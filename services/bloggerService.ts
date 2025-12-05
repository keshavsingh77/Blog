
import { Post, PostStatus } from '../types';
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
    return new Promise((resolve) => setTimeout(() => resolve(INITIAL_POSTS), 800));
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}&fetchBodies=true&maxResults=20`
    );

    if (!response.ok) {
      return INITIAL_POSTS;
    }

    const data = await response.json();

    if (!data.items) {
      return INITIAL_POSTS;
    }

    return data.items.map((item: any) => {
      let imageUrl = `https://picsum.photos/seed/${item.id}/800/400`;

      // OPTIMIZATION: Use Regex for image extraction instead of DOM parsing.
      // Creating DOM elements (document.createElement) is slow and blocks the main thread.
      const imgRegex = /<img[^>]+src="([^">]+)"/i;
      const match = item.content.match(imgRegex);

      if (match && match[1]) {
        imageUrl = match[1];
        
        // Attempt to get high-res image from Blogger URL
        if (imageUrl.includes('blogspot.com')) {
            imageUrl = imageUrl.replace(/\/s\d+(-c)?\//, '/s1600/');
            imageUrl = imageUrl.replace(/\/w\d+-h\d+(-p-k-no-nu)?\//, '/w1280-h720/');
        }
      }

      // Determine category from labels
      let tags: string[] = [];
      let category: string = 'General';
      
      if (item.labels && item.labels.length > 0) {
        tags = item.labels;
        category = item.labels[0];
      }

      return {
        id: item.id,
        title: item.title,
        content: item.content, 
        category: category,
        tags: tags,
        status: PostStatus.PUBLISHED,
        createdAt: item.published,
        imageUrl: imageUrl,
        author: item.author?.displayName || 'Creative Mind'
      };
    });

  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return INITIAL_POSTS;
  }
};
