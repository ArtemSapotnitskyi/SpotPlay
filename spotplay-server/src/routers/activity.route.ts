import { Router } from "express";
import {
  trackListening,
  getOverviewStats,
} from "../controllers/activity.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.post("/track", trackListening);
router.get("/overview", getOverviewStats);

export default router;
