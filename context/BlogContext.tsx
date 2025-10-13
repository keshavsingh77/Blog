import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Post, Category, PostStatus } from '../types';
import { INITIAL_POSTS, ADMIN_PASSWORD } from '../constants';

interface BlogContextType {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'imageUrl'>) => void;
  updatePost: (id: string, post: Partial<Post>) => void;
  deletePost: (id: string) => void;
  getPostById: (id: string) => Post | undefined;
  isAdminAuthenticated: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const savedPosts = localStorage.getItem('blogPosts');
      return savedPosts ? JSON.parse(savedPosts) : INITIAL_POSTS;
    } catch (error) {
      console.error("Could not parse posts from localStorage", error);
      return INITIAL_POSTS;
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('isAdminAuthenticated') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('blogPosts', JSON.stringify(posts));
  }, [posts]);

  const addPost = (post: Omit<Post, 'id' | 'createdAt' | 'imageUrl'>) => {
    const newPost: Post = {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      imageUrl: `https://picsum.photos/seed/${Date.now()}/800/400`,
    };
    setPosts([newPost, ...posts]);
  };

  const updatePost = (id: string, updatedPost: Partial<Post>) => {
    setPosts(posts.map(p => (p.id === id ? { ...p, ...updatedPost } : p)));
  };

  const deletePost = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  const getPostById = (id: string): Post | undefined => {
    return posts.find(p => p.id === id);
  };

  const loginAdmin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    setIsAdminAuthenticated(false);
  };

  return (
    <BlogContext.Provider value={{ posts, addPost, updatePost, deletePost, getPostById, isAdminAuthenticated, loginAdmin, logoutAdmin }}>
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