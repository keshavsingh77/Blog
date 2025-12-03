
import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../constants';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const getCategorySlug = (category: string) => category.toLowerCase().replace(/\s+/g, '-');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <header className="bg-white text-gray-800 sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left: Mobile Menu Button */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50 focus:outline-none transition-colors"
              >
                <i className="fas fa-bars text-xl"></i>
              </button>
            </div>

            {/* Center: Logo */}
            <div className="flex-1 flex justify-center">
              <Link to="/" className="flex items-center group">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-2 text-white shadow-md group-hover:shadow-lg transform group-hover:-translate-y-0.5 transition-all">
                  <i className="fas fa-lightbulb text-lg"></i>
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
                className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
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

        {/* Mobile/Sidebar Menu */}
        <div className={`fixed inset-0 z-50 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
           <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
           <nav className="relative bg-white h-full w-72 shadow-2xl flex flex-col">
              <div className="p-5 border-b flex justify-between items-center bg-gray-50">
                <div className="flex items-center">
                   <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center mr-2 text-white text-sm">
                      <i className="fas fa-bolt"></i>
                   </div>
                   <span className="font-black text-gray-800 text-lg">Menu</span>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-red-500 transition">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                <NavLink 
                  to="/" 
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => `flex items-center px-4 py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <i className="fas fa-home w-8 text-center"></i> Home
                </NavLink>
                {CATEGORIES.map((cat) => (
                  <NavLink
                    key={cat}
                    to={`/category/${getCategorySlug(cat)}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-xl font-bold transition-all ${
                        isActive ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                   <i className="fas fa-hashtag w-8 text-center text-gray-400"></i> {cat}
                  </NavLink>
                ))}
              </div>
              <div className="mt-auto p-6 border-t bg-gray-50">
                <div className="flex justify-center space-x-4 mb-4">
                  <a href="https://t.me/creativemind7" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-500"><i className="fab fa-telegram text-xl"></i></a>
                  <a href="https://www.instagram.com/filmy4uhd?igsh=cG93eDEyc3d2Nmc3" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-pink-600"><i className="fab fa-instagram text-xl"></i></a>
                  <a href="https://youtube.com/@creativemind77-b8t?si=HyiSpwJhlz2B9f5M" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-red-600"><i className="fab fa-youtube text-xl"></i></a>
                </div>
                <p className="text-xs text-center text-gray-400 font-medium">
                  &copy; 2025 Creative Mind
                </p>
              </div>
           </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
