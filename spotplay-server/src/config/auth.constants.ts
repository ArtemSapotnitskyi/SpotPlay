import { SignOptions } from "jsonwebtoken";

interface AuthConstants {
  REFRESH_TOKEN_AGE: SignOptions["expiresIn"];
  REFRESH_COOKIE_MAX_AGE: number;
  ROTATION_WINDOW_SECONDS: number;
  ACCESS_TOKEN_AGE: SignOptions["expiresIn"];
}

export const AUTH: AuthConstants = {
  REFRESH_TOKEN_AGE: "180d",
  REFRESH_COOKIE_MAX_AGE: 180 * 24 * 60 * 60 * 1000,
  ROTATION_WINDOW_SECONDS: 24 * 60 * 60,
  ACCESS_TOKEN_AGE: "15m",
} as const;
