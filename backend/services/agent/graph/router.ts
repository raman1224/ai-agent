
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { getModel } from "../config/llmModels.js"
import { ChatGroq } from "@langchain/groq"

export const router = async (state: any): Promise<ChatGroq | ChatGoogleGenerativeAI> => {

    if(state.agent && state.agent!=="auto"){
            return {
        ...state,
        agent:state.agent
    }

    }

    const llm = await getModel("router")
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
    `
    const response = await llm.invoke(prompt)
    const content = response.content
    const agent = typeof content === "string"
        ? content.trim().toLowerCase()
        : Array.isArray(content)
            ? content
                .filter((block: any) => typeof block === "object" && block && "text" in block && typeof block.text === "string")
                .map((block: any) => block.text)
                .join("")
                .trim()
                .toLowerCase()
            : String(content ?? "").trim().toLowerCase()

    return {
        ...state,
        agent
    }

}