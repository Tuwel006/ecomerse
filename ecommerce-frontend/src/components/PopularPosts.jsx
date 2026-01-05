import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PopularPosts = () => {
  const [popularPosts, setPopularPosts] = useState([]);

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/popular-posts`);
        setPopularPosts(response.data);
      } catch (error) {
        console.error('Error fetching popular posts:', error);
      }
    };

    fetchPopularPosts();
  }, []);

  return (
    <>
      <h2 className="text-3xl text-center text-blue-600 mt-4 font-semibold mb-6">Popular Posts</h2>
      <div className="space-y-4">
        {popularPosts.slice(0,5).map((post, index) => (
          <Link to={`/viewer/posts/${post.title}`}>
          <div  key={post.id} className="bg-gradient-to-r from-blue-100 to-blue-300 my-1 p-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-transform">
            <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
            <p className="text-sm text-gray-600">{(post.content).replace(/<\/?[^>]+(>|$)/g, '').slice(0, 100)}...</p>
            <span className="text-xs text-gray-400">{post.date}</span>
          </div>
          </Link>
        ))}
      </div> 
      </>
      );
};

export default PopularPosts;
