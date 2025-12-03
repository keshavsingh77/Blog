
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
        <Link to="/" className="text-red-600 hover:underline mt-4 inline-block">Go back to Home</Link>
      </div>
    );
  }

  const getCategorySlug = (category: string) => category.toLowerCase().replace(/\s+/g, '-');
  
  const plainTextContent = post.content.replace(/<[^>]+>/g, '');
  const descriptionSnippet = plainTextContent.substring(0, 160).trim() + (plainTextContent.length > 160 ? '...' : '');

  return (
    <div className="bg-white min-h-screen">
      <SEO title={post.title} description={descriptionSnippet} />
      
      {/* Article Header */}
      <div className="w-full h-[50vh] relative overflow-hidden">
         <img className="w-full h-full object-cover" src={post.imageUrl} alt={post.title} />
         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
         <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white max-w-7xl mx-auto">
            <Link to={`/category/${getCategorySlug(post.category)}`} className="inline-block bg-red-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 mb-4 rounded-sm hover:bg-red-700 transition">
              {post.category}
            </Link>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4 shadow-sm">{post.title}</h1>
            <div className="flex items-center text-sm md:text-base text-gray-300 space-x-4">
              <span className="font-bold text-white"><i className="fas fa-user-circle mr-2"></i>{post.author || 'iPopcorn Editor'}</span>
              <span><i className="far fa-clock mr-2"></i>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8">
            <AdsensePlaceholder className="w-full h-24 mb-8" />

            <article
              className="prose prose-lg prose-red max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-12 p-6 bg-gray-50 rounded-lg border-l-4 border-red-600">
              <h3 className="font-bold text-gray-900 text-lg mb-2">Share this Article</h3>
              <div className="flex space-x-3">
                 <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700 transition"><i className="fab fa-facebook-f mr-2"></i>Share</button>
                 <button className="bg-blue-400 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-500 transition"><i className="fab fa-twitter mr-2"></i>Tweet</button>
                 <button className="bg-green-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-600 transition"><i className="fab fa-whatsapp mr-2"></i>Share</button>
              </div>
            </div>

            <AdsensePlaceholder className="w-full h-60 mt-12" />

             <div className="mt-12 border-t pt-8 flex justify-between">
                <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-red-600 font-bold flex items-center transition">
                  <i className="fas fa-arrow-left mr-2"></i> Back to News
                </button>
             </div>
          </div>

          <aside className="lg:col-span-4 space-y-8">
             <div className="bg-gray-100 p-6 rounded-lg">
                <h4 className="font-bold text-gray-900 uppercase mb-4">About the Author</h4>
                <div className="flex items-center space-x-4">
                   <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xl">
                     <i className="fas fa-user"></i>
                   </div>
                   <div>
                     <p className="font-bold text-gray-900">{post.author || 'iPopcorn Editor'}</p>
                     <p className="text-xs text-gray-500">Tech & Culture Journalist</p>
                   </div>
                </div>
             </div>
             <AdsensePlaceholder className="w-full h-[600px]" />
          </aside>

        </div>
      </div>
    </div>
  );
};

export default PostPage;
