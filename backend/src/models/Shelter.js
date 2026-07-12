import mongoose from "mongoose";

const shelterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    capacity: { type: Number, required: true, min: 0 },
    currentOccupancy: { type: Number, default: 0, min: 0 },
    resources: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

export default mongoose.model("Shelter", shelterSchema);
