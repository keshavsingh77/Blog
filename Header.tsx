import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { CATEGORIES } from '../constants';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme, posts } = useBlog();
  const location = useLocation();

  // Consolidate categories from constants and live posts
  const allCategories = Array.from(new Set([
    ...CATEGORIES,
    ...posts.map(p => p.category)
  ])).sort((a, b) => a.localeCompare(b));

  const getCategorySlug = (cat: string) => cat.toLowerCase().replace(/\s+/g, '-');

  // Automatically close sidebar menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 fixed top-0 w-full z-[500] h-16 flex items-center shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors group"
            aria-label="Open Navigation"
          >
            <i className="fas fa-bars-staggered text-xl group-hover:scale-110 transition-transform"></i>
          </button>

          <Link to="/" className="flex items-center group">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center mr-3 text-white shadow-lg group-hover:rotate-12 transition-transform">
              <i className="fas fa-brain text-sm"></i>
            </div>
            <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">
              Creative<span className="text-blue-600">Mind</span>
            </span>
          </Link>

          <div className="flex items-center space-x-1 md:space-x-4">
            <nav className="hidden lg:flex items-center space-x-6 mr-4">
              <Link to="/" className={`text-xs font-black uppercase tracking-widest hover:text-blue-600 transition-colors ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400'}`}>Home</Link>
              <Link to="/about" className={`text-xs font-black uppercase tracking-widest hover:text-blue-600 transition-colors ${location.pathname === '/about' ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400'}`}>About</Link>
              <Link to="/contact" className={`text-xs font-black uppercase tracking-widest hover:text-blue-600 transition-colors ${location.pathname === '/contact' ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400'}`}>Contact</Link>
            </nav>
            <button 
              onClick={toggleTheme} 
              className="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              aria-label="Toggle Theme"
            >
              <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
            <Link to="/contact" className="hidden sm:flex bg-blue-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-105 transition-all">
              Join Us
            </Link>
          </div>
        </div>
      </header>

      {/* Side Menu Drawer */}
      <div className={`fixed inset-0 z-[1000] transition-all duration-500 ${isMenuOpen ? 'visible' : 'invisible'}`}>
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        ></div>
        
        <nav className={`absolute top-0 left-0 bg-white dark:bg-gray-950 w-full max-w-xs h-full shadow-2xl transform transition-transform duration-500 flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 text-white shadow-lg">
                <i className="fas fa-brain text-xs"></i>
              </div>
              <span className="font-black text-gray-900 dark:text-white uppercase tracking-tighter">Creative Mind</span>
            </div>
            <button 
              onClick={() => setIsMenuOpen(false)} 
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 text-gray-500 hover:text-red-500 shadow-sm"
              aria-label="Close"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
            <div className="space-y-4 mb-10">
              <Link to="/" className={`flex items-center text-2xl font-black uppercase italic tracking-tighter transition-colors ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-900 dark:text-white hover:text-blue-500'}`}>
                Home
              </Link>
              <Link to="/about" className={`flex items-center text-2xl font-black uppercase italic tracking-tighter transition-colors ${location.pathname === '/about' ? 'text-blue-600' : 'text-gray-900 dark:text-white hover:text-blue-500'}`}>
                About Us
              </Link>
              <Link to="/contact" className={`flex items-center text-2xl font-black uppercase italic tracking-tighter transition-colors ${location.pathname === '/contact' ? 'text-blue-600' : 'text-gray-900 dark:text-white hover:text-blue-500'}`}>
                Contact Us
              </Link>
            </div>

            <div className="mb-10">
              <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] mb-6 pl-1">Categories</h3>
              <div className="grid grid-cols-1 gap-2">
                {allCategories.map(cat => (
                  <Link 
                    key={cat} 
                    to={`/category/${getCategorySlug(cat)}`} 
                    className="group flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-900 hover:bg-blue-600 transition-all duration-300"
                  >
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-white">{cat}</span>
                    <i className="fas fa-chevron-right text-[10px] text-blue-500 group-hover:text-white"></i>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col space-y-3">
              <Link to="/privacy-policy" className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-blue-500 transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-blue-500 transition-colors">Terms of Service</Link>
            </div>
          </div>

          <div className="p-8 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span className="font-bold">&copy; {new Date().getFullYear()} Creative Mind</span>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;