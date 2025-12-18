
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Returns a configured GoogleGenAI client.
 * Strictly uses process.env.API_KEY as per guidelines and initializes right before use.
 */
const getAi = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateBlogPost = async (topic: string): Promise<{ title: string; content: string; tags: string[]; category: string }> => {
  const ai = getAi();
  const prompt = `Write a viral, high-energy tech/gaming blog post about: "${topic}".
  Return JSON only with fields: title, content (HTML format), tags (array of strings), category (string).
  Make it engaging for a young audience.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          category: { type: Type.STRING }
        },
        required: ["title", "content", "tags", "category"]
      }
    }
  });

  // Rule: Access the .text property directly (getter, not a method).
  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text);
};

export const generateContentFromFeed = async (feedItem: any): Promise<string> => {
  const ai = getAi();
  const prompt = `Rewrite this news snippet into a full engaging blog post (HTML format, no markdown ticks):
  Title: ${feedItem.title}
  Description: ${feedItem.description}
  Link: ${feedItem.link}
  
  Focus on "Tech Tricks" or "Viral News" style. Keep it under 500 words.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  // Rule: Use the .text property directly.
  return response.text || '';
};

export const generateSEOForContent = async (content: string): Promise<{ title: string; tags: string[] }> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a clickbait title and 5 viral tags for this content: ${content.substring(0, 500)}`,
    config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "tags"]
        }
    }
  });
  // Rule: Use the .text property directly.
  const text = response.text;
  return text ? JSON.parse(text) : { title: "New Update", tags: ["Tech"] };
};

export const generateImageForPost = async (title: string): Promise<string> => {
  try {
    const ai = getAi();
    // Rule: Use gemini-2.5-flash-image for general image generation and editing tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `Create a cinematic, hyper-realistic 4k thumbnail image for a tech blog post titled: ${title}. No text in image.` }]
      }
    });

    // Rule: Iterate through candidates and parts to find the image data.
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return `https://picsum.photos/seed/${Date.now()}/800/400`;
  } catch (e) {
    console.error("Image generation failed", e);
    return `https://picsum.photos/seed/${Date.now()}/800/400`;
  }
};
