import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { BlogProvider } from './context/BlogContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import PostPage from './pages/PostPage';

const App: React.FC = () => {
  return (
    <BlogProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen bg-white">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/post/:id" element={<PostPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </BlogProvider>
  );
};

export default App;
