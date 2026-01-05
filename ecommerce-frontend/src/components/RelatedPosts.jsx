import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as postService from '../services/postService';

const RelatedPosts = ({ currentPostId, categoryId, tags }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                // Fetch recent posts for now, ideally backend should support related posts query
                // We'll filter client-side or use category/tag if available
                const response = await postService.getAllPosts({
                    limit: 4,
                    category: categoryId
                });

                // Filter out current post
                const related = response.posts
                    .filter(p => p._id !== currentPostId)
                    .slice(0, 3);

                setPosts(related);
            } catch (error) {
                console.error('Error fetching related posts:', error);
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            fetchRelated();
        }
    }, [currentPostId, categoryId]);

    if (loading || posts.length === 0) return null;

    return (
        <div className="mt-12 pt-12 border-t border-gray-200">
            <h3 className="font-display font-bold text-2xl mb-8 text-black">Read Next</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <Link key={post._id} to={`/viewer/posts/${post._id}`} className="group block">
                        <div className="aspect-w-16 aspect-h-9 mb-4 overflow-hidden rounded-lg bg-gray-100">
                            {post.featuredImage ? (
                                <img
                                    src={post.featuredImage}
                                    alt={post.title}
                                    className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-48 bg-primary bg-opacity-10 flex items-center justify-center text-primary">
                                    <span className="font-display font-bold text-xl">{post.title.charAt(0)}</span>
                                </div>
                            )}
                        </div>
                        <h4 className="font-display font-bold text-lg text-black group-hover:text-primary transition-colors mb-2 line-clamp-2">
                            {post.title}
                        </h4>
                        <p className="text-sm text-muted font-ui">
                            {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RelatedPosts;
