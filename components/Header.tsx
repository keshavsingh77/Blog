
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

  // Extract unique labels from posts to use as categories, fallback to constants
  const dynamicCategories = Array.from(
    new Set([...(posts.flatMap(p => p.tags || [])), ...CATEGORIES])
  ).sort((a, b) => a.localeCompare(b));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/category/${searchQuery.toLowerCase().replace(/\s+/g, '-')}`);
    }
  };

  const getCategorySlug = (category: string) => category.toLowerCase().replace(/\s+/g, '-');

  // Prevent background scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMenuOpen]);

  return (
    <>
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 fixed top-0 w-full z-50 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
          
          {/* Menu Button (Left Side) */}
          <div className="flex items-center z-10">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-2 -ml-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none"
              aria-label="Open Navigation Menu"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>

          {/* Logo (Centered) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-2 text-white shadow-md group-hover:scale-110 transition-transform">
                <i className="fas fa-lightbulb text-sm"></i>
              </div>
              <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white whitespace-nowrap">
                Creative Mind
              </span>
            </Link>
          </div>

          {/* Right side Actions (Search & Theme) */}
          <div className="flex items-center space-x-1 z-10">
            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none"
              aria-label="Toggle Theme"
            >
              <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-lg`}></i>
            </button>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 -mr-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none"
              aria-label="Toggle Search"
            >
              <i className={`fas ${isSearchOpen ? 'fa-times' : 'fa-search'} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        {isSearchOpen && (
          <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 shadow-xl z-40 animate-fade-in-up">
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex gap-2">
              <input 
                type="text" 
                placeholder="Search viral tech tricks..." 
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-blue-700 transition-colors">
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Sidebar Navigation */}
      <div 
        className={`fixed inset-0 z-[100] transition-visibility duration-300 ${isMenuOpen ? 'visible' : 'invisible'}`}
        aria-hidden={!isMenuOpen}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        ></div>

        {/* Sidebar Panel */}
        <nav 
          className={`relative bg-white dark:bg-gray-900 w-[85%] max-w-sm h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Sidebar Header */}
          <div className="p-4 h-16 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900 sticky top-0 z-20">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2 text-white">
                <i className="fas fa-lightbulb text-sm"></i>
              </div>
              <span className="font-black text-gray-900 dark:text-white uppercase tracking-tight">Creative Mind</span>
            </div>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <i className="fas fa-times text-gray-500 dark:text-gray-400 text-xl"></i>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <Link 
              to="/" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center px-4 py-3 mb-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-bold rounded-xl border border-blue-100 dark:border-blue-900/30"
            >
              <i className="fas fa-home mr-3 text-lg"></i> Home Feed
            </Link>

            <Link 
              to="/admin" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center px-4 py-3 mb-8 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-colors"
            >
              <i className="fas fa-user-shield mr-3 text-lg"></i> Admin Dashboard
            </Link>

            {/* Theme Settings Section */}
            <div className="mb-10 bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
               <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 px-1">Display Mode</h3>
               <button 
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold"
               >
                  <div className="flex items-center">
                    <i className={`fas ${theme === 'dark' ? 'fa-moon text-blue-400' : 'fa-sun text-yellow-500'} mr-3`}></i>
                    <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${theme === 'dark' ? 'left-6' : 'left-1'}`}></div>
                  </div>
               </button>
            </div>

            {/* Categories List */}
            <div className="mb-8">
              <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-4 mb-4">Categories & Tags</h3>
              <div className="space-y-1">
                {dynamicCategories.length > 0 ? dynamicCategories.map(cat => (
                  <Link
                    key={cat}
                    to={`/category/${getCategorySlug(cat)}`}
                    className="flex items-center px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 font-bold hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="fas fa-tag mr-3 text-gray-300 dark:text-gray-600 group-hover:text-blue-200 transition-colors"></i>
                    <span className="flex-1 truncate">{cat}</span>
                    <i className="fas fa-chevron-right text-[10px] opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0"></i>
                  </Link>
                )) : (
                  <div className="px-4 py-2 text-xs text-gray-400 animate-pulse">Populating categories...</div>
                )}
              </div>
            </div>
          </div>

          {/* Social Footer */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800">
             <div className="flex justify-around text-gray-400 dark:text-gray-600">
                <a href="https://t.me/creativemind7" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors"><i className="fab fa-telegram text-2xl"></i></a>
                <a href="https://www.instagram.com/filmy4uhd" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors"><i className="fab fa-instagram text-2xl"></i></a>
                <a href="https://youtube.com/@creativemind77-b8t" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors"><i className="fab fa-youtube text-2xl"></i></a>
             </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
