import { Router } from "express";
import {
  listAvailableTeams,
  listTeams,
} from "../controllers/team.controller.js";
import { permit, protect } from "../middleware/auth.js";

const router = Router();

router.use(protect, permit("responder", "admin"));
router.get("/", listTeams);
router.get("/available", listAvailableTeams);

export default router;
