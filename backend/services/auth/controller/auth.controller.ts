import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";
import { User } from "../models/user.model.js";
import type { Request, Response } from "express";
import redis from "../redis/redis.js";
import crypto from "crypto";

export const login = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const decoded = await getAuth(app).verifyIdToken(token);
    let user = await User.findOne({
      firebaseUid: decoded.uid,
    });
    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture,
      });
    }
    const sessionId = crypto.randomUUID();

    await redis.set(`session:${sessionId}`, JSON.stringify({
      userId: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    }), "EX", 8 * 24 * 60 * 60); // Set expiration to 8 days



    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 8 * 24 * 60 * 60 * 1000, // 8 days
    });
    return res.status(201).json({message: "login successful", user});
  } catch (error: any) { 
    console.error("Login Error:", error);

    res.status(500).json({
      message: "Login failed",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred",
    });
  }
};


export const logout = async (req: Request, res: Response) => {
  try {
    const sessionId = req.cookies?.session;

    if (sessionId) {
      await redis.del(`session:${sessionId}`);
    }

    res.clearCookie("session", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({
      message: "Logout failed",
    });
  }
};

