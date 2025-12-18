
export const fetchLatestFeedItem = async (rssUrl: string) => {
  try {
    // Use rss2json to bypass CORS issues in browser
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();
    
    if (data.status === 'ok' && data.items && data.items.length > 0) {
       return data.items[0]; // Returns { title, link, description, guid, ... }
    }
    return null;
  } catch (error) {
    console.error("Error fetching RSS:", error);
    return null;
  }
};
