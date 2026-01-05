import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as postService from '../../services/postService';
import LoadingSpinner from '../../components/LoadingSpinner';
import PostCard from '../../components/PostCard';
import SEOHead from '../../components/SEOHead';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [currentPage, searchParams]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const category = searchParams.get('category');
      const filters = {
        published: true,
        page: currentPage,
        limit: 12
      };

      if (category) {
        filters.category = category;
      }

      const response = await postService.getAllPosts(filters);
      setPosts(response.posts || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="All Articles - Techcentry"
        description="Browse all our technology articles, tutorials, and insights. Stay updated with the latest in web development, AI, business, and more."
        keywords="technology articles, programming tutorials, web development, AI, business insights"
      />
      <div className="bg-off-white min-h-screen" style={{ backgroundColor: 'var(--color-off-white)', paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}>
      <div className="container-wide mx-auto px-4">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="font-display font-bold text-5xl mb-4 text-black">All Articles</h1>
          <p className="font-body text-lg text-secondary">
            Explore our collection of articles on various topics
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 hover:border-primary transition-all duration-200 text-gray-700"
                >
                  Previous
                </button>
                <span className="px-6 py-3 font-semibold text-sm text-gray-600 bg-white rounded-xl border border-gray-200">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 hover:border-primary transition-all duration-200 text-gray-700"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="font-body text-lg text-secondary">No articles found.</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Posts;
