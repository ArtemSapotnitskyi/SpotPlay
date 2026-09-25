import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import "./config/db.js";

import userRoutes from "./routers/user.route.js";
import activityRoutes from "./routers/activity.route.js";
import songRoutes from "./routers/song.route.js";
import libraryRoutes from "./routers/library.route.js";
import { initSoundCloud } from "./config/soundcloud.js";

dotenv.config();

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.error("FATAL ERROR: JWT keys are not defined in the .env file");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5002;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api/users", userRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/library", libraryRoutes);

app.get("/", (req, res) => {
  res.send("SpotPlay Backend is running on TypeScript!");
});

const startServer = async () => {
  try {
    await initSoundCloud();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(
      "Failed to start server due to initialization errors:",
      error,
    );
    process.exit(1);
  }
};

startServer();
