import { Router } from "express";
import {
  addSong,
  getMySongs,
  streamSong,
} from "../controllers/song.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/:id/stream", streamSong);

router.use(requireAuth);

router.post("/import", addSong);
router.get("/", getMySongs);

export default router;
