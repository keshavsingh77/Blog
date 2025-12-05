
import React, { useState } from 'react';
import SEO from '../components/SEO';
import Spinner from '../components/Spinner';
import { fetchVideoInfo, VideoData } from '../services/downloaderService';

const DownloaderPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VideoData | null>(null);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await fetchVideoInfo(url);
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pt-20 pb-12">
      <SEO 
        title="Free Video Downloader - No Watermark" 
        description="Download videos from TikTok, Instagram, Facebook, and more in HD quality without watermark. Fast, free, and secure online video saver." 
      />

      {/* Hero / Tool Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            All-in-One <span className="text-blue-600">Video Downloader</span>
          </h1>
          <p className="text-lg text-gray-600">
            Paste a link from TikTok, Instagram, Facebook, or Twitter to download without watermark.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-6 md:p-10 transform transition-all hover:shadow-2xl">
          <form onSubmit={handleDownload} className="relative">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-link text-gray-400"></i>
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste video URL here..."
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-800 text-lg placeholder-gray-400"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !url}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? <Spinner /> : <><i className="fas fa-download"></i> Download</>}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center animate-fade-in-down">
              <i className="fas fa-exclamation-circle mr-3 text-xl"></i>
              <span className="font-medium">{error}</span>
            </div>
          )}

          {result && (
            <div className="mt-8 pt-8 border-t border-gray-100 animate-fade-in-up">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Thumbnail */}
                <div className="w-full md:w-1/3 rounded-xl overflow-hidden shadow-md bg-gray-100">
                  <img src={result.thumbnail} alt={result.title} className="w-full h-auto object-cover" />
                </div>
                
                {/* Details */}
                <div className="flex-1 w-full">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider px-2 py-1 rounded mb-2">
                    {result.source}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">{result.title}</h3>
                  <p className="text-gray-500 text-sm mb-6 flex items-center">
                    <i className="fas fa-user-circle mr-2"></i> @{result.author}
                  </p>

                  <div className="grid gap-3">
                    {result.medias.map((media, idx) => {
                      // Styling based on type
                      const isNoWatermark = media.quality.includes('no_watermark');
                      const isAudio = media.type === 'audio';
                      
                      return (
                        <a 
                          key={idx} 
                          href={media.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`flex items-center justify-between px-5 py-3 rounded-lg border font-bold transition-all group ${
                            isAudio 
                              ? 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100' 
                              : isNoWatermark 
                                ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' 
                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <i className={`fas ${isAudio ? 'fa-music' : 'fa-video'} text-lg`}></i>
                            <div className="flex flex-col text-left">
                                <span>
                                    {isAudio ? 'Download MP3 Audio' : 
                                     isNoWatermark ? 'Download HD (No Watermark)' : 
                                     `Download ${media.extension.toUpperCase()}`}
                                </span>
                                {media.formattedSize && <span className="text-[10px] opacity-70 font-normal">{media.formattedSize}</span>}
                            </div>
                          </div>
                          <i className="fas fa-cloud-download-alt opacity-0 group-hover:opacity-100 transition-opacity"></i>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 prose prose-lg prose-blue text-gray-600">
         <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-4">Why Use Creative Mind Downloader?</h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
         </div>

         <div className="grid md:grid-cols-3 gap-8 mb-12 not-prose">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    <i className="fas fa-bolt"></i>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Lightning Fast</h3>
                <p className="text-sm">Get your download links in milliseconds. No waiting, no queues.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    <i className="fas fa-ban"></i>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">No Watermark</h3>
                <p className="text-sm">Remove distracting logos and usernames from TikTok and Reels automatically.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    <i className="fas fa-shield-alt"></i>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">100% Safe & Free</h3>
                <p className="text-sm">No software installation required. Secure and completely free to use.</p>
            </div>
         </div>

         <h3>How to Download Videos from Social Media?</h3>
         <ol>
            <li><strong>Copy the URL:</strong> Open the app (TikTok, Instagram, Facebook) and copy the link of the video you want to save.</li>
            <li><strong>Paste the Link:</strong> Paste the URL into the input box at the top of this page.</li>
            <li><strong>Click Download:</strong> Hit the download button and choose your preferred format (HD Video or MP3 Audio).</li>
         </ol>

         <h3>Supported Platforms</h3>
         <p>
            Our tool supports a wide range of platforms including <strong>TikTok, Instagram Reels, Facebook Videos, Twitter (X), Threads, Pinterest</strong>, and more. 
            Whether you need to save a funny meme, a tutorial, or a music clip, Creative Mind Downloader handles it all.
         </p>
      </div>
    </div>
  );
};

export default DownloaderPage;
