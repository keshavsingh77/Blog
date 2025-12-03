import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import PostCard from '../components/PostCard';
import SEO from '../components/SEO';
import Spinner from '../components/Spinner';

const HomePage: React.FC = () => {
  const { posts, isLoading } = useBlog();
  const [currentSlide, setCurrentSlide] = useState(0);

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
        <section className="relative w-full max-w-7xl mx-auto mt-4 px-4 sm:px-6 lg:px-8">
           <div className="relative rounded-2xl overflow-hidden shadow-lg h-[250px] md:h-[400px]">
              {heroPosts.map((post, index) => (
                <div 
                  key={post.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                >
                  <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                  <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
                     <span className="inline-block bg-blue-600 text-white text-[10px] md:text-xs font-bold uppercase tracking-wider px-2 py-1 rounded mb-2">
                       {post.category}
                     </span>
                     <h2 className="text-xl md:text-3xl font-bold text-white leading-tight mb-2 drop-shadow-md">
                       <Link to={`/post/${post.id}`}>{post.title}</Link>
                     </h2>
                  </div>
                </div>
              ))}
              
              {/* Slider Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {heroPosts.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${idx === currentSlide ? 'bg-blue-500' : 'bg-gray-400 bg-opacity-50'}`}
                  ></button>
                ))}
              </div>
           </div>
        </section>
      )}

      {/* Latest Posts Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
           <h2 className="text-xl font-black text-gray-800">
             Latest Posts
           </h2>
           <div className="h-1 bg-gray-100 flex-grow ml-4 rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {/* Include Hero posts in the grid for mobile feel if needed, or just latest */}
           {[...heroPosts, ...latestPosts].map(post => (
             <PostCard key={post.id} post={post} />
           ))}
        </div>
        
        {posts.length === 0 && (
           <div className="text-center py-10 text-gray-500">
             No posts available at the moment.
           </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
