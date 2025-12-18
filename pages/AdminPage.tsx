
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

  useEffect(() => {
    const checkAi = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setIsAiConnected(hasKey);
      } else {
        // Fallback for local dev if window.aistudio isn't present
        setIsAiConnected(!!process.env.API_KEY);
      }
    };
    checkAi();
  }, []);

  const handleConnectAi = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setIsAiConnected(true);
    }
  };

  const toggleAutoPosting = () => {
    const newVal = !isAutoPosting;
    setIsAutoPosting(newVal);
    localStorage.setItem('auto_post_enabled', String(newVal));
    setStatus({ type: 'info', msg: newVal ? 'Automatic posting enabled. The system will now look for viral topics.' : 'Automatic posting disabled.' });
  };

  const handleManualGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    if (!isAiConnected) {
      setStatus({ type: 'error', msg: 'Please connect AI Studio first using the button above.' });
      return;
    }

    setIsGenerating(true);
    setStatus({ type: 'info', msg: 'AI is researching and writing your viral post...' });

    try {
      // 1. Generate Content
      const aiPost = await generateBlogPost(topic);
      
      // 2. Generate Image
      const imageUrl = await generateImageForPost(aiPost.title);

      // 3. Publish to Blogger
      setStatus({ type: 'info', msg: 'Post generated! Requesting Blogger authorization...' });
      const token = await requestAccessToken();
      
      setStatus({ type: 'info', msg: 'Publishing to your Blogger site...' });
      await publishToBlogger(token, {
        title: aiPost.title,
        content: aiPost.content,
        labels: aiPost.tags,
        imageUrl: imageUrl
      });

      setStatus({ type: 'success', msg: `Successfully published: ${aiPost.title}` });
      setTopic('');
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes('Requested entity was not found')) {
        setIsAiConnected(false);
        setStatus({ type: 'error', msg: 'AI Connection expired. Please click "Connect AI" again.' });
      } else {
        setStatus({ type: 'error', msg: error.message || 'Failed to generate post.' });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pt-24 pb-16">
      <SEO title="Admin Dashboard" description="Manage your AI-powered blog and automatic posting settings." />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Control your AI content engine</p>
          </div>

          {!isAiConnected ? (
            <button 
              onClick={handleConnectAi}
              className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-1"
            >
              <i className="fas fa-plug mr-2"></i> Connect AI Studio (Required)
            </button>
          ) : (
            <div className="flex items-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full border border-green-200 dark:border-green-800 font-bold text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              AI Connected
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Controls */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center">
                <i className="fas fa-magic text-blue-600 mr-3"></i> Manual AI Generator
              </h2>
              <form onSubmit={handleManualGenerate} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Post Topic or Keyword</label>
                  <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={isGenerating || !isAiConnected}
                    placeholder="e.g., Best dark psychology tricks for viral reels"
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isGenerating || !isAiConnected || !topic.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center"
                >
                  {isGenerating ? (
                    <>
                      <i className="fas fa-circle-notch animate-spin mr-3"></i> AI is Writing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane mr-3"></i> Generate & Publish Now
                    </>
                  )}
                </button>
              </form>
              
              {!isAiConnected && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                   <p className="text-yellow-800 dark:text-yellow-400 text-sm font-medium">
                     <i className="fas fa-exclamation-triangle mr-2"></i> 
                     You must select an API key before generating content. This prevents connection refusal errors. 
                     <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline ml-1">Learn about billing</a>.
                   </p>
                </div>
              )}
            </section>

            {status && (
              <div className={`p-5 rounded-2xl border flex items-start animate-fade-in-up ${
                status.type === 'success' ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' :
                status.type === 'error' ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400' :
                'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
              }`}>
                <div className="mr-3 mt-0.5">
                   <i className={`fas ${status.type === 'success' ? 'fa-check-circle' : status.type === 'error' ? 'fa-times-circle' : 'fa-info-circle'}`}></i>
                </div>
                <p className="font-bold text-sm">{status.msg}</p>
              </div>
            )}
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            <section className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">Automation</h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-200">Automatic Posting</p>
                  <p className="text-xs text-gray-500">AI posts viral news 2x daily</p>
                </div>
                <button 
                  onClick={toggleAutoPosting}
                  className={`w-12 h-6 rounded-full relative transition-colors ${isAutoPosting ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isAutoPosting ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </section>

            <section className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                   <span className="text-gray-500">Total Posts</span>
                   <span className="font-bold text-gray-900 dark:text-white">{posts.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-gray-500">AI Generated</span>
                   <span className="font-bold text-gray-900 dark:text-white">{posts.filter(p => p.author === 'Creative AI').length || 0}</span>
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
