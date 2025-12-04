
import { GoogleGenAI, Type } from "@google/genai";
import { CATEGORIES } from '../constants';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY || 'DUMMY_KEY' });

// --- Existing Blog Generator ---
export const generateBlogPost = async (topic: string): Promise<{ title: string; content: string; category: string }> => {
  try {
    const ai = getAiClient();
    const prompt = `
      Generate a blog post about the following topic: "${topic}".
      The blog post should be written for "Creative Mind", a modern tech, viral tips, and internet culture magazine.
      The tone should be engaging, professional, and trendy.
      The content should be formatted in HTML with paragraphs (<p>), lists (<ul>, <li>), and bold text (<b>) for emphasis.
      
      Suggest the most relevant category. Preferred categories are: ${CATEGORIES.join(', ')}.
      If none match, suggest a short, relevant tag (e.g., 'Tech', 'Gaming', 'AI').

      Return the response as a JSON object with the following structure:
      {
        "title": "A compelling, click-worthy headline",
        "content": "The full blog post content in HTML format.",
        "category": "The selected category name"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            category: { type: Type.STRING },
          },
          required: ["title", "content", "category"]
        },
      },
    });

    const jsonText = response.text;
    const generatedPost = JSON.parse(jsonText || '{}');
    
    return generatedPost;

  } catch (error) {
    console.error("Error generating blog post:", error);
    throw new Error("Failed to generate content from AI. Please check your API key and try again.");
  }
};

// --- Smart Text Generation (Writer) ---
export const generateSmartText = async (
  prompt: string, 
  mode: 'fast' | 'thinking' | 'search' | 'standard'
): Promise<{ text: string; groundingUrls?: string[] }> => {
  const ai = getAiClient();
  let model = 'gemini-2.5-flash';
  let config: any = {};

  if (mode === 'fast') {
    model = 'gemini-flash-lite-latest';
  } else if (mode === 'thinking') {
    model = 'gemini-2.5-flash';
    config.thinkingConfig = { thinkingBudget: 2048 }; 
  } else if (mode === 'search') {
    model = 'gemini-2.5-flash';
    config.tools = [{ googleSearch: {} }];
  }

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config,
  });

  const text = response.text || '';
  let groundingUrls: string[] = [];

  if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
    groundingUrls = response.candidates[0].groundingMetadata.groundingChunks
      .map((c: any) => c.web?.uri)
      .filter((uri: string) => uri);
  }

  return { text, groundingUrls };
};

// --- Image Generation (Imager) ---
export const generateImage = async (prompt: string, aspectRatio: string, size: string): Promise<string> => {
  const ai = getAiClient();
  const model = 'gemini-3-pro-image-preview';
  
  const response = await ai.models.generateContent({
    model,
    contents: {
        parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any, 
        imageSize: size as any
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  if (response.text) {
      throw new Error(`Model returned text instead of image: ${response.text}`);
  }
  throw new Error("No image generated.");
};

// --- Image Editing (Imager) ---
export const editImage = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
  const ai = getAiClient();
  const model = 'gemini-2.5-flash-image';
  
  const data = base64Image.split(',')[1] || base64Image;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { 
          inlineData: { 
            mimeType: mimeType, 
            data: data 
          } 
        },
        { text: prompt },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  if (response.text) {
     throw new Error(`Model returned text: ${response.text}`);
  }
  throw new Error("No edited image generated.");
};

// --- Video Generation (Veo) ---
export const generateVideo = async (
  prompt: string, 
  imageBase64: string | null, 
  imageMimeType: string | null, 
  aspectRatio: string
): Promise<string> => {
  const ai = getAiClient();
  const model = 'veo-3.1-fast-generate-preview';
  
  let operation;
  const config = {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio as any
  };

  if (imageBase64 && imageMimeType) {
      const data = imageBase64.split(',')[1] || imageBase64;
      operation = await ai.models.generateVideos({
          model,
          prompt,
          image: {
            imageBytes: data,
            mimeType: imageMimeType
          },
          config
      });
  } else {
      operation = await ai.models.generateVideos({
          model,
          prompt,
          config
      });
  }

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) throw new Error("Video generation failed.");

  const videoRes = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
  if (!videoRes.ok) throw new Error("Failed to download video.");
  
  const blob = await videoRes.blob();
  return URL.createObjectURL(blob);
};

// --- Media Analysis (Analyzer) ---
export const analyzeMedia = async (base64Data: string, mimeType: string, prompt: string): Promise<string> => {
  const ai = getAiClient();
  const model = 'gemini-2.5-flash';
  
  const data = base64Data.split(',')[1] || base64Data;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { 
          inlineData: { 
            mimeType: mimeType, 
            data: data 
          } 
        },
        { text: prompt || "Analyze this media." }
      ]
    }
  });

  return response.text || "No analysis generated.";
};
