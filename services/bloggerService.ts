
import { Post, PostStatus, Category } from '../types';
import { INITIAL_POSTS } from '../constants';

// =================================================================================
// BLOGGER API CONFIGURATION
// =================================================================================
const API_KEY = 'AIzaSyAB38Lkz-xiuvkFFuEDd7BsVo97DMA4g24';
const BLOG_ID = '6924208631263306852';
// =================================================================================

/**
 * Fetches posts from the Blogger API or returns mock data if no keys are provided.
 */
export const fetchPostsFromBlogger = async (): Promise<Post[]> => {
  if (!API_KEY || !BLOG_ID) {
    console.warn("Blogger API Key or Blog ID not set. Using mock data.");
    return new Promise((resolve) => setTimeout(() => resolve(INITIAL_POSTS), 800));
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}&fetchBodies=true&maxResults=20`
    );

    if (!response.ok) {
      console.error(`Blogger API Error: ${response.status} ${response.statusText}`);
      // Fallback to initial posts if API fails (e.g. quota, referer)
      return INITIAL_POSTS;
    }

    const data = await response.json();

    if (!data.items) {
      return INITIAL_POSTS;
    }

    return data.items.map((item: any) => {
      // Robust image extraction using DOM parsing
      let imageUrl = `https://picsum.photos/seed/${item.id}/800/400`;
      try {
        const div = document.createElement('div');
        div.innerHTML = item.content;
        const img = div.querySelector('img');
        if (img && img.src) {
          imageUrl = img.src;
          
          // Attempt to get high-res image from Blogger URL
          // Blogger URLs often look like: .../s320/image.jpg
          // We can replace /sXXX/ or /wXXX-hXXX/ with /s1600/ or /w1280-h720/ for better quality
          if (imageUrl.includes('blogspot.com')) {
             // Replace standard thumbnail sizes with high res
             imageUrl = imageUrl.replace(/\/s\d+(-c)?\//, '/s1600/');
             imageUrl = imageUrl.replace(/\/w\d+-h\d+(-p-k-no-nu)?\//, '/w1280-h720/');
          }
        }
      } catch (e) {
        // Fallback to regex if DOM parsing fails
        const imgRegex = /<img.*?src="(.*?)"/;
        const imgMatch = item.content.match(imgRegex);
        if (imgMatch) imageUrl = imgMatch[1];
      }

      // Determine category from labels
      // Map loosely to our fixed categories or default to News/Tech
      let category: Category = Category.NEWS;
      let tags: string[] = [];
      
      if (item.labels && item.labels.length > 0) {
        tags = item.labels; // Store all labels as tags
        const label = item.labels[0].toLowerCase();
        
        // Try to match existing Enum values
        const exactMatch = Object.values(Category).find(c => c.toLowerCase() === label);
        if (exactMatch) {
          category = exactMatch;
        } else {
          // Heuristic mapping for common tags
          if (label.includes('tech') || label.includes('app') || label.includes('social') || label.includes('trick')) category = Category.TECH;
          else if (label.includes('game') || label.includes('gaming')) category = Category.GAMING;
          else if (label.includes('movie') || label.includes('film') || label.includes('cinema')) category = Category.MOVIES;
          else if (label.includes('review')) category = Category.REVIEWS;
          else if (label.includes('entertain')) category = Category.ENTERTAINMENT;
        }
      }

      return {
        id: item.id,
        title: item.title,
        content: item.content, // Blogger returns HTML content
        category: category,
        tags: tags,
        status: PostStatus.PUBLISHED,
        createdAt: item.published,
        imageUrl: imageUrl,
        author: item.author?.displayName || 'Creative Mind'
      };
    });

  } catch (error) {
    console.error("Failed to fetch posts from Blogger:", error);
    return INITIAL_POSTS;
  }
};
