import redis from "../redis/redis.js";
export const optionalAuth = async (req, res, next) => {
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
        req.user = JSON.parse(session);
        next();
    }
    catch (error) {
        console.error("Optional authentication error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
