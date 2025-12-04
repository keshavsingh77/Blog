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
// AdminPage is usually not needed for initial user load
const AdminPage = React.lazy(() => import('./pages/AdminPage'));

// Component to Lazy Load AdSense Script
// This prevents the heavy AdSense script from blocking the main thread during initial load (LCP)
const LazyAdSense = () => {
  useEffect(() => {
    const loadAds = () => {
      // Check if script is already present
      if (document.getElementById('adsense-script')) return;

      const script = document.createElement('script');
      script.id = 'adsense-script';
      script.async = true;
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9543073887536718";
      script.crossOrigin = "anonymous";
      
      script.onload = () => {
        console.log('AdSense Script Loaded');
      };
      
      document.head.appendChild(script);
    };

    // Use requestIdleCallback if available to only load ads when the browser is idle
    // Fallback to timeout for Safari/older browsers
    if ('requestIdleCallback' in window) {
      // @ts-ignore
      window.requestIdleCallback(() => {
        // Still add a minimum delay to prioritize LCP
        setTimeout(loadAds, 4000); 
      }, { timeout: 10000 });
    } else {
       setTimeout(loadAds, 4000);
    }
  }, []);

  return null;
};

// Simple Fallback for Lazy Loaded Pages
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
        {/* Inject AdSense lazily */}
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