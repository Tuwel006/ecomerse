import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RecentPosts = () => {
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/recent-posts`);
        setRecentPosts(response.data);
      } catch (error) {
        console.error('Error fetching recent posts:', error);
      }
    };

    fetchRecentPosts();
  }, []);

  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-100 via-orange-200 to-purple-200 shadow-lg">
      <h2 className="text-3xl font-semibold mb-6">Recent Posts</h2>
      <div className="space-y-4">
        {recentPosts.slice(0,5).map((post, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-transform">
            <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
            <p className="text-sm text-gray-600">{(post.content).replace(/<\/?[^>]+(>|$)/g, '').slice(0, 100)}...</p>
            <span className="text-xs text-gray-400">{post.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentPosts;
