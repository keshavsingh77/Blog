
import React, { useState, useEffect } from 'react';
import { useBlog } from '../context/BlogContext';
import { generateBlogPost, generateImageForPost } from '../services/geminiService';
import { publishToBlogger, requestAccessToken } from '../services/bloggerService';
import SEO from '../components/SEO';
import Spinner from '../components/Spinner';

const AdminPage: React.FC = () => {
  const { posts } = useBlog();
  const [isAiConnected, setIsAiConnected] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info', msg: string } | null>(null);
  const [isAutoPosting, setIsAutoPosting] = useState(() => localStorage.getItem('auto_post_enabled') === 'true');

  // CRITICAL: Check for AI connectivity on mount
  useEffect(() => {
    const checkAi = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setIsAiConnected(hasKey);
      } else {
        setIsAiConnected(!!process.env.API_KEY);
      }
    };
    checkAi();
  }, []);

  // Fixes "google.ai.com refuses to connect" by using proper environment dialog
  const handleConnectAi = async () => {
    try {
      if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
        await window.aistudio.openSelectKey();
        setIsAiConnected(true);
        setStatus({ type: 'success', msg: 'AI Studio connected successfully!' });
      }
    } catch (err) {
      console.error("Connection failed", err);
      setStatus({ type: 'error', msg: 'Failed to open AI connection dialog.' });
    }
  };

  const toggleAutoPosting = () => {
    const newVal = !isAutoPosting;
    setIsAutoPosting(newVal);
    localStorage.setItem('auto_post_enabled', String(newVal));
    setStatus({ type: 'info', msg: newVal ? 'Automatic mode enabled. Looking for viral news...' : 'Automatic mode disabled.' });
  };

  const handleManualGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    if (!isAiConnected) {
      setStatus({ type: 'error', msg: 'AI Connection required. Click the button at the top right.' });
      return;
    }

    setIsGenerating(true);
    setStatus({ type: 'info', msg: 'AI is researching the topic...' });

    try {
      // 1. Generate Content
      const aiPost = await generateBlogPost(topic);
      
      // 2. Generate Image
      setStatus({ type: 'info', msg: 'Content ready. Generating professional image...' });
      const imageUrl = await generateImageForPost(aiPost.title);

      // 3. Publish to Blogger
      setStatus({ type: 'info', msg: 'Publishing to your Blogger site...' });
      const token = await requestAccessToken();
      await publishToBlogger(token, {
        title: aiPost.title,
        content: aiPost.content,
        labels: aiPost.tags,
        imageUrl: imageUrl
      });

      setStatus({ type: 'success', msg: `Successfully published: ${aiPost.title}` });
      setTopic(''); // Clear only on success
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes('Requested entity was not found')) {
        setIsAiConnected(false);
        setStatus({ type: 'error', msg: 'AI Project link expired. Please click "Connect AI" again.' });
      } else {
        setStatus({ type: 'error', msg: error.message || 'Error occurred during generation.' });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pt-24 pb-16">
      <SEO title="Admin Dashboard" description="Manage AI content generation and automated posting." />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Admin Center</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Powering Creative Mind with Generative AI</p>
          </div>

          <div className="flex items-center gap-3">
            {!isAiConnected ? (
              <button 
                onClick={handleConnectAi}
                className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-2xl font-black shadow-xl shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                <i className="fas fa-plug mr-3"></i> Connect AI Studio
              </button>
            ) : (
              <div className="flex items-center bg-white dark:bg-gray-900 text-green-600 px-6 py-3.5 rounded-2xl border-2 border-green-100 dark:border-green-900/30 font-black text-sm shadow-sm">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-3 animate-pulse"></span>
                AI ACTIVE
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none">
              <h2 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center">
                <i className="fas fa-wand-sparkles text-blue-600 mr-4"></i> Create New Post
              </h2>
              <form onSubmit={handleManualGenerate} className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Target Topic / Viral Keyword</label>
                  <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={isGenerating}
                    placeholder="e.g., Top 5 hidden Instagram features for growth..."
                    className="w-full px-6 py-5 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-3xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all disabled:opacity-50 text-gray-900 dark:text-white font-bold text-lg"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isGenerating || !topic.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-5 rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-500/30 transition-all flex items-center justify-center transform active:scale-[0.98]"
                >
                  {isGenerating ? (
                    <>
                      <i className="fas fa-spinner animate-spin mr-3"></i> Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-rocket mr-3"></i> Generate & Post
                    </>
                  )}
                </button>
              </form>
            </section>

            {status && (
              <div className={`p-6 rounded-3xl border-2 flex items-start animate-fade-in-up ${
                status.type === 'success' ? 'bg-green-50 border-green-100 text-green-800 dark:bg-green-900/10 dark:border-green-800 dark:text-green-400' :
                status.type === 'error' ? 'bg-red-50 border-red-100 text-red-800 dark:bg-red-900/10 dark:border-red-800 dark:text-red-400' :
                'bg-blue-50 border-blue-100 text-blue-800 dark:bg-blue-900/10 dark:border-blue-800 dark:text-blue-400'
              }`}>
                <div className="mr-4 mt-1">
                   <i className={`fas text-xl ${status.type === 'success' ? 'fa-circle-check' : status.type === 'error' ? 'fa-circle-xmark' : 'fa-circle-info'}`}></i>
                </div>
                <p className="font-bold text-base">{status.msg}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <section className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tight">Auto Pilot</h3>
              <div className="p-6 bg-gray-50 dark:bg-gray-800/40 rounded-3xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-black text-gray-900 dark:text-white">Active Feed</p>
                    <p className="text-xs text-gray-500 font-bold">2 Posts Per Day</p>
                  </div>
                  <button 
                    onClick={toggleAutoPosting}
                    className={`w-14 h-7 rounded-full relative transition-all shadow-inner ${isAutoPosting ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${isAutoPosting ? 'left-8' : 'left-1'}`}></div>
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Status: {isAutoPosting ? 'Scanning Trends' : 'Standby'}</p>
              </div>
            </section>

            <section className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tight">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-bold">
                   <span className="text-gray-500 uppercase tracking-widest text-[10px]">Total Published</span>
                   <span className="text-gray-900 dark:text-white text-lg">{posts.length}</span>
                </div>
                <div className="w-full h-[1px] bg-gray-50 dark:bg-gray-800"></div>
                <div className="flex justify-between items-center text-sm font-bold">
                   <span className="text-gray-500 uppercase tracking-widest text-[10px]">AI Authored</span>
                   <span className="text-blue-600 text-lg">{posts.filter(p => p.author === 'Creative AI' || p.author === 'Creative Mind').length}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
