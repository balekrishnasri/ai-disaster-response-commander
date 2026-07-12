import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, trim: true },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
      index: true,
    },
    region: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true },
);

export default mongoose.model("Alert", alertSchema);
