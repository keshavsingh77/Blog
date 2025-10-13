
import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const getCategorySlug = (category: string) => category.toLowerCase().replace(/\s+/g, '-');
  
  const plainTextContent = post.content.replace(/<[^>]+>/g, '');
  const snippet = plainTextContent.substring(0, 120) + '...';

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <Link to={`/post/${post.id}`}>
        <img className="w-full h-48 object-cover" src={post.imageUrl} alt={post.title} />
      </Link>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Link to={`/category/${getCategorySlug(post.category)}`} className="text-sm font-semibold text-blue-600 uppercase hover:underline">{post.category}</Link>
          <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2 h-16 overflow-hidden">
          <Link to={`/post/${post.id}`} className="hover:text-blue-700">{post.title}</Link>
        </h2>
        <p className="text-gray-600 text-sm mb-4 h-12 overflow-hidden">{snippet}</p>
        <Link to={`/post/${post.id}`} className="font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200">
          Read More <i className="fas fa-arrow-right ml-1"></i>
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
