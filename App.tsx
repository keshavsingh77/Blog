
import React, { Suspense, useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { BlogProvider } from './context/BlogContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ErrorBoundary from './components/ErrorBoundary';
import { SkeletonPostDetail, SkeletonCard } from './components/SkeletonLoaders';

const CategoryPage = React.lazy(() => import('./pages/CategoryPage'));
const PostPage = React.lazy(() => import('./pages/PostPage'));
const PrivacyPage = React.lazy(() => import('./pages/PrivacyPage'));
const TermsPage = React.lazy(() => import('./pages/TermsPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));

const LazyAdSense = () => {
  useEffect(() => {
    if (document.getElementById('adsense-script')) return;

    const loadAds = () => {
      if (document.getElementById('adsense-script')) return;
      
      const script = document.createElement('script');
      script.id = 'adsense-script';
      script.async = true;
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9543073887536718";
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);

      window.removeEventListener('scroll', onInteraction);
      window.removeEventListener('mousemove', onInteraction);
      window.removeEventListener('touchstart', onInteraction);
      window.removeEventListener('keydown', onInteraction);
    };

    const onInteraction = () => {
       if ('requestIdleCallback' in window) {
         (window as any).requestIdleCallback(loadAds, { timeout: 2000 });
       } else {
         setTimeout(loadAds, 200);
       }
    };

    window.addEventListener('scroll', onInteraction, { passive: true, once: true });
    window.addEventListener('mousemove', onInteraction, { passive: true, once: true });
    window.addEventListener('touchstart', onInteraction, { passive: true, once: true });
    window.addEventListener('keydown', onInteraction, { passive: true, once: true });

    return () => {
      window.removeEventListener('scroll', onInteraction);
      window.removeEventListener('mousemove', onInteraction);
      window.removeEventListener('touchstart', onInteraction);
      window.removeEventListener('keydown', onInteraction);
    };
  }, []);

  return null;
};

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const currentScroll = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrollHeight > 0) {
        setScrollProgress(Number((currentScroll / scrollHeight).toFixed(2)) * 100);
      }
    };

    window.addEventListener('scroll', updateScrollProgress);
    
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[100]">
      <div 
        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};

const PageLoader = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
     <SkeletonCard /> <SkeletonCard /> <SkeletonCard />
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BlogProvider>
        <HashRouter>
          <LazyAdSense />
          <ScrollProgress />
          <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
            <Header />
            <main className="flex-grow">
              <Suspense fallback={<SkeletonPostDetail />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/category/:slug" element={<Suspense fallback={<PageLoader />}><CategoryPage /></Suspense>} />
                  <Route path="/post/:id" element={<Suspense fallback={<SkeletonPostDetail />}><PostPage /></Suspense>} />
                  <Route path="/privacy-policy" element={<Suspense fallback={<PageLoader />}><PrivacyPage /></Suspense>} />
                  <Route path="/terms-of-service" element={<Suspense fallback={<PageLoader />}><TermsPage /></Suspense>} />
                  <Route path="/contact" element={<Suspense fallback={<PageLoader />}><ContactPage /></Suspense>} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </HashRouter>
      </BlogProvider>
    </ErrorBoundary>
  );
};

export default App;
