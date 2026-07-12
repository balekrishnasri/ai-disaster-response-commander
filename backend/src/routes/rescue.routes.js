import { Router } from "express";
import {
  assignRescueTeam,
  createRescueRequest,
  getRescueRequest,
  listRescueRequests,
  updateRescueStatus,
} from "../controllers/rescue.controller.js";
import { permit, protect } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, permit("citizen"), createRescueRequest);
router.get("/", protect, permit("responder", "admin"), listRescueRequests);
router.get("/:id", protect, getRescueRequest);
router.patch(
  "/:id/assign",
  protect,
  permit("responder", "admin"),
  assignRescueTeam,
);
router.patch(
  "/:id/status",
  protect,
  permit("responder", "admin"),
  updateRescueStatus,
);

export default router;
