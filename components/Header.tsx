import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { CATEGORIES } from '../constants';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme, posts } = useBlog();
  const location = useLocation();

  const allCategories = useMemo(() => {
    const combined = [...CATEGORIES, ...posts.map(p => p.category)];
    return Array.from(new Set(combined.filter(Boolean))).sort();
  }, [posts]);

  const getCategorySlug = (cat: string) => cat.toLowerCase().replace(/\s+/g, '-');

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  return (
    <>
      <header className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-2xl border-b border-gray-100 dark:border-gray-800 fixed top-0 w-full z-[500] h-16 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full grid grid-cols-3 items-center">
          
          <div className="flex justify-start">
            <Link to="/" className="flex items-center group">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center mr-2 text-white shadow-lg group-hover:rotate-12 transition-transform">
                <i className="fas fa-brain text-[10px]"></i>
              </div>
              <span className="text-base font-black tracking-tighter text-gray-900 dark:text-white uppercase hidden sm:block">
                Creative<span className="text-blue-600">Mind</span>
              </span>
            </Link>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="group w-14 h-10 flex items-center justify-center text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl hover:bg-blue-600 hover:text-white hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/40 active:scale-95 transition-all duration-300 border border-gray-100 dark:border-gray-800"
              aria-label="Menu"
            >
              <i className="fas fa-bars-staggered text-lg group-hover:rotate-12 transition-transform"></i>
            </button>
          </div>

          <div className="flex justify-end items-center gap-4">
            <Link to="/admin" className={`hidden md:block text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-lg border-2 transition-all ${location.pathname === '/admin' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-blue-600'}`}>
              Dashboard
            </Link>
            <button 
              onClick={toggleTheme} 
              className="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all"
            >
              <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
          </div>
        </div>
      </header>

      {/* Modern Side Drawer */}
      <div className={`fixed inset-0 z-[1000] transition-all duration-500 ${isMenuOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMenuOpen(false)}></div>
        <nav className={`absolute top-0 left-0 bg-white dark:bg-gray-950 w-full max-w-xs h-full shadow-2xl transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-8 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
             <span className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs">Navigation</span>
             <button onClick={() => setIsMenuOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:rotate-90 transition-all duration-500">
               <i className="fas fa-times text-gray-400"></i>
             </button>
          </div>
          <div className="p-8 flex-1 overflow-y-auto no-scrollbar">
            <div className="flex flex-col space-y-4 mb-12">
               {['/', '/admin', '/about', '/contact'].map((path) => (
                 <Link key={path} to={path} className="text-3xl font-black text-gray-900 dark:text-white hover:text-blue-600 transition-colors italic tracking-tighter uppercase">
                   {path === '/' ? 'Home' : path.substring(1)}
                 </Link>
               ))}
            </div>
            <div>
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 border-l-4 border-blue-600 pl-3">Channels</h3>
               <div className="grid grid-cols-1 gap-1">
                 {allCategories.map(cat => (
                   <Link key={cat} to={`/category/${getCategorySlug(cat)}`} className="group flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl font-bold text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                     <span>{cat}</span>
                     <i className="fas fa-arrow-right text-[10px] opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all"></i>
                   </Link>
                 ))}
               </div>
            </div>
          </div>
          <div className="p-8 border-t border-gray-100 dark:border-gray-800 text-center">
             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">&copy; {new Date().getFullYear()} Creative Mind Studio</p>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;