
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import AdsensePlaceholder from '../components/AdsensePlaceholder';
import SEO from '../components/SEO';

const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPostById } = useBlog();
  const navigate = useNavigate();
  const post = id ? getPostById(id) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div className="text-center py-20">
        <SEO title="Post Not Found" description="The requested post could not be found." />
        <h2 className="text-2xl font-bold">Post not found</h2>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Go back to Home</Link>
      </div>
    );
  }

  const getCategorySlug = (category: string) => category.toLowerCase().replace(/\s+/g, '-');
  
  // Extract a plain text snippet for the meta description
  const plainTextContent = post.content.replace(/<[^>]+>/g, '');
  const descriptionSnippet = plainTextContent.substring(0, 160).trim() + (plainTextContent.length > 160 ? '...' : '');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO title={post.title} description={descriptionSnippet} />
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <img className="w-full h-96 object-cover" src={post.imageUrl} alt={post.title} />
        <div className="p-6 md:p-10">
          <div className="mb-6">
            <Link to={`/category/${getCategorySlug(post.category)}`} className="text-sm font-semibold text-blue-600 uppercase hover:underline">{post.category}</Link>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2">{post.title}</h1>
            <p className="text-gray-500 mt-3">Published on {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <AdsensePlaceholder className="w-full h-24 my-8" />

          <article
            className="prose prose-lg max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <AdsensePlaceholder className="w-full h-60 mt-12" />

          <div className="mt-12 border-t pt-6">
            <button onClick={() => navigate(-1)} className="text-blue-600 hover:text-blue-800 font-semibold">
              <i className="fas fa-arrow-left mr-2"></i> Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
