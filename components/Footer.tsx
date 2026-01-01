import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';

const Footer: React.FC = () => {
  const getCategorySlug = (cat: string) => cat.toLowerCase().replace(/\s+/g, '-');

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          <div className="md:col-span-5 space-y-6">
            <Link to="/" className="flex items-center group">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3 text-white shadow-lg">
                <i className="fas fa-brain"></i>
              </div>
              <span className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">
                Creative<span className="text-blue-600">Mind</span>
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-md font-medium">
              Unlocking the viral secrets of technology, gaming, and internet culture. Empowering you to master the digital landscape.
            </p>
            <div className="flex gap-4 pt-4">
              <a href="#" className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-blue-600 hover:shadow-xl transition-all flex items-center justify-center">
                <i className="fab fa-facebook-f text-lg"></i>
              </a>
              <a href="https://t.me/creativemind7" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-blue-400 hover:shadow-xl transition-all flex items-center justify-center">
                <i className="fab fa-telegram text-lg"></i>
              </a>
              <a href="https://youtube.com/@creativemind77-b8t" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-red-600 hover:shadow-xl transition-all flex items-center justify-center">
                <i className="fab fa-youtube text-lg"></i>
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-[0.3em] mb-8">Navigation</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-500 hover:text-blue-600 font-bold transition-colors">Home Feed</Link></li>
              <li><Link to="/about" className="text-gray-500 hover:text-blue-600 font-bold transition-colors">About Our Team</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-blue-600 font-bold transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-500 hover:text-blue-600 font-bold transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-gray-500 hover:text-blue-600 font-bold transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-[0.3em] mb-8">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.slice(0, 8).map(cat => (
                <Link 
                  key={cat} 
                  to={`/category/${getCategorySlug(cat)}`}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 rounded-xl text-xs font-black uppercase hover:bg-blue-600 hover:text-white transition-all"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-20 pt-10 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Creative Mind Studio. Built for Viral Success.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;