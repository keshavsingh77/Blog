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
  const showInContentAd = paragraphs.length > 2;

  if (showInContentAd) {
    const splitIndex = Math.ceil(paragraphs.length / 2);
    contentBeforeAd = paragraphs.slice(0, splitIndex).join('</p>') + '</p>';
    contentAfterAd = paragraphs.slice(splitIndex).join('</p>');
  }

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen pt-16 transition-colors duration-300">
      <SEO title={post.title} description={descriptionSnippet} />
      
      {/* 1. Hero Poster Image */}
      <div className="w-full relative h-[350px] md:h-[550px] overflow-hidden bg-gray-900">
         <div className="absolute inset-0">
             <img className="w-full h-full object-cover opacity-90" src={post.imageUrl} alt={post.title} />
         </div>
         <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
         <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-20 text-white max-w-7xl mx-auto">
            <Link to={`/category/${getCategorySlug(displayCategory)}`} className="inline-block bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 mb-4 rounded-lg shadow-xl">
              {displayCategory}
            </Link>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black leading-tight mb-4 drop-shadow-2xl">
                {post.title}
            </h1>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* AD PLACEMENT 1: Below Poster Image */}
        <div className="mb-10">
           <GoogleAd 
              slot="1641433819" 
              format="horizontal" 
              height="90px" 
              className="rounded-xl overflow-hidden shadow-sm" 
           />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <main className="lg:col-span-8">
            <article className="prose prose-lg md:prose-xl dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
                <div dangerouslySetInnerHTML={{ __html: contentBeforeAd }} />
                
                {/* AD PLACEMENT 2: In-Article Ad In Content Flow */}
                <GoogleAd 
                  slot="1641433819" 
                  format="fluid" 
                  layout="in-article" 
                  className="my-14 border-y border-gray-100 dark:border-gray-800 py-10" 
                />
                
                {contentAfterAd && <div dangerouslySetInnerHTML={{ __html: contentAfterAd }} />}
            </article>

            {/* Author Section (Myself) */}
            <div id="author-section" className="mt-16 bg-gray-50 dark:bg-gray-900/50 rounded-[2.5rem] p-8 md:p-10 border border-gray-100 dark:border-gray-800">
               <div className="flex items-center space-x-6 mb-8">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
                    CM
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-900 dark:text-white">About Creative Mind</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Unlocking viral tech secrets and digital wizardry.</p>
                  </div>
               </div>
               
               {/* AD PLACEMENT 3: Below Myself Section */}
               <GoogleAd 
                  slot="1641433819" 
                  format="rectangle" 
                  height="280px" 
                  className="rounded-3xl shadow-md border border-gray-100 dark:border-gray-800" 
               />
            </div>

            {/* Recommended Posts Section (Like) */}
            <div id="related-section" className="mt-16 pt-16 border-t border-gray-100 dark:border-gray-800/60">
               <div className="flex items-center mb-10">
                  <div className="w-2 h-8 bg-blue-600 rounded-full mr-4"></div>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Viral Recommendations</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {relatedPosts.map(p => <PostCard key={p.id} post={p} />)}
               </div>

               {/* AD PLACEMENT 4: Below Like Section (Sponsored Multiplex) */}
               <GoogleAd 
                  slot="1909584638" 
                  format="autorelaxed" 
                  height="550px" 
                  className="rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800" 
               />
            </div>
          </main>

          <aside className="lg:col-span-4">
             <div className="sticky top-24 space-y-12">
                 <GoogleAd 
                    slot="1641433819" 
                    format="rectangle" 
                    height="280px" 
                    className="shadow-xl rounded-3xl"
                 />

                 <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-[3rem] shadow-sm">
                    <h4 className="font-black text-gray-900 dark:text-white uppercase mb-6 text-[10px] tracking-[0.4em] opacity-60">Trending Now</h4>
                    <div className="space-y-6">
                        {trendingPosts.map((tp, idx) => (
                            <Link key={tp.id} to={`/post/${tp.id}`} className="flex items-start group">
                                <span className="text-4xl font-black text-gray-100 dark:text-gray-800 group-hover:text-blue-500 transition-colors w-12 text-center">
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

                 <GoogleAd 
                    slot="1641433819" 
                    format="vertical" 
                    height="600px" 
                    className="rounded-3xl shadow-sm" 
                 />
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PostPage;