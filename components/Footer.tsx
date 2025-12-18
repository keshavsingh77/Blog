
import React from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';

const Footer: React.FC = () => {
  const { posts } = useBlog();
  
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags))).slice(0, 20);
  const getCategorySlug = (tag: string) => tag.toLowerCase().replace(/\s+/g, '-');

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-auto font-sans transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          <div className="space-y-4">
            <Link to="/" className="flex items-center group" aria-label="Creative Mind Home">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-2 text-white shadow-md group-hover:shadow-lg transition-all">
                  <i className="fas fa-lightbulb text-sm"></i>
                </div>
                <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-800 dark:from-blue-400 dark:to-indigo-500">
                  Creative Mind
                </span>
            </Link>
            <p className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed font-medium">
              Your handshake, one source for viral tech tricks, gaming news, and daily dose of internet culture. We unlock the potential of the digital world for you.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition shadow-sm" aria-label="Facebook">
                <i className="fab fa-facebook-f text-xs"></i>
              </a>
              <a href="https://t.me/creativemind7" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-500 hover:text-white flex items-center justify-center transition shadow-sm" aria-label="Telegram">
                <i className="fab fa-telegram text-xs"></i>
              </a>
              <a href="https://youtube.com/@creativemind77-b8t" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-[#FF0000] hover:text-white flex items-center justify-center transition shadow-sm" aria-label="YouTube">
                <i className="fab fa-youtube text-xs"></i>
              </a>
            </div>
          </div>

          <div className="md:col-span-2 md:pl-10">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800">
              <div className="md:flex md:items-center md:justify-between gap-6">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Subscribe to our Newsletter</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Get the latest viral tips, tricks, and tech news delivered directly to your inbox.</p>
                </div>
                <div className="flex-1 max-w-sm">
                   <form className="flex rounded-lg shadow-sm overflow-hidden">
                      <input 
                        type="email" 
                        placeholder="Enter email address" 
                        className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 outline-none text-sm text-gray-800 dark:text-white"
                        required 
                      />
                      <button type="submit" className="bg-blue-600 text-white px-6 py-3 font-bold text-sm hover:bg-blue-700 transition">
                        JOIN
                      </button>
                   </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1e293b] dark:bg-gray-900 py-10 px-4 border-t border-gray-800 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-6 opacity-90">Categories</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {allTags.map(tag => (
              <Link 
                key={tag} 
                to={`/category/${getCategorySlug(tag)}`}
                className="px-4 py-2 bg-[#334155] dark:bg-gray-800 text-gray-200 rounded-full text-xs font-medium hover:bg-blue-600 hover:text-white transition-colors capitalize border border-gray-600 dark:border-gray-700"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-900 dark:bg-black py-6 text-center text-gray-400 text-xs border-t border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
           <p className="text-gray-500">&copy; {new Date().getFullYear()} Creative Mind. All rights reserved.</p>
           <div className="mt-2 md:mt-0 space-x-4">
             <Link to="/privacy-policy" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
             <Link to="/terms-of-service" className="text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
             <Link to="/contact" className="text-gray-500 hover:text-white transition-colors">Contact</Link>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
