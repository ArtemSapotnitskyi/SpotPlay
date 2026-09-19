import { useState } from "react";
import { userPlaylists, allTracks, type PlaylistData } from "../data/seed";
import VaultHeader from "../components/VaultHeader/VaultHeader";
import PinnedItemCard from "../components/PinnedItemCard/PinnedItemCard";
import CollectionGrid from "../components/CollectionGrid/CollectionGrid";
import FoldersList, {
  type Folder,
} from "../components/FoldersList/FoldersList";
import LibraryStats from "../components/LibraryStats/LibraryStats";

export default function PlaylistsPage() {
  const [myPlaylists, setMyPlaylists] = useState<PlaylistData[]>(userPlaylists);
  const [pinnedId, setPinnedId] = useState<string | null>(
    userPlaylists[0]?.id || null,
  );

  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const [myFolders, setMyFolders] = useState<Folder[]>([
    { name: "Gym & Workout", count: "4 playlists" },
    { name: "Focus / Work", count: "2 playlists" },
  ]);

  const pinnedPlaylist = myPlaylists.find((p) => p.id === pinnedId);

  const handlePin = (id: string | number) => {
    setPinnedId((prev) => (prev === String(id) ? null : String(id)));
  };

  const handleDeletePlaylist = (id: string | number) => {
    setMyPlaylists((prev) => prev.filter((p) => p.id !== id));
    if (pinnedId === String(id)) {
      setPinnedId(null);
    }
  };

  const handleEditPlaylist = (id: string | number, newTitle: string) => {
    setMyPlaylists((prev) =>
      prev.map((p) => (p.id === id ? { ...p, title: newTitle } : p)),
    );
  };

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      const newPlaylist: PlaylistData = {
        id: Date.now().toString(),
        title: newPlaylistName.trim(),
        owner: "You",
        description: "Created just now",
        imageUrl:
          "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300",
        tracks: [],
        type: "Playlist",
      };

      setMyPlaylists([newPlaylist, ...myPlaylists]);
      setNewPlaylistName("");
      setIsPlaylistModalOpen(false);
    }
  };

  const handleAddFolder = (folderName: string) => {
    setMyFolders((prev) => [
      ...prev,
      { name: folderName, count: "0 playlists" },
    ]);
  };

  return (
    <div className="bg-[#FAFAFA] dark:bg-neutral-950 min-h-screen p-4 md:p-8 font-sans text-neutral-900 dark:text-white pb-24 selection:bg-accent/20 selection:text-accent transition-colors duration-300">
      <div className="max-w-6xl mx-auto relative">
        <VaultHeader onAddNew={() => setIsPlaylistModalOpen(true)} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex flex-col gap-6">
            {pinnedPlaylist ? (
              <PinnedItemCard
                title={pinnedPlaylist.title}
                description={
                  pinnedPlaylist.description || `By ${pinnedPlaylist.owner}`
                }
                imageUrl={pinnedPlaylist.imageUrl}
                trackCount={pinnedPlaylist.tracks?.length || 0}
              />
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
            <FoldersList folders={myFolders} onAddFolder={handleAddFolder} />

            <LibraryStats
              playlistsCount={myPlaylists.length}
              tracksCount={allTracks?.length || 0}
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
    </div>
  );
}
