import React, { useState, useEffect } from 'react';
import { usePost } from '../hooks/usePost';
import { saveAs } from 'file-saver';
import './AdminDashboard.css';
import Navbar from './Navbar';
import fallbackImage from '../assets/pdf.png'; // Fallback image
import * as pdfjsLib from 'pdfjs-dist/webpack';

const AdminDashboard = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { getPosts, approvePost, rejectPost } = usePost();
  const [pendingPosts, setPendingPosts] = useState([]);
  const [previews, setPreviews] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  useEffect(() => {
    generatePreviews();
  }, [pendingPosts]);

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
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const generatePreviews = async () => {
    const newPreviews = {};
    for (const post of pendingPosts) {
      if (post.image.endsWith('.pdf')) {
        newPreviews[post._id] = await renderPdfThumbnail(`${apiUrl}/${post.image}`);
      } else if (post.image.endsWith('.docx')) {
        // You need to implement a server-side endpoint to convert DOCX to an image
        newPreviews[post._id] = `${apiUrl}/convert-docx?url=${encodeURIComponent(`${apiUrl}/${post.image}`)}`;
      } else {
        newPreviews[post._id] = `${apiUrl}/${post.image}`;
      }
    }
    setPreviews(newPreviews);
  };

  const renderPdfThumbnail = async (pdfUrl) => {
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 0.5 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    await page.render(renderContext).promise;

    return canvas.toDataURL();
  };

  const handleError = (event) => {
    event.target.onerror = null; // Prevents infinite loop if fallback also fails
    event.target.src = fallbackImage;
    event.target.classList.add('small-image');
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
                <div className='flex'>
                  <div className='left'>
                    <h3 className='title text-green-900'>SUBJECT: {post.title}</h3>
                    <p className='description text-green-900'>CONTENTS: {post.description}</p>
                    <p className='username'>POST BY: {post.CreatedBy?.username || 'Unknown'}</p>
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
                  </div>
                  <div className='right'>
                    <img
                      src={previews[post._id] || `${apiUrl}/${post.image}` || fallbackImage}
                      alt={post.title}
                      className="image"
                      onClick={() => window.open(`${apiUrl}/${post.image}`)}
                      onError={handleError}
                    />
                  </div>
                </div>
                {selectedImage && (
                  <div className="modal" onClick={handleCloseModal}>
                    <span className="close">&times;</span>
                    <img className="modal-content" src={`${apiUrl}/${selectedImage}`} alt="Full Size" />
                  </div>
                )}
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
