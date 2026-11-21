import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import router from "./routes/chat.routes.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8002;
app.use(express.json());
app.use("/", router);
app.get("/", (req, res) => {
    res.send("Hello, World!");
});
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`chat is running on port ${PORT}`);
    });
};
startServer().catch((error) => {
    console.error("Failed to start chat service:", error);
    process.exitCode = 1;
});
