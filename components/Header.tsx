
import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import { useBlog } from '../context/BlogContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { posts } = useBlog();
  const navigate = useNavigate();

  // Extract unique tags for the menu
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags))).slice(0, 15);

  const getCategorySlug = (category: string) => category.toLowerCase().replace(/\s+/g, '-');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      setIsSearchOpen(false);
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
      <header className="bg-white text-gray-800 sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left: Mobile Menu Button */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-blue-600 focus:outline-none transition-colors"
              >
                <i className="fas fa-bars text-2xl"></i>
              </button>
            </div>

            {/* Center: Logo */}
            <div className="flex-1 flex justify-center">
              <Link to="/" className="flex items-center group">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-2 text-white shadow-md group-hover:shadow-lg transform group-hover:-translate-y-0.5 transition-all">
                  <i className="fas fa-lightbulb text-sm"></i>
                </div>
                <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-800">
                  Creative Mind
                </span>
              </Link>
            </div>

            {/* Right: Search Icon */}
            <div className="flex items-center">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-800 hover:text-blue-600 transition-colors"
              >
                <i className={`fas ${isSearchOpen ? 'fa-times' : 'fa-search'} text-xl`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Overlay */}
        {isSearchOpen && (
          <div className="bg-white border-b border-gray-200 p-4 absolute w-full top-16 left-0 z-40 animate-fade-in-down shadow-lg">
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex gap-2">
              <input 
                type="text" 
                placeholder="Search viral tips, tech, and more..." 
                className="flex-1 px-5 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-full font-bold hover:bg-blue-700 transition shadow-md">
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile/Sidebar Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
              onClick={() => setIsMenuOpen(false)}
            ></div>

            {/* Drawer */}
            <nav className="relative bg-white w-[85%] max-w-sm h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out translate-x-0 overflow-y-auto">
              
              {/* Drawer Header */}
              <div className="p-4 flex justify-between items-center border-b border-gray-100">
                 <span className="text-xl font-black text-blue-600">Creative Mind</span>
                 <button onClick={() => setIsMenuOpen(false)} className="text-gray-500 hover:text-black p-2">
                   <i className="fas fa-times text-xl"></i>
                 </button>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <Link 
                  to="/" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-6 py-3 text-base font-medium text-gray-800 hover:bg-gray-50"
                >
                  Home
                </Link>

                <div className="mt-4 px-6 mb-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">CATEGORIES</p>
                </div>
                
                {/* Standard Categories */}
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat}
                    to={`/category/${getCategorySlug(cat)}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-6 py-3 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 capitalize"
                  >
                    {cat}
                  </Link>
                ))}

                {/* Popular Tags from Context */}
                {allTags.map((tag) => (
                   <Link
                    key={tag}
                    to={`/category/${getCategorySlug(tag)}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-6 py-3 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 capitalize"
                  >
                    {tag}
                  </Link>
                ))}
              </div>

              {/* Drawer Footer (Socials) */}
              <div className="mt-auto p-6 border-t border-gray-100">
                <div className="flex justify-center space-x-6">
                  <a href="#" className="text-gray-400 hover:text-blue-600 transition">
                    <i className="fab fa-facebook-f text-xl"></i>
                  </a>
                  <a href="https://t.me/creativemind7" className="text-gray-400 hover:text-blue-500 transition">
                    <i className="fab fa-telegram text-xl"></i>
                  </a>
                  <a href="https://www.instagram.com/filmy4uhd?igsh=cG93eDEyc3d2Nmc3" className="text-gray-400 hover:text-pink-600 transition">
                    <i className="fab fa-instagram text-xl"></i>
                  </a>
                   <a href="https://youtube.com/@creativemind77-b8t?si=HyiSpwJhlz2B9f5M" className="text-gray-400 hover:text-red-600 transition">
                    <i className="fab fa-youtube text-xl"></i>
                  </a>
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
