"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentState = void 0;
const langgraph_1 = require("@langchain/langgraph");
exports.agentState = langgraph_1.Annotation.Root({
    prompt: (0, langgraph_1.Annotation)(),
    aiResponse: (0, langgraph_1.Annotation)(),
    agent: (0, langgraph_1.Annotation)(),
    conversationId: (0, langgraph_1.Annotation)(),
    userId: (0, langgraph_1.Annotation)(),
    searchResults: (0, langgraph_1.Annotation)(),
    images: (0, langgraph_1.Annotation)(),
    artifacts: (0, langgraph_1.Annotation)()
});
