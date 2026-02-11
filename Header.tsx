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
      <header className="bg-white/70 dark:bg-gray-950/70 backdrop-blur-2xl border-b border-gray-100/50 dark:border-gray-800/50 fixed top-0 w-full z-[500] h-16 flex items-center shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-2xl transition-all group active:scale-95"
            aria-label="Open Navigation"
          >
            <i className="fas fa-bars-staggered text-xl group-hover:text-blue-600 transition-colors"></i>
          </button>

          <Link to="/" className="flex items-center group relative overflow-hidden">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-3 text-white shadow-[0_10px_20px_-5px_rgba(59,130,246,0.5)] group-hover:rotate-[360deg] transition-all duration-700">
              <i className="fas fa-brain text-sm"></i>
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">
              Creative<span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Mind</span>
            </span>
          </Link>

          <div className="flex items-center space-x-1 md:space-x-4">
            <nav className="hidden lg:flex items-center space-x-8 mr-6">
              <Link to="/" className={`text-[11px] font-black uppercase tracking-[0.2em] hover:text-blue-600 transition-all ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400'}`}>Home</Link>
              <Link to="/about" className={`text-[11px] font-black uppercase tracking-[0.2em] hover:text-blue-600 transition-all ${location.pathname === '/about' ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400'}`}>About</Link>
              <Link to="/contact" className={`text-[11px] font-black uppercase tracking-[0.2em] hover:text-blue-600 transition-all ${location.pathname === '/contact' ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400'}`}>Contact</Link>
            </nav>
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-2xl transition-all active:scale-90"
              aria-label="Toggle Theme"
            >
              <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-lg`}></i>
            </button>
            <Link to="/contact" className="hidden sm:flex bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-[0_10px_20px_-5px_rgba(59,130,246,0.4)] hover:shadow-[0_15px_25px_-5px_rgba(59,130,246,0.5)] hover:scale-[1.03] active:scale-[0.97] transition-all">
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
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 text-gray-500 hover:text-red-500 shadow-sm transition-all"
              aria-label="Close"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
            <div className="space-y-4 mb-10">
              <Link to="/" className={`flex items-center text-3xl font-black uppercase italic tracking-tighter transition-all hover:translate-x-2 ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-900 dark:text-white hover:text-blue-500'}`}>
                Home
              </Link>
              <Link to="/about" className={`flex items-center text-3xl font-black uppercase italic tracking-tighter transition-all hover:translate-x-2 ${location.pathname === '/about' ? 'text-blue-600' : 'text-gray-900 dark:text-white hover:text-blue-500'}`}>
                About
              </Link>
              <Link to="/contact" className={`flex items-center text-3xl font-black uppercase italic tracking-tighter transition-all hover:translate-x-2 ${location.pathname === '/contact' ? 'text-blue-600' : 'text-gray-900 dark:text-white hover:text-blue-500'}`}>
                Contact
              </Link>
            </div>

            <div className="mb-10">
              <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] mb-6 pl-1">Categories</h3>
              <div className="grid grid-cols-1 gap-2">
                {allCategories.map(cat => (
                  <Link
                    key={cat}
                    to={`/category/${getCategorySlug(cat)}`}
                    className="group flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 hover:bg-blue-600 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-white">{cat}</span>
                    <i className="fas fa-chevron-right text-[10px] text-blue-500 group-hover:text-white transition-transform group-hover:translate-x-1"></i>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col space-y-4">
              <Link to="/privacy-policy" className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-blue-500 transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-blue-500 transition-colors">Terms of Service</Link>
            </div>
          </div>

          <div className="p-8 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <span>&copy; {new Date().getFullYear()} Creative Mind</span>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;