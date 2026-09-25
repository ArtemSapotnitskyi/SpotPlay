import { pool } from "../config/db.js";

//Folders
export const createFolder = async (userId: string, name: string) => {
  const result = await pool.query(
    `INSERT INTO Folders (UserId, Name) VALUES ($1, $2) RETURNING *`,
    [userId, name],
  );
  return result.rows[0];
};

export const deleteFolder = async (folderId: string, userId: string) => {
  const result = await pool.query(
    `DELETE FROM Folders WHERE Id = $1 AND UserId = $2 RETURNING Id`,
    [folderId, userId],
  );
  return result.rowCount ? result.rowCount > 0 : false;
};

//Playlists
export const createPlaylist = async (
  userId: string,
  name: string,
  folderId?: string,
) => {
  const query = `INSERT INTO Playlists (UserId, Name, FolderId) VALUES ($1, $2, $3) RETURNING *`;
  const values = [userId, name, folderId || null];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const addSongToPlaylist = async (playlistId: string, songId: string) => {
  const countResult = await pool.query(
    `SELECT COUNT(*) FROM PlaylistSongs WHERE PlaylistId = $1`,
    [playlistId],
  );
  const currentCount = parseInt(countResult.rows[0].count);

  await pool.query(
    `INSERT INTO PlaylistSongs (PlaylistId, SongId, SortOrder) VALUES ($1, $2, $3)`,
    [playlistId, songId, currentCount + 1],
  );
};

export const getPlaylistWithSongs = async (
  playlistId: string,
  userId: string,
) => {
  const playlistResult = await pool.query(
    `SELECT * FROM Playlists WHERE Id = $1 AND UserId = $2`,
    [playlistId, userId],
  );
  const playlist = playlistResult.rows[0];
  if (!playlist) return null;

  const songsResult = await pool.query(
    `SELECT s.Id, s.Title, s.Artist, s.SourceUrl, s.CoverImage, s.DurationSeconds, ps.AddedAt 
     FROM PlaylistSongs ps
     JOIN songs s ON ps.SongId = s.Id
     WHERE ps.PlaylistId = $1
     ORDER BY ps.SortOrder ASC`,
    [playlistId],
  );

  return { ...playlist, songs: songsResult.rows };
};

export const getLibraryTree = async (userId: string) => {
  const foldersResult = await pool.query(
    `SELECT Id, Name FROM Folders WHERE UserId = $1`,
    [userId],
  );
  const folders = foldersResult.rows;

  const playlistsResult = await pool.query(
    `SELECT p.Id, p.Name, p.FolderId, 
            (SELECT COUNT(*) FROM PlaylistSongs ps WHERE ps.PlaylistId = p.Id) as track_count
     FROM Playlists p 
     WHERE p.UserId = $1`,
    [userId],
  );
  const playlists = playlistsResult.rows;

  const library = {
    folders: folders.map((folder) => ({
      ...folder,
      playlists: playlists.filter((p) => p.folderid === folder.id),
    })),
    rootPlaylists: playlists.filter((p) => p.folderid === null),
  };

  return library;
};
