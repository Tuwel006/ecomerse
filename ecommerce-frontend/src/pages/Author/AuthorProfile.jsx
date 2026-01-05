import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import userService from '../../services/userService';
import postService from '../../services/postService';
import { useToast } from '../../context/ToastContext';

const AuthorProfile = () => {
    const { id } = useParams();
    const [author, setAuthor] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { error } = useToast();

    useEffect(() => {
        fetchAuthorData();
    }, [id]);

    const fetchAuthorData = async () => {
        try {
            // Assuming we have endpoints for this or we fetch user and their posts
            // For now, let's mock or use existing services if possible
            // This might need backend update to get public profile
            const userData = await userService.getUser(id);
            setAuthor(userData);

            const postsData = await postService.getAllPosts({ author: id });
            setPosts(postsData.posts || []);
        } catch (err) {
            // If getUser fails (e.g. protected), we might need a public endpoint
            // For now, just show error
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-12 text-center">Loading profile...</div>;

    if (!author) return <div className="p-12 text-center">Author not found</div>;

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Profile Header */}
            <div className="bg-white shadow-sm">
                <div className="container-wide mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="w-32 h-32 rounded-full bg-primary-100 flex items-center justify-center text-4xl font-bold text-primary-600 border-4 border-white shadow-lg">
                            {author.name?.charAt(0)}
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">{author.name}</h1>
                            <p className="text-gray-600 mb-4">{author.bio || 'Content Creator'}</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500">
                                <span>{posts.length} Articles</span>
                                <span>•</span>
                                <span>Joined {new Date(author.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Articles */}
            <div className="container-wide mx-auto px-4 py-12">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8">Latest Articles</h2>

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
                                <Link to={`/viewer/posts/${post.slug || post._id}`} className="text-primary-600 font-medium text-sm hover:text-primary-700">
                                    Read More →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AuthorProfile;
