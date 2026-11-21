"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = void 0;
const axios_1 = __importDefault(require("axios"));
const getMessages = async (conversationId, userId) => {
    const chatService = process.env.CHAT_SERVICE;
    if (!chatService) {
        throw new Error("CHAT_SERVICE is not configured");
    }
    const { data } = await axios_1.default.get(`${chatService}/get-messages/${encodeURIComponent(conversationId)}`, { headers: { "x-user-id": userId } });
    return data;
};
exports.getMessages = getMessages;
