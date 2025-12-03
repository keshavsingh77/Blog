
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-gray-400 border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white text-2xl font-black italic tracking-tighter mb-4">
              <i className="fas fa-play-circle text-red-600 mr-2"></i>iPopcorn
            </h3>
            <p className="text-sm">
              Your daily source for the latest in technology, gaming culture, blockbuster movies, and entertainment news. We bring you the popcorn, you bring the hype.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-red-500 transition">Home</Link></li>
              <li><Link to="/category/tech" className="hover:text-red-500 transition">Tech News</Link></li>
              <li><Link to="/category/gaming" className="hover:text-red-500 transition">Gaming Reviews</Link></li>
              <li><Link to="/admin" className="hover:text-red-500 transition">Admin Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase mb-4">Newsletter</h4>
            <p className="text-xs mb-4">Subscribe to our weekly roundup of the best stories.</p>
            <div className="flex">
              <input type="email" placeholder="Enter your email" className="bg-gray-800 text-white px-4 py-2 rounded-l-md w-full focus:outline-none" />
              <button className="bg-red-600 text-white px-4 py-2 rounded-r-md font-bold hover:bg-red-700 transition">GO</button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} iPopcorn Media Group. All rights reserved.</p>
          <div className="mt-2 space-x-4">
             <a href="#" className="hover:text-white">Privacy Policy</a>
             <a href="#" className="hover:text-white">Terms of Service</a>
             <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
