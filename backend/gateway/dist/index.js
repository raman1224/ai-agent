import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { ENV } from "./env.js";
import { protect } from "./middleware/auth.middleware.js";
import { optionalAuth } from "./middleware/optionalAuth.middleware.js";
import { getCurrentUser } from "./controllers/user.controller.js";
import { proxyWithHeader } from "./utils/proxyWithHeader.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(morgan("dev"));
app.use(cookieParser());
// Authentication routes
app.use("/api/auth", proxy(ENV.AUTH_SERVICE));
// Chat routes: logged-in users only.
// Guest messages will not use these routes.
app.use("/api/chat", protect, proxyWithHeader(ENV.CHAT_SERVICE));
// Agent routes: guests and logged-in users.
app.use("/api/agent", optionalAuth, proxyWithHeader(ENV.AGENT_SERVICE));
// Current user: logged-in users only.
app.get("/api/me", protect, getCurrentUser);
app.get("/", (req, res) => {
    res.send("DANGOL AI Gateway is running");
});
app.listen(PORT, () => {
    console.log(`Gateway is running on port ${PORT}`);
});
