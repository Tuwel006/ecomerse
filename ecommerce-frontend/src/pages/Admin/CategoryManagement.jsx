import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import * as categoryService from '../../services/categoryService';
import AdminLayout from '../../components/AdminLayout';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', description: '', parent: '' });
    const [editingId, setEditingId] = useState(null);
    const [viewMode, setViewMode] = useState('split');
    const { error, success } = useToast();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await categoryService.getAllCategories();
            setCategories(response.categories || []);
        } catch (err) {
            error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await categoryService.updateCategory(editingId, formData);
                success('Category updated successfully');
            } else {
                await categoryService.createCategory(formData);
                success('Category created successfully');
            }
            setFormData({ name: '', description: '', parent: '' });
            setEditingId(null);
            fetchCategories();
        } catch (err) {
            error(err.message || 'Failed to save category');
        }
    };

    const handleEdit = (category) => {
        setFormData({
            name: category.name,
            description: category.description,
            parent: category.parent?._id || ''
        });
        setEditingId(category._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await categoryService.deleteCategory(id);
                success('Category deleted successfully');
                fetchCategories();
            } catch (err) {
                error('Failed to delete category');
            }
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Manage Categories">
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Manage Categories">
            <div className="container-wide mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">Manage Categories</h1>
                            <p className="text-gray-600 mt-1 text-sm sm:text-base">Organize your content with categories</p>
                        </div>
                        <div className="flex bg-gray-100 rounded-lg p-1 md:hidden">
                            <button
                                onClick={() => setViewMode('form')}
                                className={`px-3 py-1 text-sm rounded-md transition-colors touch-target ${
                                    viewMode === 'form' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                                }`}
                            >
                                Form
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-1 text-sm rounded-md transition-colors touch-target ${
                                    viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                                }`}
                            >
                                List
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Form */}
                    <div className={`bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 h-fit ${viewMode === 'list' ? 'hidden md:block' : ''}`}>
                        <h2 className="text-lg sm:text-xl font-semibold mb-4">{editingId ? 'Edit Category' : 'Add New Category'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary touch-target"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary touch-target"
                                    rows="3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                                <select
                                    value={formData.parent}
                                    onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white touch-target"
                                >
                                    <option value="">None (Top Level)</option>
                                    {categories.filter(c => c._id !== editingId).map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                <button type="submit" className="btn btn-primary flex-1 touch-target">
                                    {editingId ? 'Update' : 'Create'}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingId(null);
                                            setFormData({ name: '', description: '', parent: '' });
                                        }}
                                        className="btn btn-secondary flex-1 touch-target"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Desktop Table */}
                    <div className={`lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hidden md:block ${viewMode === 'form' ? 'md:hidden lg:block' : ''}`}>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posts</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {categories.map((category) => (
                                        <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                                <div className="text-sm text-gray-500 line-clamp-1">{category.description}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                {category.parent?.name || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                {category.postsCount || 0}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                <button onClick={() => handleEdit(category)} className="text-primary hover:text-primary-dark mr-4 touch-target">Edit</button>
                                                <button onClick={() => handleDelete(category._id)} className="text-red-600 hover:text-red-900 touch-target">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {categories.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No categories found. Create your first category!
                            </div>
                        )}
                    </div>

                    {/* Mobile Cards */}
                    <div className={`lg:col-span-2 grid grid-cols-1 gap-4 md:hidden ${viewMode === 'form' ? 'hidden' : ''}`}>
                        {categories.map((category) => (
                            <div key={category._id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{category.name}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2">{category.description}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                    <span>Parent: {category.parent?.name || 'None'}</span>
                                    <span>{category.postsCount || 0} posts</span>
                                </div>
                                
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={() => handleEdit(category)} 
                                        className="btn btn-outline flex-1 text-center touch-target"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(category._id)} 
                                        className="btn btn-secondary flex-1 touch-target"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                        {categories.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                <p>No categories found. Create your first category!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CategoryManagement;
