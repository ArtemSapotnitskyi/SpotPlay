import { Router } from "express";
import {
  addSong,
  getMySongs,
  deleteSong,
  streamSong,
} from "../controllers/song.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/:id/stream", streamSong);
router.post("/import", addSong);
router.get("/", getMySongs);
router.delete("/:id", deleteSong);

export default router;
