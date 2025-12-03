
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
    <div className="bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full overflow-hidden border border-gray-100 group transform hover:-translate-y-1">
      <div className="relative aspect-video overflow-hidden bg-gray-100">
         <Link to={`/post/${post.id}`} className="block w-full h-full">
            <img 
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
              src={post.imageUrl} 
              alt={post.title} 
              loading="lazy"
            />
         </Link>
         <Link 
            to={`/category/${getCategorySlug(post.category)}`} 
            className="absolute top-2 left-2 md:top-3 md:left-3 bg-red-600 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 md:px-3 md:py-1 rounded shadow-lg z-10 hover:bg-red-700 transition"
         >
           {post.category}
         </Link>
      </div>
      <div className="p-3 md:p-5 flex flex-col flex-grow">
        <div className="mb-2 md:mb-3 flex items-center text-[10px] md:text-[11px] font-medium text-gray-400 uppercase tracking-wide">
           <span className="mr-3 flex items-center"><i className="far fa-clock mr-1"></i> {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
           {post.author && <span className="hidden md:flex items-center"><i className="far fa-user mr-1"></i> {post.author}</span>}
        </div>
        <h2 className="text-sm md:text-xl font-bold text-gray-900 mb-2 md:mb-3 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 md:line-clamp-2">
          <Link to={`/post/${post.id}`}>{post.title}</Link>
        </h2>
        {/* Hide snippet on mobile to maintain 2-col grid alignment */}
        <p className="hidden md:block text-gray-600 text-sm mb-4 flex-grow line-clamp-2 md:line-clamp-3 leading-relaxed">{snippet}</p>
        
        <div className="mt-auto pt-3 md:pt-4 border-t border-gray-50 flex justify-between items-center">
           <Link to={`/post/${post.id}`} className="inline-flex items-center font-bold text-[10px] md:text-xs uppercase text-blue-600 hover:text-blue-800 transition-colors">
            Read <span className="hidden md:inline ml-1">Article</span> <i className="fas fa-arrow-right ml-1 text-[10px]"></i>
          </Link>
          <div className="flex space-x-2 text-gray-400 text-xs">
            <i className="fas fa-share-alt hover:text-blue-500 cursor-pointer transition"></i>
            <i className="hidden md:inline far fa-bookmark hover:text-red-500 cursor-pointer transition"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
