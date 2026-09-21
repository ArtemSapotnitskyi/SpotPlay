import { Request, Response } from "express";
import * as activityService from "../services/activity.service.js";

export const trackListening = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { songId, listenDurationSeconds } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!songId || !listenDurationSeconds) {
      res.status(400).json({ message: "Song ID and duration are required" });
      return;
    }

    await activityService.saveListeningHistory(
      userId,
      songId,
      listenDurationSeconds,
    );
    res.status(200).json({ message: "Listening history tracked" });
  } catch (error) {
    console.error("Track listening error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOverviewStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    //Calling a service that collects all the data in parallel
    const stats = await activityService.getDashboardStats(userId);
    //Formatting the response to precisely meet the front-end's needs
    res.status(200).json({
      totalListening: {
        allTimeSeconds: stats.allTimeSeconds,
        thisWeekSeconds: stats.thisWeekSeconds,
      },
      counts: {
        tracks: stats.tracksCount,
        playlists: stats.playlistsCount,
      },
      libraryDurationSeconds: stats.libraryDurationSeconds,
      activity: {
        dailyGoalMinutes: stats.activityData.dailygoalminutes,
        todayListeningMinutes: Math.floor(stats.todaySeconds / 60),
        currentStreakDays: stats.activityData.currentstreakdays,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
