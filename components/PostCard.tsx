
import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const getCategorySlug = (category: string) => category.toLowerCase().replace(/\s+/g, '-');
  
  const plainTextContent = post.content.replace(/<[^>]+>/g, '');
  const snippet = plainTextContent.substring(0, 100) + '...';

  return (
    <article className="group bg-white rounded-[2rem] shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col h-full overflow-hidden border border-gray-100 transform hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
         <Link to={`/post/${post.id}`} className="block w-full h-full" aria-label={`Read ${post.title}`}>
            <img 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform" 
              src={post.imageUrl} 
              alt={post.title} 
              loading="lazy"
              width="800"
              height="450"
            />
             {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
         </Link>
         
         <Link 
            to={`/category/${getCategorySlug(post.category)}`} 
            className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-blue-700 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-lg z-10 hover:bg-blue-600 hover:text-white transition-all duration-300"
         >
           {post.category}
         </Link>
      </div>

      {/* Content Container */}
      <div className="p-5 md:p-6 flex flex-col flex-grow">
        <div className="mb-3 flex items-center text-[11px] font-bold text-gray-400 uppercase tracking-wide">
           <span className="mr-3 flex items-center"><i className="far fa-clock mr-1.5 opacity-70" aria-hidden="true"></i> {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
           {post.author && <span className="hidden md:flex items-center"><i className="far fa-user mr-1.5 opacity-70" aria-hidden="true"></i> {post.author}</span>}
        </div>
        
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
          <Link to={`/post/${post.id}`}>
            {post.title}
          </Link>
        </h2>
        
        {/* Hide snippet on mobile to maintain 2-col grid alignment */}
        <p className="hidden md:block text-gray-600 text-sm mb-5 flex-grow line-clamp-3 leading-relaxed opacity-90">{snippet}</p>
        
        <div className="mt-auto pt-4 border-t border-dashed border-gray-100 flex justify-between items-center">
           <Link to={`/post/${post.id}`} className="inline-flex items-center font-bold text-xs uppercase text-blue-600 hover:text-blue-800 transition-colors group/btn tracking-wide" aria-label={`Read full article: ${post.title}`}>
            Read Story
            <i className="fas fa-arrow-right ml-2 text-[10px] transform group-hover/btn:translate-x-1 transition-transform" aria-hidden="true"></i>
          </Link>
          <div className="flex space-x-4 text-gray-400">
            <button className="hover:text-blue-500 hover:scale-110 transition-all focus:outline-none" aria-label="Share this post">
               <i className="fas fa-share-alt"></i>
            </button>
            <button className="hidden md:inline hover:text-red-500 hover:scale-110 transition-all focus:outline-none" aria-label="Bookmark this post">
               <i className="far fa-bookmark"></i>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
