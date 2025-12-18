
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import SEO from '../components/SEO';
import PostCard from '../components/PostCard';
import GoogleAd from '../components/GoogleAd';
import { SkeletonPostDetail } from '../components/SkeletonLoaders';

const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPostById, posts, isLoading } = useBlog();
  const post = id ? getPostById(id) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return <SkeletonPostDetail />;
  }

  if (!post) {
    return (
      <div className="text-center py-20 bg-gray-50 dark:bg-gray-950 min-h-[80vh] flex flex-col justify-center items-center">
        <SEO title="Post Not Found" description="The requested post could not be found." />
        <h2 className="text-4xl font-black text-gray-800 dark:text-gray-200 mb-4 tracking-tight">Post not found</h2>
        <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold">Go back to Home</Link>
      </div>
    );
  }

  const getCategorySlug = (text: string) => text.toLowerCase().replace(/\s+/g, '-');
  const displayCategory = post.tags && post.tags.length > 0 ? post.tags[0] : post.category;
  
  const plainTextContent = post.content.replace(/<[^>]+>/g, '');
  const descriptionSnippet = plainTextContent.substring(0, 160).trim();

  const relatedPosts = posts.filter(p => p.id !== post.id && (p.category === post.category || p.tags.some(tag => post.tags.includes(tag)))).slice(0, 4);
  const trendingPosts = [...posts].filter(p => p.id !== post.id).sort(() => 0.5 - Math.random()).slice(0, 5);

  const paragraphs = post.content.split('</p>');
  let contentBeforeAd = post.content;
  let contentAfterAd = '';
  const showInContentAd = paragraphs.length > 3;

  if (showInContentAd) {
    const splitIndex = Math.ceil(paragraphs.length / 2);
    contentBeforeAd = paragraphs.slice(0, splitIndex).join('</p>') + '</p>';
    contentAfterAd = paragraphs.slice(splitIndex).join('</p>');
  }

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen pt-16 transition-colors duration-300">
      <SEO title={post.title} description={descriptionSnippet} />
      
      {/* Hero Header */}
      <div className="w-full relative h-[350px] md:h-[550px] overflow-hidden bg-gray-900">
         <div className="absolute inset-0">
             <img className="w-full h-full object-cover opacity-90" src={post.imageUrl} alt={post.title} />
         </div>
         <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
         <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-20 text-white max-w-7xl mx-auto">
            <Link to={`/category/${getCategorySlug(displayCategory)}`} className="inline-block bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 mb-4 rounded-lg">
              {displayCategory}
            </Link>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-4 drop-shadow-lg">
                {post.title}
            </h1>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <main className="lg:col-span-8">
            {/* Top Post Ad - Managed size */}
            <GoogleAd slot="1641433819" format="horizontal" height="90px" className="mb-10" />

            <article className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
                <div dangerouslySetInnerHTML={{ __html: contentBeforeAd }} />
                
                {/* In-Article Mid-Post Ad */}
                <GoogleAd slot="1641433819" format="fluid" layout="in-article" className="my-12" />
                
                {contentAfterAd && <div dangerouslySetInnerHTML={{ __html: contentAfterAd }} />}
            </article>

            {/* Bottom Section: MANAGED "Other Stories" Ad Setup */}
            <div className="mt-16 mb-12 border-t border-gray-100 dark:border-gray-800/60 pt-12">
               <div className="flex items-center mb-8">
                  <div className="w-1.5 h-7 bg-blue-600 rounded-full mr-4"></div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase">You Might Also Like</h3>
               </div>
               
               {/* This unit is professionally managed to behave like a standard stories grid */}
               <GoogleAd 
                slot="1909584638" 
                format="autorelaxed" 
                height="500px" 
                className="rounded-[2.5rem] shadow-xl overflow-hidden border-2 border-gray-50 dark:border-gray-800/20" 
               />
            </div>

            {relatedPosts.length > 0 && (
                <div className="mt-12">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center">
                        <span className="w-1.5 h-7 bg-indigo-600 rounded-full mr-4"></span>
                        <span className="uppercase">More From Creative Mind</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-5 md:gap-8">
                        {relatedPosts.map(p => <PostCard key={p.id} post={p} />)}
                    </div>
                </div>
            )}
          </main>

          <aside className="lg:col-span-4 space-y-8">
             <div className="sticky top-24 space-y-8">
                 {/* Sidebar Standard Rectangle */}
                 <GoogleAd 
                    slot="1641433819" 
                    format="rectangle" 
                    height="280px" 
                    className="shadow-md rounded-3xl"
                 />

                 <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-[3rem] shadow-sm">
                    <h4 className="font-black text-gray-900 dark:text-white uppercase mb-6 text-xs tracking-[0.3em] flex items-center opacity-70">
                        <i className="fas fa-chart-line text-blue-600 mr-2"></i> Trending
                    </h4>
                    <div className="space-y-6">
                        {trendingPosts.map((tp, idx) => (
                            <Link key={tp.id} to={`/post/${tp.id}`} className="flex items-start group">
                                <span className="text-4xl font-black text-gray-100 dark:text-gray-800 group-hover:text-blue-500 transition-colors leading-none w-12 text-center">
                                    {idx + 1}
                                </span>
                                <div className="flex-1 ml-4 border-b border-gray-50 dark:border-gray-800 pb-4 group-last:border-0 group-last:pb-0">
                                    <h5 className="font-bold text-gray-800 dark:text-gray-200 leading-snug text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {tp.title}
                                    </h5>
                                </div>
                            </Link>
                        ))}
                    </div>
                 </div>

                 <GoogleAd slot="1641433819" format="vertical" height="600px" />
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
