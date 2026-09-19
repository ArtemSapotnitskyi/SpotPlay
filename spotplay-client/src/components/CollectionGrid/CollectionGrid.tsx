import { useState } from "react";
import { Link } from "react-router-dom";
import StandardCard from "../StandardCard/StandardCard";

interface Playlist {
  id: string | number;
  title: string;
  owner: string;
  imageUrl: string;
}

interface CollectionGridProps {
  playlists: Playlist[];
  pinnedId: string | number | null;
  onPin: (id: string | number) => void;
  onDelete: (id: string | number) => void;
  onEdit: (id: string | number, newTitle: string) => void;
}

export default function CollectionGrid({
  playlists,
  pinnedId,
  onPin,
  onDelete,
  onEdit,
}: CollectionGridProps) {
  const MAX_VISIBLE_PLAYLISTS = 8;
  const visiblePlaylists = playlists.slice(0, MAX_VISIBLE_PLAYLISTS);

  const [isViewAllOpen, setIsViewAllOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleStartEdit = (playlist: Playlist) => {
    setEditingId(playlist.id);
    setEditTitle(playlist.title);
  };

  const handleSaveEdit = (id: string | number) => {
    if (editTitle.trim()) {
      onEdit(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <>
      {/* Головний контейнер з темною темою */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[2rem] p-6 sm:p-8 relative transition-colors duration-300">
        <div className="flex justify-between items-end mb-6">
          <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest transition-colors">
            Saved Playlists
          </span>
          {playlists.length > MAX_VISIBLE_PLAYLISTS && (
            <button
              onClick={() => setIsViewAllOpen(true)}
              className="text-xs font-semibold text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
            >
              View All
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {visiblePlaylists.map((playlist) => (
            <Link
              key={playlist.id}
              to={`/playlist/${playlist.id}`}
              className="block outline-none"
            >
              <StandardCard
                title={playlist.title}
                description={`By ${playlist.owner}`}
                imageUrl={playlist.imageUrl}
                isPinned={playlist.id === pinnedId}
                onPin={() => onPin(playlist.id)}
              />
            </Link>
          ))}

          {playlists.length === 0 && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 col-span-full py-4 text-center transition-colors">
              No playlists yet. Create one to get started!
            </p>
          )}
        </div>
      </div>

      {/* Модальне вікно "View All" */}
      {isViewAllOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 dark:bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl w-full max-w-2xl shadow-2xl border border-neutral-100 dark:border-neutral-800 flex flex-col max-h-[85vh] overflow-hidden transition-colors duration-300">
            {/* Хедер модалки */}
            <div className="flex justify-between items-center p-6 sm:px-8 border-b border-neutral-100 dark:border-neutral-800 transition-colors">
              <h3 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white transition-colors">
                All Playlists
              </h3>
              <button
                onClick={() => {
                  setIsViewAllOpen(false);
                  setEditingId(null);
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

            {/* Список плейлістів */}
            <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-2 custom-scrollbar">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 transition-all group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <img
                      src={playlist.imageUrl}
                      alt={playlist.title}
                      className="w-14 h-14 rounded-xl object-cover shadow-sm"
                    />
                    <div className="flex-1 flex flex-col">
                      {/* Інлайн редагування (зміна кольорів інпуту на dark + accent) */}
                      {editingId === playlist.id ? (
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          autoFocus
                          className="bg-white dark:bg-neutral-950 border border-accent text-sm font-semibold rounded-md px-2 py-1 text-neutral-900 dark:text-white focus:outline-none w-full max-w-[200px]"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit(playlist.id);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                        />
                      ) : (
                        <p className="font-semibold text-sm text-neutral-900 dark:text-white transition-colors">
                          {playlist.title}
                        </p>
                      )}
                      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 transition-colors">
                        By {playlist.owner}
                      </p>
                    </div>
                  </div>

                  {/* Кнопки дій */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {editingId === playlist.id ? (
                      <button
                        onClick={() => handleSaveEdit(playlist.id)}
                        // Змінено text-[#1ab854] на text-accent
                        className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors font-medium text-xs"
                      >
                        Save
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStartEdit(playlist)}
                          title="Edit"
                          className="p-2 text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
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
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => onDelete(playlist.id)}
                          title="Delete"
                          className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
