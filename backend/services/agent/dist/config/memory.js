"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMessage = exports.getMemory = void 0;
const redis_1 = __importDefault(require("../redis/redis"));
const getMessages_1 = require("../utils/getMessages");
const getMemory = async (conversationId, userId) => {
    const key = `messages-${conversationId}`;
    const cached = await redis_1.default.get(key);
    if (cached) {
        const messages = JSON.parse(cached);
        if (Array.isArray(messages)) {
            return messages;
        }
    }
    const messages = await (0, getMessages_1.getMessages)(conversationId, userId);
    await redis_1.default.set(key, JSON.stringify(messages), "EX", 24 * 60 * 60);
    return messages;
};
exports.getMemory = getMemory;
const addMessage = async ({ conversationId, role, content, }) => {
    const key = `messages-${conversationId}`;
    const rawMessages = await redis_1.default.get(key);
    const messages = rawMessages ? JSON.parse(rawMessages) : [];
    messages.push({ role, content });
    if (messages.length > 20) {
        messages.shift();
    }
    await redis_1.default.set(key, JSON.stringify(messages));
};
exports.addMessage = addMessage;
