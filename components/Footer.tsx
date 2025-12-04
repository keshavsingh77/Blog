import React from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';

const Footer: React.FC = () => {
  const { posts } = useBlog();
  
  // Extract unique tags
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags))).slice(0, 20);
  const getCategorySlug = (tag: string) => tag.toLowerCase().replace(/\s+/g, '-');

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto font-sans">
      
      {/* Top Footer Section: Brand, Newsletter, Socials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Brand & Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center group" aria-label="Creative Mind Home">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-2 text-white shadow-md group-hover:shadow-lg transition-all">
                  <i className="fas fa-lightbulb text-sm"></i>
                </div>
                <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-800">
                  Creative Mind
                </span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your handshake, one source for viral tech tricks, gaming news, and daily dose of internet culture. We unlock the potential of the digital world for you.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition shadow-sm" aria-label="Facebook">
                <i className="fab fa-facebook-f text-xs"></i>
              </a>
              <a href="https://t.me/creativemind7" className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white flex items-center justify-center transition shadow-sm" aria-label="Telegram">
                <i className="fab fa-telegram text-xs"></i>
              </a>
              <a href="https://www.instagram.com/filmy4uhd?igsh=cG93eDEyc3d2Nmc3" className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500 hover:text-white flex items-center justify-center transition shadow-sm" aria-label="Instagram">
                <i className="fab fa-instagram text-xs"></i>
              </a>
              <a href="https://youtube.com/@creativemind77-b8t?si=HyiSpwJhlz2B9f5M" className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 hover:bg-[#FF0000] hover:text-white flex items-center justify-center transition shadow-sm" aria-label="YouTube">
                <i className="fab fa-youtube text-xs"></i>
              </a>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="md:col-span-2 md:pl-10">
            <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200">
              <div className="md:flex md:items-center md:justify-between gap-6">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Subscribe to our Newsletter</h3>
                  <p className="text-gray-600 text-sm">Get the latest viral tips, tricks, and tech news delivered directly to your inbox.</p>
                </div>
                <div className="flex-1 max-w-sm">
                   <form className="flex rounded-lg shadow-sm overflow-hidden">
                      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                      <input 
                        id="newsletter-email"
                        type="email" 
                        placeholder="Enter email address" 
                        className="flex-1 px-4 py-3 bg-white border border-gray-300 outline-none text-sm text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required 
                      />
                      <button type="submit" className="bg-blue-600 text-white px-6 py-3 font-bold text-sm hover:bg-blue-700 transition focus:ring-2 focus:ring-offset-2 focus:ring-blue-600">
                        JOIN
                      </button>
                   </form>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Categories Cloud Section */}
      <div className="bg-[#1e293b] py-10 px-4 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-6 opacity-90">Explore Categories</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {allTags.length > 0 ? allTags.map(tag => (
              <Link 
                key={tag} 
                to={`/category/${getCategorySlug(tag)}`}
                className="px-4 py-2 bg-[#334155] text-gray-200 rounded-full text-xs font-medium hover:bg-blue-600 hover:text-white transition-colors capitalize border border-gray-600"
              >
                {tag}
              </Link>
            )) : (
              // Fallback if no tags yet
              ['Free Followers', 'Instagram', 'AI', 'CapCut', 'ChatGPT', 'Google Ai Studio', 'Psychology', 'YouTube', 'Image', 'Image Genrate', 'Blogger', 'Bot', 'Earn Money Online'].map(tag => (
                 <Link 
                  key={tag} 
                  to={`/category/${getCategorySlug(tag)}`}
                  className="px-4 py-2 bg-[#334155] text-gray-200 rounded-full text-xs font-medium hover:bg-blue-600 hover:text-white transition-colors capitalize border border-gray-600"
                >
                  {tag}
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="bg-gray-900 py-6 text-center text-gray-400 text-xs border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
           <p>&copy; {new Date().getFullYear()} Creative Mind. All rights reserved.</p>
           <div className="mt-2 md:mt-0 space-x-4">
             <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
             <Link to="/" className="hover:text-white transition-colors">Terms of Service</Link>
             <Link to="/" className="hover:text-white transition-colors">Contact</Link>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;