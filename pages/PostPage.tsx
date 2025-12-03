import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import SEO from '../components/SEO';
import PostCard from '../components/PostCard';
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
      <div className="text-center py-20 bg-gray-50 min-h-[60vh] flex flex-col justify-center items-center">
        <SEO title="Post Not Found" description="The requested post could not be found." />
        <div className="text-6xl text-gray-300 mb-4"><i className="fas fa-ghost"></i></div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Post not found</h2>
        <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition shadow-lg">Go back to Home</Link>
      </div>
    );
  }

  const getCategorySlug = (text: string) => text.toLowerCase().replace(/\s+/g, '-');
  
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

  return (
    <div className="bg-white min-h-screen font-sans">
      <SEO title={post.title} description={descriptionSnippet} />
      
      {/* Article Header */}
      <div className="w-full relative h-[300px] md:h-[500px] overflow-hidden">
         <div className="absolute inset-0 bg-gray-900">
             <img className="w-full h-full object-cover opacity-80" src={post.imageUrl} alt={post.title} />
         </div>
         <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90"></div>
         <div className="absolute bottom-0 left-0 w-full p-4 md:p-12 lg:p-20 text-white max-w-7xl mx-auto">
            <Link to={`/category/${getCategorySlug(post.category)}`} className="inline-block bg-red-600 text-white text-[10px] md:text-xs font-bold uppercase tracking-widest px-3 py-1 md:px-4 md:py-1.5 mb-3 md:mb-5 rounded shadow-lg hover:bg-red-700 transition transform hover:-translate-y-0.5">
              {post.category}
            </Link>
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-black leading-tight mb-4 md:mb-6 shadow-sm max-w-4xl">{post.title}</h1>
            <div className="flex flex-wrap items-center text-xs md:text-sm font-medium text-gray-300 gap-4 md:gap-6">
              <span className="flex items-center text-white"><i className="fas fa-user-circle text-lg mr-2 text-blue-400"></i> {post.author || 'Creative Admin'}</span>
              <span className="flex items-center"><i className="far fa-clock mr-2 text-blue-400"></i> {new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8">
            
            <article className="prose prose-lg md:prose-xl max-w-none text-gray-800 leading-relaxed mb-4">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            {/* Tags Section */}
            {post.tags && post.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                    <div className="flex items-center mb-5">
                        <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                        <h4 className="text-gray-900 font-bold uppercase text-sm tracking-widest">Related Topics</h4>
                    </div>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                        {post.tags.map(tag => (
                            <Link 
                                key={tag} 
                                to={`/category/${getCategorySlug(tag)}`}
                                className="inline-flex items-center px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-bold bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-lg"
                            >
                                <i className="fas fa-hashtag text-[10px] md:text-xs mr-2 opacity-50"></i>
                                {tag}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Share Buttons */}
            <div className="mt-10 p-4 md:p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 text-base md:text-lg mb-4 text-center">Share this Article</h3>
              <div className="flex justify-center space-x-2 md:space-x-4">
                 <button className="flex-1 bg-[#1877F2] text-white px-3 py-2 md:px-4 md:py-3 rounded-lg text-xs md:text-sm font-bold hover:opacity-90 transition flex justify-center items-center shadow-md"><i className="fab fa-facebook-f mr-2 text-base"></i> <span className="hidden sm:inline">Facebook</span></button>
                 <button className="flex-1 bg-[#1DA1F2] text-white px-3 py-2 md:px-4 md:py-3 rounded-lg text-xs md:text-sm font-bold hover:opacity-90 transition flex justify-center items-center shadow-md"><i className="fab fa-twitter mr-2 text-base"></i> <span className="hidden sm:inline">Twitter</span></button>
                 <button className="flex-1 bg-[#25D366] text-white px-3 py-2 md:px-4 md:py-3 rounded-lg text-xs md:text-sm font-bold hover:opacity-90 transition flex justify-center items-center shadow-md"><i className="fab fa-whatsapp mr-2 text-base"></i> <span className="hidden sm:inline">WhatsApp</span></button>
              </div>
            </div>

            {/* You Might Also Like (Related Posts) */}
            {relatedPosts.length > 0 && (
                <div className="mb-12 mt-12">
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="text-xl md:text-2xl font-black text-gray-900 border-l-4 border-blue-600 pl-4">You Might Also Like</h3>
                       <Link to="/" className="text-sm font-bold text-blue-600 hover:underline">View All</Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-8">
                        {relatedPosts.map(p => (
                            <PostCard key={p.id} post={p} />
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Uploads Section */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl md:text-2xl font-black text-gray-900 border-l-4 border-red-600 pl-4">Recent Uploads</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {recentPosts.map(p => (
                        <PostCard key={p.id} post={p} />
                    ))}
                </div>
            </div>

             <div className="mt-8 border-t pt-8 flex justify-between">
                <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-blue-600 font-bold flex items-center transition px-4 py-2 rounded-lg hover:bg-gray-100">
                  <i className="fas fa-arrow-left mr-2"></i> Back
                </button>
             </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
             <div className="sticky top-24 space-y-8">
                 
                 {/* Author Widget */}
                 <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm text-center">
                    <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-md">
                        <i className="fas fa-user-astronaut"></i>
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg">{post.author || 'Creative Admin'}</h4>
                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wide mb-3">Editor in Chief</p>
                    <button className="w-full border-2 border-blue-600 text-blue-600 font-bold text-sm py-2 rounded-full hover:bg-blue-600 hover:text-white transition">Follow</button>
                 </div>

                 {/* Trending Now Widget */}
                 <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm">
                    <h4 className="font-black text-gray-900 uppercase mb-6 text-lg flex items-center">
                        <span className="w-1 h-6 bg-red-600 mr-3 rounded-full"></span>
                        Trending Now
                    </h4>
                    <div className="space-y-6">
                        {trendingPosts.map((tp, idx) => (
                            <Link key={tp.id} to={`/post/${tp.id}`} className="flex items-center group">
                                <div className="w-8 text-2xl font-black text-gray-200 leading-none group-hover:text-red-500 transition-colors">
                                    {idx + 1}
                                </div>
                                <div className="flex-1 ml-2">
                                    <h5 className="font-bold text-gray-800 leading-snug text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {tp.title}
                                    </h5>
                                    <span className="text-[10px] text-gray-400 uppercase font-bold mt-1 block">{tp.category}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                 </div>
                 
                 {/* Categories Widget */}
                 <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg">
                    <h4 className="font-bold uppercase mb-4 text-sm tracking-wider">Explore Topics</h4>
                    <div className="flex flex-wrap gap-2">
                        {['Tech', 'Gaming', 'Viral', 'Money', 'Tips', 'Movies'].map(tag => (
                             <span key={tag} className="text-xs bg-gray-800 hover:bg-red-600 px-3 py-1.5 rounded-md cursor-pointer transition">
                                 {tag}
                             </span>
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