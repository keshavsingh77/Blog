
import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getCategorySlug = (category: string) => category.toLowerCase().replace(/\s+/g, '-');

  return (
    <header className="bg-black text-white sticky top-0 z-50 border-b-4 border-red-600 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="text-3xl font-black italic tracking-tighter group-hover:text-red-500 transition-colors">
                <i className="fas fa-play-circle text-red-600 mr-2"></i>
                iPopcorn
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <nav className="flex items-center space-x-1">
              {CATEGORIES.map((cat) => (
                <NavLink
                  key={cat}
                  to={`/category/${getCategorySlug(cat)}`}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-bold uppercase tracking-wide transition-colors duration-200 ${
                      isActive ? 'bg-red-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`
                  }
                >
                  {cat}
                </NavLink>
              ))}
              <NavLink
                to="/admin"
                className="ml-4 px-4 py-2 bg-gray-800 rounded-full text-xs font-bold uppercase hover:bg-gray-700 transition-colors"
              >
                <i className="fas fa-lock mr-1"></i> Admin
              </NavLink>
            </nav>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <i className="fas fa-times block h-6 w-6"></i>
              ) : (
                <i className="fas fa-bars block h-6 w-6"></i>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {CATEGORIES.map((cat) => (
              <NavLink
                key={cat}
                to={`/category/${getCategorySlug(cat)}`}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-bold uppercase ${
                    isActive ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                {cat}
              </NavLink>
            ))}
            <NavLink
              to="/admin"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-bold uppercase text-gray-300 hover:bg-gray-800 hover:text-white"
            >
               Admin Panel
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
