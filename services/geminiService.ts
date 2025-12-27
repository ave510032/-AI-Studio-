
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

const getAIClient = () => {
  // Always use a named parameter and obtain API key directly from process.env.API_KEY
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const runPrompt = async (
  modelId: string,
  prompt: string,
  systemInstruction?: string,
  config?: any
) => {
  const ai = getAIClient();
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "You are a helpful AI assistant.",
        temperature: config?.temperature ?? 1,
        topP: config?.topP ?? 0.95,
        topK: config?.topK ?? 40,
        ...config
      }
    });
    return response;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const runGroundingSearch = async (prompt: string) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return response;
  } catch (error) {
    console.error("Grounding Error:", error);
    throw error;
  }
};

export const runStructuredOutput = async (prompt: string, schema: any) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    // The response object features a text property (not a method) that directly returns the string output.
    return response.text;
  } catch (error) {
    console.error("Structured Output Error:", error);
    throw error;
  }
};
