import { apiClient } from "../api";

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
};
