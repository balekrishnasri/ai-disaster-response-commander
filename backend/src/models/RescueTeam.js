import mongoose from "mongoose";

const rescueTeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    members: [{ type: String, trim: true }],
    vehicle: { type: String, required: true, trim: true },
    currentLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: ["available", "busy"],
      default: "available",
      index: true,
    },
    activeRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RescueRequest",
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("RescueTeam", rescueTeamSchema);
