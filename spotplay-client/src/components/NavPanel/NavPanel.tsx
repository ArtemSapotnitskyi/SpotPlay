import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";

// Icons
import StatIcon from "../icons/Stat";
import FolderIcon from "../icons/Folder";
import HeadphoneIcon from "../icons/Headphone";

export default function NavPanel() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { theme, setTheme, accentColor, setAccentColor } = useSettings();

  const colorOptions = [
    { name: "Green", hex: "#1ab854" },
    { name: "Purple", hex: "#8b5cf6" },
    { name: "Blue", hex: "#3b82f6" },
    { name: "Orange", hex: "#f97316" },
    { name: "Rose", hex: "#f43f5e" },
  ];

  const checkIsActive = (path: string) => {
    return (
      location.pathname === path ||
      (path === "/" && location.pathname.startsWith("/playlist"))
    );
  };

  return (
    <>
      {/* Додано dark:bg-neutral-900 та dark:border-neutral-800 для темної теми сайдбару */}
      <aside className="relative w-20 flex-shrink-0 bg-light-greey dark:bg-neutral-950 text-player-dark dark:text-white flex flex-col items-center py-6 h-full shadow-md border-r border-gray-200 dark:border-neutral-800 transition-colors">
        <div className="flex flex-col items-center gap-6 w-full">
          {/* Динамічний колір логотипу */}
          <div style={{ color: accentColor }} className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>

          <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
            <img
              src="https://i.pravatar.cc/150?img=33"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <nav className="flex-1 flex flex-col items-center justify-center gap-8 w-full mt-4">
          <button
            onClick={() => navigate("/statistics")}
            className={`p-2 rounded-xl shadow-sm transition-colors ${checkIsActive("/statistics") ? "text-white" : "text-gray-400 hover:text-player-dark dark:hover:text-white shadow-none"}`}
            style={
              checkIsActive("/statistics")
                ? { backgroundColor: accentColor }
                : {}
            }
          >
            <StatIcon />
          </button>

          <button
            onClick={() => navigate("/")}
            className={`p-2 rounded-xl shadow-sm transition-colors ${checkIsActive("/") ? "text-white" : "text-gray-400 hover:text-player-dark dark:hover:text-white shadow-none"}`}
            style={checkIsActive("/") ? { backgroundColor: accentColor } : {}}
          >
            <HeadphoneIcon />
          </button>

          <button
            onClick={() => navigate("/library")}
            className={`p-2 rounded-xl shadow-sm transition-colors ${checkIsActive("/library") ? "text-white" : "text-gray-400 hover:text-player-dark dark:hover:text-white shadow-none"}`}
            style={
              checkIsActive("/library") ? { backgroundColor: accentColor } : {}
            }
          >
            <FolderIcon />
          </button>
        </nav>

        <div className="flex flex-col items-center gap-6 w-full">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="text-gray-400 hover:text-player-dark dark:hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>

          <button className="text-gray-400 hover:text-player-dark dark:hover:text-white transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </aside>

      {/* МОДАЛЬНЕ ВІКНО */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
          {/* dark:bg-neutral-900 для фону модалки */}
          <div className="bg-[#FAFAFA] dark:bg-neutral-900 rounded-3xl w-full max-w-4xl shadow-2xl border border-neutral-100 dark:border-neutral-800 flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar transition-colors">
            <div className="sticky top-0 bg-[#FAFAFA]/90 dark:bg-neutral-900/90 backdrop-blur-md z-10 px-8 py-6 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center transition-colors">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-white">
                  Settings
                </h2>
                <p className="text-neutral-500 text-sm mt-1">
                  Manage your preferences and customize your app experience
                </p>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white rounded-full transition-colors"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-[2rem] p-6 flex flex-col gap-6 transition-colors">
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1 block">
                    Appearance
                  </span>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    Theme
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-center gap-3 p-3 rounded-2xl border-2 transition-all ${theme === "light" ? "border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800" : "border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"}`}
                  >
                    <div className="w-full h-12 bg-white border border-neutral-200 rounded-lg shadow-sm flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-neutral-900"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-300">
                      Light
                    </span>
                  </button>

                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center gap-3 p-3 rounded-2xl border-2 transition-all ${theme === "dark" ? "border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800" : "border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"}`}
                  >
                    <div className="w-full h-12 bg-neutral-900 border border-neutral-800 rounded-lg shadow-sm flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-300">
                      Dark
                    </span>
                  </button>

                  <button
                    onClick={() => setTheme("system")}
                    className={`flex flex-col items-center gap-3 p-3 rounded-2xl border-2 transition-all ${theme === "system" ? "border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800" : "border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"}`}
                  >
                    <div className="w-full h-12 bg-gradient-to-br from-white to-neutral-900 border border-neutral-200 rounded-lg shadow-sm flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-neutral-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-300">
                      System
                    </span>
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-[2rem] p-6 flex flex-col gap-6 transition-colors">
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1 block">
                    Personalization
                  </span>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    Accent Color
                  </h3>
                </div>

                <div className="flex items-center justify-between gap-2 mt-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setAccentColor(color.hex)}
                      className="relative flex items-center justify-center w-12 h-12 rounded-full transition-transform hover:scale-110 focus:outline-none shadow-sm"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {accentColor === color.hex && (
                        <svg
                          className="w-5 h-5 text-white"
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
                    </button>
                  ))}
                </div>

                <div className="mt-auto pt-6 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Preview:
                  </span>
                  <div
                    className="px-4 py-2 rounded-full text-white text-xs font-bold tracking-wide transition-colors"
                    style={{ backgroundColor: accentColor }}
                  >
                    Active UI
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-[2rem] p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 transition-colors">
                <div className="relative group cursor-pointer">
                  <img
                    src="https://i.pravatar.cc/150?img=33"
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border border-neutral-200 dark:border-neutral-800 shadow-sm"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left flex flex-col justify-center h-full">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1 block">
                    Account
                  </span>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    User Profile
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    user.account@example.com
                  </p>

                  <div className="mt-4 flex gap-3 justify-center sm:justify-start">
                    <button className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                      Edit Profile
                    </button>
                    <button className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 rounded-xl text-sm font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white transition-colors">
                      Reset Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
