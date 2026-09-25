import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import ClockIcon from "../components/icons/Clock";

import { usePlayer } from "../context/PlayerContext";
import { formatDuration, formatDate } from "../shared/utils/formatters";
import { libraryService } from "../shared/api/services/libraryService";
import type { Track } from "../data/seed";

const PlayIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M8 5.14v14l11-7-11-7z" />
  </svg>
);

export default function Playlist() {
  const { id } = useParams<{ id: string }>();
  const { playTrack, currentTrack } = usePlayer();

  const [playlistInfo, setPlaylistInfo] = useState<any>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [ignoreClip, setIgnoreClip] = useState(true);

  useEffect(() => {
    const fetchPlaylistData = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await libraryService.getPlaylistDetailed(id);

        setPlaylistInfo(data);

        localStorage.setItem("lastOpenedPlaylistId", id);

        if (data.songs) {
          const mappedTracks: Track[] = data.songs.map((song: any) => ({
            id: song.id,
            title: song.title,
            durationMs: song.durationseconds * 1000,
            audioUrl: `http://localhost:5001/api/songs/${song.id}/stream`,
            imageUrl:
              song.coverimage ||
              "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=150",
            albumName: "Single",
            addedAt: song.addedat,
            artist: {
              name: song.artist || "Unknown Artist",
              imageUrl: "",
              isVerified: false,
              monthlyListeners: 0,
            },
            credits: [],
          }));
          setTracks(mappedTracks);
        }
      } catch (err) {
        console.error("Failed to fetch playlist:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylistData();
  }, [id]);

  if (error) {
    return <Navigate to="/" replace />;
  }

  if (isLoading || !playlistInfo) {
    return (
      <div className="bg-[#FAFAFA] dark:bg-neutral-950 min-h-screen flex items-center justify-center">
        <p className="animate-pulse text-neutral-500">Loading playlist...</p>
      </div>
    );
  }

  const gridLayout =
    "grid grid-cols-[40px_1fr_50px] md:grid-cols-[40px_6fr_4fr_3fr_50px] gap-4 items-center px-4";

  const totalDurationMs = tracks.reduce(
    (sum, track) => sum + track.durationMs,
    0,
  );
  const totalMinutes = Math.floor(totalDurationMs / 60000);

  const handleAddTrack = async () => {
    if (!searchQuery.trim() || !id) return;

    try {
      const response = await libraryService.createSongFromQuery(searchQuery);
      const savedSong = response.song;

      await libraryService.addSongToPlaylist(id, savedSong.id);

      const newTrack: Track = {
        id: savedSong.id,
        title: savedSong.title,
        durationMs: savedSong.durationseconds * 1000,
        audioUrl: `http://localhost:5001/api/songs/${savedSong.id}/stream`,
        imageUrl:
          savedSong.coverimage ||
          "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=150",
        albumName: "YouTube Audio",
        addedAt: new Date().toISOString(),
        artist: {
          name: savedSong.artist,
          imageUrl: "",
          isVerified: false,
          monthlyListeners: 0,
        },
        credits: [],
      };

      setTracks((prev) => [...prev, newTrack]);
      setSearchQuery("");
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add track:", error);
      alert("Error adding track! Check console for details.");
    }
  };

  const coverImage =
    "https://images.unsplash.com/photo-1493225457124-a1a2a5956093?w=500";

  return (
    <section className="bg-[#FAFAFA] dark:bg-neutral-950 min-h-full pb-8 font-sans transition-colors duration-300">
      {/* Header section */}
      <div className="flex flex-col md:flex-row items-end gap-6 p-6 md:p-8 bg-gradient-to-b from-neutral-200 dark:from-neutral-900 to-[#FAFAFA] dark:to-neutral-950 border-b border-neutral-200/50 dark:border-neutral-800/50 transition-colors duration-300">
        <div className="shrink-0 shadow-lg rounded-xl overflow-hidden">
          <img
            src={coverImage}
            alt={playlistInfo.name}
            className="w-48 h-48 md:w-60 md:h-60 object-cover"
          />
        </div>

        <div className="flex flex-col pb-1">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-2 transition-colors">
            Playlist
          </span>

          <h1 className="text-5xl md:text-7xl font-black text-neutral-900 dark:text-white tracking-tight mt-1 mb-6 transition-colors">
            {playlistInfo.name}
          </h1>

          <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-neutral-300 transition-colors">
            <div className="w-7 h-7 bg-neutral-900 dark:bg-neutral-800 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase transition-colors">
              Y
            </div>
            <span className="font-semibold hover:underline cursor-pointer">
              You
            </span>
            <span className="text-neutral-500 dark:text-neutral-400 font-medium transition-colors">
              • {tracks.length} songs, {totalMinutes} min
            </span>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="px-6 md:px-8 py-6 flex items-center gap-4">
        <button
          onClick={() => tracks.length > 0 && playTrack(tracks[0])}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white transition-transform shadow-md ${
            tracks.length > 0
              ? "bg-accent hover:scale-105"
              : "bg-neutral-300 dark:bg-neutral-700 cursor-not-allowed"
          }`}
        >
          <PlayIcon className="w-7 h-7 ml-1" />
        </button>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:border-accent hover:text-accent dark:hover:border-accent dark:hover:text-accent transition-colors ml-2 shadow-sm"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 5v14m-7-7h14"
            />
          </svg>
          Add New
        </button>
      </div>

      {/* Tracks table header */}
      <div className="px-4 md:px-8">
        <div
          className={`${gridLayout} py-3 border-b border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-4 transition-colors`}
        >
          <div className="text-center">#</div>
          <div>Title</div>
          <div className="hidden md:block">Album</div>
          <div className="hidden md:block">Date added</div>
          <div className="flex justify-end pr-4">
            <ClockIcon />
          </div>
        </div>

        {/* Tracks List */}
        <div className="flex flex-col gap-1">
          {tracks.map((track, index) => {
            const isCurrentTrack = currentTrack?.id === track.id;

            return (
              <div
                key={track.id}
                onClick={() => playTrack(track)}
                className={`${gridLayout} py-2.5 rounded-xl hover:bg-white dark:hover:bg-neutral-900 border border-transparent hover:border-neutral-100 dark:hover:border-neutral-800 hover:shadow-sm transition-all group cursor-pointer`}
              >
                <div className="text-center text-neutral-400 dark:text-neutral-500 font-medium w-full flex justify-center transition-colors">
                  <span
                    className={`group-hover:hidden ${isCurrentTrack ? "text-accent" : ""}`}
                  >
                    {index + 1}
                  </span>
                  <span className="hidden group-hover:block text-neutral-900 dark:text-white">
                    <PlayIcon className="w-4 h-4" />
                  </span>
                </div>

                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={track.imageUrl}
                    alt={track.title}
                    className="w-10 h-10 rounded-md object-cover shadow-sm shrink-0"
                  />
                  <div className="flex flex-col truncate">
                    <span
                      className={`font-semibold truncate transition-colors ${isCurrentTrack ? "text-accent" : "text-neutral-900 dark:text-white"}`}
                    >
                      {track.title}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors mt-0.5">
                      {track.artist.name}
                    </span>
                  </div>
                </div>

                <div className="hidden md:block text-sm text-neutral-500 dark:text-neutral-400 truncate group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                  {track.albumName}
                </div>

                <div className="hidden md:block text-sm text-neutral-500 dark:text-neutral-400 truncate group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                  {formatDate(track.addedAt)}
                </div>

                <div className="text-sm text-neutral-500 dark:text-neutral-400 text-right pr-4 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                  {formatDuration(track.durationMs)}
                </div>
              </div>
            );
          })}

          {tracks.length === 0 && (
            <div className="text-center py-10 text-neutral-500 dark:text-neutral-400 transition-colors">
              No tracks in this playlist yet. Add some music!
            </div>
          )}
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 dark:bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-100 dark:border-neutral-800 flex flex-col gap-6 transition-colors">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white transition-colors">
                Add New Music
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
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

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest transition-colors">
                Paste a link to download the track:
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Paste URL or type: Artist - Song name"
                autoFocus
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                onKeyDown={(e) => e.key === "Enter" && handleAddTrack()}
              />
            </div>

            <div className="flex justify-between items-center mt-1">
              <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 transition-colors">
                Supported: YouTube, SoundCloud, etc.
              </span>

              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${ignoreClip ? "bg-accent border-accent" : "bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 group-hover:border-accent"}`}
                >
                  {ignoreClip && (
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={ignoreClip}
                  onChange={() => setIgnoreClip(!ignoreClip)}
                />
                <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                  Ignore Clip (Audio only)
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-5 py-2.5 text-sm font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTrack}
                disabled={!searchQuery.trim()}
                className="px-5 py-2.5 text-sm font-semibold bg-black dark:bg-white text-white dark:text-black rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Download & Add
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
