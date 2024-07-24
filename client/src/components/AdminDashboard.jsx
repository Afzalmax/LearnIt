import React, { useState, useEffect } from 'react';
import { usePost } from '../hooks/usePost';
import './AdminDashboard.css';
import Navbar from './Navbar';

const AdminDashboard = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { getPosts, approvePost, rejectPost } = usePost();
  const [pendingPosts, setPendingPosts] = useState([]);

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  const fetchPendingPosts = async () => {
    try {
      const fetchedPosts = await getPosts();
      const pending = fetchedPosts.posts.filter(post => post.status === 'pending');
      setPendingPosts(pending);
    } catch (error) {
      console.error('Error fetching pending posts:', error);
    }
  };

  const handleApprove = async (postId) => {
    try {
      await approvePost(postId);
      fetchPendingPosts(); // Refresh the pending posts list
    } catch (error) {
      console.error('Error approving post:', error);
    }
  };

  const handleReject = async (postId) => {
    try {
      await rejectPost(postId);
      fetchPendingPosts(); // Refresh the pending posts list
    } catch (error) {
      console.error('Error rejecting post:', error);
    }
  };

  return (
    <div className='bg-peach'>
      <Navbar />
      <p className="heading text-green-900">Admin Dashboard</p>
      <div className="container mx-auto p-4">
        {pendingPosts.length > 0 ? (
          <ul>
            {pendingPosts.map(post => (
              <li key={post._id} className='pending-post bg-white p-4 mb-4 rounded shadow'>
                <h3 className='title text-green-900'>SUBJECT: {post.title}</h3>
                <p className='description text-green-900'>CONTENTS: {post.description}</p>
                <p className='username'>POST BY: {post.CreatedBy.username}</p>
                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    onClick={() => handleApprove(post._id)}
                    className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(post._id)}
                    className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No pending posts</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
