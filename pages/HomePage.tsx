
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import PostCard from '../components/PostCard';
import SEO from '../components/SEO';
import GoogleAd from '../components/GoogleAd';
import { SkeletonCard, SkeletonHero } from '../components/SkeletonLoaders';

const getOptimizedHeroImage = (url: string, width: number) => {
  if (!url) return '';
  if (url.includes('picsum.photos')) {
    return url.replace(/\/seed\/([^/]+)\/\d+\/\d+/, `/seed/$1/${width}/${Math.round(width * 9/16)}`);
  }
  if (url.includes('googleusercontent.com') || url.includes('blogspot.com')) {
    return url.replace(/\/s\d+(-c)?\//, `/w${width}-h${Math.round(width * 9/16)}-p-k-no-nu/`)
              .replace(/\/w\d+-h\d+(-p-k-no-nu)?\//, `/w${width}-h${Math.round(width * 9/16)}-p-k-no-nu/`);
  }
  return url;
};

const HomePage: React.FC = () => {
  const { posts, isLoading } = useBlog();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6; 

  const allTags = Array.from(new Set(posts.flatMap(p => p.tags))).sort(() => 0.5 - Math.random());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const heroPosts = posts.slice(0, 3);
  const remainingPosts = posts.slice(3);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentLatestPosts = remainingPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(remainingPosts.length / postsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    document.getElementById('latest-posts')?.scrollIntoView({ behavior: 'smooth' });
  };

  const nextPage = () => currentPage < totalPages && paginate(currentPage + 1);
  const prevPage = () => currentPage > 1 && paginate(currentPage - 1);

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
      <div className="bg-gray-50 dark:bg-gray-950 min-h-screen font-sans pt-16">
         <div className="max-w-7xl mx-auto px-4 pt-4">
             <div className="flex space-x-3 overflow-hidden py-2 mb-4 animate-pulse">
                 {[1,2,3,4,5].map(i => <div key={i} className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-full"></div>)}
             </div>
         </div>
         <SkeletonHero />
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
               {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
            </div>
         </div>
      </div>
    );
  }

  const renderPostGrid = (postsToRender: typeof currentLatestPosts) => {
    return postsToRender.map((post, index) => (
      <React.Fragment key={post.id}>
        <PostCard post={post} />
        {/* Inject Ad after 2nd and 5th items for maximum engagement */}
        {(index === 1 || index === 4) && (
           <div className="col-span-2 md:col-span-1">
              <GoogleAd slot="1909584638" format="fluid" layoutKey="-6t+ed+2i-1n-4w" className="h-full m-0" />
           </div>
        )}
      </React.Fragment>
    ));
  };

  return (
    <div className="bg-[#FAFAFA] dark:bg-gray-950 min-h-screen font-sans pt-16 transition-colors duration-300">
      <SEO title="Home" description="Creative Mind - The best place for viral tech tips, gaming updates, and entertainment news." />

      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center overflow-x-auto no-scrollbar space-x-3 py-3">
             <span className="text-[10px] md:text-xs font-black text-blue-600 dark:text-blue-400 uppercase whitespace-nowrap mr-2 tracking-widest flex items-center">
                <i className="fas fa-bolt mr-2 text-yellow-500"></i> Trending
             </span>
             {allTags.slice(0, 15).map(tag => (
               <Link key={tag} to={`/category/${getCategorySlug(tag)}`} className="flex-shrink-0 px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[11px] font-bold hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 hover:border-blue-600 transition-all whitespace-nowrap flex items-center">
                 #{tag}
               </Link>
             ))}
          </div>
        </div>
      </div>

      {heroPosts.length > 0 && (
        <section className="relative w-full max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8 mb-6">
           <div className="relative rounded-2xl overflow-hidden shadow-lg w-full aspect-video md:aspect-[21/9] bg-gray-200 dark:bg-gray-800 group">
              {heroPosts.map((post, index) => (
                    <div 
                    key={post.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                    <Link to={`/post/${post.id}`} className="block w-full h-full relative">
                        <img 
                            src={getOptimizedHeroImage(post.imageUrl, 1280)} 
                            alt={post.title} 
                            className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80"></div>
                        <div className="absolute bottom-0 left-0 p-5 md:p-10 w-full max-w-4xl">
                            <span className="inline-block bg-blue-600 text-white text-[10px] md:text-xs font-bold uppercase tracking-wider px-2 py-1 rounded mb-2">
                                {post.category}
                            </span>
                            <h2 className="text-lg md:text-3xl lg:text-4xl font-black text-white leading-tight mb-2 line-clamp-2">
                                {post.title}
                            </h2>
                        </div>
                    </Link>
                    </div>
              ))}
           </div>
        </section>
      )}

      {/* Top Banner Ad - High Viewability */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GoogleAd slot="1641433819" format="horizontal" className="my-6" />
      </div>

      <div id="latest-posts" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center mb-6">
           <div className="w-1 h-6 bg-blue-600 rounded mr-3"></div>
           <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">Latest Stories</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
           {currentPage === 1 ? renderPostGrid([...heroPosts, ...currentLatestPosts]) : renderPostGrid(currentLatestPosts)}
        </div>
        
        {totalPages > 1 && (
            <div className="mt-12 mb-10 flex justify-center items-center space-x-2">
                <button onClick={prevPage} disabled={currentPage === 1} className={`px-4 py-2 rounded-lg font-bold text-sm ${currentPage === 1 ? 'bg-gray-100 dark:bg-gray-800 text-gray-400' : 'bg-white dark:bg-gray-900 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 border'}`}>Prev</button>
                <span className="px-4 text-sm font-bold text-gray-600 dark:text-gray-400">{currentPage} / {totalPages}</span>
                <button onClick={nextPage} disabled={currentPage === totalPages} className={`px-4 py-2 rounded-lg font-bold text-sm ${currentPage === totalPages ? 'bg-gray-100 dark:bg-gray-800 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>Next</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
