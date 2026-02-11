import React, { useEffect, useMemo, Suspense, lazy } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import SEO from '../components/SEO';
import PostCard from '../components/PostCard';
import { SkeletonPostDetail } from '../components/SkeletonLoaders';

const BOT_USERNAME = "SDMOVIEPOINT_bot"; // Updated bot name

const GoogleAd = lazy(() => import('../components/GoogleAd'));

const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { posts, isLoading, getPostById } = useBlog();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || localStorage.getItem('bot_file_token');

  const post = useMemo(() => id ? getPostById(id) : undefined, [id, posts, getPostById]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) return <SkeletonPostDetail />;

  if (!post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-3xl flex items-center justify-center text-4xl mb-6">
          <i className="fas fa-ghost"></i>
        </div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tighter">Content Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">This post might have been moved or the URL is incorrect.</p>
        <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl">BACK TO HOME</button>
      </div>
    );
  }

  const related = posts.filter(p => p.id !== post.id && p.category === post.category).slice(0, 4);
  const paragraphs = post.content.split('</p>');
  const midPoint = Math.ceil(paragraphs.length / 2);

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <SEO title={post.title} description={post.content.replace(/<[^>]+>/g, '').substring(0, 160)} image={post.imageUrl} />

      <div className="relative w-full h-[50vh] md:h-[70vh] bg-gray-900">
        <img src={post.imageUrl} className="w-full h-full object-cover" alt={post.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-20">
          <div className="max-w-7xl mx-auto">
            <Link to={`/category/${post.category.toLowerCase().replace(/\s+/g, '-')}`} className="inline-block bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-lg mb-6 shadow-2xl">
              {post.category}
            </Link>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white leading-[1.1] drop-shadow-2xl max-w-5xl tracking-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {token && (
          <div className="mb-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-6 rounded-3xl text-center animate-pulse">
            <p className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3">
              <i className="fas fa-info-circle"></i>
              Step 2: Scroll down to the bottom of this post for your Secure Download Link
            </p>
          </div>
        )}
        {/* Top Responsive Banner */}
        <Suspense fallback={<div className="h-24 bg-gray-100 dark:bg-gray-900 animate-pulse rounded-2xl mb-12" />}>
          <GoogleAd slot="1641433819" format="auto" responsive={true} className="mb-12 rounded-2xl overflow-hidden w-full" />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <main className="lg:col-span-8">
            <article className="prose prose-base sm:prose-lg lg:prose-xl dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed sm:leading-loose">
              <div dangerouslySetInnerHTML={{ __html: paragraphs.slice(0, midPoint).join('</p>') + (paragraphs.length > midPoint ? '</p>' : '') }} />

              {/* Native In-Article Fluid Ad */}
              <Suspense fallback={<div className="h-64 bg-gray-100 dark:bg-gray-900 animate-pulse rounded-2xl my-12" />}>
                <GoogleAd
                  slot="1641433819"
                  format="fluid"
                  layout="in-article"
                  className="my-12 md:my-20 border-y border-gray-100 dark:border-gray-800 py-10 w-full"
                />
              </Suspense>

              <div dangerouslySetInnerHTML={{ __html: paragraphs.slice(midPoint).join('</p>') }} />

              {token && (
                <div className="mt-20 p-12 md:p-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 border-4 border-dashed border-blue-500/20 rounded-[3rem] text-center shadow-2xl animate-fade-in-up">
                  <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-8 text-white shadow-[0_20px_40px_-10px_rgba(59,130,246,0.5)]">
                    <i className="fas fa-file-shield"></i>
                  </div>
                  <h3 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6 leading-tight">
                    Your Secure Link <br className="hidden md:block" /> is Deployed!
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-medium mb-12 max-w-xl mx-auto leading-relaxed">
                    The requested file has been validated. Click below to return to <span className="text-blue-600 font-black">Telegram</span> and receive your content.
                  </p>
                  <a
                    href={`https://t.me/${BOT_USERNAME}?start=${token}`}
                    className="group relative inline-flex items-center gap-4 bg-[#0088cc] text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-[#0077bb] transition-all shadow-2xl hover:scale-[1.05] active:scale-95"
                  >
                    <i className="fab fa-telegram-plane text-2xl group-hover:rotate-12 transition-transform"></i>
                    <span className="text-lg">Get Final File</span>
                  </a>

                  <div className="mt-12 flex items-center justify-center gap-4 opacity-20">
                    <span className="w-12 h-px bg-gray-400"></span>
                    <i className="fas fa-lock text-xs"></i>
                    <span className="w-12 h-px bg-gray-400"></span>
                  </div>
                </div>
              )}
            </article>

            <div className="mt-20 bg-gray-50 dark:bg-gray-900 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 border border-gray-100 dark:border-gray-800">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-2xl shrink-0">CM</div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">About Creative Mind</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-3 font-medium text-lg leading-relaxed">Unlocking viral digital trends and tech secrets daily. Join our community of 50k+ readers.</p>
                </div>
              </div>

              {/* Standard Rectangle Ad */}
              <Suspense fallback={<div className="h-64 bg-gray-100 dark:bg-gray-900 animate-pulse rounded-3xl mt-10" />}>
                <GoogleAd slot="1641433819" format="rectangle" responsive={true} className="mt-10 rounded-3xl w-full" />
              </Suspense>
            </div>

            <div className="mt-20">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-10 uppercase tracking-tighter border-l-8 border-blue-600 pl-6">Related Stories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {related.map(p => <PostCard key={p.id} post={p} />)}
              </div>

              {/* Multiplex Footer Ad */}
              <Suspense fallback={<div className="h-64 bg-gray-100 dark:bg-gray-900 animate-pulse rounded-[2.5rem] mt-12" />}>
                <GoogleAd slot="1909584638" format="autorelaxed" className="mt-12 rounded-[2.5rem] shadow-2xl w-full" />
              </Suspense>
            </div>
          </main>

          <aside className="lg:col-span-4 space-y-12">
            <div className="sticky top-24">
              <div className="bg-blue-600 text-white p-8 rounded-3xl mb-8 shadow-xl">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 opacity-80">Newsletter</h4>
                <p className="text-xl font-black mb-6 leading-tight uppercase text-white">Get Viral Secrets</p>
                <div className="space-y-3">
                  <input type="email" placeholder="Email Address" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 placeholder:text-white/50 outline-none focus:bg-white/20 transition-all text-sm text-white" />
                  <button className="w-full bg-white text-blue-600 font-black py-3 rounded-xl uppercase text-xs tracking-widest hover:bg-gray-100 transition-colors">Subscribe</button>
                </div>
              </div>

              {/* Vertical Sidebar Ad */}
              <Suspense fallback={<div className="h-[600px] bg-gray-100 dark:bg-gray-900 animate-pulse rounded-3xl" />}>
                <GoogleAd
                  slot="1641433819"
                  format="vertical"
                  height="600px"
                  responsive={true}
                  className="rounded-3xl shadow-sm w-full"
                />
              </Suspense>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PostPage;