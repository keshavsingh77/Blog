
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import { useBlog } from '../context/BlogContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { posts } = useBlog();
  const navigate = useNavigate();

  const getCategorySlug = (category: string) => category.toLowerCase().replace(/\s+/g, '-');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/category/${searchQuery.toLowerCase().replace(/\s+/g, '-')}`);
    }
  };

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

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left: Mobile Menu Button */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Open menu"
              >
                <i className="fas fa-bars text-xl"></i>
              </button>
            </div>

            {/* Center: Logo */}
            <div className="flex-1 flex justify-center items-center">
              <Link to="/" className="flex items-center group">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2 text-white shadow-sm">
                   <i className="fas fa-lightbulb text-sm"></i>
                </div>
                <span className="text-xl md:text-2xl font-black tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                  Creative Mind
                </span>
              </Link>
            </div>

            {/* Right: Search Icon */}
            <div className="flex items-center">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                aria-label="Search"
              >
                <i className={`fas ${isSearchOpen ? 'fa-times' : 'fa-search'} text-xl`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Overlay */}
        {isSearchOpen && (
          <div className="absolute w-full top-16 left-0 z-40 border-t border-gray-100 bg-white shadow-lg animate-fade-in-down">
            <div className="max-w-4xl mx-auto p-4">
                <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-search text-gray-400"></i>
                    </span>
                    <input 
                        type="text" 
                        placeholder="Search Creative Mind..." 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-900"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                    Search
                </button>
                </form>
            </div>
          </div>
        )}

        {/* Mobile/Sidebar Menu Drawer */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-[60] flex" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
              onClick={() => setIsMenuOpen(false)}
            ></div>

            {/* Sidebar */}
            <nav className="relative bg-white w-[80%] max-w-[300px] h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-out translate-x-0">
              
              {/* Header */}
              <div className="p-5 flex justify-between items-center border-b border-gray-100">
                 <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2 text-white">
                        <i className="fas fa-lightbulb text-sm"></i>
                    </div>
                    <span className="text-lg font-black text-gray-900">Creative Mind</span>
                 </div>
                 <button 
                  onClick={() => setIsMenuOpen(false)} 
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 hover:text-red-600 transition"
                 >
                   <i className="fas fa-times text-lg"></i>
                 </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="px-4 py-4">
                    <Link 
                        to="/" 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center px-4 py-3 font-bold text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors mb-2"
                    >
                        <i className="fas fa-home w-6 text-center mr-3 text-gray-400"></i>
                        Home
                    </Link>

                    <div className="mt-4 mb-2 px-4 text-xs font-black text-gray-400 uppercase tracking-wider">
                        Categories
                    </div>
                    
                    {/* List the new specific categories (formerly trending tags) */}
                    {CATEGORIES.map((cat) => (
                    <Link
                        key={cat}
                        to={`/category/${getCategorySlug(cat)}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center px-4 py-3 font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-4"></span>
                        {cat}
                    </Link>
                    ))}
                </div>
              </div>

              {/* Footer (Socials) */}
              <div className="p-5 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-around">
                  <a href="#" className="text-gray-400 hover:text-[#1877F2] transition-colors"><i className="fab fa-facebook-f text-xl"></i></a>
                  <a href="https://t.me/creativemind7" className="text-gray-400 hover:text-[#0088cc] transition-colors"><i className="fab fa-telegram text-xl"></i></a>
                  <a href="https://www.instagram.com/filmy4uhd?igsh=cG93eDEyc3d2Nmc3" className="text-gray-400 hover:text-[#E4405F] transition-colors"><i className="fab fa-instagram text-xl"></i></a>
                  <a href="https://youtube.com/@creativemind77-b8t?si=HyiSpwJhlz2B9f5M" className="text-gray-400 hover:text-[#FF0000] transition-colors"><i className="fab fa-youtube text-xl"></i></a>
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
