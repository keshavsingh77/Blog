
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import PostCard from '../components/PostCard';
import SEO from '../components/SEO';
import Spinner from '../components/Spinner';

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
    // Optional: scroll to top of latest posts section if needed
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
    }, 5000);
    return () => clearInterval(timer);
  }, [heroPosts.length]);

  const getCategorySlug = (tag: string) => tag.toLowerCase().replace(/\s+/g, '-');

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans">
      <SEO 
        title="Home" 
        description="Creative Mind - The best place for viral tech tips, gaming updates, and entertainment news."
      />

      {/* Discover More - Horizontal Scroll Bar */}
      <div className="bg-white pt-4 pb-2 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center overflow-x-auto no-scrollbar space-x-3 py-1">
             <span className="text-xs font-bold text-gray-400 uppercase whitespace-nowrap mr-2">Discover more</span>
             {allTags.map(tag => (
               <Link
                 key={tag}
                 to={`/category/${getCategorySlug(tag)}`}
                 className="flex-shrink-0 px-4 py-1.5 rounded-full border border-blue-100 bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-600 hover:text-white transition whitespace-nowrap flex items-center"
               >
                 <i className="fas fa-bolt mr-1.5 text-[10px]"></i> {tag}
               </Link>
             ))}
             {/* Fallback tags if empty */}
             {allTags.length === 0 && ['YouTube Shorts', 'Creative Mind', 'Video', 'Viral', 'Tech', 'Money'].map(tag => (
                <Link
                 key={tag}
                 to={`/category/${getCategorySlug(tag)}`}
                 className="flex-shrink-0 px-4 py-1.5 rounded-full border border-blue-100 bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-600 hover:text-white transition whitespace-nowrap flex items-center"
               >
                 <i className="fas fa-bolt mr-1.5 text-[10px]"></i> {tag}
               </Link>
             ))}
          </div>
        </div>
      </div>

      {/* Hero Carousel Section - Single Element */}
      {heroPosts.length > 0 && (
        <section className="relative w-full max-w-7xl mx-auto mt-4 md:mt-6 px-4 sm:px-6 lg:px-8 mb-8">
           <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-xl h-[200px] sm:h-[350px] md:h-[450px]">
              {heroPosts.map((post, index) => (
                <div 
                  key={post.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                >
                  <Link to={`/post/${post.id}`}>
                      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                      <div className="absolute bottom-0 left-0 p-4 md:p-12 w-full max-w-4xl">
                        <span className="inline-block bg-red-600 text-white text-[10px] md:text-xs font-bold uppercase tracking-wider px-2 py-1 md:px-3 rounded shadow-md mb-2 md:mb-3 hover:bg-red-700 transition">
                          {post.category}
                        </span>
                        <h2 className="text-lg md:text-4xl font-black text-white leading-tight mb-1 md:mb-2 drop-shadow-lg line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="hidden md:block text-gray-200 text-sm line-clamp-1 opacity-90">
                            Click to read the full story and explore more...
                        </p>
                      </div>
                  </Link>
                </div>
              ))}
              
              {/* Slider Dots */}
              <div className="absolute bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {heroPosts.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-white scale-110 shadow-md' : 'bg-gray-500 bg-opacity-50 hover:bg-white'}`}
                  ></button>
                ))}
              </div>
           </div>
        </section>
      )}

      {/* Latest Posts Section - Double Element (2 Col Grid) */}
      <div id="latest-posts" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-6 border-b-2 border-gray-100 pb-2">
           <h2 className="text-xl md:text-2xl font-black text-gray-900 border-l-4 border-blue-600 pl-3">
             Latest Posts
           </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
           {/* Displaying current page of posts */}
           {(currentPage === 1 ? [...heroPosts, ...currentLatestPosts] : currentLatestPosts).map(post => (
             <PostCard key={post.id} post={post} />
           ))}
        </div>
        
        {posts.length === 0 && (
           <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-lg mt-4">
             No posts available at the moment.
           </div>
        )}

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
      </div>
    </div>
  );
};

export default HomePage;
