import { Request, Response } from "express";
import play from "play-dl";
import * as songService from "../services/song.service.js";
import { pool } from "../config/db.js";

const isValidUrl = (string: string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const addSong = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { query } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!query) {
      res.status(400).json({ message: "Search query or URL is required" });
      return;
    }

    let trackUrl = query;
    let title = "";
    let artist = "";
    let coverImage = "";
    let durationSeconds = 0;

    if (!isValidUrl(query)) {
      const searchResults = await play.search(query, {
        limit: 1,
        source: { soundcloud: "tracks" },
      });

      if (!searchResults || searchResults.length === 0) {
        res.status(404).json({
          message: "Track not found. Try a different name or direct URL.",
        });
        return;
      }
      trackUrl = searchResults[0].url;
    }

    if (trackUrl.includes("soundcloud.com")) {
      const trackInfo = (await play.soundcloud(trackUrl)) as any;
      title = trackInfo.name;
      artist =
        trackInfo.publisher?.artist || trackInfo.user?.name || "Unknown Artist";
      coverImage = trackInfo.thumbnail || "";
      durationSeconds = trackInfo.durationInSec || 0;
    } else if (
      trackUrl.includes("youtube.com") ||
      trackUrl.includes("youtu.be")
    ) {
      const videoInfo = await play.video_info(trackUrl);
      title = videoInfo.video_details.title || "";
      artist = videoInfo.video_details.channel?.name || "Unknown Artist";
      coverImage = videoInfo.video_details.thumbnails[0]?.url || "";
      durationSeconds = videoInfo.video_details.durationInSec;
    } else {
      res.status(400).json({
        message: "Unsupported URL provider. Use SoundCloud or YouTube.",
      });
      return;
    }

    if (title.includes("-") && artist === "Unknown Artist") {
      const parts = title.split("-");
      artist = parts[0].trim();
      title = parts.slice(1).join("-").trim();
    }

    const newSong = await songService.addSongToDb({
      title,
      artist,
      sourceUrl: trackUrl,
      coverImage,
      durationSeconds,
      userId,
    });

    res.status(201).json({
      message: "Song added successfully",
      song: newSong,
    });
  } catch (error) {
    console.error("Add song error:", error);
    res.status(500).json({ message: "Failed to add song" });
  }
};

export const streamSong = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const songId = req.params.id as string;
    //Find song in db
    const result = await pool.query(
      `SELECT SourceUrl FROM Songs WHERE Id = $1`,
      [songId],
    );
    const song = result.rows[0];

    if (!song) {
      res.status(404).json({ message: "Song not found" });
      return;
    }

    const stream = await play.stream(song.SourceUrl);
    res.set({
      "Content-Type": stream.type === "webm/opus" ? "audio/webm" : "audio/mpeg",
      "Transfer-Encoding": "chunked",
    });
    stream.stream.pipe(res);
  } catch (error) {
    console.error("Stream error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to stream audio" });
    }
  }
};

export const getMySongs = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const songs = await songService.getUserSongs(userId);
    res.status(200).json({ songs });
  } catch (error) {
    console.error("Get songs error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteSong = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const songId = req.params.id as string;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const isDeleted = await songService.deleteSongById(songId, userId);

    if (!isDeleted) {
      res
        .status(404)
        .json({ message: "Song not found or you don't have permission" });
      return;
    }

    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    console.error("Delete song error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
