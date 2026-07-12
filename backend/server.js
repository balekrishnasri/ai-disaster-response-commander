import "dotenv/config";
import http from "node:http";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import { connectDatabase } from "./config/db.js";
import alertRoutes from "./src/routes/alert.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import rescueRoutes from "./src/routes/rescue.routes.js";
import shelterRoutes from "./src/routes/shelter.routes.js";
import teamRoutes from "./src/routes/team.routes.js";
import weatherRoutes from "./src/routes/weather.routes.js";
import { configureSockets } from "./src/sockets/index.js";

const app = express();
const server = http.createServer(app);
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const io = new Server(server, {
  cors: { origin: frontendUrl, methods: ["GET", "POST", "PATCH"] },
});

app.set("io", io);
app.use(cors({ origin: frontendUrl }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() }),
);
app.use("/api/auth", authRoutes);
app.use("/api/shelters", shelterRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/rescue", rescueRoutes);
app.use("/api/teams", teamRoutes);

app.use((req, res) =>
  res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` }),
);
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message || "Internal server error",
  });
});

configureSockets(io);

const port = Number(process.env.PORT || 5000);

connectDatabase()
  .then(() => {
    server.listen(port, () => {
      console.log(`AI Disaster Response API listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });
