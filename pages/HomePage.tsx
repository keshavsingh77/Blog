
import React from 'react';
import { useBlog } from '../context/BlogContext';
import { PostStatus } from '../types';
import PostCard from '../components/PostCard';
import AdsensePlaceholder from '../components/AdsensePlaceholder';

const HomePage: React.FC = () => {
  const { posts } = useBlog();
  const publishedPosts = posts
    .filter(p => p.status === PostStatus.PUBLISHED)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const featuredPost = publishedPosts[0];
  const otherPosts = publishedPosts.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2 text-center">Latest News & Insights</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">Your daily source for government updates, finance, and job opportunities.</p>
      
      {featuredPost && (
         <div className="mb-12 bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="md:flex">
                <div className="md:flex-shrink-0">
                    <img className="h-full w-full object-cover md:w-96" src={featuredPost.imageUrl} alt={featuredPost.title}/>
                </div>
                <div className="p-8 flex flex-col justify-center">
                    <div className="uppercase tracking-wide text-sm text-blue-500 font-semibold">{featuredPost.category}</div>
                    <a href={`#/post/${featuredPost.id}`} className="block mt-1 text-3xl leading-tight font-bold text-black hover:underline">{featuredPost.title}</a>
                    <p className="mt-4 text-gray-500">{featuredPost.content.replace(/<[^>]+>/g, '').substring(0, 200)}...</p>
                    <a href={`#/post/${featuredPost.id}`} className="mt-6 font-semibold text-blue-600 hover:text-blue-800">
                        Continue Reading <i className="fas fa-arrow-right ml-1"></i>
                    </a>
                </div>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-l-4 border-blue-600 pl-4">More Stories</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {otherPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
        <aside className="md:col-span-4 space-y-8">
             <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">High Revenue Ad</h3>
                 <AdsensePlaceholder className="w-full h-64" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Sponsored Content</h3>
                 <AdsensePlaceholder className="w-full h-96" />
            </div>
        </aside>
      </div>

    </div>
  );
};

export default HomePage;
