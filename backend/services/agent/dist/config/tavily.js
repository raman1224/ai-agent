"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTool = void 0;
const tavily_1 = require("@langchain/tavily");
exports.searchTool = new tavily_1.TavilySearch({
    maxResults: 5,
    // apiKey: process.env.TAVILY_API_KEY || "",
    topic: "general",
    includeImages: true
});
