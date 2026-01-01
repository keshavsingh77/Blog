import React, { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { generateBlogPost, generateImageForPost } from '../services/geminiService';
import { PostStatus } from '../types';
import SEO from '../components/SEO';

const AdminPage: React.FC = () => {
  const { posts, addPost, deletePost } = useBlog();
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isGenerating) return;

    setIsGenerating(true);
    setStatusMsg('Drafting viral structure...');
    
    try {
      const content = await generateBlogPost(topic);
      setStatusMsg('Synthesizing cinematic visuals...');
      const imageUrl = await generateImageForPost(content.title);

      const newPost = {
        id: `ai-${Date.now()}`,
        ...content,
        imageUrl,
        status: PostStatus.PUBLISHED,
        createdAt: new Date().toISOString(),
        author: 'AI Studio',
        isLocal: true
      };

      addPost(newPost);
      setTopic('');
      setStatusMsg('Post published successfully!');
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setStatusMsg('API Error: Ensure Gemini access is active.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pt-24 pb-20">
      <SEO title="Dashboard" description="Command center for AI content generation." />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
              Admin <span className="text-blue-600">Studio</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Powering Creative Mind with Advanced GenAI.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white dark:bg-gray-900 px-6 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Total Posts</span>
              <span className="text-xl font-black text-gray-900 dark:text-white">{posts.length}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-xl shadow-blue-500/5 border border-gray-100 dark:border-gray-800 sticky top-24">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mr-4 shadow-lg shadow-blue-500/30">
                  <i className="fas fa-bolt"></i>
                </div>
                <div>
                   <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">AI Engine</h2>
                   <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Gemini 3 Flash</p>
                </div>
              </div>
              
              <form onSubmit={handleGenerate} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Article Topic</label>
                  <textarea 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Describe your article idea..."
                    rows={4}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-3xl px-6 py-5 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all dark:text-white resize-none"
                    disabled={isGenerating}
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={isGenerating || !topic.trim()}
                  className="w-full bg-blue-600 text-white font-black py-5 rounded-3xl shadow-xl shadow-blue-500/25 hover:bg-blue-700 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Generating Content...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-magic"></i>
                      Launch Post
                    </>
                  )}
                </button>
                
                {statusMsg && (
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                    <p className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest animate-pulse">
                      {statusMsg}
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Live Library</h3>
                <span className="text-[9px] bg-green-500/10 text-green-500 px-3 py-1 rounded-full font-black uppercase">System Online</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {posts.map(post => (
                      <tr key={post.id} className="group hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-all">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-5">
                            <div className="relative w-16 h-12 shrink-0 rounded-xl overflow-hidden shadow-sm">
                               <img src={post.imageUrl} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                               <span className="font-black text-sm text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">{post.title}</span>
                               <div className="flex items-center gap-3 mt-1">
                                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{post.category}</span>
                                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                               </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {post.isLocal && (
                              <button 
                                onClick={() => deletePost(post.id)}
                                className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all"
                                title="Delete AI Post"
                              >
                                <i className="fas fa-trash-alt text-sm"></i>
                              </button>
                            )}
                            <a 
                              href={`/post/${post.id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all"
                            >
                               <i className="fas fa-external-link-alt text-sm"></i>
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;