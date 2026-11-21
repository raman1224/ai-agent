import { getModel } from "../config/llmModels";

export const codingAgent = async (state: any) => {
  const intentLlm = await getModel("intent");
  const llm = await getModel("coding");
  const intentRes = await intentLlm.invoke(`
        you are an intent classifier.
        return only one of these value.
        CODE_GENERATION
        CODE_REVIEW
        CODE_EXPLANATION
        DEBUGGING
        OPTIMIZATION
        CONVERSION
        DOCUMENTATION
        User Request:
        ${state.prompt}
        `);
  const intent = intentRes.content;
  if (intent === "CODE_GENERATION") {
    const prompt = `
            You are DANGOL AI Coding Agent.
            
            generate the requested project.

            Default stack:
            - HTML
            - CSS 
            - JavaScript

            use React / Next.js / Vue ONLY if explicitly requested.

            Rules:
            - Responsive
            - Modern UI
            - CSS Variables
            - Flexbox/Grid
            - Smooth Scroll
            - Hover Effects
            - Beautiful spacing
            - Single page unless user asks otherwise.

            IMAGES 
            ================
            Always use real Unsplash images.
            Never use placeholders.
        
            Return ONLY valid JSON.

            Schema: {
            "files": [
            {
              "name": "index.html",
              "content":"..."
              },
              {
              "name": "style.css",
              "content":"..."
              },
              {
              "name": "script.js",
              "content":"..."
              },
              ]
            }

        Rules:
         - Output must start with {
         - Output must end with }
         - No markdown
         - No explanation
         - No extra text
         - No \`\`\`
         - Never mention intent

        User Request:
        ${state.prompt}

            `;

            const res = await llm.invoke(prompt)
            const content = typeof res.content === "string"
                ? res.content
                : res.content.map((block) =>
                    typeof block === "string"
                        ? block
                        : "text" in block && typeof block.text === "string"
                            ? block.text
                            : ""
                ).join("");
            const data = JSON.parse(content)

            return {
                ...state,
                aiResponse: "Code Generated Sucessfully.",
                artifacts: [
                    {
                        id:Date.now(),
                        type: "Project",
                        files:data.files || [],
                        title: state.prompt

                    }
                ]
            }
            
  }

  const res = await llm.invoke(`
       The user's request is:
       ${intent}
       Return Markdown only.
       Never generate project files.
       use heading like:

       # Overview
       ## Explanation
       ## Problems
       ## Improvements
       ## Best Practices
       ## Optimized code (if needed)

       User Request:
       ${state.prompt}
    `)

    const data = res.content
    return {
        ...state,
        aiResponse: data,
        artifacts: []
    }
};
