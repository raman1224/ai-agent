
import type { Request, Response, NextFunction } from "express";
import redis from "../redis/redis.js";

interface SessionUser {
  userId: string;
  name?: string;
  email?: string;
  avatar?: string;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const sessionId = req.cookies?.session;

    if (!sessionId) {
      res.status(401).json({
        message: "Unauthorized: Please login first",
      });
      return;
    }

    const session = await redis.get(`session:${sessionId}`);

    if (!session) {
      res.status(401).json({
        message: "Session expired. Please login again",
      });
      return;
    }

    const user: SessionUser = JSON.parse(session);

    req.user = user;

    next();

  } catch (error: unknown) {
    console.error("Authentication Middleware Error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
