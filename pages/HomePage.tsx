
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import PostCard from '../components/PostCard';
import SEO from '../components/SEO';
import Spinner from '../components/Spinner';

const HomePage: React.FC = () => {
  const { posts, isLoading } = useBlog();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const heroPosts = posts.slice(0, 3);
  const latestPosts = posts.slice(3);

  // Auto-scroll hero slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroPosts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroPosts.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <Spinner />
      </div>
    );
  }

  const getCategorySlug = (category: string) => category.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="bg-white min-h-screen font-sans">
      <SEO 
        title="Home" 
        description="Creative Mind - The best place for viral tech tips, gaming updates, and entertainment news."
      />

      {/* Hero Carousel Section */}
      {heroPosts.length > 0 && (
        <section className="relative w-full max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8 mb-10">
           <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[220px] sm:h-[350px] md:h-[450px]">
              {heroPosts.map((post, index) => (
                <div 
                  key={post.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                >
                  <Link to={`/post/${post.id}`}>
                      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                      <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full max-w-4xl">
                        <span className="inline-block bg-red-600 text-white text-[10px] md:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded shadow-md mb-3 hover:bg-red-700 transition">
                          {post.category}
                        </span>
                        <h2 className="text-xl md:text-4xl font-black text-white leading-tight mb-2 drop-shadow-lg line-clamp-2">
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
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {heroPosts.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-white scale-110 shadow-md' : 'bg-gray-500 bg-opacity-50 hover:bg-white'}`}
                  ></button>
                ))}
              </div>
           </div>
        </section>
      )}

      {/* Latest Posts Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-8 border-b-2 border-gray-100 pb-2">
           <h2 className="text-2xl font-black text-gray-900 border-l-4 border-blue-600 pl-3">
             Latest Posts
           </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
           {/* Include Hero posts in the grid for mobile feel if needed, or just latest */}
           {[...heroPosts, ...latestPosts].map(post => (
             <PostCard key={post.id} post={post} />
           ))}
        </div>
        
        {posts.length === 0 && (
           <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-lg mt-4">
             No posts available at the moment.
           </div>
        )}

        <div className="mt-12 text-center mb-12">
            <button className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-full transition shadow-sm uppercase text-sm tracking-wide">
                Load More
            </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
