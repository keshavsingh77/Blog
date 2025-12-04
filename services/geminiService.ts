
import { GoogleGenAI, Type } from "@google/genai";
import { CATEGORIES } from '../constants';

if (!process.env.API_KEY) {
  // Silent fail or alert depending on env
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'DUMMY_KEY' });

export const generateBlogPost = async (topic: string): Promise<{ title: string; content: string; category: string }> => {
  try {
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
    const generatedPost = JSON.parse(jsonText);
    
    return generatedPost;

  } catch (error) {
    console.error("Error generating blog post:", error);
    throw new Error("Failed to generate content from AI. Please check your API key and try again.");
  }
};
