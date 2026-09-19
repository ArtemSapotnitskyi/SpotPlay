import { useState, useEffect } from "react";
import { usePlayer } from "../../context/PlayerContext";
import { allTracks } from "../../data/seed";

export default function PlayerSideBar() {
  const [width, setWidth] = useState(320);
  const [resizing, setResizing] = useState(false);

  const { currentTrack, playTrack } = usePlayer();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizing) return;

      let newWidth = window.innerWidth - e.clientX;

      // Min/Max width constraints
      if (newWidth < 280) newWidth = 280;
      if (newWidth > 400) newWidth = 400;

      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      setResizing(false);
      document.body.style.cursor = "default";
    };

    if (resizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
    };
  }, [resizing]);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setResizing(true);
  };

  if (!currentTrack) return null;

  const artistTracks = allTracks.filter(
    (track) =>
      track.artist.name === currentTrack.artist.name &&
      track.id !== currentTrack.id,
  );

  return (
    <aside
      style={{ width: `${width}px` }}
      className={`relative flex-shrink-0 bg-[#FAFAFA] dark:bg-neutral-950 flex flex-col h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-l border-neutral-200 dark:border-neutral-800 transition-colors ${
        !resizing ? "transition-[width] duration-300 ease-out" : ""
      }`}
    >
      <div
        onMouseDown={startResizing}
        className="absolute top-0 left-0 w-1.5 h-full cursor-col-resize hover:bg-neutral-300 dark:hover:bg-neutral-700 active:bg-neutral-400 dark:active:bg-neutral-600 transition-colors z-10"
      />

      <div className="p-4 flex flex-col h-full overflow-y-auto custom-scrollbar space-y-6 pb-24">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-4 transition-colors">
            Now playing
          </h2>
          <div className="flex flex-col">
            <img
              src={currentTrack.imageUrl}
              alt={currentTrack.title}
              className="w-full aspect-square rounded-xl object-cover shadow-md mb-4"
            />
            <div className="w-full">
              <p className="text-2xl font-bold text-neutral-900 dark:text-white truncate transition-colors">
                {currentTrack.title}
              </p>
              <p className="text-md text-neutral-500 dark:text-neutral-400 truncate mt-1 transition-colors">
                {currentTrack.artist.name}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[2rem] p-6 flex flex-col transition-colors">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest transition-colors line-clamp-1 pr-2">
              More from {currentTrack.artist.name}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {artistTracks.length > 0 ? (
              artistTracks.map((track) => (
                <div
                  key={track.id}
                  onClick={() => playTrack(track)}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden relative shrink-0 bg-neutral-100 dark:bg-neutral-800">
                    <img
                      src={track.imageUrl}
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4 text-white ml-0.5"
                      >
                        <path d="M8 5.14v14l11-7-11-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="overflow-hidden flex-1">
                    <p className="font-semibold text-sm text-neutral-900 dark:text-white group-hover:text-accent transition-colors truncate">
                      {track.title}
                    </p>
                    <p className="text-[11px] font-medium text-neutral-400 mt-0.5 truncate transition-colors">
                      {track.albumName}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-10 h-10 rounded-full bg-neutral-50 dark:bg-neutral-800/50 flex items-center justify-center text-neutral-300 dark:text-neutral-600 mb-3 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 transition-colors">
                  No other tracks found in your library.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
