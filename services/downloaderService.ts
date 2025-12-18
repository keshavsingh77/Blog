
// Downloader feature has been removed.
export const fetchVideoInfo = async (url: string): Promise<any> => {
  throw new Error("Downloader feature disabled.");
};
