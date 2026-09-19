interface StandardCardProps {
  title: string;
  description: string;
  imageUrl: string;
  isPinned?: boolean;
  onPin?: (e: React.MouseEvent) => void;
}

export default function StandardCard({
  title,
  description,
  imageUrl,
  isPinned,
  onPin,
}: StandardCardProps) {
  return (
    <div className="p-3 bg-white dark:bg-neutral-900 rounded-[1rem] border border-transparent hover:border-accent dark:hover:border-accent hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all cursor-pointer group flex flex-col gap-3 h-full relative">
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-800 transition-colors">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full"
        />

        <div className="absolute right-2 bottom-2 bg-accent text-white rounded-full p-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-sm hover:scale-105">
          <svg className="w-4 h-4 ml-0.5 fill-current" viewBox="0 0 24 24">
            <path d="M7 4v16l13-8z" />
          </svg>
        </div>

        {onPin && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPin(e);
            }}
            className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md bg-white/80 dark:bg-black/60 hover:bg-white dark:hover:bg-black/80 transition-all shadow-sm z-10 
              ${
                isPinned
                  ? "opacity-100 text-accent"
                  : "opacity-0 group-hover:opacity-100 text-neutral-500 dark:text-neutral-400 hover:text-accent dark:hover:text-accent"
              }`}
          >
            <svg
              className="w-3 h-3 fill-current transition-colors"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </button>
        )}
      </div>
      <div className="flex flex-col gap-0.5 px-1 pb-1">
        <h3 className="font-semibold text-neutral-900 dark:text-white truncate text-sm transition-colors">
          {title}
        </h3>
        <p className="text-[13px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-snug transition-colors">
          {description}
        </p>
      </div>
    </div>
  );
}
