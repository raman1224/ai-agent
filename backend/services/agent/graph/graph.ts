

import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state";
import { chatAgent } from "../agents/chat.agent";
import { searchAgent } from "../agents/search.agent";
import { codingAgent } from "../agents/coding.agent";
// import { pdfAgent } from "../agents/pdf.agent";
// import { pptAgent } from "../agents/ppt.agent";
// import { visionAgent } from "../agents/vision.agent";
import { router } from "./router.js";


const workflow = new StateGraph(agentState)
    .addNode("router", router)
    .addNode("chat", chatAgent)
    .addNode("search", searchAgent)
    .addNode("coding", codingAgent)
    // .addNode("pdf", pdfAgent)
    // .addNode("ppt", pptAgent)
    // .addNode("vision", visionAgent)

workflow.addEdge( "__start__", "router")
workflow.addConditionalEdges("router", (state) => {
    switch (state.agent){
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
},{
    chat: "chat",
    search: "search",
    coding: "coding",
    // pdf: "pdf",
    // ppt: "ppt",
    // vision: "vision",
    "__end__": "__end__"
})


workflow.addEdge("search", "chat")
workflow.addEdge("chat", "__end__")
workflow.addEdge("coding", "__end__")
// workflow.addEdge("pdf", "__end__")
// workflow.addEdge("ppt", "__end__")
// workflow.addEdge("vision", "__end__")

export const graph = workflow.compile()