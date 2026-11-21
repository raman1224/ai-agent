import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";
import { User } from "../models/user.model.js";
import redis from "../redis/redis.js";
import crypto from "crypto";
export const login = async (req, res) => {
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
        return res.status(201).json({ message: "login successful", user });
    }
    catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({
            message: "Login failed",
            error: error instanceof Error
                ? error.message
                : "Unknown error occurred",
        });
    }
};
export const logout = async (req, res) => {
    try {
        const sessionId = req.cookies.session;
        await redis.del(`session:${sessionId}`);
        res.clearCookie("session");
        return res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({
            message: "Logout failed",
            error: error instanceof Error
                ? error.message
                : "Unknown error occurred",
        });
    }
};
