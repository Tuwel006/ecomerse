import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import * as postService from '../services/postService';
import * as categoryService from '../services/categoryService';
import MediaLibrary from './MediaLibrary';

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '', // Primary category
    categories: [], // Multi-select
    tags: '',
    featuredImage: '',
    published: false,
    metaTitle: '',
    metaDescription: '',
    keywords: ''
  });
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchPost(id);
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.categories || []);
    } catch (err) {
      error('Failed to load categories');
    }
  };

  const fetchPost = async (postId) => {
    try {
      setLoading(true);
      const response = await postService.getPostById(postId);
      const post = response.post;
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        category: post.category?._id || '',
        categories: post.categories?.map(c => c._id) || [],
        tags: post.tags?.join(', ') || '',
        featuredImage: post.featuredImage || '',
        published: post.published,
        metaTitle: post.metaTitle || '',
        metaDescription: post.metaDescription || '',
        keywords: post.keywords?.join(', ') || ''
      });
    } catch (err) {
      error('Failed to load post: ' + err.message);
      navigate('/admin/posts');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({
      ...formData,
      categories: selectedOptions,
      category: selectedOptions[0] || '' // Set primary to first selected
    });
  };

  const handleContentChange = (content) => {
    setFormData({ ...formData, content });
  };

  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault();
    setLoading(true);

    try {
      const postData = {
        ...formData,
        published: isDraft ? false : formData.published,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k)
      };

      if (id) {
        await postService.updatePost(id, postData);
        success(isDraft ? 'Draft saved successfully' : 'Post updated successfully');
      } else {
        await postService.createPost(postData);
        success(isDraft ? 'Draft saved successfully' : 'Post created successfully');
      }
      if (!isDraft) navigate('/admin/posts');
    } catch (err) {
      error(err.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = (e) => {
    handleSubmit(e, true);
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  if (loading && id) return <div className="p-8 text-center">Loading editor...</div>;

  return (
    <div className="container-wide mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          {id ? 'Edit Post' : 'Create New Post'}
        </h1>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{showPreview ? 'Hide Preview' : 'Preview'}</span>
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={loading}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            {loading ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/posts')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="post-form"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? 'Publishing...' : (id ? 'Update Post' : 'Publish Post')}
          </button>
        </div>
      </div>

      {showPreview ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
          </div>
          <div className="p-8">
            {formData.featuredImage && (
              <img
                src={formData.featuredImage}
                alt={formData.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{formData.title || 'Untitled Post'}</h1>
            <div className="flex items-center space-x-4 mb-6 text-sm text-gray-600">
              <span>By Author</span>
              <span>•</span>
              <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span>•</span>
              <span>{formData.published ? 'Published' : 'Draft'}</span>
            </div>
            {formData.excerpt && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <p className="text-blue-800 italic">{formData.excerpt}</p>
              </div>
            )}
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: formData.content }}
            />
            {formData.tags && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {formData.tags.split(',').map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}

      <form id="post-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <input
              type="text"
              name="title"
              placeholder="Post Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full text-2xl font-bold border-none focus:ring-0 placeholder-gray-400 p-0 mb-4"
              required
            />
            <div className="prose max-w-none">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={handleContentChange}
                modules={modules}
                className="h-96 mb-12"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4">Excerpt</h3>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Short summary of the post..."
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4">SEO Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="SEO Title (defaults to post title)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="SEO Description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Comma separated keywords"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4">Publishing</h3>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                Publish immediately
              </label>
            </div>
            <div className="text-sm text-gray-500">
              Status: <span className="font-medium text-gray-900">{formData.published ? 'Published' : 'Draft'}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <select
              multiple
              name="categories"
              value={formData.categories}
              onChange={handleCategoryChange}
              className="w-full px-3 py-2 border rounded-md h-40"
            >
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2">Hold Ctrl/Cmd to select multiple</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4">Tags</h3>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="React, JavaScript, Web..."
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4">Featured Image</h3>
            <input
              type="text"
              name="featuredImage"
              value={formData.featuredImage}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md mb-2"
              placeholder="Image URL"
            />
            <button
              type="button"
              onClick={() => setShowMediaLibrary(true)}
              className="w-full px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm mb-2"
            >
              Select from Media Library
            </button>
            {formData.featuredImage && (
              <img
                src={formData.featuredImage}
                alt="Preview"
                className="w-full h-40 object-cover rounded-md mt-2"
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
          </div>
        </div>
      </form>

      {showMediaLibrary && (
        <MediaLibrary
          onSelect={(url) => {
            setFormData({ ...formData, featuredImage: url });
            setShowMediaLibrary(false);
          }}
          onClose={() => setShowMediaLibrary(false)}
        />
      )}
    </div>
  );
};

export default PostEditor;
