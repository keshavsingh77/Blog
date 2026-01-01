import { Post, PostStatus } from '../types';
import { INITIAL_POSTS } from '../constants';

const API_KEY = 'AIzaSyAB38Lkz-xiuvkFFuEDd7BsVo97DMA4g24';
const BLOG_ID = '6924208631263306852';

export const fetchPostsFromBlogger = async (): Promise<Post[]> => {
  if (!API_KEY || !BLOG_ID) {
    return INITIAL_POSTS;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}&fetchBodies=true&maxResults=50`
    );

    if (!response.ok) {
      return INITIAL_POSTS;
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return INITIAL_POSTS;
    }

    const remotePosts = data.items.map((item: any) => {
      let imageUrl = '';
      const imgRegex = /<img[^>]+src="([^">]+)"/i;
      const match = item.content.match(imgRegex);

      if (match && match[1]) {
        imageUrl = match[1];
        if (imageUrl.includes('blogspot.com') || imageUrl.includes('googleusercontent.com')) {
          imageUrl = imageUrl.replace(/\/s\d+(-c)?\//, '/s1600/');
        }
      } else {
        imageUrl = `https://picsum.photos/seed/${encodeURIComponent(item.title)}/1280/720`;
      }

      return {
        id: item.id,
        title: item.title,
        content: item.content, 
        category: (item.labels && item.labels[0]) || 'Viral',
        tags: item.labels || [],
        status: PostStatus.PUBLISHED,
        createdAt: item.published,
        imageUrl: imageUrl,
        author: item.author?.displayName || 'Creative Mind'
      };
    });

    // Merge to ensure we always have content
    const combined = [...remotePosts, ...INITIAL_POSTS];
    return Array.from(new Map(combined.map(p => [p.id, p])).values());

  } catch (error) {
    console.error("Blogger Sync Error:", error);
    return INITIAL_POSTS;
  }
};