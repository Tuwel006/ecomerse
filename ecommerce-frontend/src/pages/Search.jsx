import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import postService from '../services/postService';
import { useToast } from '../context/ToastContext';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { error } = useToast();

    useEffect(() => {
        if (query) {
            handleSearch();
        }
    }, [query]);

    const handleSearch = async () => {
        setLoading(true);
        try {
            // Assuming postService has searchPosts or we use getAllPosts with query
            const data = await postService.getAllPosts({ search: query });
            setPosts(data.posts || []);
        } catch (err) {
            error('Failed to search posts');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-wide mx-auto px-4 py-12">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">
                Search Results for "{query}"
            </h1>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                </div>
            ) : posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <div key={post._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                            {post.featuredImage && (
                                <img
                                    src={post.featuredImage}
                                    alt={post.title}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-6">
                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                    <span className="text-primary-600 font-medium">{post.category?.name}</span>
                                    <span className="mx-2">•</span>
                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                                    <Link to={`/viewer/posts/${post.slug || post._id}`} className="hover:text-primary-600 transition-colors">
                                        {post.title}
                                    </Link>
                                </h2>
                                <p className="text-gray-600 mb-4 line-clamp-3">
                                    {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                            {post.author?.name?.charAt(0)}
                                        </div>
                                        <span className="ml-2 text-sm text-gray-600">{post.author?.name}</span>
                                    </div>
                                    <Link to={`/viewer/posts/${post.slug || post._id}`} className="text-primary-600 font-medium text-sm hover:text-primary-700">
                                        Read More →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600">Try adjusting your search terms or browse our categories.</p>
                    <Link to="/viewer/posts" className="btn btn-primary mt-6 inline-block">
                        Browse All Posts
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Search;
