
import { GoogleGenAI, Type } from "@google/genai";
import { ResultType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using gemini-3-pro-preview for complex reasoning and coding tasks
const MODEL_NAME = 'gemini-3-pro-preview';

export interface GeminiResponse {
  text: string;
  groundingSources?: { uri: string; title: string }[];
}

export const generateAnalysis = async (
  url: string,
  type: ResultType,
  language?: string
): Promise<GeminiResponse> => {
  // Ultra-strict system instruction to abolish LaTeX/Math-mode
  let systemInstruction = `You are an expert competitive programming assistant. 
  
  CRITICAL FORMATTING RULES:
  1. NEVER use LaTeX, dollar signs ($), or any math-mode formatting.
  2. Render all mathematical expressions, variables, and indices as standard PLAIN TEXT.
  3. Example of WRONG: $a_i$, $O(N \log N)$, $10^5$, $x^2$.
  4. Example of CORRECT: a[i], O(N log N), 100,000 or 10^5 (plain text), x^2 (plain text).
  5. Use square brackets for indices: a[i][j].
  6. Use standard caret ^ for powers in plain text: 2^n.
  7. Use beautiful, well-structured Markdown with clear headers and lists.`;
  
  let prompt = "";

  if (type === ResultType.ELI5) {
    prompt = `
      I have a coding problem located at this URL: ${url}
      
      Please perform the following steps:
      1. Use Google Search to retrieve the full problem description and constraints.
      2. Explain the problem as if I am a 5-year-old using analogies.
      3. Structure: # The Big Idea, ## What's the Goal?, ## The Rules, ## Let's Imagine.
      4. Use plain text for all variables and numbers.
    `;
  } else if (type === ResultType.SOLUTION) {
    if (!language) throw new Error("Language is required for solution generation");
    prompt = `
      I have a coding problem located at this URL: ${url}
      
      Please perform the following steps:
      1. Use Google Search to retrieve the full problem description.
      2. Provide:
         - # Approach Overview
         - ## Complexity Analysis (Strictly plain text: e.g., Time: O(N), Space: O(1))
         - # Optimized Solution (The code)
      3. Generate optimized code in ${language}.
      4. Use plain text for all mathematical logic in the explanation. No dollar signs.
    `;
  } else if (type === ResultType.TEST_CASES) {
    prompt = `
      I have a coding problem located at this URL: ${url}
      
      Please analyze the constraints and provide:
      - # Nasty Test Scenarios
      - A table of 10 edge cases with Input and Logic.
      - Use plain text for all indices and variable names in the table (e.g. a[0], n-1).
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: systemInstruction,
        temperature: 0.2, // Lowered for stricter formatting adherence
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: { uri: string; title: string }[] = [];

    if (groundingChunks) {
      for (const chunk of groundingChunks) {
        if (chunk.web) {
          sources.push({
            uri: chunk.web.uri || '',
            title: chunk.web.title || 'Source',
          });
        }
      }
    }

    const uniqueSources = Array.from(new Map(sources.map(s => [s.uri, s])).values());

    return {
      text: response.text || "I couldn't generate a response. Please try again.",
      groundingSources: uniqueSources,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to process the request. Ensure the URL is accessible.");
  }
};
