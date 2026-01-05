import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as postService from '../../services/postService';
import * as commentService from '../../services/commentService';
import * as userService from '../../services/userService';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import ShareButtons from '../../components/ShareButtons';
import LoadingSpinner from '../../components/LoadingSpinner';
import ProgressBar from '../../components/ProgressBar';
import TableOfContents from '../../components/TableOfContents';
import RelatedPosts from '../../components/RelatedPosts';
import NewsletterSignup from '../../components/NewsletterSignup';
import SEOHead from '../../components/SEOHead';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState({
    authorName: '',
    authorEmail: '',
    content: ''
  });
  const { user, isAuthenticated, updateUser } = useAuth();
  const { showToast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (user && user.bookmarks && post) {
      setIsBookmarked(user.bookmarks.includes(post._id));
    }
  }, [user, post]);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postService.getPostById(id);
      setPost(response.post);

      // Fetch comments
      if (response.post?._id) {
        const commentsData = await commentService.getPostComments(response.post._id);
        setComments(commentsData.comments || []);

        // Increment view count
        await postService.incrementViews(response.post._id);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await commentService.addComment(post._id, newComment);
      setNewComment({ authorName: '', authorEmail: '', content: '' });
      // Refresh comments
      const commentsData = await commentService.getPostComments(post._id);
      setComments(commentsData.comments || []);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      showToast('Please login to bookmark posts', 'info');
      return;
    }

    try {
      const response = await userService.toggleBookmark(post._id);
      setIsBookmarked(!isBookmarked);
      updateUser({ bookmarks: response.bookmarks });
      showToast(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks', 'success');
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      showToast('Failed to update bookmark', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container-narrow mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-4xl font-bold mb-4">Article Not Found</h1>
        <Link to="/viewer/posts" className="btn btn-primary">
          View All Articles
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title={post.title}
        description={post.excerpt || post.content?.replace(/<[^>]*>/g, '').substring(0, 160)}
        keywords={post.tags?.join(', ') || 'technology, blog, article'}
        image={post.featuredImage}
        type="article"
      />
      <article className="bg-off-white" style={{ backgroundColor: 'var(--color-off-white)' }}>
      <ProgressBar />
      {/* Article Header */}
      <header className="bg-white border-b" style={{ padding: 'var(--space-3xl) 0' }}>
        <div className="container-narrow mx-auto px-4">
          {post.category && (
            <span className="text-primary font-ui text-sm font-semibold uppercase tracking-wide">
              {post.category.name}
            </span>
          )}
          <h1 className="font-display font-bold mt-4 mb-6" style={{ fontSize: '3.5rem', lineHeight: '1.1', color: 'var(--color-black)' }}>
            {post.title}
          </h1>

          {/* Author Info */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-lg">
              {post.author?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="font-ui font-semibold text-black">{post.author?.name || 'Anonymous'}</p>
              <div className="flex items-center space-x-4 text-sm text-muted font-ui">
                <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span>•</span>
                <span>{post.readingTime || 5} min read</span>
                <span>•</span>
                <span>{post.views || 0} views</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="bg-white">
          <div className="container-wide mx-auto px-4" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-xl)' }}>
            <div className="relative group overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden w-full h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl items-center justify-center">
                <div className="text-center text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg font-medium">Featured Image</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="bg-white" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-3xl)' }}>
        <div className="container-wide mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar (TOC) */}
            <div className="hidden lg:block lg:col-span-3">
              <TableOfContents contentSelector="#post-content" />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8 lg:col-start-4">
              <div
                id="post-content"
                className="prose prose-lg font-body text-secondary"
                style={{
                  maxWidth: '100%',
                  fontSize: '1.0625rem',
                  lineHeight: '1.75',
                  color: 'var(--color-charcoal)'
                }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-light-gray text-secondary text-sm font-ui rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share & Like */}
              <div className="mt-8 flex items-center justify-between py-6 border-y border-gray-200">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => postService.likePost(post._id)}
                    className="flex items-center space-x-2 text-secondary hover:text-primary transition-colors font-ui"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{post.likes || 0} Likes</span>
                  </button>
                  <button
                    onClick={handleBookmark}
                    className={`flex items-center space-x-2 transition-colors font-ui ${isBookmarked ? 'text-primary' : 'text-secondary hover:text-primary'}`}
                  >
                    <svg className="w-6 h-6" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                  </button>
                  <ShareButtons title={post.title} />
                </div>
                <div className="text-muted font-ui text-sm">
                  Share this article
                </div>
              </div>

              <NewsletterSignup />

              <RelatedPosts
                currentPostId={post._id}
                categoryId={post.category?._id}
                tags={post.tags}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <section className="bg-light-gray" style={{ backgroundColor: 'var(--color-light-gray)', padding: 'var(--space-3xl) 0' }}>
        <div className="container-narrow mx-auto px-4">
          <h2 className="font-display font-bold text-3xl mb-8 text-black">
            Comments ({comments.length})
          </h2>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="bg-white p-8 rounded-lg mb-8 border border-gray-200">
            <h3 className="font-display font-semibold text-xl mb-6 text-black">Leave a Comment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-ui font-medium text-dark-gray mb-2">Name</label>
                <input
                  type="text"
                  value={newComment.authorName}
                  onChange={(e) => setNewComment({ ...newComment, authorName: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-ui font-medium text-dark-gray mb-2">Email</label>
                <input
                  type="email"
                  value={newComment.authorEmail}
                  onChange={(e) => setNewComment({ ...newComment, authorEmail: e.target.value })}
                  className="input"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-ui font-medium text-dark-gray mb-2">Comment</label>
              <textarea
                value={newComment.content}
                onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                rows="4"
                className="input"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit Comment
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.filter(c => c.approved).map((comment) => (
              <div key={comment._id} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {comment.author?.name?.charAt(0) || comment.authorName?.charAt(0) || 'A'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-ui font-semibold text-black">
                        {comment.author?.name || comment.authorName}
                      </span>
                      <span className="text-muted text-sm font-ui">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-body text-secondary">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </article>
    </>
  );
};

export default PostDetail;
