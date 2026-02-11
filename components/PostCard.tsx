import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const getCategorySlug = (cat: string) => cat.toLowerCase().replace(/\s+/g, '-');

  return (
    <article className="group relative bg-white dark:bg-gray-900 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-gray-100/50 dark:border-gray-800/50 h-full flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Link to={`/post/${post.id}`} className="block w-full h-full">
          <img
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            src={post.imageUrl}
            alt={post.title}
            loading="lazy"
          />
        </Link>
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-gray-950/90 to-transparent transition-transform duration-700 translate-y-full group-hover:translate-y-0"></div>

        <Link
          to={`/category/${getCategorySlug(post.category)}`}
          className="absolute top-5 left-5 bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg transition-all hover:bg-blue-600 hover:border-blue-600"
        >
          {post.category}
        </Link>
      </div>

      <div className="p-7 md:p-9 flex flex-col flex-grow bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3 mb-5 animate-fade-in-up">
          <span className="text-[9px] font-black uppercase tracking-widest text-blue-600/70">
            {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="w-1 h-1 bg-gray-200 dark:bg-gray-800 rounded-full"></span>
          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
            {post.author}
          </span>
        </div>

        <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-6 leading-[1.2] group-hover:text-blue-600 transition-colors tracking-tight line-clamp-2">
          <Link to={`/post/${post.id}`}>
            {post.title}
          </Link>
        </h2>

        <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-50/50 dark:border-gray-800/50">
          <Link to={`/post/${post.id}`} className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white group-hover:text-blue-600 transition-all group-hover:gap-2">
            Read Secret <i className="fas fa-arrow-right-long ml-2 transform group-hover:translate-x-1 transition-transform"></i>
          </Link>
          <div className="flex -space-x-2">
            {[1, 2].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-800"></div>)}
          </div>
        </div>
      </div>

      {post.isLocal && (
        <div className="absolute top-6 right-6 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px] shadow-lg animate-pulse" title="AI Generated">
          <i className="fas fa-robot"></i>
        </div>
      )}
    </article>
  );
};

export default PostCard;