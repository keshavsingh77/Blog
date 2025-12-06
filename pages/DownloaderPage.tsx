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

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
      } else {
        alert("Clipboard is empty.");
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      alert("Could not access clipboard. Please paste the link manually.");
    }
  };

  // Structured Data for SEO (SoftwareApplication Schema)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "All-in-One Video Downloader",
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
    <div className="min-h-screen bg-gray-50 font-sans pt-16">
      <SEO 
        title="All-in-One Video Downloader | Free & No Watermark (TikTok, Insta, FB)" 
        description="Download videos from TikTok, Instagram, Facebook, and Twitter without watermark. Fast, free, and mobile-friendly All-in-One Video Downloader tool." 
      />
      
      {/* Inject Schema for Google safely */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section with Gradient */}
      <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 text-white py-16 md:py-24 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         {/* Abstract Shapes */}
         <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
         <div className="absolute bottom-10 left-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>

         <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-50 text-xs font-bold uppercase tracking-wider mb-4 shadow-lg">
              <i className="fas fa-bolt text-yellow-400 mr-1"></i> Free Online Tool
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight drop-shadow-lg leading-tight">
               All-in-One <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">Video Downloader</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-medium leading-relaxed opacity-90">
               Download high-quality videos from TikTok, Instagram, Facebook, and Twitter <strong className="text-white border-b-2 border-blue-400/50 pb-0.5">without watermark</strong>.
            </p>
         </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-12">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 md:p-10 transform transition-all duration-300">
          <form onSubmit={handleDownload}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-link text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste video URL here (e.g., TikTok, FB, Insta...)"
                  className="w-full pl-11 pr-20 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-gray-800 text-lg placeholder-gray-400 font-medium"
                  autoFocus
                />
                {/* Paste Button inside input */}
                <button
                  type="button"
                  onClick={handlePaste}
                  className="absolute inset-y-2 right-2 px-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs font-bold uppercase transition-colors flex items-center shadow-sm"
                  title="Paste from clipboard"
                >
                  Paste
                </button>
              </div>
              <button
                type="submit"
                disabled={isLoading || !url}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 min-w-[160px]"
              >
                {isLoading ? <Spinner /> : <><i className="fas fa-download"></i> Download</>}
              </button>
            </div>
          </form>

          {/* AD PLACEMENT: Below Download Button */}
          <div className="mt-8 mb-2">
             <div className="text-[10px] text-gray-300 text-center uppercase tracking-widest mb-1">Advertisement</div>
             <div className="min-h-[100px] w-full bg-gray-50 rounded-lg overflow-hidden flex justify-center items-center border border-dashed border-gray-200">
                 <GoogleAd slot="1909584638" format="horizontal" responsive={true} style={{ display: 'block', width: '100%' }} />
             </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center animate-fade-in-down shadow-sm">
              <i className="fas fa-exclamation-circle mr-3 text-xl"></i>
              <span className="font-bold">{error}</span>
            </div>
          )}

          {result && (
            <div className="mt-10 pt-8 border-t border-gray-100 animate-fade-in-up">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Thumbnail */}
                <div className="w-full md:w-1/3 rounded-2xl overflow-hidden shadow-lg bg-gray-100 group relative ring-1 ring-gray-100">
                  <img src={result.thumbnail} alt={result.title} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-white text-xs font-bold"><i className="fas fa-play mr-1"></i> Preview</span>
                  </div>
                </div>
                
                {/* Details */}
                <div className="flex-1 w-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                        <i className={`fab fa-${result.source.toLowerCase()} mr-1.5`}></i> {result.source}
                    </span>
                    <span className="text-xs font-bold text-gray-400">Ready to download</span>
                  </div>
                  
                  <h3 className="text-xl font-black text-gray-900 mb-2 line-clamp-2 leading-snug">{result.title}</h3>
                  <p className="text-gray-500 text-sm mb-6 flex items-center font-medium">
                    <i className="fas fa-user-circle mr-2 text-gray-400"></i> @{result.author}
                  </p>

                  <div className="grid gap-3">
                    {result.medias.map((media, idx) => {
                      // Styling based on type - Safe checks for quality and extension
                      const quality = media.quality || '';
                      const extension = media.extension || '';
                      
                      const isNoWatermark = quality.includes('no_watermark') || quality.includes('hd');
                      const isAudio = media.type === 'audio';
                      
                      return (
                        <a 
                          key={idx} 
                          href={media.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`flex items-center justify-between px-5 py-4 rounded-xl border-2 font-bold transition-all group relative overflow-hidden ${
                            isAudio 
                              ? 'bg-orange-50 border-orange-100 text-orange-800 hover:border-orange-300 hover:bg-orange-100' 
                              : isNoWatermark 
                                ? 'bg-green-50 border-green-100 text-green-800 hover:border-green-300 hover:bg-green-100 shadow-sm' 
                                : 'bg-white border-gray-100 text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'
                          }`}
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isAudio ? 'bg-orange-200 text-orange-700' : isNoWatermark ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                <i className={`fas ${isAudio ? 'fa-music' : 'fa-video'}`}></i>
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-sm">
                                    {isAudio ? 'Download Audio (MP3)' : 
                                     isNoWatermark ? 'Download HD (No Watermark)' : 
                                     `Download ${extension.toUpperCase()}`}
                                </span>
                                {media.formattedSize && <span className="text-[10px] opacity-70 font-normal">{media.formattedSize}</span>}
                            </div>
                          </div>
                          <i className="fas fa-arrow-down transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all text-current relative z-10"></i>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEO Content & Article Section */}
        <div className="mt-20">
           
           {/* Features Grid */}
           <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <i className="fas fa-bolt"></i>
                  </div>
                  <h3 className="font-black text-gray-900 text-xl mb-3">Lightning Fast</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Fetches video links in milliseconds using high-speed API. No waiting queues, no lag.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl group-hover:bg-green-600 group-hover:text-white transition-colors">
                      <i className="fas fa-magic"></i>
                  </div>
                  <h3 className="font-black text-gray-900 text-xl mb-3">No Watermark</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Download clean videos from TikTok and Reels. We automatically strip logos and user IDs for you.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <i className="fas fa-shield-alt"></i>
                  </div>
                  <h3 className="font-black text-gray-900 text-xl mb-3">Secure & Free</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">No signup required. No software installation. 100% safe for all Android, iOS, and PC devices.</p>
              </div>
           </div>

           {/* Detailed Article */}
           <article className="prose prose-lg prose-blue max-w-none bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center">
                 <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
                 Why Choose This Downloader?
              </h2>
              <p className="text-gray-600 leading-relaxed">
                 In the age of viral content, saving your favorite videos to watch offline or share with friends is essential. 
                 This <strong>All-in-One Video Downloader</strong> is engineered to be the most versatile tool on the web. 
                 Unlike other downloaders that limit you to one platform, our tool connects to multiple social networks to provide a seamless experience.
              </p>

              <div className="my-8 p-8 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-3xl border border-blue-100/50">
                 <h3 className="text-gray-900 font-black text-xl mt-0 mb-6 uppercase tracking-wider text-center">Supported Platforms</h3>
                 <ul className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 list-none pl-0 my-0">
                    <li className="flex items-center font-bold text-gray-700 bg-white p-3 rounded-lg shadow-sm border border-gray-100"><i className="fab fa-tiktok text-black mr-3 text-xl"></i> TikTok</li>
                    <li className="flex items-center font-bold text-gray-700 bg-white p-3 rounded-lg shadow-sm border border-gray-100"><i className="fab fa-instagram text-pink-600 mr-3 text-xl"></i> Instagram</li>
                    <li className="flex items-center font-bold text-gray-700 bg-white p-3 rounded-lg shadow-sm border border-gray-100"><i className="fab fa-facebook text-blue-700 mr-3 text-xl"></i> Facebook</li>
                    <li className="flex items-center font-bold text-gray-700 bg-white p-3 rounded-lg shadow-sm border border-gray-100"><i className="fab fa-twitter text-blue-400 mr-3 text-xl"></i> Twitter/X</li>
                    <li className="flex items-center font-bold text-gray-700 bg-white p-3 rounded-lg shadow-sm border border-gray-100"><i className="fab fa-pinterest text-red-600 mr-3 text-xl"></i> Pinterest</li>
                    <li className="flex items-center font-bold text-gray-700 bg-white p-3 rounded-lg shadow-sm border border-gray-100"><i className="fab fa-threads text-black mr-3 text-xl"></i> Threads</li>
                    <li className="flex items-center font-bold text-gray-700 bg-white p-3 rounded-lg shadow-sm border border-gray-100"><i className="fab fa-youtube text-red-600 mr-3 text-xl"></i> Shorts</li>
                    <li className="flex items-center font-bold text-gray-700 bg-white p-3 rounded-lg shadow-sm border border-gray-100"><i className="fas fa-plus text-gray-400 mr-3 text-xl"></i> 40+ More</li>
                 </ul>
              </div>

              <h3 className="text-2xl font-bold text-gray-900">How to Download Videos from TikTok without Watermark</h3>
              <p className="text-gray-600">
                 TikTok adds a bouncing watermark to every downloaded video, which can be annoying if you want to reuse your content or watch it cleanly. Here is how to remove it:
              </p>
              <ol className="text-gray-600 space-y-2">
                 <li>Open the TikTok app and find the video you wish to save.</li>
                 <li>Tap the <strong>Share</strong> button (arrow icon) and select <strong>Copy Link</strong>.</li>
                 <li>Come back here and paste the link in the input box above.</li>
                 <li>Click the <strong>Download</strong> button.</li>
                 <li>Select the button labeled <strong>"HD (No Watermark)"</strong>.</li>
              </ol>

              <h3 className="text-2xl font-bold text-gray-900 mt-8">Download Instagram Reels & Stories</h3>
              <p className="text-gray-600">
                 Instagram doesn't provide a native way to download Reels with audio. Our tool extracts the original MP4 file directly from Instagram's servers, ensuring you get the highest quality video with synchronized audio.
              </p>
              
              <div className="my-10">
                 <div className="text-[10px] text-gray-300 text-center uppercase tracking-widest mb-1">Sponsored</div>
                  <GoogleAd slot="8617081290" format="autorelaxed" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mt-8">Frequently Asked Questions (FAQ)</h3>
              
              <div className="not-prose space-y-4 mt-6">
                  <details className="group bg-gray-50 rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 open:bg-white open:shadow-md">
                     <summary className="flex items-center justify-between p-5 cursor-pointer font-bold text-gray-800 hover:bg-gray-100/50 transition-colors">
                        Is this tool truly free?
                        <i className="fas fa-chevron-down text-gray-400 transition-transform group-open:rotate-180"></i>
                     </summary>
                     <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4 bg-white">
                        Yes, this tool is 100% free to use. You don't need to register, pay a subscription, or install any browser extensions.
                     </div>
                  </details>

                  <details className="group bg-gray-50 rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 open:bg-white open:shadow-md">
                     <summary className="flex items-center justify-between p-5 cursor-pointer font-bold text-gray-800 hover:bg-gray-100/50 transition-colors">
                        Where are the videos saved on my device?
                        <i className="fas fa-chevron-down text-gray-400 transition-transform group-open:rotate-180"></i>
                     </summary>
                     <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4 bg-white">
                        On mobile devices (Android/iOS), videos are usually saved to your "Downloads" folder or directly to your Gallery/Photos app. On PC, they appear in the default "Downloads" folder selected in your browser settings.
                     </div>
                  </details>

                  <details className="group bg-gray-50 rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 open:bg-white open:shadow-md">
                     <summary className="flex items-center justify-between p-5 cursor-pointer font-bold text-gray-800 hover:bg-gray-100/50 transition-colors">
                        Does it store a copy of downloaded videos?
                        <i className="fas fa-chevron-down text-gray-400 transition-transform group-open:rotate-180"></i>
                     </summary>
                     <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4 bg-white">
                        No. We do not store any videos or keep logs of your download history. The downloading process is completely anonymous and secure.
                     </div>
                  </details>

                  <details className="group bg-gray-50 rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 open:bg-white open:shadow-md">
                     <summary className="flex items-center justify-between p-5 cursor-pointer font-bold text-gray-800 hover:bg-gray-100/50 transition-colors">
                        Can I download MP3 Audio from TikTok videos?
                        <i className="fas fa-chevron-down text-gray-400 transition-transform group-open:rotate-180"></i>
                     </summary>
                     <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4 bg-white">
                        Absolutely. After pasting the link, look for the button labeled <strong>"Download Audio (MP3)"</strong>. This extracts just the sound from the video for you to save.
                     </div>
                  </details>
              </div>
           </article>
        </div>
      </div>
    </div>
  );
};

export default DownloaderPage;