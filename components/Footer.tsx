import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white text-2xl font-black tracking-tight mb-4 flex items-center">
              <i className="fas fa-brain text-blue-500 mr-2"></i> Creative Mind
            </h3>
            <p className="text-sm mb-6">
              Your #1 source for viral tech tricks, gaming news, and daily doses of internet culture. We unlock the potential of the digital world for you.
            </p>
            <div className="flex space-x-4">
              <a href="https://t.me/creativemind7" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-400 transition shadow-lg">
                <i className="fab fa-telegram-plane"></i>
              </a>
              <a href="https://www.instagram.com/filmy4uhd?igsh=cG93eDEyc3d2Nmc3" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center text-white hover:bg-pink-500 transition shadow-lg">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://youtube.com/@creativemind77-b8t?si=HyiSpwJhlz2B9f5M" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white hover:bg-red-500 transition shadow-lg">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase mb-4 tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-blue-400 transition">Home</Link></li>
              <li><Link to="/category/tech" className="hover:text-blue-400 transition">Tech Tricks</Link></li>
              <li><Link to="/category/gaming" className="hover:text-blue-400 transition">Gaming</Link></li>
              <li><Link to="/category/reviews" className="hover:text-blue-400 transition">Reviews</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase mb-4 tracking-wider">Stay Updated</h4>
            <p className="text-xs mb-4">Get the latest viral hits straight to your inbox.</p>
            <div className="flex">
              <input type="email" placeholder="Your email address" className="bg-gray-800 text-white px-4 py-2 rounded-l-md w-full focus:outline-none border border-gray-700 focus:border-blue-500" />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md font-bold hover:bg-blue-700 transition">JOIN</button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Creative Mind. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
