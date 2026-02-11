import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import PostCard from '../components/PostCard';
import SEO from '../components/SEO';
import { SkeletonCard, SkeletonHero } from '../components/SkeletonLoaders';

const GoogleAd = lazy(() => import('../components/GoogleAd'));

const HomePage: React.FC = () => {
  const { posts, isLoading } = useBlog();
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const filteredPosts = useMemo(() => {
    if (activeTab === 'All') return posts;
    return posts.filter(p => p.category === activeTab || p.tags?.includes(activeTab));
  }, [posts, activeTab]);

  const tabs = useMemo(() => {
    const cats = new Set<string>();
    posts.forEach(p => p.category && cats.add(p.category));
    return ['All', ...Array.from(cats)].slice(0, 10);
  }, [posts]);

  const featured = filteredPosts[0];
  const others = filteredPosts.slice(1);

  if (isLoading && posts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-950 min-h-screen">
        <SkeletonHero />
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen transition-colors duration-500 pb-20">
      <SEO title="Digital Secrets" description="Unlock the internet's most powerful secrets with Creative Mind." />

      {featured && (
        <section className="relative w-full h-[75vh] md:h-[95vh] bg-gray-950 overflow-hidden group">
          <img src={featured.imageUrl} alt={featured.title} className="w-full h-full object-cover opacity-60 transition-transform duration-[40s] group-hover:scale-125" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-gray-950 to-transparent"></div>

          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-16 lg:p-24 pb-20 md:pb-32">
            <div className="max-w-7xl mx-auto w-full">
              <div className="flex items-center gap-4 mb-6 animate-fade-in-up">
                <span className="bg-blue-600/20 backdrop-blur-md border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-lg">
                  Featured
                </span>
                <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
                  {featured.category}
                </span>
              </div>

              <h1 className="text-5xl md:text-8xl lg:text-[10rem] font-black text-white mb-10 leading-[0.85] max-w-6xl tracking-tighter drop-shadow-2xl animate-fade-in-up [animation-delay:200ms]">
                {featured.title.split(' ').map((word, i) => (
                  <span key={i} className={i % 2 === 0 ? "block" : "block text-blue-600"}>{word}</span>
                ))}
              </h1>

              <Link to={`/post/${featured.id}`} className="group relative inline-flex items-center bg-white text-gray-950 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:bg-blue-600 hover:text-white overflow-hidden active:scale-95 animate-fade-in-up [animation-delay:400ms]">
                <span className="relative z-10 flex items-center">
                  Read Article
                  <i className="fas fa-arrow-right ml-4 group-hover:translate-x-2 transition-transform"></i>
                </span>
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="sticky top-16 z-[100] bg-white/80 dark:bg-gray-950/80 backdrop-blur-2xl border-b border-gray-100 dark:border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${activeTab === tab
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20'
                  : 'bg-transparent border-gray-100 dark:border-gray-800 text-gray-500 hover:border-blue-600 hover:text-blue-600'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 my-12">
        <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse rounded-[2.5rem]" />}>
          <GoogleAd slot="1641433819" format="horizontal" height="120px" className="rounded-[2.5rem] overflow-hidden" />
        </Suspense>
      </div>

      <main className="max-w-7xl mx-auto px-4">
        {others.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {others.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        ) : (
          <div className="text-center py-40 border-4 border-dashed border-gray-100 dark:border-gray-900 rounded-[4rem]">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <i className="fas fa-rss text-3xl animate-pulse"></i>
            </div>
            <h2 className="text-xl font-black text-gray-400 uppercase tracking-widest italic">Awaiting Next Sync...</h2>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;