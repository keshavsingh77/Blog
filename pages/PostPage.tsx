
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import SEO from '../components/SEO';
import PostCard from '../components/PostCard';
import GoogleAd from '../components/GoogleAd'; // Import GoogleAd
import { SkeletonPostDetail } from '../components/SkeletonLoaders';

const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPostById, posts, isLoading } = useBlog();
  const navigate = useNavigate();
  const post = id ? getPostById(id) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return <SkeletonPostDetail />;
  }

  if (!post) {
    return (
      <div className="text-center py-20 bg-gray-50 min-h-[80vh] flex flex-col justify-center items-center">
        <SEO title="Post Not Found" description="The requested post could not be found." />
        <div className="text-7xl text-gray-200 mb-6"><i className="fas fa-ghost"></i></div>
        <h2 className="text-4xl font-black text-gray-800 mb-4 tracking-tight">Post not found</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">It seems the article you are looking for has been moved or deleted.</p>
        <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-xl hover:shadow-2xl hover:-translate-y-1 transform focus:outline-none focus:ring-4 focus:ring-blue-200">Go back to Home</Link>
      </div>
    );
  }

  const getCategorySlug = (text: string) => text.toLowerCase().replace(/\s+/g, '-');
  
  // Logic: Use the first tag as the "Display Category"
  const displayCategory = post.tags && post.tags.length > 0 ? post.tags[0] : post.category;
  
  const plainTextContent = post.content.replace(/<[^>]+>/g, '');
  const descriptionSnippet = plainTextContent.substring(0, 160).trim() + (plainTextContent.length > 160 ? '...' : '');

  // Related Posts Logic
  const relatedPosts = posts.filter(p => 
      p.id !== post.id && (
      p.category === post.category || 
      p.tags.some(tag => post.tags.includes(tag))
      )
  ).slice(0, 4);

  // Recent Posts Logic
  const recentPosts = posts.filter(p => 
      p.id !== post.id && !relatedPosts.find(rp => rp.id === p.id)
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);

  // Trending Posts
  const trendingPosts = [...posts]
    .filter(p => p.id !== post.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);

  // --- SMART CONTENT SPLITTING FOR ADS ---
  // Split content by paragraph closing tag to inject ad after the 2nd paragraph
  const paragraphs = post.content.split('</p>');
  let contentBeforeAd = post.content;
  let contentAfterAd = '';
  const showInContentAd = paragraphs.length > 2;

  if (showInContentAd) {
    // Reconstruct the first 2 paragraphs (adding the closing tag back)
    contentBeforeAd = paragraphs.slice(0, 2).join('</p>') + '</p>';
    // The rest of the content
    contentAfterAd = paragraphs.slice(2).join('</p>');
  }

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900 pt-16">
      <SEO title={post.title} description={descriptionSnippet} />
      
      {/* Article Header / Hero */}
      <div className="w-full relative h-[350px] md:h-[550px] overflow-hidden bg-gray-900 group">
         <div className="absolute inset-0">
             <img 
               className="w-full h-full object-cover opacity-90 scale-100 group-hover:scale-105 transition-transform duration-[3s]" 
               src={post.imageUrl} 
               alt={post.title} 
               fetchPriority="high"
               width="1280"
               height="720"
             />
         </div>
         {/* Gradients for text readability */}
         <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
         
         <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-20 text-white max-w-7xl mx-auto animate-fade-in-up">
            <Link 
              to={`/category/${getCategorySlug(displayCategory)}`} 
              className="inline-block bg-blue-600/90 backdrop-blur-md text-white text-[10px] md:text-xs font-black uppercase tracking-widest px-3 py-1.5 md:px-4 md:py-2 mb-4 md:mb-6 rounded-lg shadow-lg hover:bg-blue-600 transition transform hover:-translate-y-0.5"
            >
              {displayCategory}
            </Link>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-4 md:mb-6 shadow-sm max-w-5xl tracking-tight drop-shadow-lg">
                {post.title}
            </h1>
            <div className="flex flex-wrap items-center text-xs md:text-sm font-bold text-gray-300 gap-4 md:gap-8 border-t border-gray-700/50 pt-4 md:pt-6 w-full md:w-auto">
              <span className="flex items-center text-white"><i className="fas fa-user-circle text-xl mr-2 text-blue-500" aria-hidden="true"></i> {post.author || 'Creative Admin'}</span>
              <span className="flex items-center"><i className="far fa-clock mr-2 text-gray-400" aria-hidden="true"></i> {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="flex items-center"><i className="far fa-eye mr-2 text-gray-400" aria-hidden="true"></i> 5 min read</span>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content Column */}
          <main className="lg:col-span-8">
            
            {/* Article Content */}
            <article className="prose prose-lg md:prose-xl max-w-none text-gray-800 leading-relaxed prose-headings:font-black prose-headings:tracking-tight prose-a:text-blue-600 prose-img:rounded-2xl prose-img:shadow-lg animate-fade-in-up delay-100">
                
                {/* 1. First Part of Content (First 2 paragraphs) */}
                <div dangerouslySetInnerHTML={{ __html: contentBeforeAd }} className="first-letter:float-left first-letter:text-5xl first-letter:pr-3 first-letter:font-black first-letter:text-blue-600 first-letter:mt-[-4px]" />
                
                {/* 2. In-Article Ad (Injected here for high CTR) */}
                <div className="my-8 block w-full min-h-[100px] overflow-hidden">
                   <div className="text-[10px] text-gray-400 text-center uppercase tracking-widest mb-1">Advertisement</div>
                   <GoogleAd 
                     slot="1641433819" 
                     format="fluid" 
                     layout="in-article" 
                     style={{ display: 'block', textAlign: 'center' }}
                   />
                </div>

                {/* 3. Remaining Content */}
                {contentAfterAd && (
                   <div dangerouslySetInnerHTML={{ __html: contentAfterAd }} />
                )}
            </article>

            {/* Bottom Ad (Multiplex - Auto Relaxed) */}
            <div className="mt-12 mb-8 block w-full min-h-[100px]">
                <div className="text-[10px] text-gray-400 text-center uppercase tracking-widest mb-1">Sponsored Links</div>
                <GoogleAd 
                  slot="8617081290" 
                  format="autorelaxed" 
                />
            </div>

            {/* Categories Section (derived from tags) */}
            {post.tags && post.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                    <div className="flex items-center mb-6">
                        <span className="w-1 h-6 bg-blue-600 rounded mr-3"></span>
                        <h4 className="text-gray-900 font-black uppercase text-sm tracking-widest">Categories</h4>
                    </div>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                        {post.tags.map(tag => (
                            <Link 
                                key={tag} 
                                to={`/category/${getCategorySlug(tag)}`}
                                className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-bold bg-gray-50 text-gray-700 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-gray-200 hover:border-blue-600"
                            >
                                <i className="fas fa-hashtag text-[10px] mr-2 opacity-60"></i> {tag}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Share Buttons */}
            <div className="mt-12">
                <div className="p-6 md:p-8 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 rounded-3xl border border-gray-100 shadow-sm text-center">
                    <h3 className="font-black text-gray-900 text-lg md:text-xl mb-6 flex items-center justify-center">
                        <i className="fas fa-share-nodes mr-3 text-blue-500"></i> Share this Story
                    </h3>
                    <div className="flex justify-center gap-3 md:gap-4 flex-wrap">
                        <button className="flex-1 min-w-[120px] bg-[#1877F2] text-white px-4 py-3.5 rounded-2xl text-sm font-bold hover:shadow-xl hover:shadow-blue-900/10 hover:-translate-y-0.5 transition flex justify-center items-center" aria-label="Share on Facebook">
                            <i className="fab fa-facebook-f mr-2.5 text-lg" aria-hidden="true"></i> Facebook
                        </button>
                        <button className="flex-1 min-w-[120px] bg-[#0088cc] text-white px-4 py-3.5 rounded-2xl text-sm font-bold hover:shadow-xl hover:shadow-blue-400/20 hover:-translate-y-0.5 transition flex justify-center items-center" aria-label="Share on Telegram">
                            <i className="fab fa-telegram mr-2.5 text-lg" aria-hidden="true"></i> Telegram
                        </button>
                        <button className="flex-1 min-w-[120px] bg-[#25D366] text-white px-4 py-3.5 rounded-2xl text-sm font-bold hover:shadow-xl hover:shadow-green-900/10 hover:-translate-y-0.5 transition flex justify-center items-center" aria-label="Share on WhatsApp">
                            <i className="fab fa-whatsapp mr-2.5 text-lg" aria-hidden="true"></i> WhatsApp
                        </button>
                    </div>
                </div>
            </div>

            {/* Author Bio (Enhanced) */}
            <div className="mt-12 bg-white border border-gray-100 p-8 rounded-3xl shadow-lg shadow-gray-100 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[4rem] -mr-8 -mt-8 z-0"></div>
                <div className="flex-shrink-0 relative z-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl rotate-3 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-500/30">
                        {post.author ? post.author.charAt(0) : 'C'}
                    </div>
                </div>
                <div className="flex-grow relative z-10">
                    <h3 className="text-2xl font-black text-gray-900 mb-1">{post.author || 'Creative Admin'}</h3>
                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wide mb-4 bg-blue-50 inline-block px-2 py-1 rounded">Senior Editor</p>
                    <p className="text-gray-700 text-base leading-relaxed mb-5 font-medium">
                        Passionate about technology, gaming, and the latest digital trends. dedicated to bringing you the most viral and useful content from around the web.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                        <a 
                            href="https://t.me/creativemind7" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-600 transition-all shadow-md hover:shadow-lg flex items-center group"
                            aria-label="Follow Author on Telegram"
                        >
                            <i className="fab fa-telegram-plane mr-2 group-hover:scale-110 transition-transform"></i> Follow Author
                        </a>
                        <div className="flex space-x-5 text-gray-400">
                             <a href="https://t.me/creativemind7" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-transform hover:scale-110" aria-label="Telegram"><i className="fab fa-telegram text-lg"></i></a>
                            <a href="https://www.instagram.com/filmy4uhd?igsh=cG93eDEyc3d2Nmc3" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition-transform hover:scale-110" aria-label="Instagram"><i className="fab fa-instagram text-lg"></i></a>
                            <a href="https://youtube.com/@creativemind77-b8t?si=HyiSpwJhlz2B9f5M" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-transform hover:scale-110" aria-label="YouTube"><i className="fab fa-youtube text-lg"></i></a>
                        </div>
                    </div>
                </div>
            </div>

            {/* You Might Also Like */}
            {relatedPosts.length > 0 && (
                <div className="mt-20">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-2xl font-black text-gray-900 flex items-center">
                            <span className="w-2 h-8 bg-yellow-400 rounded-full mr-3"></span>
                            You Might Also Like
                       </h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-5 md:gap-8">
                        {relatedPosts.map(p => (
                            <PostCard key={p.id} post={p} />
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Uploads Section */}
            <div className="mt-20">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-gray-900 border-l-4 border-red-500 pl-4">Recent Uploads</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
                    {recentPosts.map(p => (
                        <PostCard key={p.id} post={p} />
                    ))}
                </div>
            </div>

             <div className="mt-12 border-t pt-8 flex justify-between">
                <button 
                  onClick={() => navigate(-1)} 
                  className="text-gray-600 hover:text-blue-600 font-bold flex items-center transition px-5 py-3 rounded-xl hover:bg-gray-100 focus:outline-none"
                  aria-label="Back to Feed"
                >
                  <i className="fas fa-arrow-left mr-2" aria-hidden="true"></i> Back to Feed
                </button>
             </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
             <div className="sticky top-24 space-y-8">
                 
                 {/* Trending Now Widget */}
                 <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="font-black text-gray-900 uppercase mb-6 text-sm tracking-widest flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                        Trending Now
                    </h4>
                    <div className="space-y-6">
                        {trendingPosts.map((tp, idx) => {
                             // Determine display category for trending items
                             const trendingCat = tp.tags && tp.tags.length > 0 ? tp.tags[0] : tp.category;
                             return (
                                <Link key={tp.id} to={`/post/${tp.id}`} className="flex items-start group">
                                    <span className="text-3xl font-black text-gray-200 group-hover:text-red-500 transition-colors leading-none -mt-1 w-8 text-center font-mono">
                                        {idx + 1}
                                    </span>
                                    <div className="flex-1 ml-4 border-b border-gray-50 pb-4 group-last:border-0 group-last:pb-0">
                                        <h5 className="font-bold text-gray-800 leading-snug text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {tp.title}
                                        </h5>
                                        <span className="text-[10px] text-gray-400 font-bold mt-1.5 block uppercase tracking-wide">{trendingCat}</span>
                                    </div>
                                </Link>
                             );
                        })}
                    </div>
                 </div>
                 
                 {/* Categories / Topics Widget */}
                 <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden group">
                    {/* Decorative bg element */}
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-blue-600 rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition-opacity"></div>
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-indigo-600 rounded-full opacity-20 blur-2xl"></div>
                    
                    <h4 className="font-bold uppercase mb-6 text-sm tracking-widest relative z-10 flex items-center">
                        <i className="fas fa-compass mr-2 text-blue-400"></i> Explore Categories
                    </h4>
                    <div className="flex flex-wrap gap-2 relative z-10">
                        {['Tech', 'Gaming', 'Viral', 'Money', 'Tips', 'Movies', 'Reviews', 'Shorts'].map(tag => (
                             <Link key={tag} to={`/category/${getCategorySlug(tag)}`} className="text-xs font-bold bg-white/10 hover:bg-white hover:text-gray-900 border border-white/10 hover:border-white px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 backdrop-blur-sm">
                                 {tag}
                             </Link>
                        ))}
                    </div>
                 </div>
             </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default PostPage;
