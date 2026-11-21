"use strict";
// import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
// import { getModel } from "../config/llmModels.js"
// import { ChatGroq } from "@langchain/groq"
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const llmModels_js_1 = require("../config/llmModels.js");
const router = async (state) => {
    if (state.agent && state.agent !== "auto") {
        return {
            ...state,
            agent: state.agent
        };
    }
    const llm = await (0, llmModels_js_1.getModel)("router");
    const prompt = `you are an agent router.
    available agents:
    - chat
    - search
    - coding
    - pdf
    - ppt
    - vision
    
    rules:
    chat: general conversation, explanation, learning, questions.
    search: current events, latest information, news, recent developments, internet lookup.
    coding: generate code, debug code, build projects, architecture, api design.
    pdf: questions about generate PDFs or document contexts.
    ppt: questions about generate ppts or ppt context.
    vision: generate image, create image
    return only one word:
    chat
    search
    coding
    pdf
    ppt
    vision
    
    user query:
    ${state.prompt}
    `;
    const response = await llm.invoke(prompt);
    const content = response.content;
    const agent = typeof content === "string"
        ? content.trim().toLowerCase()
        : Array.isArray(content)
            ? content
                .filter((block) => typeof block === "object" && block && "text" in block && typeof block.text === "string")
                .map((block) => block.text)
                .join("")
                .trim()
                .toLowerCase()
            : String(content ?? "").trim().toLowerCase();
    return {
        ...state,
        agent
    };
};
exports.router = router;
