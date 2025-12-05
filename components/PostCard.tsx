
import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const displayCategory = post.tags && post.tags.length > 0 ? post.tags[0] : post.category;
  const getCategorySlug = (category: string) => category.toLowerCase().replace(/\s+/g, '-');
  
  // PERFORMANCE: URL Rewriting to request 400px wide thumbnails instead of full size
  let thumbnailUrl = post.imageUrl;
  
  if (thumbnailUrl.includes('picsum.photos')) {
    // Picsum dynamic resizing: /seed/ID/400/225
    thumbnailUrl = thumbnailUrl.replace(/\/seed\/([^/]+)\/\d+\/\d+/, '/seed/$1/400/225');
  } else if (thumbnailUrl.includes('googleusercontent.com') || thumbnailUrl.includes('blogspot.com')) {
    // Blogger dynamic resizing: Replace /sXXXX/ with /w400-h225-p-k-no-nu/
    thumbnailUrl = thumbnailUrl.replace(/\/s\d+(-c)?\//, '/w400-h225-p-k-no-nu/');
    thumbnailUrl = thumbnailUrl.replace(/\/w\d+-h\d+(-p-k-no-nu)?\//, '/w400-h225-p-k-no-nu/');
  }

  return (
    <article 
      className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden border border-gray-100"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 300px' }} 
    >
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

      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2 flex items-center text-xs text-gray-500 font-medium uppercase tracking-wide">
           <span className="mr-3"><i className="far fa-clock mr-1" aria-hidden="true"></i> {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        </div>
        
        <h2 className="text-base md:text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
          <Link to={`/post/${post.id}`}>
            {post.title}
          </Link>
        </h2>
        
        <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center">
           <Link to={`/post/${post.id}`} className="inline-flex items-center font-bold text-xs uppercase text-blue-600 hover:text-blue-800 transition-colors">
            Read More
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
