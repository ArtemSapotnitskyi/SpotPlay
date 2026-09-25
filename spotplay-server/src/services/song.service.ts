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
     ORDER BY CreatedAt DESC`,
    [userId],
  );
  return result.rows;
};

export const deleteSongById = async (songId: string, userId: string) => {
  const result = await pool.query(
    `DELETE FROM songs WHERE Id = $1 AND AddedByUserId = $2 RETURNING Id`,
    [songId, userId],
  );
  return result.rowCount ? result.rowCount > 0 : false;
};
