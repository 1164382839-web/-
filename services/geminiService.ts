import { GoogleGenAI } from "@google/genai";
import { SketchStyle } from "../types";

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a base64 string (with data URI prefix) to a raw base64 string
 */
const stripBase64Prefix = (base64: string): string => {
  return base64.replace(/^data:image\/[a-z]+;base64,/, "");
};

/**
 * Gets the mime type from a base64 data URI
 */
const getMimeType = (base64: string): string => {
  const match = base64.match(/^data:(image\/[a-z]+);base64,/);
  return match ? match[1] : "image/jpeg";
};

export const generateSketchFromImage = async (
  imageBase64: string,
  style: SketchStyle
): Promise<string> => {
  try {
    const cleanBase64 = stripBase64Prefix(imageBase64);
    const mimeType = getMimeType(imageBase64);

    // Construct a specific prompt based on the selected style
    let promptText = "";
    switch (style) {
      case SketchStyle.CHARCOAL:
        promptText = "Convert this image into a high-contrast charcoal drawing. Use smudged shadows and bold strokes. Black and white only.";
        break;
      case SketchStyle.INK:
        promptText = "Convert this image into a pen and ink drawing. Use cross-hatching for shading and sharp, defined lines. Black ink on white paper.";
        break;
      case SketchStyle.COLORED_PENCIL:
        promptText = "Convert this image into a colored pencil sketch. Keep the colors soft and textured, showing the grain of the paper.";
        break;
      case SketchStyle.WATERCOLOR_SKETCH:
        promptText = "Convert this image into a mixed media sketch with watercolor washes and ink outlines. Artistic and expressive.";
        break;
      case SketchStyle.PENCIL:
      default:
        promptText = "Convert this image into a realistic graphite pencil sketch. Focus on shading, fine details, and gradients. Grey tones on white paper.";
        break;
    }

    promptText += " Maintain the original composition and subject matter exactly. Return only the image.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64
            }
          },
          {
            text: promptText
          }
        ]
      }
    });

    // Extract the image from the response
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          // Re-attach prefix for browser display if the API returns raw base64
          // The API usually returns the raw data.
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data found in the response.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};