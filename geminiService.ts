import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A concise summary of the medical report findings in the target language.",
    },
    medicalAdvice: {
      type: Type.STRING,
      description: "General lifestyle and dietary advice based on the report findings in the target language. Do not prescribe medication.",
    },
    translatedText: {
      type: Type.STRING,
      description: "The full text of the medical report translated into the target language. Maintain the original structure (headings, values) as much as possible.",
    },
  },
  required: ["summary", "medicalAdvice", "translatedText"],
};

export const analyzeReport = async (
  fileBase64: string,
  mimeType: string,
  targetLanguage: string
): Promise<Omit<AnalysisResult, 'originalFileName' | 'targetLanguage'>> => {
  
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are an expert medical translator and assistant. 
    I have uploaded a medical report (PDF or Image). 
    
    Please perform the following tasks:
    1. Analyze the entire document content.
    2. Translate the FULL content into ${targetLanguage}. ensure technical medical terms are either translated or kept in English if commonly used, but the surrounding context must be in ${targetLanguage}.
    3. Create a summary of the key findings in ${targetLanguage}.
    4. Provide general medical/lifestyle advice based on any abnormal findings in ${targetLanguage}.
    
    Return the output strictly as a JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: fileBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.2, // Lower temperature for more accurate extraction/translation
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response received from AI.");
    }

    const data = JSON.parse(responseText);
    return {
      summary: data.summary,
      medicalAdvice: data.medicalAdvice,
      translatedText: data.translatedText,
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};