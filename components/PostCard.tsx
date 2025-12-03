
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
    <div className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col h-full overflow-hidden border border-gray-100 group">
      <div className="relative overflow-hidden h-48">
         <Link to={`/post/${post.id}`}>
            <img className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" src={post.imageUrl} alt={post.title} />
         </Link>
         <Link to={`/category/${getCategorySlug(post.category)}`} className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold uppercase tracking-wide px-3 py-1 m-2 rounded-sm shadow-md">
           {post.category}
         </Link>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-2 flex items-center text-xs text-gray-400">
           <span className="mr-2"><i className="far fa-clock"></i> {new Date(post.createdAt).toLocaleDateString()}</span>
           {post.author && <span><i className="far fa-user"></i> {post.author}</span>}
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-red-600 transition-colors">
          <Link to={`/post/${post.id}`}>{post.title}</Link>
        </h2>
        <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">{snippet}</p>
        <div className="mt-auto">
           <Link to={`/post/${post.id}`} className="inline-flex items-center font-bold text-xs uppercase text-red-600 hover:text-red-800 transition-colors">
            Read More <i className="fas fa-chevron-right ml-1 text-[10px]"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
