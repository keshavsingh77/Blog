
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import PostCard from '../components/PostCard';
import SEO from '../components/SEO';
import { SkeletonCard, SkeletonHero } from '../components/SkeletonLoaders';

const HomePage: React.FC = () => {
  const { posts, isLoading } = useBlog();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6; 

  // Extract tags for "Discover more"
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags))).sort(() => 0.5 - Math.random());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Separate Hero Posts (Top 3) from the rest
  const heroPosts = posts.slice(0, 3);
  const remainingPosts = posts.slice(3);

  // Pagination Logic for Remaining Posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentLatestPosts = remainingPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(remainingPosts.length / postsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const latestSection = document.getElementById('latest-posts');
    if (latestSection) {
        latestSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) paginate(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) paginate(currentPage - 1);
  };


  // Auto-scroll hero slider
  useEffect(() => {
    if (heroPosts.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroPosts.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroPosts.length]);

  const getCategorySlug = (tag: string) => tag.toLowerCase().replace(/\s+/g, '-');

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans pt-20">
         <div className="max-w-7xl mx-auto px-4 pt-4">
             {/* Tag bar skeleton */}
             <div className="flex space-x-3 overflow-hidden py-2 mb-4 animate-pulse">
                 {[1,2,3,4,5].map(i => <div key={i} className="h-8 w-24 bg-gray-200 rounded-full"></div>)}
             </div>
         </div>
         <SkeletonHero />
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="h-8 w-48 bg-gray-200 rounded mb-8 animate-pulse"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
               {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
            </div>
         </div>
      </div>
    );
  }

  // Helper to inject ads into the grid (if needed)
  const renderPostGrid = (posts: typeof currentLatestPosts) => {
    return posts.map((post) => (
      <PostCard key={post.id} post={post} />
    ));
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen font-sans pt-20">
      <SEO 
        title="Home" 
        description="Creative Mind - The best place for viral tech tips, gaming updates, and entertainment news."
      />

      {/* Discover More - Horizontal Scroll Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-16 md:top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center overflow-x-auto no-scrollbar space-x-3 py-3.5" role="navigation" aria-label="Tag navigation">
             <span className="text-[10px] md:text-xs font-black text-blue-600 uppercase whitespace-nowrap mr-2 tracking-widest flex items-center">
                <i className="fas fa-sparkles mr-2"></i> Trending
             </span>
             {allTags.map(tag => (
               <Link
                 key={tag}
                 to={`/category/${getCategorySlug(tag)}`}
                 className="flex-shrink-0 px-4 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 text-[11px] font-bold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all whitespace-nowrap flex items-center shadow-sm hover:shadow-md active:scale-95"
               >
                 #{tag}
               </Link>
             ))}
             {/* Fallback tags if empty */}
             {allTags.length === 0 && ['Creative Mind', 'YouTube Shorts', 'Viral Hacks', 'Tech', 'Money', 'AI Tools'].map(tag => (
                <Link
                 key={tag}
                 to={`/category/${getCategorySlug(tag)}`}
                 className="flex-shrink-0 px-4 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 text-[11px] font-bold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all whitespace-nowrap flex items-center shadow-sm hover:shadow-md"
               >
                 #{tag}
               </Link>
             ))}
          </div>
        </div>
      </div>

      {/* Hero Carousel Section */}
      {heroPosts.length > 0 && (
        <section className="relative w-full max-w-7xl mx-auto mt-6 md:mt-8 px-4 sm:px-6 lg:px-8 mb-12" aria-label="Featured Posts">
           <div className="relative rounded-[2rem] overflow-hidden shadow-2xl h-[240px] sm:h-[400px] md:h-[520px] group transform transition-transform">
              {heroPosts.map((post, index) => (
                <div 
                  key={post.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  aria-hidden={index !== currentSlide}
                >
                  <Link to={`/post/${post.id}`} tabIndex={index === currentSlide ? 0 : -1} className="block w-full h-full relative">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[3s]" 
                        loading={index === 0 ? "eager" : "lazy"}
                        // @ts-ignore
                        fetchpriority={index === 0 ? "high" : undefined}
                      />
                      {/* Advanced Gradient Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-90"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-transparent to-transparent opacity-60"></div>

                      <div className="absolute bottom-0 left-0 p-6 md:p-12 lg:p-16 w-full max-w-5xl">
                        <div className="flex items-center space-x-3 mb-3 md:mb-5 animate-fade-in-up">
                            <span className="inline-block bg-blue-600 text-white text-[10px] md:text-xs font-black uppercase tracking-widest px-3 py-1 rounded-lg shadow-lg">
                            {post.category}
                            </span>
                            <span className="text-gray-300 text-[10px] md:text-xs font-bold uppercase tracking-wide border-l border-gray-500 pl-3">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <h2 className="text-xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-3 md:mb-5 drop-shadow-xl line-clamp-2 md:line-clamp-2 animate-fade-in-up delay-100 tracking-tight">
                          {post.title}
                        </h2>
                        <p className="hidden md:block text-gray-200 text-lg max-w-2xl line-clamp-2 animate-fade-in-up delay-200 font-medium opacity-90">
                            Click to read the full story about {post.title}...
                        </p>
                      </div>
                  </Link>
                </div>
              ))}
              
              {/* Slider Dots */}
              <div className="absolute bottom-5 right-6 md:bottom-10 md:right-12 flex space-x-2.5 z-20">
                {heroPosts.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm ${idx === currentSlide ? 'w-8 bg-blue-500' : 'w-2 bg-white/40 hover:bg-white'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                    aria-current={idx === currentSlide}
                  ></button>
                ))}
              </div>
           </div>
        </section>
      )}

      {/* Latest Posts Section */}
      <div id="latest-posts" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex items-center justify-between mb-8 md:mb-10">
           <div className="flex items-center">
               <div className="w-1.5 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full mr-4"></div>
               <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                    Latest Stories
               </h2>
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
           {currentPage === 1 
              ? renderPostGrid([...heroPosts, ...currentLatestPosts]) 
              : renderPostGrid(currentLatestPosts)
           }
        </div>
        
        {posts.length === 0 && (
           <div className="text-center py-20 text-gray-500 bg-white rounded-2xl shadow-sm mt-4 border border-gray-100">
             No posts available at the moment.
           </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
            <div className="mt-16 mb-12 flex justify-center items-center space-x-2" role="navigation" aria-label="Pagination">
                <button 
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`px-6 py-3 rounded-full font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border border-gray-200 hover:bg-white hover:text-blue-600 hover:shadow-lg transform hover:-translate-y-0.5'}`}
                    aria-label="Previous Page"
                >
                    <i className="fas fa-arrow-left mr-2" aria-hidden="true"></i> Prev
                </button>
                
                <div className="px-5 text-sm font-bold text-gray-500">
                    <span className="text-blue-600 text-lg">{currentPage}</span> <span className="text-gray-300 mx-1">/</span> {totalPages}
                </div>

                <button 
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`px-6 py-3 rounded-full font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-0.5'}`}
                    aria-label="Next Page"
                >
                    Next <i className="fas fa-arrow-right ml-2" aria-hidden="true"></i>
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
