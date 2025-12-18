
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
        setIsAiConnected(!!process.env.API_KEY);
      }
    };
    checkAi();
  }, []);

  const handleConnectAi = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
        await window.aistudio.openSelectKey();
        setIsAiConnected(true);
        setStatus({ type: 'success', msg: 'AI Connected.' });
      }
    } catch (err) {
      console.error("Connection failed", err);
      setStatus({ type: 'error', msg: 'Connection failed.' });
    }
  };

  const toggleAutoPosting = () => {
    const newVal = !isAutoPosting;
    setIsAutoPosting(newVal);
    localStorage.setItem('auto_post_enabled', String(newVal));
    setStatus({ type: 'info', msg: newVal ? 'Auto mode: ON' : 'Auto mode: OFF' });
  };

  const handleManualGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    if (!isAiConnected) {
      setStatus({ type: 'error', msg: 'Please connect AI first.' });
      return;
    }

    setIsGenerating(true);
    setStatus({ type: 'info', msg: 'Generating viral content...' });

    try {
      const aiPost = await generateBlogPost(topic);
      const imageUrl = await generateImageForPost(aiPost.title);
      const token = await requestAccessToken();
      await publishToBlogger(token, {
        title: aiPost.title,
        content: aiPost.content,
        labels: aiPost.tags,
        imageUrl: imageUrl
      });
      setStatus({ type: 'success', msg: `Posted: ${aiPost.title}` });
      setTopic('');
    } catch (error: any) {
      console.error(error);
      setStatus({ type: 'error', msg: 'Failed to generate post.' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pt-24 pb-16">
      <SEO title="System Admin" description="Internal management console." />
      
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <p className="text-gray-800 dark:text-gray-200 font-black uppercase tracking-widest text-sm">Dashboard</p>
          </div>
          {!isAiConnected ? (
            <button onClick={handleConnectAi} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl font-bold text-xs shadow-lg transition-colors">Connect AI Studio</button>
          ) : (
            <div className="flex items-center text-green-600 font-bold text-xs bg-green-50 dark:bg-green-900/10 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span> AI READY
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <section className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
              <h2 className="text-lg font-black mb-6 text-gray-900 dark:text-white uppercase tracking-tight">New Content</h2>
              <form onSubmit={handleManualGenerate} className="space-y-4">
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isGenerating}
                  placeholder="Enter topic or keywords..."
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-none outline-none font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="submit"
                  disabled={isGenerating || !topic.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-black shadow-lg disabled:opacity-50 transition-all active:scale-[0.98]"
                >
                  {isGenerating ? 'AI is Writing...' : 'Generate & Publish'}
                </button>
              </form>
            </section>
            
            {status && (
              <div className={`mt-6 p-4 rounded-xl border-2 font-bold text-sm ${status.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : status.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
                {status.msg}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <section className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="text-xs font-black uppercase text-gray-400 mb-6 tracking-widest">Automation</h3>
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-700 dark:text-gray-300">Auto Post</span>
                <button 
                  onClick={toggleAutoPosting}
                  className={`w-12 h-6 rounded-full relative transition-all shadow-inner ${isAutoPosting ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isAutoPosting ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
