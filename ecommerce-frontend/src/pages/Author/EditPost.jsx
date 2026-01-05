// src/pages/Author/EditPost.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditPost = () => {
  const { draftId } = useParams(); // The ID of the draft to edit
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  // Fetch the draft to edit
  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const response = await axios.get('https://blog-react-webapp-3.onrender.com/drafts');
        const draft = response.data.find(d => d.id === draftId);
        if (draft) {
          setTitle(draft.title);
          setContent(draft.content);
          setTags(draft.tags);
        }
      } catch (error) {
        console.error('Error fetching the draft:', error);
      }
    };
    fetchDraft();
  }, [draftId]);

  // Save the updated draft
  const handleSaveDraft = async () => {
    const updatedDraft = {
      id: draftId,
      title,
      content,
      tags,
      status: 'draft',
      updatedAt: new Date().toISOString(),
    };

    try {
      // Update the draft in the backend
      const draftsResponse = await axios.get('https://blog-react-webapp-3.onrender.com/drafts');
      const drafts = draftsResponse.data.map(d =>
        d.id === draftId ? updatedDraft : d
      );
      await axios.post('https://blog-react-webapp-3.onrender.com/save-draft', { drafts });
      alert('Draft updated successfully');
    } catch (error) {
      console.error('Error updating draft:', error);
    }
  };

  // Publish the updated post
  const handlePublish = async () => {
    const post = {
      id: draftId,
      title,
      content,
      tags,
      status: 'published',
      publishedAt: new Date().toISOString(),
    };

    try {
      await axios.post('https://blog-react-webapp-3.onrender.com/publish-post', { post });
      alert('Post published successfully');
      navigate('/author/dashboard');
    } catch (error) {
      console.error('Error publishing post:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      <input
        type="text"
        placeholder="Title"
        className="block w-full p-2 mb-4 border"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Edit your post content here..."
        className="block w-full p-2 mb-4 border"
        rows="10"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tags (comma separated)"
        className="block w-full p-2 mb-4 border"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <button onClick={handleSaveDraft} className="bg-yellow-500 text-white p-2 mr-4">Save Draft</button>
      <button onClick={handlePublish} className="bg-blue-500 text-white p-2">Publish Post</button>
    </div>
  );
};

export default EditPost;
