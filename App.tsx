import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BlogProvider } from './context/BlogContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import GoogleAd from './components/GoogleAd';
import ErrorBoundary from './components/ErrorBoundary';
import { SkeletonPostDetail } from './components/SkeletonLoaders';

const CategoryPage = React.lazy(() => import('./pages/CategoryPage'));
const PostPage = React.lazy(() => import('./pages/PostPage'));
const PrivacyPage = React.lazy(() => import('./pages/PrivacyPage'));
const TermsPage = React.lazy(() => import('./pages/TermsPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));

const LazyAdSense = () => {
  useEffect(() => {
    if (document.getElementById('adsense-script')) return;
    const script = document.createElement('script');
    script.id = 'adsense-script';
    script.async = true;
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9543073887536718";
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }, []);
  return null;
};

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (h > 0) {
        setScrollProgress((window.scrollY / h) * 100);
      }
    };
    window.addEventListener('scroll', update);
    return () => window.removeEventListener('scroll', update);
  }, []);
  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[300]">
      <div 
        className="h-full bg-blue-600 transition-all duration-150 ease-out" 
        style={{ width: `${scrollProgress}%` }} 
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BlogProvider>
        <BrowserRouter>
          <LazyAdSense />
          <ScrollProgress />
          <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
            <Header />
            <main className="flex-grow">
              {/* GLOBAL TOP BANNER AD */}
              <div className="max-w-7xl mx-auto px-4 mt-20 md:mt-24 mb-4">
                 <GoogleAd 
                    slot="1641433819" 
                    format="horizontal" 
                    height="90px" 
                    className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800" 
                 />
              </div>

              <Suspense fallback={<SkeletonPostDetail />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/category/:slug" element={<CategoryPage />} />
                  <Route path="/post/:id" element={<PostPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPage />} />
                  <Route path="/terms-of-service" element={<TermsPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  {/* Catch-all including former admin paths */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </BlogProvider>
    </ErrorBoundary>
  );
};

export default App;