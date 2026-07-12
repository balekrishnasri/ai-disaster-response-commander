import { Router } from "express";
import { listAlerts } from "../controllers/alert.controller.js";

const router = Router();
router.get("/", listAlerts);

export default router;
