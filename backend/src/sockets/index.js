import jwt from "jsonwebtoken";
import RescueRequest from "../models/RescueRequest.js";
import RescueTeam from "../models/RescueTeam.js";
import User from "../models/User.js";

export const configureSockets = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next();
      }
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = await User.findById(payload.sub);
      return next();
    } catch {
      return next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    if (socket.user) {
      socket.join(`user:${socket.user.id}`);
      if (["responder", "admin"].includes(socket.user.role)) {
        socket.join("responders");
      }
    }

    socket.on("status_update", async ({ requestId, status }) => {
      if (!["responder", "admin"].includes(socket.user?.role)) return;
      if (!["assigned", "in_progress", "completed"].includes(status)) return;

      const request = await RescueRequest.findByIdAndUpdate(
        requestId,
        { status },
        { new: true },
      ).populate("assignedTeamId");
      if (!request) return;

      if (status === "completed" && request.assignedTeamId) {
        await RescueTeam.findByIdAndUpdate(request.assignedTeamId._id, {
          status: "available",
          activeRequestId: null,
        });
      }

      io.to(`user:${request.userId}`).emit("status_update", request);
      io.to("responders").emit("status_update", request);
    });

    socket.on("team_location_update", async ({ teamId, location }) => {
      if (!["responder", "admin"].includes(socket.user?.role)) return;
      if (
        !Number.isFinite(Number(location?.lat)) ||
        !Number.isFinite(Number(location?.lng))
      ) {
        return;
      }

      const team = await RescueTeam.findByIdAndUpdate(
        teamId,
        {
          currentLocation: {
            lat: Number(location.lat),
            lng: Number(location.lng),
          },
        },
        { new: true },
      );
      if (!team?.activeRequestId) return;

      const request = await RescueRequest.findById(team.activeRequestId);
      if (request) {
        io.to(`user:${request.userId}`).emit("team_location_update", {
          requestId: request.id,
          teamId: team.id,
          location: team.currentLocation,
        });
      }
    });
  });
};
