
import { GoogleGenAI } from "@google/genai";
import { AspectRatio, Resolution } from "../types";

export const generateImageWithGemini = async (
  prompt: string,
  aspectRatio: AspectRatio,
  resolution: Resolution,
  sourceImage?: { data: string, mimeType: string }
): Promise<string> => {
  // Ensure user has selected a key for Nano Banana Pro (Gemini 3 Pro Image)
  if (typeof window !== 'undefined' && (window as any).aistudio) {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
    }
  }

  // Use the API Key from environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

  try {
    const parts: any[] = [];
    
    // If source image is provided, we are in "Edit" mode
    if (sourceImage) {
      parts.push({
        inlineData: {
          data: sourceImage.data.split(',')[1] || sourceImage.data,
          mimeType: sourceImage.mimeType,
        },
      });
    }
    
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: resolution as any,
        },
      },
    });

    if (!response || !response.candidates || response.candidates.length === 0) {
      throw new Error("No image generated.");
    }

    let imageUrl = '';
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        imageUrl = `data:image/jpeg;base64,${base64EncodeString}`;
        break;
      }
    }

    if (!imageUrl) {
      throw new Error("Failed to extract image data from response.");
    }

    return imageUrl;
  } catch (error: any) {
    if (error.message?.includes("Requested entity was not found")) {
        if (typeof window !== 'undefined' && (window as any).aistudio) {
            await (window as any).aistudio.openSelectKey();
        }
    }
    console.error("Image Generation Error:", error);
    throw error;
  }
};
