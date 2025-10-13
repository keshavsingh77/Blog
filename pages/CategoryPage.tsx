
import React from 'react';
import { useParams } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { PostStatus } from '../types';
import PostCard from '../components/PostCard';

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { posts } = useBlog();

  const categoryName = slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '';

  const categoryPosts = posts.filter(
    p => p.category === categoryName && p.status === PostStatus.PUBLISHED
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="border-b-2 border-blue-600 pb-4 mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">{categoryName}</h1>
        <p className="mt-2 text-lg text-gray-600">Browse the latest articles and updates in this category.</p>
      </div>
      
      {categoryPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <i className="fas fa-file-alt text-6xl text-gray-300 mb-4"></i>
            <h2 className="text-2xl font-semibold text-gray-700">No Posts Found</h2>
            <p className="text-gray-500 mt-2">There are currently no articles in the "{categoryName}" category.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
