import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import "./config/db.js";

import userRoutes from "./routers/user.route.js";
import activityRoutes from "./routers/activity.route.js";

dotenv.config();

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.error("FATAL ERROR: JWT keys are not defined in the .env file");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5002;

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/activity", activityRoutes);

app.get("/", (req, res) => {
  res.send("SpotPlay Backend is running on TypeScript!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
