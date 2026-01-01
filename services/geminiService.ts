import { GoogleGenAI, Type } from "@google/genai";

const getAi = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateBlogPost = async (topic: string): Promise<{ title: string; content: string; tags: string[]; category: string }> => {
  const ai = getAi();
  
  const prompt = `Act as a world-class viral content creator for 'Creative Mind', a top-tier tech blog.
  Write a high-engagement, deep-dive article about: "${topic}".
  
  Requirements:
  - Language: Professional, energetic, and catchy.
  - Formatting: Use HTML with <h2>, <h3>, <p>, <ul>, and <strong> tags.
  - Length: Minimum 800 words with deep insights.
  - Structure: Engaging hook, actionable tips, and a compelling conclusion.
  
  Output MUST be strictly valid JSON.
  JSON Schema:
  - title: A click-worthy headline.
  - content: Full article body in HTML.
  - tags: Array of 5 trending search tags.
  - category: One from [Free Followers, Instagram, CapCut, Psychology, YouTube, AI, Image Genrate, Finance, Earn Money Online, Tech].`;

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

  const text = response.text;
  if (!text) throw new Error("AI Content Engine failed to respond.");
  return JSON.parse(text);
};

export const generateImageForPost = async (title: string): Promise<string> => {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A cinematic, ultra-high-definition professional blog thumbnail for: ${title}. Digital art style, vibrant colors, neon accents, 16:9 aspect ratio, no text in image, 4k resolution.` }]
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return `https://picsum.photos/seed/${encodeURIComponent(title)}/1280/720`;
  } catch (e) {
    console.error("AI Image generation failed:", e);
    return `https://picsum.photos/seed/${Date.now()}/1280/720`;
  }
};