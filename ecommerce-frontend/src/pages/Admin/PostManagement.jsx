import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import * as postService from '../../services/postService';
import AdminLayout from '../../components/AdminLayout';

const PostManagement = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
    const { error, success } = useToast();
    const { user, isAuthenticated } = useAuth();

    // Check if user is authenticated and has proper role
    useEffect(() => {
        if (!isAuthenticated) {
            error('Please log in to access this page');
            return;
        }
        if (user && !['admin', 'author'].includes(user.role)) {
            error('You do not have permission to access this page');
            return;
        }
    }, [isAuthenticated, user, error]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            console.log('User:', user);
            console.log('Token:', localStorage.getItem('token'));
            // Admin should see all posts (published and unpublished)
            const params = { limit: 100 };
            // Don't filter by published status for admin
            const data = await postService.getAllPosts(params);
            setPosts(data.posts || []);
        } catch (err) {
            console.error('Fetch posts error:', err);
            error('Failed to load posts: ' + (err.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await postService.deletePost(id);
                success('Post deleted successfully');
                fetchPosts();
            } catch (err) {
                console.error('Delete error:', err);
                if (err.statusCode === 401) {
                    error('Please log in to delete posts');
                } else if (err.statusCode === 403) {
                    error('You do not have permission to delete this post');
                } else {
                    error('Failed to delete post: ' + (err.message || 'Unknown error'));
                }
            }
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Manage Posts">
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Manage Posts">
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">Manage Posts</h1>
                            <p className="text-gray-600 mt-1 text-sm sm:text-base">View and manage all blog posts</p>
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                            {/* View Mode Toggle */}
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`px-3 py-1 text-sm rounded-md transition-colors touch-target ${
                                        viewMode === 'table' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                                    }`}
                                >
                                    Table
                                </button>
                                <button
                                    onClick={() => setViewMode('cards')}
                                    className={`px-3 py-1 text-sm rounded-md transition-colors touch-target ${
                                        viewMode === 'cards' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                                    }`}
                                >
                                    Cards
                                </button>
                            </div>
                            <Link to="/admin/posts/new" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Create New Post
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {viewMode === 'table' ? (
                    /* Table View - Desktop */
                    <div className="bg-white rounded border overflow-hidden hidden md:block">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Title
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Author
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {posts.map((post) => (
                                        <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 line-clamp-2">{post.title}</div>
                                                        <div className="text-sm text-gray-500">{post.category?.name || 'Uncategorized'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{post.author?.name || 'Unknown'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {post.published ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link to={`/admin/posts/edit/${post._id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                                                    Edit
                                                </Link>
                                                <button onClick={() => handleDelete(post._id)} className="text-red-600 hover:text-red-900">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {posts.length === 0 && !loading && (
                            <div className="text-center py-12 text-gray-500">
                                <p className="mb-4">No posts found. Create your first post!</p>
                                <Link to="/admin/posts/new" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                    Create Post
                                </Link>
                            </div>
                        )}
                    </div>
                ) : null}

                {/* Card View - Mobile and when selected */}
                <div className={`grid grid-cols-1 gap-4 sm:gap-6 ${viewMode === 'cards' ? 'block' : 'md:hidden'}`}>
                    {posts.map((post) => (
                        <div key={post._id} className="bg-white rounded border p-4">
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{post.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{post.category?.name || 'Uncategorized'}</p>
                                    </div>
                                    <span className={`ml-4 px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                                        post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {post.published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>By {post.author?.name || 'Unknown'}</span>
                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                                
                                <div className="flex space-x-3">
                                    <Link 
                                        to={`/admin/posts/edit/${post._id}`} 
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex-1 text-center"
                                    >
                                        Edit
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(post._id)} 
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex-1"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {posts.length === 0 && !loading && (
                        <div className="text-center py-12 text-gray-500">
                            <p className="mb-4">No posts found. Create your first post!</p>
                            <Link to="/admin/posts/new" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Create Post
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default PostManagement;
