
import { GoogleGenAI, Type } from "@google/genai";
import { Category } from '../types';

if (!process.env.API_KEY) {
  alert("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateBlogPost = async (topic: string): Promise<{ title: string; content: string; category: Category }> => {
  try {
    const prompt = `
      Generate a blog post about the following topic: "${topic}".
      The blog post should be written for "iPopcorn", a modern tech, gaming, and entertainment magazine.
      The tone should be engaging, professional, and trendy (like The Verge, IGN, or Polygon).
      The content should be formatted in HTML with paragraphs (<p>), lists (<ul>, <li>), and bold text (<b>) for emphasis.
      Based on the topic, also suggest the most relevant category from: Tech, Gaming, Entertainment, Movies, Reviews, News.

      Return the response as a JSON object with the following structure:
      {
        "title": "A compelling, click-worthy headline",
        "content": "The full blog post content in HTML format.",
        "category": "One of the provided category names"
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
            category: { 
              type: Type.STRING,
              enum: Object.values(Category)
            },
          },
          required: ["title", "content", "category"]
        },
      },
    });

    const jsonText = response.text;
    const generatedPost = JSON.parse(jsonText);
    
    if (!Object.values(Category).includes(generatedPost.category)) {
        generatedPost.category = Category.TECH;
    }

    return generatedPost;

  } catch (error) {
    console.error("Error generating blog post:", error);
    throw new Error("Failed to generate content from AI. Please check your API key and try again.");
  }
};
