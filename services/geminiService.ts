import { GoogleGenAI, Type } from "@google/genai";
import { ResultType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using gemini-3-pro-preview for complex reasoning and coding tasks as per guidelines
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
  let systemInstruction = "You are an expert competitive programming assistant. Your goal is to help users understand algorithms, write code, and debug efficiently.";
  let prompt = "";

  if (type === ResultType.ELI5) {
    prompt = `
      I have a coding problem located at this URL: ${url}
      
      Please perform the following steps:
      1. Use Google Search to retrieve the full problem description, constraints, and examples from the provided URL.
      2. Once you have the context, explain the problem to me as if I am a 5-year-old. 
      3. Use simple analogies (like toys, playgrounds, or animals) to explain the core logic.
      4. Avoid jargon. Keep it fun and very easy to understand.
    `;
  } else if (type === ResultType.SOLUTION) {
    if (!language) throw new Error("Language is required for solution generation");
    prompt = `
      I have a coding problem located at this URL: ${url}
      
      Please perform the following steps:
      1. Use Google Search to retrieve the full problem description and constraints from the provided URL.
      2. Generate a complete, optimized solution in ${language}.
      3. Include comments explaining the time and space complexity.
      4. Ensure the code handles edge cases described in the constraints.
      5. Wrap the code block in markdown like \`\`\`${language.toLowerCase()} ... \`\`\`.
    `;
  } else if (type === ResultType.TEST_CASES) {
    prompt = `
      I have a coding problem located at this URL: ${url}
      
      Please perform the following steps:
      1. Use Google Search to retrieve the full problem description and strictly analyze the constraints from the provided URL.
      2. Generate 10 "nasty" test cases. These should be edge cases (e.g., minimum/maximum constraints, empty inputs, negative numbers, etc.) that often cause solutions to fail.
      3. Format the output as a clear list. 
      4. For each test case, briefly explain WHY it is a nasty case (e.g., "Max integer overflow possibility").
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: systemInstruction,
        temperature: 0.5, // Balance between creativity and precision
      },
    });

    // Extract grounding chunks if available
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

    // Remove duplicates based on URI
    const uniqueSources = Array.from(new Map(sources.map(s => [s.uri, s])).values());

    return {
      text: response.text || "I couldn't generate a response. Please try again.",
      groundingSources: uniqueSources,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to process the request. Please ensure the URL is correct and accessible.");
  }
};
