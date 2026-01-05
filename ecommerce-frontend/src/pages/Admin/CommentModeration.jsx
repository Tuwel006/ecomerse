import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import commentService from '../../services/commentService';

const CommentModeration = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { error, success } = useToast();

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const data = await commentService.getAllComments();
            setComments(data.data || []);
        } catch (err) {
            error('Failed to load comments');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await commentService.approveComment(id);
            success('Comment approved');
            fetchComments();
        } catch (err) {
            error('Failed to approve comment');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await commentService.deleteComment(id);
                success('Comment deleted');
                fetchComments();
            } catch (err) {
                error('Failed to delete comment');
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container-wide mx-auto px-4 py-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Moderate Comments</h1>

            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-600 font-medium">{comment.user?.name?.charAt(0) || 'A'}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <h4 className="text-sm font-bold text-gray-900">{comment.user?.name || 'Anonymous'}</h4>
                                        <span className="text-xs text-gray-500">• {new Date(comment.createdAt).toLocaleDateString()}</span>
                                        {!comment.approved && (
                                            <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
                                        )}
                                    </div>
                                    <p className="mt-1 text-sm text-gray-600">{comment.content}</p>
                                    <p className="mt-2 text-xs text-gray-500">On post: <span className="font-medium">{comment.post?.title}</span></p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                {!comment.approved && (
                                    <button
                                        onClick={() => handleApprove(comment._id)}
                                        className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                                    >
                                        Approve
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(comment._id)}
                                    className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {comments.length === 0 && (
                    <div className="text-center py-12 text-gray-500">No comments to moderate</div>
                )}
            </div>
        </div>
    );
};

export default CommentModeration;
