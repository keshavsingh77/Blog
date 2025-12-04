
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import PostCard from '../components/PostCard';
import SEO from '../components/SEO';
import GoogleAd from '../components/GoogleAd'; // Import GoogleAd
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
      <div className="bg-gray-50 min-h-screen font-sans pt-16">
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

  // Helper to inject ads into the grid
  const renderPostGrid = (posts: typeof currentLatestPosts) => {
    return posts.map((post, index) => (
      <React.Fragment key={post.id}>
        <PostCard post={post} />
        {/* Inject Native In-Feed Ad after the 3rd item */}
        {index === 2 && (
           <div className="col-span-2 md:col-span-3 my-4 min-h-[250px] bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Native In-Feed Ad Unit - Slot: 1909584638 */}
              <div className="text-[10px] text-gray-300 text-center uppercase tracking-widest pt-2">Sponsored</div>
              <GoogleAd 
                slot="1909584638" 
                format="fluid" 
                layoutKey="-6t+ed+2i-1n-4w" 
                className="w-full"
              />
           </div>
        )}
      </React.Fragment>
    ));
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen font-sans pt-16">
      <SEO 
        title="Home" 
        description="Creative Mind - The best place for viral tech tips, gaming updates, and entertainment news."
      />

      {/* Discover More - Horizontal Scroll Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center overflow-x-auto no-scrollbar space-x-3 py-3" role="navigation" aria-label="Tag navigation">
             <span className="text-[10px] md:text-xs font-black text-blue-600 uppercase whitespace-nowrap mr-2 tracking-widest flex items-center">
                <i className="fas fa-bolt mr-2 text-yellow-500"></i> Creative Mind
             </span>
             {allTags.map(tag => (
               <Link
                 key={tag}
                 to={`/category/${getCategorySlug(tag)}`}
                 className="flex-shrink-0 px-4 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-gray-700 text-[11px] font-bold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all whitespace-nowrap flex items-center"
               >
                 #{tag}
               </Link>
             ))}
             {/* Fallback tags if empty */}
             {allTags.length === 0 && ['Creative Mind', 'YouTube Shorts', 'Viral Hacks', 'Tech', 'Money', 'AI Tools'].map(tag => (
                <Link
                 key={tag}
                 to={`/category/${getCategorySlug(tag)}`}
                 className="flex-shrink-0 px-4 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-gray-700 text-[11px] font-bold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all whitespace-nowrap flex items-center"
               >
                 #{tag}
               </Link>
             ))}
          </div>
        </div>
      </div>

      {/* Hero Carousel Section */}
      {heroPosts.length > 0 && (
        <section className="relative w-full max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8 mb-10" aria-label="Featured Posts">
           <div className="relative rounded-2xl overflow-hidden shadow-lg h-[220px] sm:h-[350px] md:h-[450px] group">
              {heroPosts.map((post, index) => (
                <div 
                  key={post.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                  <Link to={`/post/${post.id}`} className="block w-full h-full relative">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-[4s] hover:scale-105" 
                        loading={index === 0 ? "eager" : "lazy"}
                        // @ts-ignore
                        fetchpriority={index === 0 ? "high" : undefined}
                        width="1280"
                        height="720"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80"></div>

                      <div className="absolute bottom-0 left-0 p-5 md:p-10 w-full max-w-4xl">
                        <div className="flex items-center space-x-2 mb-2 md:mb-3">
                            <span className="inline-block bg-blue-600 text-white text-[10px] md:text-xs font-bold uppercase tracking-wider px-2 py-1 rounded">
                            {post.category}
                            </span>
                        </div>
                        <h2 className="text-lg md:text-3xl lg:text-4xl font-black text-white leading-tight mb-2 md:mb-3 drop-shadow-sm line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="hidden md:block text-gray-200 text-sm md:text-base max-w-xl line-clamp-2 font-medium opacity-90">
                           {post.content.replace(/<[^>]+>/g, '').substring(0, 120)}...
                        </p>
                      </div>
                  </Link>
                </div>
              ))}
              
              {/* Slider Dots */}
              <div className="absolute bottom-3 right-4 md:bottom-8 md:right-8 flex space-x-2 z-20">
                {heroPosts.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-6 bg-blue-500' : 'w-1.5 bg-white/50 hover:bg-white'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  ></button>
                ))}
              </div>
           </div>
        </section>
      )}

      {/* Latest Posts Section */}
      <div id="latest-posts" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
           <div className="flex items-center">
               <div className="w-1 h-6 bg-blue-600 rounded mr-3"></div>
               <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                    Latest Stories
               </h2>
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
           {currentPage === 1 
              ? renderPostGrid([...heroPosts, ...currentLatestPosts]) 
              : renderPostGrid(currentLatestPosts)
           }
        </div>
        
        {posts.length === 0 && (
           <div className="text-center py-20 text-gray-500 bg-white rounded-xl shadow-sm mt-4">
             No posts available at the moment.
           </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
            <div className="mt-12 mb-10 flex justify-center items-center space-x-2" role="navigation" aria-label="Pagination">
                <button 
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border border-gray-200 hover:bg-blue-50 hover:text-blue-600'}`}
                    aria-label="Previous Page"
                >
                    <i className="fas fa-arrow-left mr-2"></i> Prev
                </button>
                
                <div className="px-4 text-sm font-bold text-gray-600">
                    {currentPage} <span className="text-gray-300 mx-1">/</span> {totalPages}
                </div>

                <button 
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white shadow-md hover:bg-blue-700'}`}
                     aria-label="Next Page"
                >
                    Next <i className="fas fa-arrow-right ml-2"></i>
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
