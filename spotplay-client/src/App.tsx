import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Playlist from "./pages/Playlist";
import Albums from "./pages/Albums";
import Statistics from "./pages/Statistics";
import Auth from "./pages/Auth";

// Panels
import SideBar from "./components/SideBar/SideBar";
import NavPanel from "./components/NavPanel/NavPanel";
import PlayerSideBar from "./components/PlayerSideBar/PlayerSideBar";
import PlayerFooter from "./components/PlayerFooter/PlayerFooter";

// Context Providers
import { PlayerProvider } from "./context/PlayerContext";

export default function App() {
  const location = useLocation();

  const isAuthPage = location.pathname === "/login";

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Auth />} />
      </Routes>
    );
  }

  return (
    <PlayerProvider>
      <div className="flex flex-col h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors duration-300">
        <div className="flex flex-1 overflow-hidden">
          <NavPanel />
          <SideBar />

          <main className="flex-1 bg-[#FAFAFA] dark:bg-neutral-900 overflow-y-auto transition-colors duration-300">
            <Routes>
              <Route
                path="/"
                element={<Navigate to="/playlist/p1" replace />}
              />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/playlist/:id" element={<Playlist />} />
              <Route path="/library" element={<Albums />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <PlayerSideBar />
        </div>

        <footer className="h-[90px] bg-[#FAFAFA] dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 p-5 shrink-0 transition-colors duration-300">
          <PlayerFooter />
        </footer>
      </div>
    </PlayerProvider>
  );
}
