import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post, variant = 'default', showAuthor = true, showCategory = true }) => {
  const getImageUrl = () => {
    if (post.featuredImage) return post.featuredImage;
    return null;
  };

  const renderFallbackImage = (index = 0) => (
    <div className="w-full h-48 sm:h-52 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center text-gray-400">
        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
        <p className="text-xs font-medium">Article #{index + 1}</p>
      </div>
    </div>
  );

  if (variant === 'compact') {
    return (
      <Link to={`/viewer/posts/${post._id}`} className="group flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all duration-200">
        <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
          {getImageUrl() ? (
            <img
              src={getImageUrl()}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          {!getImageUrl() && renderFallbackImage()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-semibold text-base text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h4>
          <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
            <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            <span>•</span>
            <span>{post.views || 0} views</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <article className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary/20">
      <div className="relative overflow-hidden">
        {getImageUrl() ? (
          <img
            src={getImageUrl()}
            alt={post.title}
            className="w-full h-48 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        {!getImageUrl() && renderFallbackImage()}
        
        {showCategory && post.category && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700 backdrop-blur-sm">
              {post.category.name || 'Article'}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="font-display font-bold text-xl mb-3 text-gray-900 leading-tight">
          <Link to={`/viewer/posts/${post._id}`} className="hover:text-primary transition-colors line-clamp-2 group-hover:text-primary">
            {post.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {post.excerpt || post.content?.replace(/<[^>]*>/g, '').substring(0, 120)}...
        </p>
        
        <div className="flex items-center justify-between">
          {showAuthor && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                {post.author?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="text-xs font-medium text-gray-900">{post.author?.name || 'Anonymous'}</p>
                <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              {post.views || 0}
            </span>
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              {post.likes || 0}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;