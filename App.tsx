import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams, useLocation } from 'react-router-dom';
import { BlogProvider } from './context/BlogContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SafeLink from './components/SafeLink';
import ErrorBoundary from './components/ErrorBoundary';
import { SkeletonPostDetail } from './components/SkeletonLoaders';

// Lazy load non-critical pages
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const PostPage = lazy(() => import('./pages/PostPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const SafeLinkPage = lazy(() => import('./pages/SafeLinkPage'));

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BlogProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </BlogProvider>
    </ErrorBoundary>
  );
};

const AppContent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const tokenFromUrl = searchParams.get('token');
  const tokenFromStorage = localStorage.getItem('bot_file_token');
  const isSLink = location.pathname.startsWith('/s/');
  const showGlobalLayout = !(tokenFromUrl || tokenFromStorage || isSLink);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
      <SafeLink />
      {showGlobalLayout && <Header />}
      <main className={`flex-grow ${showGlobalLayout ? 'pt-16' : ''}`}>
        <Suspense fallback={<SkeletonPostDetail />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/privacy-policy" element={<PrivacyPage />} />
            <Route path="/terms-of-service" element={<TermsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/s/:token" element={<SafeLinkPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      {showGlobalLayout && <Footer />}
    </div>
  );
};

export default App;