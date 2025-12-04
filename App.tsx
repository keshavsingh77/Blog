import React, { Suspense, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { BlogProvider } from './context/BlogContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import { SkeletonPostDetail, SkeletonCard } from './components/SkeletonLoaders';

// Lazy load secondary pages to reduce initial bundle size and improve TBT
const CategoryPage = React.lazy(() => import('./pages/CategoryPage'));
const PostPage = React.lazy(() => import('./pages/PostPage'));
const AdminPage = React.lazy(() => import('./pages/AdminPage'));

// Component to Lazy Load AdSense Script
const LazyAdSense = () => {
  useEffect(() => {
    let scriptLoaded = false;

    const loadAds = () => {
      if (scriptLoaded || document.getElementById('adsense-script')) return;
      scriptLoaded = true;

      const script = document.createElement('script');
      script.id = 'adsense-script';
      script.async = true;
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9543073887536718";
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    };

    const onInteraction = () => {
      loadAds();
      window.removeEventListener('scroll', onInteraction);
      window.removeEventListener('mousemove', onInteraction);
      window.removeEventListener('touchstart', onInteraction);
      window.removeEventListener('keydown', onInteraction);
    };

    window.addEventListener('scroll', onInteraction, { passive: true });
    window.addEventListener('mousemove', onInteraction, { passive: true });
    window.addEventListener('touchstart', onInteraction, { passive: true });
    window.addEventListener('keydown', onInteraction, { passive: true });

    const timeoutId = setTimeout(loadAds, 7000);

    return () => {
      window.removeEventListener('scroll', onInteraction);
      window.removeEventListener('mousemove', onInteraction);
      window.removeEventListener('touchstart', onInteraction);
      window.removeEventListener('keydown', onInteraction);
      clearTimeout(timeoutId);
    };
  }, []);

  return null;
};

const PageLoader = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
       <SkeletonCard />
       <SkeletonCard />
       <SkeletonCard />
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <BlogProvider>
      <HashRouter>
        <LazyAdSense />
        
        <div className="flex flex-col min-h-screen bg-white">
          <Header />
          <main className="flex-grow">
            <Suspense fallback={<SkeletonPostDetail />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route 
                  path="/category/:slug" 
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <CategoryPage />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/post/:id" 
                  element={
                    <Suspense fallback={<SkeletonPostDetail />}>
                      <PostPage />
                    </Suspense>
                  } 
                />
                <Route 
                   path="/admin" 
                   element={
                     <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading Admin...</div>}>
                       <AdminPage />
                     </Suspense>
                   } 
                />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </BlogProvider>
  );
};

export default App;