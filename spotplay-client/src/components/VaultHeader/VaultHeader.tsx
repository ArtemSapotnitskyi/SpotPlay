import { useState, useRef, useEffect } from "react";

interface VaultHeaderProps {
  onAddPlaylist: () => void;
  onAddFolder: () => void;
}

export default function VaultHeader({
  onAddPlaylist,
  onAddFolder,
}: VaultHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="mb-8 flex justify-between items-end border-b border-neutral-200 dark:border-neutral-800 pb-6 transition-colors">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white transition-colors">
          My Vault
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1 transition-colors">
          Your personal collection of albums, folders, and tracks
        </p>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:border-accent hover:text-accent dark:hover:border-accent dark:hover:text-accent transition-colors flex items-center gap-2 shadow-sm"
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
          Add New
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-100 dark:border-neutral-800 overflow-hidden z-50 transition-colors">
            <div className="py-2">
              <button
                onClick={() => {
                  onAddPlaylist();
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium flex items-center gap-2"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4 text-neutral-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
                New Playlist
              </button>
              <button
                onClick={() => {
                  onAddFolder();
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium flex items-center gap-2"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4 text-neutral-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
                New Folder
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
