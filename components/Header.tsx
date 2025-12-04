
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import { useBlog } from '../context/BlogContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { posts } = useBlog();
  const navigate = useNavigate();

  // Extract unique tags for the menu
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags))).slice(0, 15);

  const getCategorySlug = (category: string) => category.toLowerCase().replace(/\s+/g, '-');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/category/${searchQuery.toLowerCase().replace(/\s+/g, '-')}`);
    }
  };

  // Handle scroll effect for glass header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  // Premium SVG Logo Component
  const BrandLogo = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 drop-shadow-md group-hover:scale-105 transition-transform duration-300">
      <rect width="40" height="40" rx="10" fill="url(#paint0_linear_logo)" />
      <path d="M20 10C14.4772 10 10 14.4772 10 20C10 25.5228 14.4772 30 20 30C25.5228 30 30 25.5228 30 20C30 14.4772 25.5228 10 20 10ZM25 21C25 21.5523 24.5523 22 24 22H16C15.4477 22 15 21.5523 15 21V19C15 18.4477 15.4477 18 16 18H24C24.5523 18 25 18.4477 25 19V21Z" fill="white" fillOpacity="0.95"/>
      <path d="M20 14C20.5523 14 21 14.4477 21 15V17H19V15C19 14.4477 19.4477 14 20 14Z" fill="white" fillOpacity="0.8"/>
      <path d="M20 23V25C20 25.5523 19.5523 26 19 26H21C21.5523 26 22 25.5523 22 25V23H20Z" fill="white" fillOpacity="0.6"/>
      <circle cx="20" cy="20" r="3" fill="#3B82F6"/>
      <defs>
        <linearGradient id="paint0_linear_logo" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled 
            ? 'bg-white/85 backdrop-blur-lg border-gray-200 shadow-sm' 
            : 'bg-white/60 backdrop-blur-md border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            
            {/* Left: Mobile Menu Button - Ensure high z-index and visibility */}
            <div className="flex items-center z-50">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="inline-flex items-center justify-center p-2.5 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none transition-all duration-200 active:scale-95"
                aria-label="Open menu"
                aria-expanded={isMenuOpen}
              >
                <i className="fas fa-bars text-xl md:text-2xl"></i>
              </button>
            </div>

            {/* Center: Logo */}
            <div className="flex-1 flex justify-center absolute inset-0 items-center pointer-events-none">
              <Link to="/" className="flex items-center group pointer-events-auto" aria-label="Creative Mind Home">
                <BrandLogo />
                <span className="text-2xl md:text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 drop-shadow-sm">
                  Creative Mind
                </span>
              </Link>
            </div>

            {/* Right: Search Icon */}
            <div className="flex items-center z-50">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 active:scale-95"
                aria-label={isSearchOpen ? "Close search" : "Open search"}
                aria-expanded={isSearchOpen}
              >
                <i className={`fas ${isSearchOpen ? 'fa-times' : 'fa-search'} text-xl`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Overlay */}
        {isSearchOpen && (
          <div className="absolute w-full top-full left-0 z-40 animate-fade-in-down border-t border-gray-100">
            <div className="bg-white/95 backdrop-blur-xl shadow-xl p-4 md:p-6">
                <form onSubmit={handleSearch} className="max-w-4xl mx-auto flex gap-3" role="search">
                <label htmlFor="site-search" className="sr-only">Search</label>
                <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <i className="fas fa-search text-gray-400"></i>
                    </span>
                    <input 
                        id="site-search"
                        type="text" 
                        placeholder="Search topics, tutorials, news..." 
                        className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 text-gray-900 text-lg transition-all shadow-inner"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold text-base hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 active:scale-95 transform">
                    Search
                </button>
                </form>
            </div>
          </div>
        )}

        {/* Mobile/Sidebar Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-[100] flex justify-start" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300" 
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            ></div>

            {/* Drawer */}
            <nav className="relative bg-white w-[85%] max-w-[320px] h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-out translate-x-0 overflow-hidden">
              
              {/* Drawer Header */}
              <div className="p-6 flex justify-between items-center border-b border-gray-50 bg-gradient-to-b from-white to-gray-50">
                 <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 text-white shadow-blue-500/30 shadow-lg">
                        <i className="fas fa-lightbulb text-sm"></i>
                    </div>
                    <span className="text-xl font-black text-gray-900 tracking-tight">Creative Mind</span>
                 </div>
                 <button 
                  onClick={() => setIsMenuOpen(false)} 
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-100 shadow-sm transition-all"
                  aria-label="Close menu"
                 >
                   <i className="fas fa-times"></i>
                 </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto py-2">
                <div className="px-4 py-2">
                    <Link 
                    to="/" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-4 py-3.5 text-base font-bold text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                    >
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-xs">
                        <i className="fas fa-home"></i>
                    </span>
                    Home
                    </Link>
                </div>

                <div className="mt-4 px-6 mb-2">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Categories</span>
                </div>
                
                {/* Standard Categories */}
                <div className="px-3 space-y-1">
                    {CATEGORIES.map((cat) => (
                    <Link
                        key={cat}
                        to={`/category/${getCategorySlug(cat)}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center px-4 py-3 text-[15px] font-medium text-gray-600 hover:text-blue-700 hover:bg-gray-50 rounded-xl transition-all group"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-3 group-hover:bg-blue-500 transition-colors"></span>
                        {cat}
                        <i className="fas fa-chevron-right text-[10px] text-gray-300 ml-auto group-hover:text-blue-400 transition-colors"></i>
                    </Link>
                    ))}
                </div>

                <div className="mt-6 px-6 mb-3">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Trending Tags</span>
                </div>

                <div className="px-6 flex flex-wrap gap-2 pb-6">
                    {allTags.map((tag) => (
                    <Link
                        key={tag}
                        to={`/category/${getCategorySlug(tag)}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="inline-block px-3 py-1.5 bg-gray-50 text-gray-600 border border-gray-100 rounded-lg text-xs font-semibold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all capitalize shadow-sm"
                    >
                        #{tag}
                    </Link>
                    ))}
                </div>
              </div>

              {/* Drawer Footer (Socials) */}
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <p className="text-center text-[10px] font-bold text-gray-400 uppercase mb-4 tracking-wider">Follow Our Socials</p>
                <div className="flex justify-center gap-5">
                  <a href="#" className="text-gray-400 hover:text-[#1877F2] hover:scale-110 transition-all"><i className="fab fa-facebook-f text-xl"></i></a>
                  <a href="https://t.me/creativemind7" className="text-gray-400 hover:text-[#0088cc] hover:scale-110 transition-all"><i className="fab fa-telegram text-xl"></i></a>
                  <a href="https://www.instagram.com/filmy4uhd?igsh=cG93eDEyc3d2Nmc3" className="text-gray-400 hover:text-[#E4405F] hover:scale-110 transition-all"><i className="fab fa-instagram text-xl"></i></a>
                  <a href="https://youtube.com/@creativemind77-b8t?si=HyiSpwJhlz2B9f5M" className="text-gray-400 hover:text-[#FF0000] hover:scale-110 transition-all"><i className="fab fa-youtube text-xl"></i></a>
                </div>
              </div>

            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
