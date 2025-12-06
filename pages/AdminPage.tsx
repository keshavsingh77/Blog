import React, { useState, useEffect } from 'react';
import { useBlog } from '../context/BlogContext';
import { Post, PostStatus } from '../types';
import { CATEGORIES } from '../constants';
import SEO from '../components/SEO';

const AdminPage: React.FC = () => {
  const { posts, addPost, updatePost, deletePost, isAdminAuthenticated, loginAdmin, logoutAdmin } = useBlog();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  
  // Default to first new category
  const [formData, setFormData] = useState({ 
    title: '', 
    content: '', 
    category: CATEGORIES[0] || 'Tech', 
    tags: '', 
    status: PostStatus.DRAFT, 
    author: 'Editor' 
  });
  
  // For Login
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title,
        content: editingPost.content,
        category: editingPost.category,
        tags: editingPost.tags.join(', '),
        status: editingPost.status,
        author: editingPost.author || 'Editor'
      });
    } else {
      resetForm();
    }
  }, [editingPost]);

  const resetForm = () => {
    setFormData({ title: '', content: '', category: CATEGORIES[0] || 'Tech', tags: '', status: PostStatus.DRAFT, author: 'Editor' });
    setEditingPost(null);
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
    
    // Auto-update category based on first tag
    if (name === 'tags') {
      const firstTag = value.split(',')[0].trim();
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        category: firstTag || prev.category // Set category to first tag if available
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    
    // Ensure category is the first tag if tags exist
    const finalCategory = tagsArray.length > 0 ? tagsArray[0] : formData.category;

    if (editingPost) {
      updatePost(editingPost.id, {
        ...formData,
        category: finalCategory,
        tags: tagsArray
      });
    } else {
      addPost({
        ...formData,
        category: finalCategory,
        tags: tagsArray
      });
    }
    handleCloseModal();
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
      <div className="flex items-center justify-center min-h-[60vh] px-4 sm:px-6 lg:px-8 bg-gray-50">
        <SEO title="Admin Login" description="Secure login for site administration." />
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl border-t-4 border-red-600">
          <div className="text-center">
            <i className="fas fa-lock text-5xl text-red-600"></i>
            <h2 className="mt-4 text-3xl font-black text-center text-gray-900 uppercase">Admin Access</h2>
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
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
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
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold uppercase rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
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
      <SEO title="Admin Panel" description="Manage content and settings." />
      <div className="flex justify-between items-center mb-8 border-b-2 border-gray-200 pb-4">
        <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Content Management</h1>
        <div className="flex items-center gap-4">
            <button
            onClick={() => handleOpenModal(null)}
            className="bg-red-600 text-white px-6 py-2 rounded-full font-bold uppercase text-sm hover:bg-red-700 transition shadow-lg flex items-center"
            >
            <i className="fas fa-plus mr-2"></i> New Story
            </button>
            <button
            onClick={logoutAdmin}
            className="bg-gray-800 text-white px-6 py-2 rounded-full font-bold uppercase text-sm hover:bg-gray-900 transition shadow-lg flex items-center"
            >
            <i className="fas fa-sign-out-alt mr-2"></i> Logout
            </button>
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPosts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900 truncate" style={{maxWidth: '300px'}}>{post.title}</div>
                    <div className="text-xs text-gray-500">{post.author}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="bg-gray-200 px-2 py-1 rounded text-xs font-bold uppercase">{post.category}</span>
                    <div className="text-[10px] text-gray-400 mt-1 max-w-[150px] truncate">{post.tags.join(', ')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-bold rounded-full uppercase ${
                      post.status === PostStatus.PUBLISHED ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleOpenModal(post)} className="text-blue-600 hover:text-blue-900 mr-4 transition"><i className="fas fa-edit"></i></button>
                    <button onClick={() => deletePost(post.id)} className="text-red-600 hover:text-red-900 transition"><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all scale-100">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-2xl font-black text-gray-800 uppercase">{editingPost ? 'Edit Story' : 'New Story'}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-red-600 text-2xl transition">&times;</button>
            </div>
            
            <div className="p-6">
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-bold text-gray-700 uppercase">Headline</label>
                  <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"/>
                </div>
                <div>
                  <label htmlFor="content" className="block text-sm font-bold text-gray-700 uppercase">Content (HTML)</label>
                  <textarea name="content" id="content" value={formData.content} onChange={handleChange} rows={10} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 font-mono text-sm"></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                    <label htmlFor="category" className="block text-sm font-bold text-gray-700 uppercase">Category</label>
                    <input list="category-options" name="category" id="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" readOnly/>
                    <p className="text-xs text-gray-500 mt-1">Automatically set from the first tag.</p>
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-bold text-gray-700 uppercase">Status</label>
                    <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
                      <option value={PostStatus.DRAFT}>Draft</option>
                      <option value={PostStatus.PUBLISHED}>Published</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="tags" className="block text-sm font-bold text-gray-700 uppercase">Tags (Comma Separated)</label>
                  <input type="text" name="tags" id="tags" value={formData.tags} onChange={handleChange} placeholder="Technology, Viral, Tips, Mobile" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"/>
                   <p className="text-xs text-gray-500 mt-1">The first tag will be used as the main Category.</p>
                </div>

                <div>
                    <label htmlFor="author" className="block text-sm font-bold text-gray-700 uppercase">Author</label>
                    <input type="text" name="author" id="author" value={formData.author} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"/>
                </div>

                 <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={handleCloseModal} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-bold uppercase hover:bg-gray-300 transition">Cancel</button>
                  <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded-md font-bold uppercase hover:bg-red-700 transition shadow-lg">{editingPost ? 'Update' : 'Publish'}</button>
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