import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getMissionInsight = async (landmarkName: string, context: string): Promise<string> => {
  if (!apiKey) return "API Key missing. Unable to fetch AI insight.";

  try {
    const prompt = `
      You are the AI Onboard Computer for a Mars Mission. 
      The user is looking at: ${landmarkName}.
      Context: ${context}.
      
      Provide a brief, engaging, sci-fi style "Data Drop" (max 2 sentences) describing the geological significance or mission status of this location. 
      Keep it technical but accessible.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Data link unstable. Unable to retrieve archive data.";
  }
};