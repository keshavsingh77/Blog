
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { PostStatus } from '../types';
import PostCard from '../components/PostCard';
import SEO from '../components/SEO';
import GoogleAd from '../components/GoogleAd';
import { SkeletonCard } from '../components/SkeletonLoaders';

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { posts, isLoading } = useBlog();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentPage(1); 
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
           <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
           </div>
      </div>
    );
  }

  const rawSlug = slug || '';
  const readableName = rawSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const categoryPosts = posts.filter(
    p => {
        if (p.status !== PostStatus.PUBLISHED) return false;
        const categoryMatch = p.category.toLowerCase() === readableName.toLowerCase();
        const tagMatch = p.tags && p.tags.some(tag => tag.toLowerCase() === readableName.toLowerCase());
        return categoryMatch || tagMatch;
    }
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = categoryPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(categoryPosts.length / postsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen pt-24">
      <SEO title={readableName} description={`Latest news regarding ${readableName}`} />
      
      <div className="border-b border-gray-200 dark:border-gray-800 pb-6 mb-8">
           <span className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-1 block">Category</span>
           <h1 className="text-4xl font-black text-gray-900 dark:text-white">{readableName}</h1>
      </div>

      {/* Top Banner for Categories - Managed Size */}
      <GoogleAd slot="1641433819" format="horizontal" height="120px" className="mb-8" />
      
      {currentPosts.length > 0 ? (
        <>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {currentPosts.map((post, idx) => (
                    <React.Fragment key={post.id}>
                        <PostCard post={post} />
                        {idx === 2 && (
                             <div className="col-span-2 md:col-span-1">
                                <GoogleAd 
                                  slot="1909584638" 
                                  format="fluid" 
                                  layoutKey="-6t+ed+2i-1n-4w" 
                                  className="h-full m-0" 
                                  style={{ minHeight: '100%' }}
                                />
                             </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center space-x-2">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-bold">Prev</button>
                    <span className="text-sm font-medium text-gray-500">{currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold">Next</button>
                </div>
            )}
        </>
      ) : (
        <div className="text-center py-24 bg-gray-50 dark:bg-gray-900 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">No Posts Found</h2>
            <Link to="/" className="text-blue-600 font-bold hover:underline">Return to Home</Link>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
