import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as userService from "../services/user.service.js";

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
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "30d" },
    );

    await userService.saveRefreshToken(newUser.id, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
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
