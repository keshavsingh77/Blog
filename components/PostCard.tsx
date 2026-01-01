import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const getCategorySlug = (cat: string) => cat.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <article className="group relative bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-gray-800 h-full flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden">
         <Link to={`/post/${post.id}`} className="block w-full h-full">
            <img 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              src={post.imageUrl} 
              alt={post.title} 
              loading="lazy"
            />
         </Link>
         <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
         
         <Link 
            to={`/category/${getCategorySlug(post.category)}`} 
            className="absolute top-6 left-6 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all hover:bg-blue-600 hover:border-blue-600"
         >
           {post.category}
         </Link>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center gap-3 mb-4">
           <span className="text-[9px] font-black uppercase tracking-widest text-blue-600">
             <i className="far fa-calendar-alt mr-2"></i>
             {new Date(post.createdAt).toLocaleDateString()}
           </span>
           <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
           <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
             {post.author}
           </span>
        </div>
        
        <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-6 leading-tight group-hover:text-blue-600 transition-colors tracking-tighter italic">
          <Link to={`/post/${post.id}`}>
            {post.title}
          </Link>
        </h2>
        
        <div className="mt-auto pt-6 border-t border-gray-50 dark:border-gray-800">
           <Link to={`/post/${post.id}`} className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white group-hover:text-blue-600 transition-all">
            Read Secret <i className="fas fa-chevron-right ml-3 transform group-hover:translate-x-2 transition-transform"></i>
          </Link>
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