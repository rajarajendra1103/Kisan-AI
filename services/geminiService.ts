import { GoogleGenAI, Part, GenerateContentResponse } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

/**
 * Generates content using the Gemini API.
 * @param prompt The text prompt to send to the model.
 * @param imageBase64 Optional base64 encoded image data.
 * @param imageMimeType Optional MIME type for the image.
 * @param systemInstruction Optional system instruction for the model.
 * @param responseSchema Optional response schema for JSON output.
 * @param configOverrides Optional additional config for the generation request.
 * @returns The full GenerateContentResponse from the API.
 */
export const generateContent = async (
  prompt: string,
  imageBase64?: string,
  imageMimeType?: string,
  systemInstruction?: string,
  responseSchema?: any,
  configOverrides: any = {}
): Promise<GenerateContentResponse> => {
  try {
    // Lazily initialize the client
    const client = getAiClient();
    const modelName = 'gemini-2.5-flash';

    const parts: Part[] = [];

    if (imageBase64 && imageMimeType) {
      parts.push({
        inlineData: {
          data: imageBase64,
          mimeType: imageMimeType,
        },
      });
    }
    
    parts.push({ text: prompt });

    const config: any = { ...configOverrides };
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }
    if (responseSchema) {
      config.responseMimeType = "application/json";
      config.responseSchema = responseSchema;
    }

    const response = await client.models.generateContent({
      model: modelName,
      contents: { parts },
      config: Object.keys(config).length > 0 ? config : undefined,
    });

    return response;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};