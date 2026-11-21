import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
export const createConversation = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId || Array.isArray(userId)) {
            res.status(401).json({
                message: "User ID is missing or invalid",
            });
            return;
        }
        const conversation = await Conversation.create({
            userId: userId,
        });
        res.status(201).json(conversation);
    }
    catch (error) {
        console.error("Create conversation error:", error);
        res.status(500).json({
            message: "Failed to create conversation",
        });
    }
};
export const getConversation = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId || Array.isArray(userId)) {
            res.status(401).json({
                message: "User ID is missing or invalid",
            });
            return;
        }
        const conversation = await Conversation.find({
            userId: userId,
        }).sort({ updatedAt: -1 });
        res.status(201).json(conversation);
    }
    catch (error) {
        console.error("get conversation error:", error);
        res.status(500).json({
            message: "Failed to get conversation",
        });
    }
};
export const updateConversation = async (req, res) => {
    try {
        const { id, title } = req.body;
        const conversation = await Conversation.findByIdAndUpdate(id, { title }, { new: true });
        if (!conversation) {
            res.status(404).json({
                message: "Conversation not found",
            });
            return;
        }
        res.status(200).json(conversation);
    }
    catch (error) {
        console.error("Update conversation error:", error);
        res.status(500).json({
            message: "Failed to update conversation",
        });
    }
};
export const saveMessage = async (req, res) => {
    try {
        const { conversationId, role, content, images, artifacts } = req.body;
        const message = await Message.create({
            conversationId,
            content,
            role,
            images,
            artifacts
        });
        res.status(200).json(message);
    }
    catch (error) {
        res.status(500).json({
            message: "save msg error",
        });
    }
};
export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        });
        res.status(200).json(messages);
    }
    catch (error) {
        res.status(500).json({
            message: "get msg error",
        });
    }
};
