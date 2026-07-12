import mongoose from "mongoose";

const rescueRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    urgencyLevel: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "assigned", "in_progress", "completed"],
      default: "pending",
      index: true,
    },
    assignedTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RescueTeam",
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("RescueRequest", rescueRequestSchema);
