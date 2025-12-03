
import React from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { PostStatus, Category } from '../types';
import PostCard from '../components/PostCard';
import AdsensePlaceholder from '../components/AdsensePlaceholder';
import SEO from '../components/SEO';
import { CATEGORIES } from '../constants';

const HomePage: React.FC = () => {
  const { posts } = useBlog();
  const publishedPosts = posts
    .filter(p => p.status === PostStatus.PUBLISHED)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const heroPost = publishedPosts[0];
  const trendingPosts = publishedPosts.slice(1, 4);
  const latestPosts = publishedPosts.slice(4);

  const getCategorySlug = (category: string) => category.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="bg-gray-50 min-h-screen">
      <SEO 
        title="Home" 
        description="iPopcorn - Your daily dose of Tech, Gaming, Movies, and Entertainment news. Reviews, trending stories and more."
      />

      {/* Hero Section */}
      {heroPost && (
        <section className="relative bg-gray-900 text-white">
          <div className="absolute inset-0 opacity-50">
             <img src={heroPost.imageUrl} alt="Background" className="w-full h-full object-cover filter blur-sm" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex items-end min-h-[500px]">
             <div className="w-full md:w-2/3 lg:w-1/2 bg-black bg-opacity-70 p-8 rounded-lg border-l-8 border-red-600">
                <Link to={`/category/${getCategorySlug(heroPost.category)}`} className="inline-block bg-red-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 mb-4 rounded-sm">
                   {heroPost.category}
                </Link>
                <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
                  <Link to={`/post/${heroPost.id}`} className="hover:text-red-400 transition-colors">
                    {heroPost.title}
                  </Link>
                </h1>
                <p className="text-gray-300 text-lg mb-6 line-clamp-2">
                  {heroPost.content.replace(/<[^>]+>/g, '')}
                </p>
                <Link to={`/post/${heroPost.id}`} className="inline-flex items-center text-white font-bold uppercase tracking-wider hover:text-red-400">
                  Read Full Story <i className="fas fa-chevron-right ml-2 text-xs"></i>
                </Link>
             </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8">
            
            {/* Trending Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6 border-b-2 border-gray-200 pb-2">
                 <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                   <span className="text-red-600 mr-2">/</span>Trending Now
                 </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {trendingPosts.map(post => (
                   <div key={post.id} className="group cursor-pointer">
                      <div className="overflow-hidden rounded-lg mb-3 shadow-md">
                        <Link to={`/post/${post.id}`}>
                           <img src={post.imageUrl} alt={post.title} className="w-full h-40 object-cover transform group-hover:scale-110 transition-transform duration-500" />
                        </Link>
                      </div>
                      <Link to={`/category/${getCategorySlug(post.category)}`} className="text-xs font-bold text-red-600 uppercase mb-1 block">{post.category}</Link>
                      <h3 className="font-bold text-gray-900 leading-snug group-hover:text-red-600 transition-colors">
                        <Link to={`/post/${post.id}`}>{post.title}</Link>
                      </h3>
                   </div>
                ))}
              </div>
            </div>

            {/* Latest News */}
            <div className="mb-8">
               <div className="flex items-center justify-between mb-6 border-b-2 border-gray-200 pb-2">
                 <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                   <span className="text-red-600 mr-2">/</span>Latest Stories
                 </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {latestPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}
                  {latestPosts.length === 0 && <p className="text-gray-500 italic">More stories coming soon...</p>}
              </div>
            </div>

            {/* Ad Unit */}
            <AdsensePlaceholder className="w-full h-32 mb-12 bg-gray-200" />
            
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-10">
            
            {/* Search (Visual Only) */}
            <div className="relative">
              <input type="text" placeholder="Search articles..." className="w-full pl-4 pr-10 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-red-600 shadow-sm" />
              <button className="absolute right-3 top-3 text-gray-400 hover:text-red-600">
                <i className="fas fa-search"></i>
              </button>
            </div>

            {/* Categories Widget */}
            <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-red-600">
               <h3 className="text-lg font-black uppercase mb-4">Categories</h3>
               <ul className="space-y-2">
                 {CATEGORIES.map(cat => (
                   <li key={cat}>
                     <Link to={`/category/${getCategorySlug(cat)}`} className="flex justify-between items-center text-gray-700 hover:text-red-600 font-medium transition-colors">
                       <span>{cat}</span>
                       <span className="bg-gray-100 text-gray-500 text-xs py-1 px-2 rounded-full">{posts.filter(p => p.category === cat).length}</span>
                     </Link>
                   </li>
                 ))}
               </ul>
            </div>

            {/* Social Widget */}
            <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-black uppercase mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-500 transition"><i className="fab fa-facebook-f"></i></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center hover:bg-blue-300 transition"><i className="fab fa-twitter"></i></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center hover:bg-pink-500 transition"><i className="fab fa-instagram"></i></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-500 transition"><i className="fab fa-youtube"></i></a>
                </div>
            </div>

             {/* Sidebar Ad */}
             <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="text-xs font-bold text-gray-400 uppercase mb-2 text-center">Advertisement</div>
                <AdsensePlaceholder className="w-full h-64" />
             </div>

          </aside>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
