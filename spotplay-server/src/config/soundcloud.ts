import play from "play-dl";

export const initSoundCloud = async () => {
  try {
    console.log("[SoundCloud] Initializing Client ID...");
    const client_id = await play.getFreeClientID();

    play.setToken({
      soundcloud: {
        client_id: client_id,
      },
    });
    console.log(`[SoundCloud] Client ID successfully generated: ${client_id}`);
  } catch (error) {
    console.error("[SoundCloud] Failed to initialize Client ID:", error);
    throw error;
  }
};
