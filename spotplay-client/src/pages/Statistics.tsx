import { useState, useEffect } from "react";
import { usePlayer } from "../context/PlayerContext";
import { formatDuration } from "../shared/utils/formatters";
import { allTracks } from "../data/seed";

import {
  activityService,
  type DashboardStats,
} from "../shared/api/services/activityService";

// Icons
import PlayIcon from "../components/icons/Play";
import PauseIcon from "../components/icons/Pause";
import LightningIcon from "../components/icons/Lightning";
import TargetIcon from "../components/icons/Target";
import FireIcon from "../components/icons/Fire";

// Safe time parser converting raw seconds into formatted hours and minutes
const formatSecondsToTime = (totalSeconds: number) => {
  if (!totalSeconds) return { h: "0", m: "00" };
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  return { h: h.toString(), m: m.toString().padStart(2, "0") };
};

const formatCompactNumber = (num: number) => {
  if (!num) return "0";
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
};

export default function MinimalStatistics() {
  const { currentTrack, isPlaying, togglePlayPause, playTrack } = usePlayer();
  const displayTrack = currentTrack || allTracks[0];

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard statistics on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await activityService.getOverviewStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setError("The statistics could not be loaded. You may need to log in.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-[#FAFAFA] dark:bg-neutral-950 min-h-screen flex items-center justify-center font-sans text-neutral-900 dark:text-white">
        <p className="animate-pulse">Loading your stats...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-[#FAFAFA] dark:bg-neutral-950 min-h-screen flex flex-col items-center justify-center font-sans text-neutral-900 dark:text-white gap-4">
        <p className="text-red-500">{error || "No data available"}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90"
        >
          Try Again
        </button>
      </div>
    );
  }

  const allTimeStats = formatSecondsToTime(stats.totalListening.allTimeSeconds);
  const thisWeekStatsRaw = formatSecondsToTime(
    stats.totalListening.thisWeekSeconds,
  );
  const thisWeekStats = `${thisWeekStatsRaw.h}h ${thisWeekStatsRaw.m}m`;
  const libraryStats = formatSecondsToTime(stats.libraryDurationSeconds);

  const safeDailyGoal = stats.activity.dailyGoalMinutes || 1;
  const dailyGoalPercentage = Math.min(
    (stats.activity.todayListeningMinutes / safeDailyGoal) * 100,
    100,
  );

  const weeklyPulsePercentage = Math.min(
    (stats.activity.currentStreakDays / 7) * 100,
    100,
  );

  return (
    <div className="bg-[#FAFAFA] dark:bg-neutral-950 min-h-screen p-4 md:p-8 font-sans text-neutral-900 dark:text-white pb-24 selection:bg-accent selection:text-white transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1 transition-colors">
              What are we listening to today?
            </p>
          </div>
          <div className="text-sm font-medium text-neutral-400 dark:text-neutral-500 transition-colors">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 flex flex-col justify-between transition-colors">
            <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest transition-colors">
              Total Listening Time
            </span>
            <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <div className="flex items-baseline gap-2 font-medium tracking-tighter text-6xl sm:text-8xl">
                  <span>
                    {allTimeStats.h}
                    <span className="text-3xl sm:text-5xl text-neutral-400 dark:text-neutral-500 font-light ml-1 transition-colors">
                      h
                    </span>
                  </span>
                  <span>
                    {allTimeStats.m}
                    <span className="text-3xl sm:text-5xl text-neutral-400 dark:text-neutral-500 font-light ml-1 transition-colors">
                      m
                    </span>
                  </span>
                </div>
                <span className="text-neutral-500 dark:text-neutral-400 text-sm mt-2 block transition-colors">
                  All Time
                </span>
              </div>
              <div className="md:text-right">
                <span className="block text-3xl font-medium tracking-tight">
                  {thisWeekStats}
                </span>
                <span className="block text-neutral-500 dark:text-neutral-400 text-sm mt-1 transition-colors">
                  This Week
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-accent rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group transition-colors">
            <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-6 transition-colors">
              Now Playing
            </span>

            <div className="flex flex-col gap-6 relative z-10">
              <img
                src={displayTrack.imageUrl}
                alt={displayTrack.title}
                className="w-full h-40 object-cover rounded-xl grayscale-[15%] group-hover:grayscale-0 transition-all duration-500 shadow-sm"
              />
              <div>
                <h3 className="text-lg font-semibold tracking-tight truncate">
                  {displayTrack.title}
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm transition-colors">
                  {displayTrack.artist.name}
                </p>
              </div>

              <div className="space-y-3">
                <div className="h-1 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full group/slider cursor-pointer flex items-center relative transition-colors">
                  <div
                    className={`h-full bg-accent ${
                      isPlaying ? "w-[40%]" : "w-[0%]"
                    } rounded-full transition-all duration-1000 relative`}
                  >
                    <div className="hidden group-hover/slider:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white dark:bg-neutral-200 rounded-full shadow-md border border-neutral-100 dark:border-neutral-700 z-10"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium w-8 transition-colors">
                    {isPlaying ? "1:24" : "0:00"}
                  </span>
                  <div className="flex items-center gap-4">
                    <button className="text-neutral-400 dark:text-neutral-500 hover:text-accent dark:hover:text-accent transition-colors">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        currentTrack
                          ? togglePlayPause()
                          : playTrack(displayTrack)
                      }
                      className="w-8 h-8 flex items-center justify-center bg-accent text-white rounded-full hover:scale-105 transition-transform shadow-sm"
                    >
                      {isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </button>
                    <button className="text-neutral-400 dark:text-neutral-500 hover:text-accent dark:hover:text-accent transition-colors">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium w-8 text-right transition-colors">
                    {formatDuration(displayTrack.durationMs)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center transition-colors">
              <p className="text-4xl font-medium tracking-tight mb-2">
                {formatCompactNumber(stats.counts.tracks)}
              </p>
              <p className="text-neutral-400 dark:text-neutral-500 text-xs uppercase tracking-wider font-semibold transition-colors">
                Tracks
              </p>
            </div>
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center transition-colors">
              <p className="text-4xl font-medium tracking-tight mb-2">
                {formatCompactNumber(stats.counts.playlists)}
              </p>
              <p className="text-neutral-400 dark:text-neutral-500 text-xs uppercase tracking-wider font-semibold transition-colors">
                Playlists
              </p>
            </div>
            <div className="col-span-2 md:col-span-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center transition-colors">
              <p className="text-4xl font-medium tracking-tight mb-2">
                {libraryStats.h}
                <span className="text-2xl text-neutral-400 dark:text-neutral-500 font-light transition-colors">
                  h
                </span>{" "}
                {libraryStats.m}
                <span className="text-2xl text-neutral-400 dark:text-neutral-500 font-light transition-colors">
                  m
                </span>
              </p>
              <p className="text-neutral-400 dark:text-neutral-500 text-xs uppercase tracking-wider font-semibold transition-colors">
                Library Duration
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 transition-colors">
            <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-6 block transition-colors">
              Activity
            </span>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <LightningIcon className="text-accent" />
                    <span className="text-sm font-medium">Weekly Pulse</span>
                  </div>
                  <span className="text-xs font-semibold">
                    {stats.activity.currentStreakDays} Days
                  </span>
                </div>
                <div className="h-1 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden transition-colors">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${weeklyPulsePercentage}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <TargetIcon className="text-accent w-5 h-5" />
                    <span className="text-sm font-medium">Daily Goal</span>
                  </div>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 transition-colors">
                    {stats.activity.todayListeningMinutes}m /{" "}
                    {stats.activity.dailyGoalMinutes}m
                  </span>
                </div>
                <div className="h-1 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden transition-colors">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${dailyGoalPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-neutral-100 dark:border-neutral-800 transition-colors">
                <div className="flex items-center gap-2">
                  <FireIcon className="text-accent" />
                  <span className="text-sm font-medium">Current Streak</span>
                </div>
                <span className="text-sm font-medium">
                  {stats.activity.currentStreakDays} Day
                  {stats.activity.currentStreakDays !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 transition-colors">
            <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-6 block transition-colors">
              Heavy Rotation
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {allTracks.slice(0, 3).map((track) => {
                const isThisTrackPlaying =
                  currentTrack?.id === track.id && isPlaying;

                return (
                  <div
                    key={track.id}
                    onClick={() => playTrack(track)}
                    className="flex items-center gap-4 group cursor-pointer p-2 -m-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <img
                      src={track.imageUrl || track.artist.imageUrl}
                      className="w-12 h-12 rounded-lg object-cover grayscale-[15%] group-hover:grayscale-0 transition-all shadow-sm"
                      alt={track.title}
                    />
                    <div>
                      <p
                        className={`font-medium text-sm group-hover:underline decoration-1 underline-offset-2 transition-colors ${
                          isThisTrackPlaying
                            ? "text-accent"
                            : "text-neutral-900 dark:text-white"
                        }`}
                      >
                        {track.title}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 transition-colors">
                        {track.artist.name}
                      </p>
                    </div>
                    <div
                      className={`ml-auto transition-opacity text-accent ${
                        isThisTrackPlaying
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      {isThisTrackPlaying ? (
                        <div className="w-5 h-5">
                          <PauseIcon />
                        </div>
                      ) : (
                        <div className="w-5 h-5">
                          <PlayIcon />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
