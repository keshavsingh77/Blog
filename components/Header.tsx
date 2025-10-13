
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CATEGORIES } from '../constants';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getCategorySlug = (category: string) => category.toLowerCase().replace(/\s+/g, '-');

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <NavLink to="/" className="flex items-center space-x-2">
              <i className="fas fa-landmark text-2xl text-blue-600"></i>
              <span className="text-xl font-bold text-gray-800">GovNews AI</span>
            </NavLink>
          </div>
          <div className="hidden md:block">
            <nav className="flex items-center space-x-4">
              {CATEGORIES.map((cat) => (
                <NavLink
                  key={cat}
                  to={`/category/${getCategorySlug(cat)}`}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  {cat}
                </NavLink>
              ))}
              <NavLink
                to="/admin"
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                <i className="fas fa-user-shield mr-2"></i>Admin
              </NavLink>
            </nav>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {CATEGORIES.map((cat) => (
              <NavLink
                key={cat}
                to={`/category/${getCategorySlug(cat)}`}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                {cat}
              </NavLink>
            ))}
            <NavLink
              to="/admin"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
               <i className="fas fa-user-shield mr-2"></i>Admin
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
