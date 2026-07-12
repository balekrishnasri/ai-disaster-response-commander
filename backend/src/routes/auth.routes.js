import { Router } from "express";
import {
  getMe,
  sendOtp,
  verifyOtp,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/me", protect, getMe);

export default router;
