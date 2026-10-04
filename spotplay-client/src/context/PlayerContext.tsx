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
  updateQueue: (newQueue: Track[]) => void;
  seekTo: (time: number) => void;
  isLooping: boolean;
  toggleLoop: () => void;
  volume: number;
  setVolume: (volume: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isLooping, setIsLooping] = useState(false);
  const [volume, setVolume] = useState<number>(0.5);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const accumulatedSeconds = useRef(0);
  const activeTrackId = useRef<string | null>(null);

  const updateQueue = useCallback((newQueue: Track[]) => {
    setQueue(newQueue);
    stateRef.current.queue = newQueue;
  }, []);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const toggleLoop = useCallback(() => {
    setIsLooping((prev) => {
      const newValue = !prev;
      if (audioRef.current) {
        audioRef.current.loop = newValue;
      }
      return newValue;
    });
  }, []);

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
    //Object destructuring with renaming "queue: currentQueue, currentTrack: trackNowPlaying"
    //This reading: "Take data from queue that in stateRef.current and rewrite it to currentQueue"
    const { queue: currentQueue, currentTrack: trackNowPlaying } =
      stateRef.current;
    console.log("Pressed NEXT Button");
    console.log("Current Track:", trackNowPlaying?.title);
    console.log("Queue size:", currentQueue.length);
    if (!trackNowPlaying || currentQueue.length === 0) return;

    const currentIndex = currentQueue.findIndex(
      (t) => t.id === trackNowPlaying.id,
    );
    if (currentIndex !== -1 && currentIndex < currentQueue.length - 1) {
      executePlay(currentQueue[currentIndex + 1]);
    } else {
      // Stop player if queue is finished.
      console.log(
        "Action: Reached end of queue or track not in queue. Stopping.",
      );
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
    const { queue: currentQueue, currentTrack: trackNowPlaying } =
      stateRef.current;

    console.log("Pressed Prev Button");
    console.log("Current Track:", trackNowPlaying?.title);
    console.log("Queue size:", currentQueue.length);
    if (!trackNowPlaying || !audioRef.current) return;

    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    if (currentQueue.length === 0) return;

    const currentIndex = currentQueue.findIndex(
      (t) => t.id === trackNowPlaying.id,
    );
    if (currentIndex > 0) {
      executePlay(currentQueue[currentIndex - 1]);
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

  // Synchronization volume with teg <audio>
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

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
    console.log("PLAY TRACK CALLED");
    console.log("Track:", track.title);
    if (newQueue) {
      setQueue(newQueue);
      // Update the ref immediately, do not wait for state to update asynchronously.
      stateRef.current.queue = newQueue;
    } else if (queue.length === 0) {
      setQueue([track]);
      stateRef.current.queue = [track];
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
        isLooping,
        volume,
        playTrack,
        togglePlayPause,
        playNext,
        playPrev,
        updateQueue,
        seekTo,
        toggleLoop,
        setVolume,
      }}
    >
      {children}
      <audio ref={audioRef} loop={isLooping} />
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
