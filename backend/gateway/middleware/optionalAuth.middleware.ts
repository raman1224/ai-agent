import type { Request, Response, NextFunction } from "express";
import redis from "../redis/redis.js";

interface SessionUser {
  userId: string;
  name?: string;
  email?: string;
  avatar?: string;
}

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const sessionId = req.cookies?.session;

    // No session cookie means this is a guest request.
    if (!sessionId) {
      next();
      return;
    }

    const session = await redis.get(`session:${sessionId}`);

    // A stale session should not prevent guest access.
    if (!session) {
      next();
      return;
    }

    req.user = JSON.parse(session) as SessionUser;
    next();
  } catch (error) {
    console.error("Optional authentication error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};