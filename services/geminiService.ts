
import { AspectRatio, Resolution } from "../types";

export const generateImageWithGemini = async (
  prompt: string,
  aspectRatio: AspectRatio,
  resolution: Resolution,
  sourceImage?: { data: string, mimeType: string }
): Promise<string> => {
  const apiKey = process.env.API_KEY || "";
  const parts: any[] = [];

  if (sourceImage) {
    parts.push({
      inlineData: {
        data: sourceImage.data.split(',')[1] || sourceImage.data,
        mimeType: sourceImage.mimeType,
      },
    });
  }

  parts.push({ text: prompt });

  const body = {
    contents: [{ parts }],
    generationConfig: {
      responseModalities: ["IMAGE", "TEXT"],
      imageConfig: {
        aspectRatio,
        imageSize: resolution,
      },
    },
  };

  try {
    const response = await fetch(
      `/api-proxy/v1beta/models/gemini-3-pro-image-preview:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || `Request failed: ${response.status}`);
    }

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No image generated.");
    }

    for (const part of data.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/jpeg;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("Failed to extract image data from response.");
  } catch (error: any) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};
