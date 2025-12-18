
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

      {/* Top Post Ad - Highly visible */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <GoogleAd slot="1641433819" format="horizontal" className="mt-0" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <main className="lg:col-span-8">
            <article className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
                <div dangerouslySetInnerHTML={{ __html: contentBeforeAd }} />
                
                {/* In-Article Ad - Best for mobile reading */}
                <GoogleAd slot="1641433819" format="fluid" layout="in-article" className="my-10" />
                
                {contentAfterAd && <div dangerouslySetInnerHTML={{ __html: contentAfterAd }} />}
            </article>

            {/* Bottom Ad Unit - Before related content */}
            <GoogleAd slot="1909584638" format="autorelaxed" className="mt-12" />

            {relatedPosts.length > 0 && (
                <div className="mt-12 pt-12 border-t border-gray-100 dark:border-gray-800">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8">Related Stories</h3>
                    <div className="grid grid-cols-2 gap-5 md:gap-6">
                        {relatedPosts.map(p => <PostCard key={p.id} post={p} />)}
                    </div>
                </div>
            )}
          </main>

          <aside className="lg:col-span-4 space-y-8">
             <div className="sticky top-24 space-y-8">
                 {/* Sidebar Sticky Ad */}
                 <GoogleAd slot="1641433819" format="rectangle" responsive={false} style={{ height: '250px' }} />

                 <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-3xl shadow-sm">
                    <h4 className="font-black text-gray-900 dark:text-white uppercase mb-6 text-sm tracking-widest flex items-center">
                        Trending Now
                    </h4>
                    <div className="space-y-6">
                        {trendingPosts.map((tp, idx) => (
                            <Link key={tp.id} to={`/post/${tp.id}`} className="flex items-start group">
                                <span className="text-2xl font-black text-gray-200 dark:text-gray-800 group-hover:text-red-500 transition-colors leading-none w-8 text-center">
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
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
