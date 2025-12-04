
import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  // Logic: Use the first tag as the "Display Category" if available, otherwise fallback to the main Category
  const displayCategory = post.tags && post.tags.length > 0 ? post.tags[0] : post.category;
  const getCategorySlug = (category: string) => category.toLowerCase().replace(/\s+/g, '-');
  
  const plainTextContent = post.content.replace(/<[^>]+>/g, '');
  const snippet = plainTextContent.substring(0, 100) + '...';

  return (
    <article className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden border border-gray-100">
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
         <Link to={`/post/${post.id}`} className="block w-full h-full" aria-label={`Read ${post.title}`}>
            <img 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              src={post.imageUrl} 
              alt={post.title} 
              loading="lazy"
              width="640"
              height="360"
            />
         </Link>
         
         <Link 
            to={`/category/${getCategorySlug(displayCategory)}`} 
            className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-md hover:bg-blue-700 transition-colors"
         >
           {displayCategory}
         </Link>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2 flex items-center text-xs text-gray-400 font-medium uppercase tracking-wide">
           <span className="mr-3"><i className="far fa-clock mr-1"></i> {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        </div>
        
        <h2 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
          <Link to={`/post/${post.id}`}>
            {post.title}
          </Link>
        </h2>
        
        {/* Hide snippet on mobile for compact view, show on md+ */}
        <p className="hidden md:block text-gray-600 text-sm mb-4 flex-grow line-clamp-3 leading-relaxed">{snippet}</p>
        
        <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center">
           <Link to={`/post/${post.id}`} className="inline-flex items-center font-bold text-xs uppercase text-blue-600 hover:text-blue-800 transition-colors">
            Read More
          </Link>
          <div className="flex space-x-3 text-gray-400">
             <i className="far fa-bookmark hover:text-gray-600 cursor-pointer"></i>
             <i className="fas fa-share-alt hover:text-gray-600 cursor-pointer"></i>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
