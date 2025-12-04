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

  // OPTIMIZATION: Request smaller images for the grid view to save bandwidth and improve LCP/Performance
  // If using Picsum or common CDN patterns, rewrite the URL.
  let thumbnailUrl = post.imageUrl;
  
  if (thumbnailUrl.includes('picsum.photos')) {
    // Replace large dimensions with smaller ones for the card (e.g. 400x225 for 16:9)
    thumbnailUrl = thumbnailUrl.replace(/\/seed\/([^/]+)\/\d+\/\d+/, '/seed/$1/400/225');
  } else if (thumbnailUrl.includes('googleusercontent.com') || thumbnailUrl.includes('blogspot.com')) {
    // Try to request a smaller size for Blogger images (w400)
    thumbnailUrl = thumbnailUrl.replace(/\/s\d+(-c)?\//, '/w400-h225-p-k-no-nu/');
    thumbnailUrl = thumbnailUrl.replace(/\/w\d+-h\d+(-p-k-no-nu)?\//, '/w400-h225-p-k-no-nu/');
  }

  return (
    <article 
      className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden border border-gray-100"
      // content-visibility: auto skips rendering work for off-screen cards
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 400px' }} 
    >
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
         <Link to={`/post/${post.id}`} className="block w-full h-full" aria-label={`Read ${post.title}`}>
            <img 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              src={thumbnailUrl} 
              alt={post.title} 
              loading="lazy"
              decoding="async"
              width="400"
              height="225"
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
        <div className="mb-2 flex items-center text-xs text-gray-500 font-medium uppercase tracking-wide">
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
          <div className="flex space-x-3 text-gray-400 hover:text-gray-600">
             <i className="far fa-bookmark cursor-pointer hover:text-blue-600 transition-colors" aria-label="Bookmark"></i>
             <i className="fas fa-share-alt cursor-pointer hover:text-blue-600 transition-colors" aria-label="Share"></i>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;