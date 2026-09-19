import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userPlaylists } from "../../data/seed";
import { useDropdown } from "../../shared/hooks/useDropdown";

// Icons
import SearchIcon from "../icons/Search";
import ListIcon from "../icons/List";
import PlusIcon from "../icons/Plus";
import MusicIcon from "../icons/Music";
import FolderIcon from "../icons/Folder";

interface SidebarFolder {
  id: string;
  name: string;
}

export default function SideBar() {
  // Resizable sidebar state
  const [width, setWidth] = useState(200);
  const [resizing, setResizing] = useState(false);
  const isCollapsed = width < 150;

  // Search input state
  const [searchActive, setSearchActive] = useState(false);

  // Dropdowns
  const plusMenu = useDropdown();
  const sortMenu = useDropdown();

  const [sidebarPlaylists, setSidebarPlaylists] = useState(userPlaylists);
  const [sidebarFolders, setSidebarFolders] = useState<SidebarFolder[]>([]);

  const [activeModal, setActiveModal] = useState<
    "none" | "playlist" | "folder"
  >("none");
  const [inputValue, setInputValue] = useState("");

  // Handle click resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizing) return;

      let newWidth = e.clientX - 80;

      if (newWidth < 160) {
        newWidth = 80;
      } else if (newWidth >= 160 && newWidth <= 200) {
        newWidth = 200;
      } else if (newWidth > 300) {
        newWidth = 300;
      }

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

  const handleOpenModal = (type: "playlist" | "folder") => {
    plusMenu.setIsOpen(false);
    setInputValue("");
    setActiveModal(type);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (activeModal === "playlist") {
      const newPlaylist = {
        id: `p-${Date.now()}`,
        title: inputValue.trim(),
        owner: "You",
        description: "",
        imageUrl:
          "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=150",
        tracks: [],
        type: "Playlist" as const,
      };
      setSidebarPlaylists([newPlaylist, ...sidebarPlaylists]);
    } else if (activeModal === "folder") {
      const newFolder = {
        id: `f-${Date.now()}`,
        name: inputValue.trim(),
      };
      setSidebarFolders([newFolder, ...sidebarFolders]);
    }

    setActiveModal("none");
  };

  return (
    <>
      <aside
        style={{ width: `${width}px` }}
        className={`relative flex-shrink-0 bg-[#FAFAFA] dark:bg-neutral-950 flex flex-col h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-neutral-200 dark:border-neutral-800 transition-colors ${
          !resizing ? "transition-[width] duration-300 ease-out" : ""
        }`}
      >
        <div
          className={`p-3 flex flex-col h-full ${isCollapsed ? "items-center" : ""}`}
        >
          <div
            className={`flex items-center w-full ${isCollapsed ? "justify-center mt-1" : "justify-between"}`}
          >
            {!isCollapsed && (
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white ml-1 whitespace-nowrap overflow-hidden tracking-tight transition-colors">
                Library
              </h2>
            )}

            {/* Drop menu Plus */}
            <div ref={plusMenu.ref} className="relative">
              <button
                onClick={() => plusMenu.setIsOpen((prev) => !prev)}
                className="flex items-center justify-center w-8 h-8 rounded-full text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <PlusIcon />
              </button>

              {plusMenu.isOpen && (
                <div className="absolute left-0 top-10 w-[300px] bg-white dark:bg-neutral-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-100 dark:border-neutral-800 p-2 z-50 flex flex-col transition-colors">
                  <button
                    onClick={() => handleOpenModal("playlist")}
                    className="w-full flex items-center gap-3 p-2.5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-xl transition-colors group"
                  >
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 group-hover:text-accent transition-colors">
                      <MusicIcon />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-neutral-900 dark:text-white transition-colors">
                        Create Playlist
                      </span>
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 transition-colors">
                        Build your custom collection
                      </span>
                    </div>
                  </button>

                  <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-1 mx-2 transition-colors"></div>

                  <button
                    onClick={() => handleOpenModal("folder")}
                    className="w-full flex items-center gap-3 p-2.5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-xl transition-colors group"
                  >
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 group-hover:text-accent transition-colors">
                      <FolderIcon />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-neutral-900 dark:text-white transition-colors">
                        Create Folder
                      </span>
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 transition-colors">
                        Organize your library
                      </span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Search & Sort Section */}
          {!isCollapsed && (
            <div className="mt-4 flex items-center justify-between w-full gap-2 relative">
              <div
                className={`flex items-center transition-all duration-300 ease-in-out border ${
                  searchActive
                    ? "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 shadow-sm flex-1 rounded-full py-1.5 px-3"
                    : "bg-transparent border-transparent w-auto p-1 rounded-full hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50"
                }`}
              >
                <button
                  className={`flex-shrink-0 w-5 h-5 flex items-center justify-center transition-colors ${
                    searchActive
                      ? "text-accent"
                      : "text-neutral-500 dark:text-neutral-400"
                  }`}
                  onClick={() => setSearchActive(!searchActive)}
                >
                  <SearchIcon />
                </button>

                <input
                  type="text"
                  placeholder="Search..."
                  className={`bg-transparent outline-none text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 transition-all duration-300 ease-in-out overflow-hidden ${
                    searchActive
                      ? "w-full opacity-100 ml-2"
                      : "w-0 opacity-0 pointer-events-none ml-0"
                  }`}
                />
              </div>

              <div ref={sortMenu.ref} className="relative flex-shrink-0">
                <button
                  onClick={() => sortMenu.setIsOpen((prev) => !prev)}
                  className={`flex items-center flex-shrink-0 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-md transition-all duration-300 ease-in-out overflow-hidden ${
                    searchActive
                      ? "max-w-0 opacity-0 p-0 m-0 pointer-events-none"
                      : "max-w-[100px] opacity-100 p-1.5"
                  }`}
                >
                  <div className="flex-shrink-0 flex items-center w-5 h-5">
                    <ListIcon />
                  </div>
                  <span className="ml-1 text-sm font-semibold whitespace-nowrap">
                    Latest
                  </span>
                </button>

                {sortMenu.isOpen && (
                  <div className="absolute right-0 top-10 w-48 bg-white dark:bg-neutral-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-100 dark:border-neutral-800 p-2 z-50 flex flex-col gap-0.5 transition-colors">
                    <span className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
                      Sort by
                    </span>
                    <button className="w-full text-left px-3 py-2 text-sm font-medium text-accent hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-lg transition-colors">
                      Recents
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-lg transition-colors">
                      Recently Added
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-lg transition-colors">
                      Alphabetical
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-lg transition-colors">
                      Creator
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="h-px bg-neutral-200 dark:bg-neutral-800 mt-3 mx-2 transition-colors"></div>

          {/* Library Items List */}
          <ul className="mt-3 space-y-1 overflow-y-auto flex-1 w-full custom-scrollbar">
            {sidebarFolders.map((folder) => (
              <li key={folder.id}>
                <div
                  className={`flex items-center rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer transition-all duration-200 group ${
                    isCollapsed ? "justify-center p-1" : "gap-3 p-2"
                  }`}
                >
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-neutral-200/50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 rounded-lg group-hover:text-accent transition-colors">
                    <FolderIcon />
                  </div>
                  {!isCollapsed && (
                    <div className="overflow-hidden flex-1">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate group-hover:text-accent transition-colors">
                        {folder.name}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5 transition-colors">
                        Folder
                      </p>
                    </div>
                  )}
                </div>
              </li>
            ))}

            {sidebarPlaylists.map((item) => (
              <li key={item.id}>
                <Link
                  to={`/playlist/${item.id}`}
                  className={`flex items-center rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer transition-all duration-200 group ${
                    isCollapsed ? "justify-center p-1" : "gap-3 p-2"
                  }`}
                >
                  <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden relative shadow-sm group-hover:shadow-md transition-shadow">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {!isCollapsed && (
                    <div className="overflow-hidden flex-1">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate transition-colors">
                        {item.title}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5 transition-colors">
                        {item.type || "Playlist"} • {item.owner}
                      </p>
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resizer */}
        <div
          onMouseDown={startResizing}
          className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-neutral-300 dark:hover:bg-neutral-700 active:bg-neutral-400 dark:active:bg-neutral-600 transition-colors z-10"
        />
      </aside>

      {/* Модальне вікно */}
      {activeModal !== "none" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 w-full max-w-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-100 dark:border-neutral-800 transition-colors">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1 transition-colors">
              {activeModal === "playlist" ? "New Playlist" : "New Folder"}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-5 transition-colors">
              {activeModal === "playlist"
                ? "Give your new playlist a title."
                : "Enter a name for your new folder."}
            </p>

            <form onSubmit={handleCreate}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  activeModal === "playlist"
                    ? "My Awesome Mix..."
                    : "Workout..."
                }
                autoFocus
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all mb-6 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModal("none")}
                  className="px-5 py-2.5 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="px-5 py-2.5 text-sm font-medium bg-black dark:bg-white text-white dark:text-black rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
