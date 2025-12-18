import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Post } from '../types';
import { fetchPostsFromBlogger } from '../services/bloggerService';

interface BlogContextType {
  posts: Post[];
  isLoading: boolean;
  getPostById: (id: string) => Post | undefined;
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'imageUrl'> & { imageUrl?: string }) => void;
  updatePost: (id: string, post: Partial<Post>) => void;
  deletePost: (id: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      try {
        const fetchedPosts = await fetchPostsFromBlogger();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error loading posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  const getPostById = (id: string): Post | undefined => {
    return posts.find(p => p.id === id);
  };

  const addPost = (postData: Omit<Post, 'id' | 'createdAt' | 'imageUrl'> & { imageUrl?: string }) => {
    const newPost: Post = {
      ...postData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      imageUrl: postData.imageUrl || `https://picsum.photos/seed/${Date.now()}/800/400`,
    };
    setPosts([newPost, ...posts]);
  };

  const updatePost = (id: string, updatedData: Partial<Post>) => {
    setPosts(posts.map(post => (post.id === id ? { ...post, ...updatedData } : post)));
  };

  const deletePost = (id: string) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  return (
    <BlogContext.Provider value={{
      posts,
      isLoading,
      getPostById,
      addPost,
      updatePost,
      deletePost,
      theme,
      toggleTheme
    }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = (): BlogContextType => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};