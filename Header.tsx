
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { CATEGORIES } from '../constants';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { posts, theme, toggleTheme } = useBlog();
  const navigate = useNavigate();

  const dynamicCategories = Array.from(
    new Set([...(posts.flatMap(p => p.tags || [])), ...CATEGORIES])
  ).sort((a, b) => a.localeCompare(b));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/category/${searchQuery.toLowerCase().replace(/\s+/g, '-')}`);
      setSearchQuery('');
    }
  };

  const getCategorySlug = (category: string) => category.toLowerCase().replace(/\s+/g, '-');

  useEffect(() => {
    document.body.style.overflow = (isMenuOpen || isSearchOpen) ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMenuOpen, isSearchOpen]);

  return (
    <>
      <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 fixed top-0 w-full z-[100] h-16 flex items-center shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between relative">
          
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-3 -ml-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors z-50 cursor-pointer"
            aria-label="Open Menu"
          >
            <i className="fas fa-bars-staggered text-xl"></i>
          </button>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <Link to="/" className="flex items-center group cursor-pointer">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center mr-3 text-white shadow-lg group-hover:rotate-6 transition-transform">
                <i className="fas fa-lightbulb"></i>
              </div>
              <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">
                Creative<span className="text-blue-600">Mind</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-1 z-50">
            <button 
              onClick={(e) => { e.preventDefault(); toggleTheme(); }}
              className="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
            >
              <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-lg`}></i>
            </button>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
            >
              <i className={`fas ${isSearchOpen ? 'fa-times' : 'fa-search'} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        {isSearchOpen && (
          <div className="fixed inset-0 top-16 left-0 w-full h-screen bg-black/40 backdrop-blur-sm z-[90]" onClick={() => setIsSearchOpen(false)}>
             <div className="bg-white dark:bg-gray-900 p-6 shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSearch} className="max-w-4xl mx-auto flex gap-3">
                  <input 
                    type="text" 
                    placeholder="Search viral content..." 
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 rounded-2xl text-gray-900 dark:text-white outline-none transition-all font-bold"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-colors">FIND</button>
                </form>
             </div>
          </div>
        )}
      </header>

      {/* Sidebar Drawer */}
      <div 
        className={`fixed inset-0 z-[1000] ${isMenuOpen ? 'visible' : 'invisible'}`}
      >
        <div 
          className={`absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        ></div>

        <nav 
          className={`absolute top-0 left-0 bg-white dark:bg-gray-900 w-[85%] max-w-sm h-full shadow-2xl flex flex-col transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="p-6 h-16 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <span className="font-black text-xl text-gray-900 dark:text-white tracking-tighter">NAVIGATE</span>
            <button onClick={() => setIsMenuOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <i className="fas fa-xmark text-2xl text-gray-500"></i>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-10 no-scrollbar">
            <div className="space-y-3 mb-10">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center px-6 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 transition-transform"
              >
                <i className="fas fa-house mr-4 text-xl"></i> HOME FEED
              </Link>
              <Link 
                to="/admin" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-black rounded-2xl transition-all active:scale-95"
              >
                <i className="fas fa-shield-halved mr-4 text-xl text-blue-600"></i> ADMIN CONSOLE
              </Link>
            </div>

            <div className="mb-10">
              <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.5em] px-6 mb-6">Popular Tags</h3>
              <div className="flex flex-wrap gap-2 px-2">
                {dynamicCategories.slice(0, 18).map(cat => (
                  <Link
                    key={cat}
                    to={`/category/${getCategorySlug(cat)}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-black bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition-all border border-gray-100 dark:border-gray-700 shadow-sm"
                  >
                    #{cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
