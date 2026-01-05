import React from 'react';
import { Link } from 'react-router-dom';

const PostList = ({ posts, onEditClick, onDeleteClick }) => (
  <div>
    {posts.map((post) => (
      <div key={post.id} className="border p-2 mb-4 rounded shadow">
        <h2 className="text-xl font-bold">{post.title}</h2>
        <p>{post.content.replace(/<\/?[^>]+(>|$)/g, '').slice(0, 100)}...</p>
        <div className="flex justify-between mt-2">
          <div>
            <span>{post.views} Views</span> | <span>{post.likes} Likes</span> | <span>{post.comments?post.comments.length:0} Comments</span>
          </div>
          <div>
            <button onClick={() => onEditClick(post)} className="text-blue-500 mr-2">Edit</button>
            <button onClick={() => onDeleteClick(post.id)} className="text-red-500 mr-2">Delete</button>
            <Link to={`/viewer/posts/${post.title}`} className="text-blue-500">View</Link>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default PostList;
