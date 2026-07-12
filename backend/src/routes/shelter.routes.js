import { Router } from "express";
import {
  listNearbyShelters,
  listShelters,
} from "../controllers/shelter.controller.js";

const router = Router();

router.get("/", listShelters);
router.get("/nearby", listNearbyShelters);

export default router;
