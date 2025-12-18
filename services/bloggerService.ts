import { Post, PostStatus } from '../types';
import { INITIAL_POSTS } from '../constants';

// =================================================================================
// BLOGGER API CONFIGURATION
// =================================================================================
const API_KEY = 'AIzaSyAB38Lkz-xiuvkFFuEDd7BsVo97DMA4g24';
const BLOG_ID = '6924208631263306852';
// =================================================================================

declare var google: any;

export const preloadGoogleSdk = () => {
    if (typeof document === 'undefined') return;
    if (document.getElementById('google-client-script')) return;
    const script = document.createElement('script');
    script.id = 'google-client-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
};

export const requestAccessToken = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (typeof google === 'undefined') {
            reject(new Error("Google SDK not loaded. Please refresh the page."));
            return;
        }
        
        // Use a generic client ID for demo/personal use if one isn't provided in env
        // In production, this should be properly configured in GCP
        const clientId = '607410923533-7utf3iedicboslj6di8fmc3viifmte7l.apps.googleusercontent.com'; 

        const client = google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: 'https://www.googleapis.com/auth/blogger',
            callback: (response: any) => {
                if (response.access_token) {
                    resolve(response.access_token);
                } else {
                    reject(new Error("Failed to obtain access token"));
                }
            },
        });
        client.requestAccessToken();
    });
};

export const publishToBlogger = async (token: string, post: { title: string; content: string; labels: string[], imageUrl?: string }) => {
    let content = post.content;
    if (post.imageUrl) {
        content = `<div class="separator" style="clear: both; text-align: center;"><img src="${post.imageUrl}" style="max-width: 100%;" /></div><br />` + content;
    }

    const response = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            kind: 'blogger#post',
            blog: { id: BLOG_ID },
            title: post.title,
            content: content,
            labels: post.labels
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || "Failed to publish");
    }
    return response.json();
};

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
      console.warn('Blogger API fetch failed, falling back to initial posts.');
      return INITIAL_POSTS;
    }

    const data = await response.json();

    if (!data.items) {
      return INITIAL_POSTS;
    }

    return data.items.map((item: any) => {
      let imageUrl = `https://picsum.photos/seed/${item.id}/800/400`;

      // OPTIMIZATION: Use Regex for image extraction instead of DOM parsing.
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

      // CRITICAL: Map Blogger Labels (Levels) to Categories & Tags
      // Ensure 'tags' is always an array, even if item.labels is undefined
      const tags: string[] = Array.isArray(item.labels) ? item.labels : [];
      
      // The first label becomes the primary Category
      const category: string = tags.length > 0 ? tags[0] : 'General';

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