import { pool } from "../config/db.js";

interface CreateSongData {
  title: string;
  artist: string;
  sourceUrl: string;
  coverImage: string;
  durationSeconds: number;
  userId: string;
}

export const addSongToDb = async (data: CreateSongData) => {
  const result = await pool.query(
    `INSERT INTO songs (Title, Artist, SourceUrl, CoverImage, DurationSeconds, AddedByUserId) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [
      data.title,
      data.artist,
      data.sourceUrl,
      data.coverImage,
      data.durationSeconds,
      data.userId,
    ],
  );
  return result.rows[0];
};

export const getUserSongs = async (userId: string) => {
  const result = await pool.query(
    `SELECT Id, Title, Artist, SourceUrl, CoverImage, DurationSeconds, CreatedAt 
     FROM songs 
     WHERE AddedByUserId = $1 
     AND EXISTS (SELECT 1 FROM playlistsongs WHERE SongId = songs.Id)
     ORDER BY CreatedAt DESC`,
    [userId],
  );
  return result.rows;
};

export const removeSongFromPlaylistDb = async (
  playlistId: string,
  songId: string,
  userId: string,
) => {
  const checkOwner = await pool.query(
    `SELECT Id FROM Playlists WHERE Id = $1 AND UserId = $2`,
    [playlistId, userId],
  );
  if (checkOwner.rowCount === 0) {
    throw new Error("Playlist not found or you don't have permission");
  }
  const result = await pool.query(
    `DELETE FROM PlaylistSongs WHERE PlaylistId = $1 AND SongId = $2 RETURNING *`,
    [playlistId, songId],
  );

  return result.rowCount ? result.rowCount > 0 : false;
};
