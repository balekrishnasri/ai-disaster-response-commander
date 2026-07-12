import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "Citizen" },
    phone: { type: String, required: true, unique: true, trim: true },
    otpVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["citizen", "responder", "admin"],
      default: "citizen",
    },
    location: { type: locationSchema, default: () => ({}) },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
