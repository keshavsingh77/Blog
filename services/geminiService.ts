import { GoogleGenAI, Type } from "@google/genai";
import { CATEGORIES } from '../constants';

// Safely access process.env to avoid ReferenceError in browsers
const getApiKey = () => {
  try {
    return process.env.API_KEY || '';
  } catch (e) {
    return '';
  }
};

// Always create a new client to ensure latest key is used
const getAiClient = () => new GoogleGenAI({ apiKey: getApiKey() });

// --- Blog Generator (For Admin Panel) ---
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

// --- AI Studio Functions ---

export const generateSmartText = async (prompt: string, mode: 'fast' | 'thinking' | 'search' | 'standard'): Promise<{ text: string, groundingUrls?: string[] }> => {
    const ai = getAiClient();
    let model = 'gemini-2.5-flash';
    let config: any = {};

    switch (mode) {
        case 'standard':
            // Complex Text Tasks
            model = 'gemini-3-pro-preview';
            break;
        case 'fast':
            // Basic Text Tasks
            model = 'gemini-2.5-flash';
            break;
        case 'thinking':
            // Thinking Config only for 2.5 series
            model = 'gemini-2.5-flash';
            config.thinkingConfig = { thinkingBudget: 4096 };
            break;
        case 'search':
            // Search Grounding
            model = 'gemini-2.5-flash';
            config.tools = [{ googleSearch: {} }];
            break;
    }

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config
        });

        let groundingUrls: string[] = [];
        if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
             response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
                if (chunk.web?.uri) {
                    groundingUrls.push(chunk.web.uri);
                }
             });
        }

        return {
            text: response.text || '',
            groundingUrls
        };
    } catch (error) {
        console.error("Error generating text:", error);
        throw error;
    }
};

export const generateImage = async (prompt: string, aspectRatio: string, size: string): Promise<string> => {
    const ai = getAiClient();
    // Use gemini-3-pro-image-preview for high quality (2K/4K)
    let model = 'gemini-2.5-flash-image';
    if (size === '2K' || size === '4K') {
        model = 'gemini-3-pro-image-preview';
    }

    const config: any = {
        imageConfig: {
            aspectRatio: aspectRatio,
        }
    };
    if (model === 'gemini-3-pro-image-preview') {
         config.imageConfig.imageSize = size;
    }

    try {
        const response = await ai.models.generateContent({
            model,
            contents: {
                parts: [{ text: prompt }]
            },
            config
        });
        
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No image generated.");
    } catch (error) {
        console.error("Error generating image:", error);
        throw error;
    }
};

export const editImage = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash-image';
    const base64Data = base64Image.split(',')[1] || base64Image;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: {
                parts: [
                    { inlineData: { mimeType, data: base64Data } },
                    { text: prompt }
                ]
            }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No edited image returned.");
    } catch (error) {
        console.error("Error editing image:", error);
        throw error;
    }
};

export const generateVideo = async (prompt: string, imageBase64: string | null, imageMimeType: string | null, aspectRatio: string): Promise<string> => {
    const ai = getAiClient();
    const model = 'veo-3.1-fast-generate-preview';
    
    const request: any = {
        model,
        prompt,
        config: {
            numberOfVideos: 1,
            resolution: '1080p',
            aspectRatio: aspectRatio
        }
    };

    if (imageBase64 && imageMimeType) {
        const base64Data = imageBase64.split(',')[1] || imageBase64;
        request.image = {
            imageBytes: base64Data,
            mimeType: imageMimeType
        };
    }

    try {
        let operation = await ai.models.generateVideos(request);
        
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) throw new Error("Video generation failed.");

        // The download link needs the API key
        const res = await fetch(`${downloadLink}&key=${getApiKey()}`);
        const blob = await res.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error("Error generating video:", error);
        throw error;
    }
};

export const analyzeMedia = async (base64Data: string, mimeType: string, prompt: string): Promise<string> => {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash';
    const data = base64Data.split(',')[1] || base64Data;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: {
                parts: [
                    { inlineData: { mimeType, data } },
                    { text: prompt || "Analyze this." }
                ]
            }
        });
        return response.text || "No analysis available.";
    } catch (error) {
        console.error("Error analyzing media:", error);
        throw error;
    }
};