import redis from "../redis/redis.js";
export const protect = async (req, res, next) => {
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
        const user = JSON.parse(session);
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Authentication Middleware Error:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};
