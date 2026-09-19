interface LibraryStatsProps {
  playlistsCount?: number;
  tracksCount?: number;
}

export default function LibraryStats({
  playlistsCount = 0,
  tracksCount = 0,
}: LibraryStatsProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[2rem] p-6 grid grid-cols-2 gap-4 transition-colors">
      <div className="flex flex-col justify-center items-center text-center p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 transition-colors">
        <p className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white transition-colors">
          {playlistsCount}
        </p>
        <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-1 transition-colors">
          Playlists
        </p>
      </div>
      <div className="flex flex-col justify-center items-center text-center p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 transition-colors">
        <p className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white transition-colors">
          {tracksCount}
        </p>
        <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-1 transition-colors">
          Tracks
        </p>
      </div>
    </div>
  );
}
