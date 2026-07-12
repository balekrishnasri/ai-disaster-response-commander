import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const otpStore = new Map();
const OTP_TTL_MS = 5 * 60 * 1000;

const normalizePhone = (phone) => String(phone ?? "").replace(/[^\d+]/g, "");

const signToken = (user) =>
  jwt.sign(
    { sub: user.id, role: user.role, phone: user.phone },
    process.env.JWT_SECRET,
    { expiresIn: "12h" },
  );

export const sendOtp = async (req, res) => {
  const phone = normalizePhone(req.body.phone);

  if (!/^\+?\d{8,15}$/.test(phone)) {
    return res.status(400).json({ message: "Enter a valid phone number" });
  }

  const code = String(crypto.randomInt(100000, 1000000));
  otpStore.set(phone, { code, expiresAt: Date.now() + OTP_TTL_MS });
  console.log(`[DEV OTP] ${phone}: ${code}`);

  return res.json({
    message: "OTP generated",
    devHint:
      process.env.NODE_ENV === "development"
        ? "Use any 6-digit code in development."
        : undefined,
  });
};

export const verifyOtp = async (req, res) => {
  const phone = normalizePhone(req.body.phone);
  const code = String(req.body.code ?? "");
  const storedOtp = otpStore.get(phone);
  const isDevelopment = process.env.NODE_ENV !== "production";
  const validDevCode = isDevelopment && /^\d{6}$/.test(code);
  const validStoredCode =
    storedOtp && storedOtp.expiresAt > Date.now() && storedOtp.code === code;

  if (!validDevCode && !validStoredCode) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  const requestedRole = req.body.role;
  const canSelectRole =
    isDevelopment && process.env.ALLOW_DEV_ROLE_SELECTION === "true";
  const role =
    canSelectRole && ["citizen", "responder"].includes(requestedRole)
      ? requestedRole
      : "citizen";

  let user = await User.findOne({ phone });
  if (!user) {
    user = await User.create({
      phone,
      name: req.body.name?.trim() || (role === "responder" ? "Responder" : "Citizen"),
      role,
      otpVerified: true,
    });
  } else {
    user.otpVerified = true;
    if (canSelectRole) {
      user.role = role;
    }
    if (req.body.name?.trim()) {
      user.name = req.body.name.trim();
    }
    await user.save();
  }

  otpStore.delete(phone);
  return res.json({ token: signToken(user), user });
};

export const getMe = async (req, res) => res.json({ user: req.user });
