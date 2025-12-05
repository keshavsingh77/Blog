
import React, { useState } from 'react';
import SEO from '../components/SEO';
import Spinner from '../components/Spinner';
import GoogleAd from '../components/GoogleAd';
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

  // Structured Data for SEO (SoftwareApplication Schema)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "SnapLoad - Universal Video Downloader",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": "Download videos from TikTok, Instagram, Facebook without watermark",
    "description": "A free online tool to download HD videos from social media platforms without watermarks."
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pt-20 pb-12">
      <SEO 
        title="SnapLoad | Free Video Downloader - No Watermark (TikTok, Insta, FB)" 
        description="SnapLoad is the fastest free tool to download videos from TikTok, Instagram, Facebook, and more in HD quality without watermark. Save MP4 and MP3 instantly." 
      />
      
      {/* Inject Schema for Google safely */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero / Tool Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
            Free Online Tool
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            SnapLoad <span className="text-blue-600">Media Saver</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Paste a link from TikTok, Instagram, Facebook, or Twitter to download high-quality videos <strong>without watermark</strong> instantly.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-6 md:p-10 transform transition-all hover:shadow-2xl z-10 relative">
          <form onSubmit={handleDownload} className="relative z-20">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-link text-gray-400"></i>
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste video URL here (e.g., https://...)"
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

          {/* AD PLACEMENT: Below Download Button */}
          <div className="mt-8 mb-2">
             <div className="text-[10px] text-gray-300 text-center uppercase tracking-widest mb-1">Advertisement</div>
             <div className="min-h-[100px] w-full bg-gray-50 rounded-lg overflow-hidden flex justify-center items-center">
                 <GoogleAd slot="1909584638" format="horizontal" responsive={true} style={{ display: 'block', width: '100%' }} />
             </div>
          </div>

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
                <div className="w-full md:w-1/3 rounded-xl overflow-hidden shadow-md bg-gray-100 group relative">
                  <img src={result.thumbnail} alt={result.title} className="w-full h-auto object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
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
                      // Styling based on type - Safe checks for quality and extension
                      const quality = media.quality || '';
                      const extension = media.extension || '';
                      
                      const isNoWatermark = quality.includes('no_watermark');
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
                                     `Download ${extension.toUpperCase()}`}
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

      {/* SEO Content & Article Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
         
         {/* Features Grid */}
         <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    <i className="fas fa-bolt"></i>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Lightning Fast</h3>
                <p className="text-gray-600 text-sm">SnapLoad fetches video links in milliseconds. No waiting queues, no lag.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    <i className="fas fa-magic"></i>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">No Watermark</h3>
                <p className="text-gray-600 text-sm">Download clean videos from TikTok and Reels. We automatically strip logos and user IDs.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    <i className="fas fa-shield-alt"></i>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Secure & Free</h3>
                <p className="text-gray-600 text-sm">No signup required. No software installation. 100% safe for all devices.</p>
            </div>
         </div>

         {/* Detailed Article */}
         <article className="prose prose-lg prose-blue max-w-none bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center">
               <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
               Why Choose SnapLoad?
            </h2>
            <p className="text-gray-600 leading-relaxed">
               In the age of viral content, saving your favorite videos to watch offline or share with friends is essential. 
               <strong>SnapLoad</strong> is engineered to be the most versatile tool on the web. 
               Unlike other downloaders that limit you to one platform, our tool connects to multiple social networks to provide a seamless experience.
            </p>

            <div className="my-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
               <h3 className="text-blue-900 font-bold text-xl mt-0 mb-4">Supported Platforms</h3>
               <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 list-none pl-0 my-0">
                  <li className="flex items-center font-medium text-gray-700"><i className="fab fa-tiktok text-black mr-2"></i> TikTok</li>
                  <li className="flex items-center font-medium text-gray-700"><i className="fab fa-instagram text-pink-600 mr-2"></i> Instagram</li>
                  <li className="flex items-center font-medium text-gray-700"><i className="fab fa-facebook text-blue-700 mr-2"></i> Facebook</li>
                  <li className="flex items-center font-medium text-gray-700"><i className="fab fa-twitter text-blue-400 mr-2"></i> Twitter/X</li>
                  <li className="flex items-center font-medium text-gray-700"><i className="fab fa-pinterest text-red-600 mr-2"></i> Pinterest</li>
                  <li className="flex items-center font-medium text-gray-700"><i className="fab fa-threads text-black mr-2"></i> Threads</li>
                  <li className="flex items-center font-medium text-gray-700"><i className="fab fa-youtube text-red-600 mr-2"></i> Shorts</li>
               </ul>
            </div>

            <h3 className="text-2xl font-bold text-gray-900">How to Download Videos from TikTok without Watermark</h3>
            <p className="text-gray-600">
               TikTok adds a bouncing watermark to every downloaded video, which can be annoying if you want to reuse your content or watch it cleanly. Here is how to remove it:
            </p>
            <ol className="text-gray-600">
               <li>Open the TikTok app and find the video you wish to save.</li>
               <li>Tap the <strong>Share</strong> button (arrow icon) and select <strong>Copy Link</strong>.</li>
               <li>Come back to SnapLoad and paste the link in the input box above.</li>
               <li>Click the <strong>Download</strong> button.</li>
               <li>Select the button labeled <strong>"HD (No Watermark)"</strong>.</li>
            </ol>

            <h3 className="text-2xl font-bold text-gray-900 mt-8">Download Instagram Reels & Stories</h3>
            <p className="text-gray-600">
               Instagram doesn't provide a native way to download Reels with audio. Our tool extracts the original MP4 file directly from Instagram's servers, ensuring you get the highest quality video with synchronized audio.
            </p>
            
            <div className="my-8">
               <div className="text-[10px] text-gray-300 text-center uppercase tracking-widest mb-1">Sponsored</div>
                <GoogleAd slot="8617081290" format="autorelaxed" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8">Frequently Asked Questions (FAQ)</h3>
            
            <div className="not-prose space-y-4 mt-6">
                <details className="group bg-gray-50 rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 open:bg-white open:shadow-md">
                   <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-gray-800">
                      Is SnapLoad truly free?
                      <i className="fas fa-chevron-down text-gray-400 transition-transform group-open:rotate-180"></i>
                   </summary>
                   <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                      Yes, SnapLoad is 100% free to use. You don't need to register, pay a subscription, or install any browser extensions.
                   </div>
                </details>

                <details className="group bg-gray-50 rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 open:bg-white open:shadow-md">
                   <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-gray-800">
                      Where are the videos saved on my device?
                      <i className="fas fa-chevron-down text-gray-400 transition-transform group-open:rotate-180"></i>
                   </summary>
                   <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                      On mobile devices (Android/iOS), videos are usually saved to your "Downloads" folder or directly to your Gallery/Photos app. On PC, they appear in the default "Downloads" folder selected in your browser settings.
                   </div>
                </details>

                <details className="group bg-gray-50 rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 open:bg-white open:shadow-md">
                   <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-gray-800">
                      Does it store a copy of downloaded videos?
                      <i className="fas fa-chevron-down text-gray-400 transition-transform group-open:rotate-180"></i>
                   </summary>
                   <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                      No. We do not store any videos or keep logs of your download history. The downloading process is completely anonymous and secure.
                   </div>
                </details>

                <details className="group bg-gray-50 rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 open:bg-white open:shadow-md">
                   <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-gray-800">
                      Can I download MP3 Audio from TikTok videos?
                      <i className="fas fa-chevron-down text-gray-400 transition-transform group-open:rotate-180"></i>
                   </summary>
                   <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                      Absolutely. After pasting the link, look for the button labeled <strong>"Download Audio (MP3)"</strong>. This extracts just the sound from the video for you to save.
                   </div>
                </details>
            </div>
         </article>
      </div>
    </div>
  );
};

export default DownloaderPage;
