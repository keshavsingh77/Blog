import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Post } from '../types';
import { fetchPostsFromBlogger } from '../services/bloggerService';
import { INITIAL_POSTS } from '../constants';

interface BlogContextType {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  getPostById: (id: string) => Post | undefined;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  refreshPosts: () => Promise<void>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'creative_mind_vault_v3';

export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'dark'
  );

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const refreshPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const remotePosts = await fetchPostsFromBlogger();

      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      const localPosts: Post[] = saved ? JSON.parse(saved) : [];

      // Combine and Sort
      const combined = [...localPosts, ...remotePosts];
      const unique = Array.from(new Map(combined.map(p => [p.id, p])).values());

      const sorted = unique.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setPosts(sorted.length > 0 ? sorted : INITIAL_POSTS);
    } catch (err) {
      console.error("Critical error syncing feed:", err);
      setError("Sync failed. Using cached/static data.");
      if (posts.length === 0) setPosts(INITIAL_POSTS);
    } finally {
      setIsLoading(false);
    }
  }, [posts.length]);

  useEffect(() => {
    refreshPosts();
  }, []);

  const getPostById = (id: string) => posts.find(p => p.id === id);

  return (
    <BlogContext.Provider value={{
      posts,
      isLoading,
      error,
      getPostById,
      theme,
      toggleTheme,
      refreshPosts
    }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) throw new Error('useBlog must be used within BlogProvider');
  return context;
};