import MusicIcon from "../icons/Music";

interface PinnedItemProps {
  id?: string;
  title: string;
  description?: string;
  imageUrl?: string;
  trackCount: number;
}

export default function PinnedItemCard({
  title,
  description = "Playlist",
  imageUrl,
  trackCount,
}: PinnedItemProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center group cursor-pointer hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl object-cover shadow-sm group-hover:scale-[1.02] transition-transform duration-500 flex-shrink-0"
        />
      ) : (
        <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl flex-shrink-0 overflow-hidden relative shadow-sm group-hover:shadow-md transition-shadow bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
          <MusicIcon className="w-24 h-24 text-neutral-400 dark:text-neutral-500" />
        </div>
      )}

      <div className="flex flex-col flex-1 text-center sm:text-left w-full h-full">
        <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3 flex items-center justify-center sm:justify-start gap-1.5 transition-colors">
          <svg
            className="w-3 h-3 text-accent transition-colors"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          Pinned
        </span>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-2 transition-colors">
          {title}
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6 line-clamp-2 transition-colors">
          {description}
        </p>
        <div className="mt-auto flex items-center justify-center sm:justify-start gap-4">
          <button className="bg-accent text-white w-12 h-12 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-sm">
            <svg className="w-5 h-5 ml-1 fill-current" viewBox="0 0 24 24">
              <path d="M7 4v16l13-8z" />
            </svg>
          </button>
          <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 transition-colors">
            {trackCount} TRACKS
          </span>
        </div>
      </div>
    </div>
  );
}
