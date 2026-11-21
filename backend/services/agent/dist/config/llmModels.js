"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModel = void 0;
const groq_1 = require("@langchain/groq");
const openrouter_1 = require("@langchain/openrouter");
const getModel = async (agent) => {
    if (agent === "coding") {
        // const apiKey = process.env.GOOGLE_API_KEY;
        // if (!apiKey) {
        //     throw new Error("GOOGLE_API_KEY is not configured");
        // }
        return new openrouter_1.ChatOpenRouter({
            model: "deepseek/deepseek-chat",
            apiKey: process.env.OPENROUTER_API_KEY,
            temperature: 0,
            maxTokens: 2500
        });
        // return new ChatGoogleGenerativeAI({
        //     model: "gemini-3.5-flash",
        //     apiKey,
        // });
    }
    //     if (agent === "chat" || agent === "search") {
    // const apiKey = process.env.GROQ_API_KEY;
    //     if (!apiKey) {
    //         throw new Error("GROQ_API_KEY is not configured");
    //     }
    //     return new ChatGroq({
    //         model: "openai/gpt-oss-20b",
    //         apiKey,
    //     });
    //     }
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error("GROQ_API_KEY is not configured");
    }
    return new groq_1.ChatGroq({
        model: "openai/gpt-oss-120b",
        apiKey,
    });
};
exports.getModel = getModel;
