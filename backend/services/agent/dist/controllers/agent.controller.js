"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agent = void 0;
const graph_1 = require("../graph/graph");
const axios_1 = __importDefault(require("axios"));
const memory_1 = require("../config/memory");
const agent = async (req, res) => {
    try {
        const { prompt, conversationId, agent } = req.body;
        const userId = req.headers["x-user-id"];
        if (typeof userId !== "string" || !userId.trim()) {
            return res.status(401).json({ message: "Missing conversation owner" });
        }
        await axios_1.default.post(`${process.env.CHAT_SERVICE}/save-message`, {
            conversationId,
            role: "user",
            content: prompt,
        }, {
            headers: { "x-user-id": userId },
        });
        const result = await graph_1.graph.invoke({
            prompt,
            conversationId,
            agent,
            userId,
        });
        if (typeof result.aiResponse !== "string") {
            throw new Error("Agent did not return a text response");
        }
        // const response = result.aiResponse
        await (0, memory_1.addMessage)({ conversationId, role: "user", content: prompt });
        await (0, memory_1.addMessage)({
            conversationId,
            role: "assistant",
            content: result.aiResponse,
        });
        await axios_1.default.post(`${process.env.CHAT_SERVICE}/save-message`, {
            conversationId,
            role: "assistant",
            content: result?.aiResponse,
            images: result?.images,
            artifacts: result?.artifacts,
        }, {
            headers: { "x-user-id": userId },
        });
        return res.status(200).json({
            answer: result?.aiResponse,
            images: result?.images,
            artifacts: result?.artifacts,
        });
    }
    catch (error) {
        console.error("Agent request failed:", error);
        return res.status(500).json({ message: "Agent request failed" });
    }
};
exports.agent = agent;
