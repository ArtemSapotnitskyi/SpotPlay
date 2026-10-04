import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  libraryService,
  type SidebarFolder,
  type SidebarPlaylist,
} from "../shared/api/services/libraryService";
import VaultHeader from "../components/VaultHeader/VaultHeader";
import PinnedItemCard from "../components/PinnedItemCard/PinnedItemCard";
import CollectionGrid from "../components/CollectionGrid/CollectionGrid";
import FoldersList from "../components/FoldersList/FoldersList";
import LibraryStats from "../components/LibraryStats/LibraryStats";

export interface UIPinnedPlaylist {
  id: string | number;
  title: string;
  owner: string;
  imageUrl: string;
  trackCount: number;
}

const adaptToUI = (backendPlaylist: SidebarPlaylist): UIPinnedPlaylist => ({
  id: backendPlaylist.id,
  title: backendPlaylist.name,
  owner: "You",
  imageUrl: "",
  trackCount: parseInt(backendPlaylist.track_count) || 0,
});

export default function PlaylistsPage() {
  const [myPlaylists, setMyPlaylists] = useState<UIPinnedPlaylist[]>([]);
  const [myFolders, setMyFolders] = useState<SidebarFolder[]>([]);
  const [totalSongsCount, setTotalSongsCount] = useState<number>(0);

  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [targetFolderForNewPlaylist, setTargetFolderForNewPlaylist] = useState<
    string | null
  >(null);
  const [isAddingExisting, setIsAddingExisting] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [pinnedId, setPinnedId] = useState<string | null>(() => {
    return localStorage.getItem("spotplay_pinned_playlist_id");
  });

  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [treeData, songsData] = await Promise.all([
          libraryService.getTree(),
          libraryService.getMySongs(),
        ]);

        setMyFolders(treeData.folders);

        const allBackendPlaylists = [
          ...treeData.rootPlaylists,
          ...treeData.folders.flatMap((folder) => folder.playlists),
        ];

        setMyPlaylists(allBackendPlaylists.map(adaptToUI));
        setTotalSongsCount(songsData.length);

        if (
          allBackendPlaylists.length > 0 &&
          !localStorage.getItem("spotplay_pinned_playlist_id")
        ) {
          const firstId = allBackendPlaylists[0].id.toString();
          setPinnedId(firstId);
          localStorage.setItem("spotplay_pinned_playlist_id", firstId);
        }
      } catch (error) {
        console.error("Error to loading librarys:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const pinnedPlaylist = myPlaylists.find((p) => p.id.toString() === pinnedId);

  const handlePin = (id: string | number) => {
    const stringId = String(id);
    setPinnedId((prev) => {
      const newPinnedId = prev === stringId ? null : stringId;
      if (newPinnedId) {
        localStorage.setItem("spotplay_pinned_playlist_id", newPinnedId);
      } else {
        localStorage.removeItem("spotplay_pinned_playlist_id");
      }
      return newPinnedId;
    });
  };

  const handleDeletePlaylist = (id: string | number) => {
    setMyPlaylists((prev) => prev.filter((p) => p.id !== id));
    if (pinnedId === String(id)) {
      setPinnedId(null);
      localStorage.removeItem("spotplay_pinned_playlist_id");
    }
  };

  const handleEditPlaylist = (id: string | number, newTitle: string) => {
    setMyPlaylists((prev) =>
      prev.map((p) => (p.id === id ? { ...p, title: newTitle } : p)),
    );
  };

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    try {
      await libraryService.createPlaylist(
        newPlaylistName.trim(),
        targetFolderForNewPlaylist || undefined,
      );

      const treeData = await libraryService.getTree();
      setMyFolders(treeData.folders);

      const allBackendPlaylists = [
        ...treeData.rootPlaylists,
        ...treeData.folders.flatMap((folder) => folder.playlists),
      ];
      setMyPlaylists(allBackendPlaylists.map(adaptToUI));

      setNewPlaylistName("");
      setIsPlaylistModalOpen(false);
      setTargetFolderForNewPlaylist(null);
    } catch (error) {
      console.error("Error creating a playlist:", error);
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      const newFolder = await libraryService.createFolder(newFolderName.trim());
      setMyFolders((prev) => [...prev, newFolder]);
      setNewFolderName("");
      setIsFolderModalOpen(false);
    } catch (error) {
      console.error("Error creating a folder:", error);
    }
  };

  const handleMovePlaylistToFolder = async (playlistId: string | number) => {
    if (!activeFolderId) return;

    try {
      await libraryService.movePlaylistToFolder(playlistId, activeFolderId);

      const treeData = await libraryService.getTree();
      setMyFolders(treeData.folders);

      const allBackendPlaylists = [
        ...treeData.rootPlaylists,
        ...treeData.folders.flatMap((folder) => folder.playlists),
      ];
      setMyPlaylists(allBackendPlaylists.map(adaptToUI));

      setIsAddingExisting(false);
    } catch (error) {
      console.error("Error moving playlist to folder:", error);
    }
  };

  const formattedFolders = myFolders.map((folder) => ({
    id: folder.id,
    name: folder.name,
    count: `${folder.playlists ? folder.playlists.length : 0} playlists`,
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading library...
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] dark:bg-neutral-950 min-h-screen p-4 md:p-8 font-sans text-neutral-900 dark:text-white pb-24 selection:bg-accent/20 selection:text-accent transition-colors duration-300">
      <div className="max-w-6xl mx-auto relative">
        <VaultHeader
          onAddPlaylist={() => setIsPlaylistModalOpen(true)}
          onAddFolder={() => setIsFolderModalOpen(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex flex-col gap-6">
            {pinnedPlaylist ? (
              <Link
                to={`/playlist/${pinnedPlaylist.id}`}
                className="block outline-none"
              >
                <PinnedItemCard
                  id={pinnedPlaylist.id.toString()}
                  title={pinnedPlaylist.title}
                  description="Playlist"
                  imageUrl={pinnedPlaylist.imageUrl}
                  trackCount={pinnedPlaylist.trackCount}
                />
              </Link>
            ) : (
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 border-dashed rounded-[2rem] p-8 flex flex-col items-center justify-center text-center min-h-[200px] transition-colors">
                <p className="text-neutral-500 dark:text-neutral-400 font-medium transition-colors">
                  No playlist pinned yet.
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 transition-colors">
                  Hover over any playlist below and click the pin icon to stick
                  it here.
                </p>
              </div>
            )}

            <CollectionGrid
              playlists={myPlaylists}
              pinnedId={pinnedId}
              onPin={handlePin}
              onDelete={handleDeletePlaylist}
              onEdit={handleEditPlaylist}
            />
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <FoldersList
              folders={formattedFolders}
              onAddFolder={() => setIsFolderModalOpen(true)}
              onFolderClick={(id) => setActiveFolderId(id)}
            />

            <LibraryStats
              playlistsCount={myPlaylists.length}
              tracksCount={totalSongsCount}
            />
          </div>
        </div>
      </div>

      {isPlaylistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 dark:bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 w-full max-w-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-100 dark:border-neutral-800 transition-colors">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1 transition-colors">
              New Playlist
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-5 transition-colors">
              Give your new collection a title.
            </p>

            <form onSubmit={handleCreatePlaylist}>
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="E.g., Summer Vibes 2026..."
                autoFocus
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all mb-6 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlaylistModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newPlaylistName.trim()}
                  className="px-5 py-2.5 text-sm font-medium bg-black dark:bg-white text-white dark:text-black rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 dark:bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 w-full max-w-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-100 dark:border-neutral-800 transition-colors">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1 transition-colors">
              New Folder
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-5 transition-colors">
              Organize your playlists into a folder.
            </p>

            <form onSubmit={handleCreateFolder}>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="E.g., Workout Mixes..."
                autoFocus
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all mb-6 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFolderModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newFolderName.trim()}
                  className="px-5 py-2.5 text-sm font-medium bg-black dark:bg-white text-white dark:text-black rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeFolderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 dark:bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl w-full max-w-2xl shadow-2xl border border-neutral-100 dark:border-neutral-800 flex flex-col max-h-[85vh] overflow-hidden transition-colors duration-300">
            <div className="flex justify-between items-center p-6 sm:px-8 border-b border-neutral-100 dark:border-neutral-800 transition-colors">
              <div className="flex items-center gap-3">
                {isAddingExisting && (
                  <button
                    onClick={() => setIsAddingExisting(false)}
                    className="p-1.5 -ml-2 text-neutral-500 hover:text-black dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}
                <div className="flex flex-col">
                  <h3 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white transition-colors">
                    {isAddingExisting
                      ? "Add Existing Playlist"
                      : myFolders.find((f) => f.id === activeFolderId)?.name ||
                        "Folder"}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    {isAddingExisting
                      ? "Select a playlist to move"
                      : "Folder contents"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveFolderId(null);
                  setIsAddingExisting(false);
                }}
                className="w-8 h-8 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white rounded-full transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-2 custom-scrollbar">
              {!isAddingExisting ? (
                <>
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <button
                      onClick={() => {
                        setTargetFolderForNewPlaylist(activeFolderId);
                        setIsPlaylistModalOpen(true);
                        setActiveFolderId(null);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:border-accent text-neutral-500 hover:text-accent transition-all cursor-pointer"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span className="font-semibold text-sm">Create New</span>
                    </button>

                    <button
                      onClick={() => setIsAddingExisting(true)}
                      className="flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:border-accent text-neutral-500 hover:text-accent transition-all cursor-pointer"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="font-semibold text-sm">
                        Add Existing
                      </span>
                    </button>
                  </div>

                  {myFolders
                    .find((f) => f.id === activeFolderId)
                    ?.playlists?.map((playlist) => (
                      <Link
                        key={playlist.id}
                        to={`/playlist/${playlist.id}`}
                        onClick={() => setActiveFolderId(null)}
                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 transition-all group cursor-pointer w-full outline-none"
                      >
                        <div className="w-12 h-12 rounded-xl flex-shrink-0 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shadow-sm">
                          <svg
                            className="w-5 h-5 text-neutral-400 dark:text-neutral-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 flex flex-col text-left">
                          <p className="font-semibold text-sm text-neutral-900 dark:text-white transition-colors">
                            {playlist.name}
                          </p>
                          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 transition-colors">
                            {playlist.track_count || 0} tracks
                          </p>
                        </div>
                      </Link>
                    ))}

                  {(!myFolders.find((f) => f.id === activeFolderId)
                    ?.playlists ||
                    myFolders.find((f) => f.id === activeFolderId)!.playlists
                      .length === 0) && (
                    <p className="text-center text-sm text-neutral-400 py-8">
                      This folder is empty.
                    </p>
                  )}
                </>
              ) : (
                <>
                  {myPlaylists
                    .filter((p) => {
                      const playlistsInFolder =
                        myFolders.find((f) => f.id === activeFolderId)
                          ?.playlists || [];
                      return !playlistsInFolder.some(
                        (fp) => fp.id === p.id.toString(),
                      );
                    })
                    .map((playlist) => (
                      <div
                        key={playlist.id}
                        onClick={() => handleMovePlaylistToFolder(playlist.id)}
                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 transition-all group cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-xl flex-shrink-0 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shadow-sm">
                          <svg
                            className="w-5 h-5 text-neutral-400 dark:text-neutral-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 flex flex-col">
                          <p className="font-semibold text-sm text-neutral-900 dark:text-white transition-colors group-hover:text-accent">
                            {playlist.title}
                          </p>
                          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 transition-colors">
                            {playlist.trackCount} tracks
                          </p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 text-accent mr-2 transition-opacity">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </div>
                      </div>
                    ))}

                  {myPlaylists.filter(
                    (p) =>
                      !(
                        myFolders.find((f) => f.id === activeFolderId)
                          ?.playlists || []
                      ).some((fp) => fp.id === p.id.toString()),
                  ).length === 0 && (
                    <div className="text-center py-8 flex flex-col items-center">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
                        No available playlists
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        All your playlists are already in this folder.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
