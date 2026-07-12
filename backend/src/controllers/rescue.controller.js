import RescueRequest from "../models/RescueRequest.js";
import RescueTeam from "../models/RescueTeam.js";

const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 };

const emitToCitizen = (req, request, eventName) => {
  const userId = request.userId?._id ?? request.userId;
  req.app.get("io").to(`user:${userId}`).emit(eventName, request);
};

export const createRescueRequest = async (req, res) => {
  const { location, description, urgencyLevel } = req.body;

  if (
    !Number.isFinite(Number(location?.lat)) ||
    !Number.isFinite(Number(location?.lng)) ||
    !description?.trim()
  ) {
    return res
      .status(400)
      .json({ message: "Location and description are required" });
  }

  const request = await RescueRequest.create({
    userId: req.user.id,
    location: { lat: Number(location.lat), lng: Number(location.lng) },
    description: description.trim(),
    urgencyLevel,
  });

  const populated = await request.populate("userId", "name phone");
  req.app.get("io").to("responders").emit("new_rescue_request", populated);
  return res.status(201).json({ request: populated });
};

export const getRescueRequest = async (req, res) => {
  const request = await RescueRequest.findById(req.params.id)
    .populate("userId", "name phone")
    .populate("assignedTeamId");

  if (!request) {
    return res.status(404).json({ message: "Rescue request not found" });
  }

  const isOwner = request.userId._id.toString() === req.user.id;
  const isResponder = ["responder", "admin"].includes(req.user.role);
  if (!isOwner && !isResponder) {
    return res.status(403).json({ message: "You cannot view this request" });
  }

  return res.json({ request });
};

export const listRescueRequests = async (_req, res) => {
  const requests = await RescueRequest.find()
    .populate("userId", "name phone")
    .populate("assignedTeamId")
    .sort({ createdAt: -1 });

  requests.sort(
    (a, b) =>
      urgencyOrder[b.urgencyLevel] - urgencyOrder[a.urgencyLevel] ||
      b.createdAt - a.createdAt,
  );

  return res.json({ requests });
};

export const assignRescueTeam = async (req, res) => {
  const request = await RescueRequest.findById(req.params.id);
  if (!request) {
    return res.status(404).json({ message: "Rescue request not found" });
  }
  if (request.status !== "pending") {
    return res.status(409).json({ message: "Request is already assigned" });
  }

  const team = await RescueTeam.findOneAndUpdate(
    { _id: req.body.teamId, status: "available" },
    { status: "busy", activeRequestId: request.id },
    { new: true },
  );
  if (!team) {
    return res.status(409).json({ message: "Team is no longer available" });
  }

  request.assignedTeamId = team.id;
  request.status = "assigned";
  await request.save();
  const populated = await request.populate([
    { path: "userId", select: "name phone" },
    { path: "assignedTeamId" },
  ]);

  emitToCitizen(req, populated, "request_assigned");
  req.app.get("io").to("responders").emit("status_update", populated);
  return res.json({ request: populated });
};

export const updateRescueStatus = async (req, res) => {
  const allowedStatuses = ["assigned", "in_progress", "completed"];
  if (!allowedStatuses.includes(req.body.status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const request = await RescueRequest.findById(req.params.id);
  if (!request) {
    return res.status(404).json({ message: "Rescue request not found" });
  }

  request.status = req.body.status;
  await request.save();

  if (request.status === "completed" && request.assignedTeamId) {
    await RescueTeam.findByIdAndUpdate(request.assignedTeamId, {
      status: "available",
      activeRequestId: null,
    });
  }

  const populated = await request.populate([
    { path: "userId", select: "name phone" },
    { path: "assignedTeamId" },
  ]);
  emitToCitizen(req, populated, "status_update");
  req.app.get("io").to("responders").emit("status_update", populated);
  return res.json({ request: populated });
};
