import { pool } from "../config/db.js";

export const saveListeningHistory = async (
  userId: string,
  songId: string,
  durationSeconds: number,
) => {
  await pool.query(
    `INSERT INTO ListeningHistory (userId, songId, ListenDurationSeconds) VALUES ($1, $2, $3)`,
    [userId, songId, durationSeconds],
  );

  await pool.query(
    `INSERT INTO UserActivity (UserId, CurrentStreakDays, LastActiveDate)
     VALUES ($1, 1, CURRENT_DATE)
     ON CONFLICT (UserId) DO UPDATE SET
       CurrentStreakDays = CASE
         WHEN UserActivity.LastActiveDate = CURRENT_DATE THEN UserActivity.CurrentStreakDays
         WHEN UserActivity.LastActiveDate = CURRENT_DATE - INTERVAL '1 day' THEN UserActivity.CurrentStreakDays + 1
         ELSE 1
       END,
       LastActiveDate = CURRENT_DATE`,
    [userId],
  );
};

export const getDashboardStats = async (userId: string) => {
  const [
    allTimeResult,
    thisWeekResult,
    tracksResult,
    playlistsResult,
    libraryDurationResult,
    activityResult,
    todayResult,
  ] = await Promise.all([
    // All Time Listening
    pool.query(
      `SELECT SUM(ListenDurationSeconds) as total FROM ListeningHistory WHERE UserId = $1`,
      [userId],
    ),

    // This Week Listening
    pool.query(
      `SELECT SUM(ListenDurationSeconds) as total FROM ListeningHistory WHERE UserId = $1 AND ListenedAt >= NOW() - INTERVAL '7 days'`,
      [userId],
    ),

    // Tracks Count
    pool.query(
      `SELECT COUNT(Id) as count FROM Songs WHERE AddedByUserId = $1`,
      [userId],
    ),

    // Playlists Count
    pool.query(`SELECT COUNT(Id) as count FROM Playlists WHERE UserId = $1`, [
      userId,
    ]),

    // Library Duration
    pool.query(
      `SELECT SUM(DurationSeconds) as total FROM Songs WHERE AddedByUserId = $1`,
      [userId],
    ),

    // User Activity (Goal & Streak)
    pool.query(
      `SELECT DailyGoalMinutes, CurrentStreakDays FROM UserActivity WHERE UserId = $1`,
      [userId],
    ),

    // Today Listening
    pool.query(
      `SELECT SUM(ListenDurationSeconds) as total FROM ListeningHistory WHERE UserId = $1 AND DATE(ListenedAt) = CURRENT_DATE`,
      [userId],
    ),
  ]);

  return {
    // The driver always sets the `rows` property. It is always an array. Rows: [ { total: "41520" } ]
    allTimeSeconds: parseInt(allTimeResult.rows[0]?.total || "0"),
    thisWeekSeconds: parseInt(thisWeekResult.rows[0]?.total || "0"),
    tracksCount: parseInt(tracksResult.rows[0]?.count || "0"),
    playlistsCount: parseInt(playlistsResult.rows[0]?.count || "0"),
    libraryDurationSeconds: parseInt(
      libraryDurationResult.rows[0]?.total || "0",
    ),
    activityData: activityResult.rows[0] || {
      dailygoalminutes: 120,
      currentstreakdays: 0,
    },
    todaySeconds: parseInt(todayResult.rows[0]?.total || "0"),
  };
};
