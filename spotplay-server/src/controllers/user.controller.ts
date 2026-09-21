import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as userService from "../services/user.service.js";
import { AUTH } from "../config/auth.constants.js";

interface TokenPayload {
  userId: string;
  iat: number;
  exp: number;
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await userService.findByEmail(email);
    if (existingUser) {
      res
        .status(409)
        .json({ message: "A user with this email address already exists" });
      return;
    }

    const newUser = await userService.create({
      username,
      email,
      password,
    });

    const accessToken = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET as string,
      { expiresIn: AUTH.ACCESS_TOKEN_AGE },
    );

    const refreshToken = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: AUTH.REFRESH_TOKEN_AGE },
    );

    await userService.saveRefreshToken(newUser.id, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      maxAge: AUTH.REFRESH_COOKIE_MAX_AGE,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      accessToken,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await userService.findByEmail(email);
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordhash);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: AUTH.ACCESS_TOKEN_AGE },
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: AUTH.REFRESH_TOKEN_AGE },
    );

    await userService.saveRefreshToken(user.id, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      maxAge: AUTH.REFRESH_COOKIE_MAX_AGE,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentRefreshToken = req.cookies?.refreshToken;
    if (!currentRefreshToken) {
      res.status(401).json({ message: "Refresh token not found" });
      return;
    }

    //jwt.verify return string | JwtPayload
    let decoded: TokenPayload;
    try {
      decoded = jwt.verify(
        currentRefreshToken,
        process.env.JWT_REFRESH_SECRET as string,
      ) as TokenPayload;
    } catch (error) {
      res.clearCookie("refreshToken");
      res.status(401).json({ message: "Invalid or expired refresh token" });
      return;
    }

    // Check whether this token is still in the database
    const user = await userService.getById(decoded.userId);
    if (!user || user.refreshtoken !== currentRefreshToken) {
      res.clearCookie("refreshToken");
      res.status(401).json({
        message: "Refresh token reused or invalidated. Please login again.",
      });
      return;
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    const timeSinceIssue = nowInSeconds - decoded.iat;
    const shouldRotate = timeSinceIssue >= AUTH.ROTATION_WINDOW_SECONDS;

    // If the shouldRotate was generated more than 24 hours ago, it will be regenerated
    if (shouldRotate) {
      const newRefreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: AUTH.REFRESH_TOKEN_AGE },
      );
      await userService.saveRefreshToken(user.id, newRefreshToken);
      res.cookie("refreshToken", newRefreshToken, {
        maxAge: AUTH.REFRESH_COOKIE_MAX_AGE,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    }

    const newAccessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: AUTH.ACCESS_TOKEN_AGE },
    );

    res.status(200).json({
      accessToken: newAccessToken,
      tokenRotated: shouldRotate,
    });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      res.status(204).send();
      return;
    }

    let decoded: TokenPayload;
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string,
      ) as TokenPayload;

      await userService.removeRefreshToken(decoded.userId);
    } catch (error) {}
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await userService.getById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdat,
      },
    });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
