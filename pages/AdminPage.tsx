
import React, { useState, useEffect } from 'react';
import { useBlog } from '../context/BlogContext';
import { Post, Category, PostStatus } from '../types';
import { CATEGORIES } from '../constants';
import { generateBlogPost } from '../services/geminiService';
import Spinner from '../components/Spinner';
import SEO from '../components/SEO';

const AdminPage: React.FC = () => {
  const { posts, addPost, updatePost, deletePost, isAdminAuthenticated, loginAdmin, logoutAdmin } = useBlog();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '', category: Category.CENTRAL_GOVERNMENT, status: PostStatus.DRAFT });
  const [aiTopic, setAiTopic] = useState('');
  const [error, setError] = useState<string | null>(null);

  // For Login
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title,
        content: editingPost.content,
        category: editingPost.category,
        status: editingPost.status,
      });
    } else {
      resetForm();
    }
  }, [editingPost]);

  const resetForm = () => {
    setFormData({ title: '', content: '', category: Category.CENTRAL_GOVERNMENT, status: PostStatus.DRAFT });
    setAiTopic('');
    setEditingPost(null);
    setError(null);
  };

  const handleOpenModal = (post: Post | null) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
      updatePost(editingPost.id, formData);
    } else {
      addPost(formData);
    }
    handleCloseModal();
  };

  const handleGeneratePost = async () => {
    if (!aiTopic.trim()) {
      setError("Please enter a topic to generate a post.");
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const generated = await generateBlogPost(aiTopic);
      setFormData(prev => ({
        ...prev,
        title: generated.title,
        content: generated.content,
        category: generated.category,
      }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(password)) {
      setLoginError('');
      setPassword('');
    } else {
      setLoginError('Incorrect password. Please try again.');
    }
  };
  
  const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (!isAdminAuthenticated) {
    return (
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <SEO title="Admin Login" description="Secure login for site administration." />
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
          <div className="text-center">
            <i className="fas fa-user-shield text-5xl text-blue-600"></i>
            <h2 className="mt-4 text-3xl font-bold text-center text-gray-900">Admin Login</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {loginError && (
              <p className="text-sm text-center text-red-600">{loginError}</p>
            )}
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO title="Admin Panel" description="Manage content and settings for the AI Gov & Finance News Hub." />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Admin Panel</h1>
        <div className="flex items-center gap-4">
            <button
            onClick={() => handleOpenModal(null)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md flex items-center"
            >
            <i className="fas fa-plus mr-2"></i> New Post
            </button>
            <button
            onClick={logoutAdmin}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md flex items-center"
            >
            <i className="fas fa-sign-out-alt mr-2"></i> Logout
            </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPosts.map(post => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 truncate" style={{maxWidth: '300px'}}>{post.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      post.status === PostStatus.PUBLISHED ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleOpenModal(post)} className="text-indigo-600 hover:text-indigo-900 mr-4"><i className="fas fa-edit"></i></button>
                    <button onClick={() => deletePost(post.id)} className="text-red-600 hover:text-red-900"><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-gray-800">{editingPost ? 'Edit Post' : 'Create New Post'}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            
            <div className="p-6">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center"><i className="fas fa-robot mr-3"></i>AI Content Generation</h3>
                <div className="flex items-stretch gap-2">
                  <input
                    type="text"
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    placeholder="Enter a topic (e.g., 'latest RBI policy updates')"
                    className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isGenerating}
                  />
                  <button onClick={handleGeneratePost} disabled={isGenerating} className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600 disabled:bg-blue-300 flex items-center justify-center min-w-[120px]">
                    {isGenerating ? <Spinner /> : <><i className="fas fa-magic mr-2"></i>Generate</>}
                  </button>
                </div>
                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                  <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content (HTML)</label>
                  <textarea name="content" id="content" value={formData.content} onChange={handleChange} rows={10} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <select name="category" id="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                      <option value={PostStatus.DRAFT}>Draft</option>
                      <option value={PostStatus.PUBLISHED}>Published</option>
                    </select>
                  </div>
                </div>
                 <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={handleCloseModal} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-300">Cancel</button>
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700">{editingPost ? 'Update Post' : 'Save Post'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
