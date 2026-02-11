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
            className="md:hidden text-gray-700 dark:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>

          <Link to="/" className="text-xl font-black tracking-tighter flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
              <span className="font-bold text-lg">C</span>
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 group-hover:to-blue-500 transition-all duration-300">
              Creative Mind
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className={`text-sm font-medium transition-colors hover:text-blue-600 ${location.pathname === '/' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
              Home
            </Link>
            <div className="relative group">
              <button className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1 py-4">
                Categories <i className="fas fa-chevron-down text-xs opacity-50"></i>
              </button>
              <div className="absolute top-full left-0 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                <div className="p-2 grid gap-1">
                  {allCategories.slice(0, 5).map(cat => (
                    <Link
                      key={cat}
                      to={`/category/${getCategorySlug(cat)}`}
                      className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link to="/about" className={`text-sm font-medium transition-colors hover:text-blue-600 ${location.pathname === '/about' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
              About
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'dark' ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[1000] transition-all duration-300 ${isMenuOpen ? 'visible' : 'invisible'}`}>
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        />
        <div className={`absolute top-0 left-0 w-[80%] max-w-[300px] h-full bg-white dark:bg-gray-950 shadow-2xl transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <span className="font-bold text-xl dark:text-white">Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <nav className="space-y-2">
              <Link to="/" className="block px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium">Home</Link>
              {allCategories.map(cat => (
                <Link key={cat} to={`/category/${getCategorySlug(cat)}`} className="block px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">{cat}</Link>
              ))}
              <Link to="/about" className="block px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">About</Link>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;