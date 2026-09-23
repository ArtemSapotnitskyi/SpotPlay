import {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { type Track } from "../data/seed";
import { activityService } from "../shared/api/services/activityService";

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (track: Track) => void;
  togglePlayPause: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const accumulatedSeconds = useRef(0);
  const activeTrackId = useRef<string | null>(null);

  const sendTrackingData = async () => {
    const secondsToTrack = accumulatedSeconds.current;
    if (activeTrackId.current && accumulatedSeconds.current > 0) {
      window.dispatchEvent(
        new CustomEvent("optimisticUpdate", { detail: secondsToTrack }),
      );

      // Timer Reset
      accumulatedSeconds.current = 0;
      try {
        await activityService.trackListening(
          activeTrackId.current,
          secondsToTrack,
        );
        window.dispatchEvent(new Event("silentSyncStats"));
      } catch (error) {
        console.error("Failed to track listening:", error);
      }
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (currentTrack?.id !== activeTrackId.current) {
      sendTrackingData();
      activeTrackId.current = currentTrack?.id || null;
    }

    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        accumulatedSeconds.current += 1;
        if (accumulatedSeconds.current >= 15) {
          sendTrackingData();
        }
      }, 1000);
    } else {
      sendTrackingData();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentTrack]);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (currentTrack) {
      setIsPlaying((prev) => !prev);
    }
  };

  return (
    <PlayerContext.Provider
      value={{ currentTrack, isPlaying, playTrack, togglePlayPause }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
