import { apiClient } from "../api";

export interface DashboardStats {
  totalListening: {
    allTimeSeconds: number;
    thisWeekSeconds: number;
  };
  counts: {
    tracks: number;
    playlists: number;
  };
  libraryDurationSeconds: number;
  activity: {
    dailyGoalMinutes: number;
    todayListeningMinutes: number;
    currentStreakDays: number;
  };
}

export const activityService = {
  //Get all stats for Overview
  async getOverviewStats(): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>("/activity/overview");
    return response.data;
  },

  async trackListening(songId: string, durationSeconds: number): Promise<void> {
    await apiClient.post("/activity/track", {
      songId,
      listenDurationSeconds: durationSeconds,
    });
  },
};
