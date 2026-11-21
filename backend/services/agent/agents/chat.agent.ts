import { getModel } from "../config/llmModels.js";
import { getMemory } from "../config/memory.js";
import type { AgentState } from "../types/agent.types.js";
import { AIMessage, HumanMessage, SystemMessage, type BaseMessage } from "@langchain/core/messages";

export const chatAgent = async (
  state: AgentState
): Promise<AgentState> => {
  const llm = await getModel("chat");
const history = await getMemory(state.conversationId, state.userId)
const searchContext = state.searchResults ? `
Web Search Results:
${JSON.stringify(state.searchResults)}
Answer the user using only the above search results.
`: "" ;


  const systemPrompt = `
    You are DANGOL AI, an intelligent AI assistant.
  ${searchContext}

  if searchContext exists:
  - use search results to ansewr . 
  - do not mention internal tools.
  
    Rules:
    - Provide accurate and concise information.
    - For simple questions, greetings and short queries, respond in a friendly and conversational manner.
    - For technical, educational, coding or detailed topics, use clean Markdown formatting.

    Formatting:
    - Use Markdown formatting.
    - Leave a blank line after headings and before lists.
    - Use bullet points for lists.
    - Use numbered lists for steps.
    - Use fenced code blocks with language tags for code snippets.
    - Keep paragraphs short and concise.
    - Never write headings and content on the same line.
    - Avoid large walls of text.
  `;
  const messages: BaseMessage[] = [
    new SystemMessage(systemPrompt)
  ]
  history.forEach((msg: { role: string; content: string }) => {
if(msg.role=="user"){
  messages.push(new HumanMessage(msg.content))
}else{
  messages.push(new AIMessage(msg.content))
}
  })

  messages.push(new HumanMessage(state.prompt))

  const response = await llm.invoke(messages)
  //   [
  //   {
  //     role: "system",
  //     content: systemPrompt,
  //   },
  //   {
  //     role: "human",
  //     content: state.prompt,
  //   },
  // ];

  return {
    ...state,
    aiResponse: response.content as BaseMessage["content"],
  };
};