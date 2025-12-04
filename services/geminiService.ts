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

// --- NEW AI STUDIO FEATURES ---

// 1. Text Generation (Flash Lite, Thinking, Search)
export const generateSmartText = async (prompt: string, mode: 'fast' | 'thinking' | 'search' | 'standard') => {
  const ai = getAiClient();
  let model = 'gemini-2.5-flash';
  let config: any = {};

  if (mode === 'fast') {
    model = 'gemini-2.5-flash-lite';
  } else if (mode === 'thinking') {
    model = 'gemini-3-pro-preview';
    config.thinkingConfig = { thinkingBudget: 1024 }; 
  } else if (mode === 'search') {
    model = 'gemini-2.5-flash';
    config.tools = [{ googleSearch: {} }];
  } else {
    // Standard complex tasks use Pro
    model = 'gemini-3-pro-preview';
  }

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config
  });
  
  // Handle grounding metadata for search
  let groundingUrls: string[] = [];
  if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
     response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) groundingUrls.push(chunk.web.uri);
     });
  }

  return { text: response.text, groundingUrls };
};

// 2. Image Generation (Pro)
export const generateImage = async (prompt: string, aspectRatio: string = "1:1", imageSize: string = "1K") => {
   // User must select key in UI before calling this
   const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
   const response = await ai.models.generateContent({
     model: 'gemini-3-pro-image-preview',
     contents: { parts: [{ text: prompt }] },
     config: {
       imageConfig: {
         aspectRatio: aspectRatio,
         imageSize: imageSize
       }
     }
   });
   
   // Extract image
   const part = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
   if (part && part.inlineData) {
     return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
   }
   return null;
}

// 3. Image Editing (Flash Image)
export const editImage = async (imageBase64: string, mimeType: string, prompt: string) => {
    const ai = getAiClient();
    // remove data:image/png;base64, prefix if present for API
    const base64Data = imageBase64.split(',')[1] || imageBase64;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { inlineData: { data: base64Data, mimeType } },
                { text: prompt }
            ]
        }
    });
    
    // Flash Image returns generated image
    const part = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
    if (part && part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    return null;
}

// 4. Video Generation (Veo)
export const generateVideo = async (prompt: string, imageBase64: string | null, mimeType: string | null, aspectRatio: string) => {
    // User must select key in UI before calling this
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let imageParam = undefined;
    
    if (imageBase64 && mimeType) {
        const base64Data = imageBase64.split(',')[1] || imageBase64;
        imageParam = {
            imageBytes: base64Data,
            mimeType: mimeType
        };
    }

    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt,
        image: imageParam,
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: aspectRatio as any
        }
    });
    
    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (downloadLink) {
        // Fetch the video bytes using the key
        const videoRes = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await videoRes.blob();
        return URL.createObjectURL(blob);
    }
    return null;
}

// 5. Analysis (Audio/Image/Video)
export const analyzeMedia = async (fileBase64: string, mimeType: string, prompt: string) => {
    const ai = getAiClient();
    const base64Data = fileBase64.split(',')[1] || fileBase64;
    
    // Audio uses Flash
    let model = 'gemini-3-pro-preview';
    if (mimeType.startsWith('audio/')) {
        model = 'gemini-2.5-flash';
    }

    const response = await ai.models.generateContent({
        model,
        contents: {
            parts: [
                { inlineData: { data: base64Data, mimeType } },
                { text: prompt || (mimeType.startsWith('audio/') ? "Transcribe this audio." : "Analyze this.") }
            ]
        }
    });
    return response.text;
}