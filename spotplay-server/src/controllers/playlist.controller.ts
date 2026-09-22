import { Request, Response } from "express";
import * as libraryService from "../services/library.service.js";

export const createPlaylist = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { name, folderId } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!name) {
      res.status(400).json({ message: "Playlist name is required" });
      return;
    }

    const newPlaylist = await libraryService.createPlaylist(
      userId,
      name,
      folderId,
    );
    res
      .status(201)
      .json({ message: "Playlist created", playlist: newPlaylist });
  } catch (error) {
    console.error("Create playlist error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyLibrary = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const libraryTree = await libraryService.getLibraryTree(userId);
    res.status(200).json(libraryTree);
  } catch (error) {
    console.error("Get library error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPlaylistById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const playlistId = req.params.id as string;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const playlistData = await libraryService.getPlaylistWithSongs(
      playlistId,
      userId,
    );

    if (!playlistData) {
      res.status(404).json({ message: "Playlist not found" });
      return;
    }

    res.status(200).json(playlistData);
  } catch (error) {
    console.error("Get playlist details error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addSongToPlaylist = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const playlistId = req.params.id as string;
    const { songId } = req.body;

    if (!songId) {
      res.status(400).json({ message: "Song ID is required" });
      return;
    }

    await libraryService.addSongToPlaylist(playlistId, songId);

    res.status(200).json({ message: "Song added to playlist" });
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate key")) {
      res.status(409).json({ message: "Song is already in this playlist" });
      return;
    }
    console.error("Add song to playlist error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
