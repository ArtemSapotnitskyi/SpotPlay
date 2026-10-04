import { Router } from "express";
import {
  createFolder,
  deleteFolder,
} from "../controllers/folder.controller.js";
import {
  createPlaylist,
  getMyLibrary,
  getPlaylistById,
  addSongToPlaylist,
  movePlaylist,
} from "../controllers/playlist.controller.js";
import { removeSongFromPlaylist } from "../controllers/song.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.post("/folders", createFolder);
router.delete("/folders/:id", deleteFolder);

router.post("/playlists", createPlaylist);
router.get("/tree", getMyLibrary);
router.get("/playlists/:id", getPlaylistById);
router.post("/playlists/:id/songs", addSongToPlaylist);
router.patch("/playlists/:id/move", movePlaylist);
router.delete("/playlists/:id/songs", removeSongFromPlaylist);

export default router;
