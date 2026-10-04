import FolderIcon from "../icons/Folder";

export interface Folder {
  id: string;
  name: string;
  count: string;
}

interface FoldersListProps {
  folders: Folder[];
  onAddFolder: () => void;
  onFolderClick: (id: string) => void;
}

export default function FoldersList({
  folders,
  onAddFolder,
  onFolderClick,
}: FoldersListProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[2rem] p-6 flex-1 flex flex-col transition-colors">
      <div className="flex justify-between items-center mb-6">
        <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest transition-colors">
          Your Folders
        </span>
        <button
          onClick={onAddFolder}
          className="text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        {folders.length > 0 ? (
          folders.map((folder) => (
            <div
              key={folder.id}
              onClick={() => onFolderClick(folder.id)}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 group-hover:text-accent dark:group-hover:bg-accent/10 transition-colors">
                <FolderIcon />
              </div>
              <div>
                <p className="font-semibold text-sm text-neutral-900 dark:text-white group-hover:text-accent dark:group-hover:text-accent transition-colors">
                  {folder.name}
                </p>
                <p className="text-[11px] font-medium text-neutral-400 mt-0.5">
                  {folder.count}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-neutral-50 dark:bg-neutral-800/50 flex items-center justify-center text-neutral-300 dark:text-neutral-600 mb-3 transition-colors">
              <FolderIcon />
            </div>
            <p className="text-sm font-semibold text-neutral-900 dark:text-white mb-1 transition-colors">
              You have no folders
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4 max-w-[200px] transition-colors">
              Create a folder to organize your collection.
            </p>
            <button
              onClick={onAddFolder}
              className="text-xs font-semibold text-accent hover:brightness-90 transition-colors"
            >
              + Create Folder
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
