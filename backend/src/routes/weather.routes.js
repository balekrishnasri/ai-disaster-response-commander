import { Router } from "express";
import { getWeatherRisk } from "../controllers/weather.controller.js";

const router = Router();
router.get("/risk", getWeatherRisk);

export default router;
