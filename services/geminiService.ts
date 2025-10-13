
import { GoogleGenAI, Type } from "@google/genai";
import { Category } from '../types';

if (!process.env.API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this example, we'll alert the developer.
  alert("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateBlogPost = async (topic: string): Promise<{ title: string; content: string; category: Category }> => {
  try {
    const prompt = `
      Generate a blog post about the following topic: "${topic}".
      The blog post should be well-structured, informative, and engaging for a general audience interested in government news, finance, and jobs in India.
      The content should be formatted in HTML with paragraphs (<p>), lists (<ul>, <li>), and bold text (<b>) for emphasis.
      Based on the topic, also suggest the most relevant category for this blog post.

      Return the response as a JSON object with the following structure:
      {
        "title": "A compelling and SEO-friendly title",
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
    
    // Validate if the returned category is a valid enum member
    if (!Object.values(Category).includes(generatedPost.category)) {
        // Fallback category if Gemini hallucinates a new one
        generatedPost.category = Category.CENTRAL_GOVERNMENT;
    }

    return generatedPost;

  } catch (error) {
    console.error("Error generating blog post:", error);
    throw new Error("Failed to generate content from AI. Please check your API key and try again.");
  }
};
