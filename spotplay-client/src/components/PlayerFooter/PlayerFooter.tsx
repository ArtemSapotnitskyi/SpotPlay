import { usePlayer } from "../../context/PlayerContext";
import { formatDuration } from "../../shared/utils/formatters";
import { allTracks } from "../../data/seed";

//Icons
import NextIcon from "../icons/Next";
import PrevIcon from "../icons/Prev";
import VolumeIcon from "../icons/Volume";
import QueueIcon from "../icons/Queue";
import RepeatIcon from "../icons/Repeat";
import PlayIcon from "../icons/Play";
import PauseIcon from "../icons/Pause";

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-accent transition-colors">
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
      clipRule="evenodd"
      fill="currentColor"
    />
    <circle cx="12" cy="12" r="9.75" fill="currentColor" />
    <path
      fillRule="evenodd"
      d="M16.707 9.293a1 1 0 010 1.414l-5.5 5.5a1 1 0 01-1.414 0l-2.5-2.5a1 1 0 111.414-1.414l1.793 1.793 4.793-4.793a1 1 0 011.414 0z"
      className="fill-white dark:fill-neutral-950 transition-colors"
      clipRule="evenodd"
    />
  </svg>
);

export default function PlayerFooter() {
  const { currentTrack, isPlaying, togglePlayPause, playTrack } = usePlayer();
  const displayTrack = currentTrack || allTracks[0];

  if (!currentTrack) {
    return (
      <div className="flex items-center h-full px-2 text-neutral-500 dark:text-neutral-400 transition-colors">
        Виберіть трек для відтворення
      </div>
    );
  }

  return (
    <div className="flex items-center h-full px-2">
      {/* 1. LEFT: Track Info */}
      <div className="flex items-center gap-4 overflow-hidden w-[30%] min-w-[180px]">
        <img
          src={currentTrack.imageUrl}
          alt={currentTrack.title}
          className="w-14 h-14 rounded-md object-cover shadow-sm shrink-0"
        />
        <div className="flex flex-col truncate">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900 dark:text-white text-sm truncate hover:underline cursor-pointer transition-colors">
              {currentTrack.title}
            </span>
            <button className="flex-shrink-0 hover:scale-105 transition-transform">
              <CheckCircleIcon />
            </button>
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate hover:text-neutral-900 dark:hover:text-white hover:underline transition-colors cursor-pointer mt-0.5">
            {currentTrack.artist.name}
          </span>
        </div>
      </div>

      {/* 2. CENTER: Controls & Progress */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-[722px] px-4">
        {/* Top Controls */}
        <div className="flex items-center gap-6 mb-2">
          <button className="text-neutral-400 dark:text-neutral-500 hover:text-accent dark:hover:text-accent transition-colors">
            <PrevIcon />
          </button>

          <button
            onClick={() => {
              currentTrack ? togglePlayPause() : playTrack(displayTrack);
            }}
            className="w-8 h-8 flex items-center justify-center bg-accent text-white rounded-full hover:scale-105 transition-all shadow-sm"
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          <button className="text-neutral-400 dark:text-neutral-500 hover:text-accent dark:hover:text-accent transition-colors">
            <NextIcon />
          </button>
          <button className="text-neutral-400 dark:text-neutral-500 hover:text-accent dark:hover:text-accent transition-colors">
            <RepeatIcon />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 w-full text-xs text-neutral-500 dark:text-neutral-400 font-medium transition-colors">
          <span className="min-w-[40px] text-right">0:20</span>

          <div className="h-1 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full cursor-pointer group flex items-center relative transition-colors">
            <div
              className={`h-full bg-accent ${
                isPlaying ? "w-[40%]" : "w-[0%]"
              } rounded-full transition-all duration-1000 relative`}
            >
              <div className="hidden group-hover:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white dark:bg-neutral-200 rounded-full shadow-md border border-neutral-100 dark:border-neutral-700"></div>
            </div>
          </div>

          <span className="min-w-[40px]">
            {currentTrack.durationMs
              ? formatDuration(currentTrack.durationMs)
              : "0:00"}
          </span>
        </div>
      </div>

      {/* 3. RIGHT: Extra Controls */}
      <div className="w-[30%] min-w-[180px] flex items-center justify-end gap-4 text-neutral-400 dark:text-neutral-500 transition-colors">
        <button className="hover:text-neutral-900 dark:hover:text-white transition-colors">
          <QueueIcon />
        </button>

        {/* Volume Slider */}
        <div className="flex items-center gap-2 w-24 group cursor-pointer">
          <button className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            <VolumeIcon />
          </button>
          <div className="h-1 flex-1 bg-neutral-200 dark:bg-neutral-800 rounded-full flex items-center relative transition-colors">
            <div className="h-full bg-neutral-400 dark:bg-neutral-500 group-hover:bg-accent dark:group-hover:bg-accent rounded-full w-[60%] transition-colors relative">
              <div className="hidden group-hover:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white dark:bg-neutral-200 rounded-full shadow-md border border-neutral-100 dark:border-neutral-700"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
