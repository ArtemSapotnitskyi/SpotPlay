import {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { type Track } from "../data/seed";
import { BASE_URL } from "../shared/api/api";
import { activityService } from "../shared/api/services/activityService";

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  queue: Track[];
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrev: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [queue, setQueue] = useState<Track[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const accumulatedSeconds = useRef(0);
  const activeTrackId = useRef<string | null>(null);

  // Store latest state in ref to avoid stale closures.
  const stateRef = useRef({ queue, currentTrack });
  useEffect(() => {
    stateRef.current = { queue, currentTrack };
  }, [queue, currentTrack]);

  // Isolated function for loading and playing audio.
  const executePlay = useCallback((track: Track) => {
    if (!audioRef.current) return;

    const streamUrl = `${BASE_URL}/songs/${track.id}/stream`;
    audioRef.current.src = streamUrl;
    audioRef.current.load();
    setCurrentTime(0);

    audioRef.current
      .play()
      .then(() => {
        setCurrentTrack(track);
        setIsPlaying(true);
      })
      .catch((e) => {
        // Ignore AbortError when switching tracks quickly.
        if (e.name !== "AbortError") {
          console.error("Audio playback error:", e);
          setIsPlaying(false);
        }
      });
  }, []);

  // Switch to next track in queue.
  const playNext = useCallback(() => {
    const { queue, currentTrack } = stateRef.current;
    if (!currentTrack || queue.length === 0) return;

    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex !== -1 && currentIndex < queue.length - 1) {
      executePlay(queue[currentIndex + 1]);
    } else {
      // Stop player if queue is finished.
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
      }
    }
  }, [executePlay]);

  // Switch to previous track or restart current.
  const playPrev = useCallback(() => {
    const { queue, currentTrack } = stateRef.current;
    if (!currentTrack || !audioRef.current) return;

    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    if (queue.length === 0) return;

    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex > 0) {
      executePlay(queue[currentIndex - 1]);
    }
  }, [executePlay]);

  // Initialize Audio element and event listeners.
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = "anonymous";
    }

    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => playNext();
    const handleError = (e: Event) => {
      console.error("Audio stream error:", e);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.pause();
    };
  }, [playNext]);

  // Analytics tracking for played seconds.
  const sendTrackingData = async () => {
    const secondsToTrack = accumulatedSeconds.current;
    if (activeTrackId.current && secondsToTrack > 0) {
      window.dispatchEvent(
        new CustomEvent("optimisticUpdate", { detail: secondsToTrack }),
      );
      accumulatedSeconds.current = 0;

      try {
        await activityService.trackListening(
          activeTrackId.current,
          secondsToTrack,
        );
        window.dispatchEvent(new Event("silentSyncStats"));
      } catch (error) {
        console.error("Failed to track listening:", error);
        accumulatedSeconds.current += secondsToTrack;
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
        if (accumulatedSeconds.current >= 15) sendTrackingData();
      }, 1000);
    } else {
      sendTrackingData();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentTrack]);

  // Main play function triggered by user click.
  const playTrack = (track: Track, newQueue?: Track[]) => {
    if (newQueue) {
      setQueue(newQueue);
    } else if (queue.length === 0) {
      setQueue([track]);
    }

    if (currentTrack?.id !== track.id) {
      executePlay(track);
    } else {
      togglePlayPause();
    }
  };

  // Toggle play/pause state.
  const togglePlayPause = () => {
    if (currentTrack && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((e) => {
            if (e.name !== "AbortError") {
              console.error("Audio playback error:", e);
              setIsPlaying(false);
            }
          });
      }
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        queue,
        playTrack,
        togglePlayPause,
        playNext,
        playPrev,
      }}
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
