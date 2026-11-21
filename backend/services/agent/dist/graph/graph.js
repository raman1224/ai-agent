"use strict";
// import { StateGraph } from "@langchain/langgraph";
// import { agentState } from "./state";
// import { chatAgent } from "../agents/chat.agent";
// import { searchAgent } from "../agents/search.agent";
// import { codingAgent } from "../agents/coding.agent";
// import { pdfAgent } from "../agents/pdf.agent";
// import { pptAgent } from "../agents/ppt.agent";
// import { visionAgent } from "../agents/vision.agent";
// import { router } from "./router.js";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graph = void 0;
// const workflow = new StateGraph(agentState)
// workflow.addNode("router", router)
// workflow.addNode("chat", chatAgent)
// workflow.addNode("search", searchAgent)
// workflow.addNode("coding", codingAgent)
// workflow.addNode("pdf", pdfAgent)
// workflow.addNode("ppt", pptAgent)
// workflow.addNode("vision", visionAgent)
// workflow.addEdge("__start__", "router")
// workflow.addConditionalEdges("router", (state) => {
//     switch (state.agent){
//         case "chat":
//             return "chat";
//         case "search":
//             return "search";
//         case "coding":
//             return "coding";
//         case "pdf":
//             return "pdf";
//         case "ppt":
//             return "ppt";
//         case "vision":
//             return "vision";
//         default:
//             break;
//     }
// },{
//     chat: "chat",
//     search: "search",
//     coding: "coding",
//     pdf: "pdf",
//     ppt: "ppt",
//     vision: "vision"
// })
// workflow.addEdge("search", "chat")
// workflow.addEdge("chat", "__end__")
// workflow.addEdge("coding", "__end__")
// workflow.addEdge("pdf", "__end__")
// workflow.addEdge("ppt", "__end__")
// workflow.addEdge("vision", "__end__")
// export const graph = workflow.compile()
const langgraph_1 = require("@langchain/langgraph");
const state_1 = require("./state");
const chat_agent_1 = require("../agents/chat.agent");
const search_agent_1 = require("../agents/search.agent");
const coding_agent_1 = require("../agents/coding.agent");
// import { pdfAgent } from "../agents/pdf.agent";
// import { pptAgent } from "../agents/ppt.agent";
// import { visionAgent } from "../agents/vision.agent";
const router_js_1 = require("./router.js");
const workflow = new langgraph_1.StateGraph(state_1.agentState)
    .addNode("router", router_js_1.router)
    .addNode("chat", chat_agent_1.chatAgent)
    .addNode("search", search_agent_1.searchAgent)
    .addNode("coding", coding_agent_1.codingAgent);
// .addNode("pdf", pdfAgent)
// .addNode("ppt", pptAgent)
// .addNode("vision", visionAgent)
workflow.addEdge("__start__", "router");
workflow.addConditionalEdges("router", (state) => {
    switch (state.agent) {
        case "chat":
            return "chat";
        case "search":
            return "search";
        case "coding":
            return "coding";
        // case "pdf":
        //     return "pdf";
        // case "ppt":
        //     return "ppt";
        // case "vision":
        //     return "vision";
        default:
            return "__end__";
    }
}, {
    chat: "chat",
    search: "search",
    coding: "coding",
    // pdf: "pdf",
    // ppt: "ppt",
    // vision: "vision",
    "__end__": "__end__"
});
workflow.addEdge("search", "chat");
workflow.addEdge("chat", "__end__");
workflow.addEdge("coding", "__end__");
// workflow.addEdge("pdf", "__end__")
// workflow.addEdge("ppt", "__end__")
// workflow.addEdge("vision", "__end__")
exports.graph = workflow.compile();
