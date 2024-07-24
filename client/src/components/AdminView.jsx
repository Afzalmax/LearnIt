import React, { useState, useEffect } from 'react';
import { usePost } from '../hooks/usePost';
import { useStore } from '../context/Store';
import './AdminView.css'; // Import your CSS file for styling

const AdminView = () => {
const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useStore(state => ({
    token: state.token
  }));
  const { getPosts, deletePost } = usePost();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
        const fetchedPosts = await getPosts();
        // Filter posts to show only approved ones
        const approvedPosts = fetchedPosts.posts.filter(post => post.status === 'approved');
        setPosts(approvedPosts);
        setFilteredPosts(approvedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      // Refresh the list after deletion
      setPosts(posts.filter(post => post._id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post.');
    }
  };

  return (
    <div className="admin-view">
      <h1 className="heading">Approved Posts</h1>
      {error && <p className="error">{error}</p>}
      {posts.length > 0 ? (
        <table className="posts-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post._id}>
                <td>{post.title}</td>
                <td>{post.CreatedBy.username}</td>
                <td>{new Date(post.date).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No approved posts available.</p>
      )}
    </div>
  );
};

export default AdminView;
