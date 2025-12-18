import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { PostStatus } from '../types';
import PostCard from '../components/PostCard';
import SEO from '../components/SEO';
import { SkeletonCard } from '../components/SkeletonLoaders';

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { posts, isLoading } = useBlog();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentPage(1); // Reset to page 1 when category changes
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen font-sans">
           {/* Header Skeleton */}
           <div className="mb-8 animate-pulse">
              <div className="h-4 bg-gray-200 w-32 mb-2 rounded"></div>
              <div className="h-10 bg-gray-200 w-64 rounded"></div>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
           </div>
      </div>
    );
  }

  const rawSlug = slug || '';
  // Convert slug to readable name (e.g., 'tech-tips' -> 'Tech Tips')
  const readableName = rawSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const categoryPosts = posts.filter(
    p => {
        if (p.status !== PostStatus.PUBLISHED) return false;
        
        // Match standard category
        const categoryMatch = p.category.toLowerCase() === readableName.toLowerCase();
        
        // Match against tags (normalized)
        const tagMatch = p.tags && p.tags.some(tag => tag.toLowerCase() === readableName.toLowerCase());
        
        return categoryMatch || tagMatch;
    }
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Pagination Logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = categoryPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(categoryPosts.length / postsPerPage);

  const nextPage = () => {
     if (currentPage < totalPages) {
         setCurrentPage(prev => prev + 1);
         window.scrollTo({ top: 0, behavior: 'smooth' });
     }
  };

  const prevPage = () => {
      if (currentPage > 1) {
          setCurrentPage(prev => prev - 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen font-sans">
      <SEO 
        title={readableName || "Category"} 
        description={`Explore the latest news, updates, and in-depth articles regarding ${readableName}. Stay informed with Creative Mind.`} 
      />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-6 mb-8">
        <div>
           <span className="text-red-600 font-bold uppercase tracking-widest text-xs mb-1 block">Browsing Category</span>
           <h1 className="text-4xl font-black text-gray-900">{readableName}</h1>
        </div>
        <div className="mt-4 md:mt-0 text-gray-500 text-sm">
            Showing {categoryPosts.length} articles
        </div>
      </div>
      
      {currentPosts.length > 0 ? (
        <>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {currentPosts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center space-x-2">
                    <button 
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-800 border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'}`}
                    >
                        <i className="fas fa-chevron-left mr-1"></i> Previous
                    </button>
                    
                    <span className="text-sm font-medium text-gray-500 px-2">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button 
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white shadow-md hover:bg-blue-700'}`}
                    >
                        Next <i className="fas fa-chevron-right ml-1"></i>
                    </button>
                </div>
            )}
        </>
      ) : (
        <div className="text-center py-24 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <div className="inline-block p-4 rounded-full bg-white shadow-sm mb-4">
               <i className="fas fa-folder-open text-4xl text-blue-300"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-700">No Posts Found</h2>
            <p className="text-gray-500 mt-2 mb-6">There are currently no articles tagged with "{readableName}".</p>
            <Link to="/" className="text-blue-600 font-bold hover:underline">Return to Home</Link>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;