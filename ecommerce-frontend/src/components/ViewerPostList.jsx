// src/components/PostList.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ViewerPostList = ({ posts }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {posts.map((post) => (
      <div key={post.id} className="bg-cyan-200 p-1 rounded shadow h-[80px] overflow-hidden flex flex-col md:h-[150px] lg:h-[150px] xl:h-[150px]">
        <div>
        <h2 className="text-xl font-bold">{post.title}</h2>
        <div className='h-[60%] overflow-hidden text-sm' >{post.content.replace(/<\/?[^>]+(>|$)/g, '').slice(0, 100)}...</div> {/* Handling undefined content */}
        <Link to={`/viewer/posts/${post.title}`} className="text-blue-500 text-right">Read More</Link>
        </div>
      </div>
    ))}
  </div>
);

export default ViewerPostList;
