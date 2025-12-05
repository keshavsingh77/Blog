
export interface DownloadMedia {
  url: string;
  quality: string;
  extension: string;
  type: string;
  formattedSize?: string;
  size?: number;
}

export interface VideoData {
  title: string;
  thumbnail: string;
  author: string;
  source: string;
  medias: DownloadMedia[];
}

const API_KEY = '29f8c3b79amshc7b9755d426320dp1b94fajsn62b1821d47db';
const API_HOST = 'social-download-all-in-one.p.rapidapi.com';
const API_URL = 'https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink';

export const fetchVideoInfo = async (url: string): Promise<VideoData> => {
  if (!url) throw new Error("Please provide a URL");

  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': API_HOST
    },
    body: JSON.stringify({ url })
  };

  try {
    const response = await fetch(API_URL, options);
    
    if (!response.ok) {
        throw new Error('Failed to fetch video details. Please check the link.');
    }

    const data = await response.json();

    if (data.error) {
         throw new Error('Video not found or private. Please check the URL.');
    }

    // Map response to our interface
    return {
        title: data.title || 'Untitled Video',
        thumbnail: data.thumbnail || '',
        author: data.author || 'Unknown',
        source: data.source || 'Social Media',
        medias: data.medias || []
    };
  } catch (error: any) {
    console.error("Downloader API Error:", error);
    throw new Error(error.message || "An unexpected error occurred.");
  }
};
