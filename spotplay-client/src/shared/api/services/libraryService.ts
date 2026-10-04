import { apiClient } from "../api";
import type { Track } from "../../../data/seed";

export interface SidebarPlaylist {
  id: string;
  name: string;
  folderid: string | null;
  track_count: string;
}

export interface SidebarFolder {
  id: string;
  name: string;
  playlists: SidebarPlaylist[];
}

export interface LibraryTree {
  folders: SidebarFolder[];
  rootPlaylists: SidebarPlaylist[];
}

export const libraryService = {
  getTree: async (): Promise<LibraryTree> => {
    const response = await apiClient.get("/library/tree");
    return response.data;
  },

  createFolder: async (name: string): Promise<SidebarFolder> => {
    const response = await apiClient.post("/library/folders", { name });
    return response.data;
  },

  createPlaylist: async (
    name: string,
    folderId?: string,
  ): Promise<SidebarPlaylist> => {
    const response = await apiClient.post("/library/playlists", {
      name,
      folderId,
    });
    return response.data;
  },

  getPlaylistDetailed: async (playlistId: string) => {
    const response = await apiClient.get(`/library/playlists/${playlistId}`);
    return response.data;
  },

  createSongFromQuery: async (query: string) => {
    const response = await apiClient.post("/songs/import", { query });
    return response.data;
  },

  addSongToPlaylist: async (playlistId: string, songId: string) => {
    const response = await apiClient.post(
      `/library/playlists/${playlistId}/songs`,
      { songId },
    );
    return response.data;
  },

  removeSongFromPlaylist: async (playlistId: string, songId: string) => {
    const response = await apiClient.delete(
      `/library/playlists/${playlistId}/songs`,
      { data: { songId } },
    );
    return response.data;
  },

  getMySongs: async (): Promise<Track[]> => {
    const response = await apiClient.get("/songs");

    return response.data.songs.map((song: any) => ({
      id: song.id,
      title: song.title,
      durationMs: song.durationseconds * 1000,
      audioUrl: `http://localhost:5001/api/songs/${song.id}/stream`,
      imageUrl:
        song.coverimage ||
        "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=150",
      albumName: "Single",
      addedAt: song.createdat || new Date().toISOString(),
      artist: {
        name: song.artist || "Unknown Artist",
        imageUrl: "",
        isVerified: false,
        monthlyListeners: 0,
      },
      credits: [],
    }));
  },

  movePlaylistToFolder: async (
    playlistId: string | number,
    folderId: string | null,
  ) => {
    const response = await apiClient.patch(
      `/library/playlists/${playlistId}/move`,
      {
        folderId,
      },
    );
    return response.data;
  },
};
