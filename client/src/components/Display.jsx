import React, { useState, useEffect } from 'react';
import { usePost } from '../hooks/usePost';
import { useStore } from '../context/Store';
import { saveAs } from 'file-saver'; // Import file-saver
import './Display.css';
import fallbackImage from '../assets/pdf.png'; // Updated to use fallback image
import Navbar from './Navbar';

const Display = () => {
  const { logout } = useStore();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { getPosts } = usePost();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts(searchQuery);
  }, [searchQuery, posts, currentPage]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts.posts);
      setFilteredPosts(fetchedPosts.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleDownload = async (event, post) => {
    event.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/${post.image}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      saveAs(blob, post.image); // Use file-saver to download the file
    } catch (error) {
      console.error('Error downloading the image:', error);
    }
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const filterPosts = (query) => {
    let filtered = posts;
    if (query) {
      filtered = posts.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.CreatedBy.username.toLowerCase().includes(query.toLowerCase())
      );
    }
    setFilteredPosts(filtered);
  };

  // Get current posts for pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleError = (event) => {
    event.target.onerror = null; // Prevents infinite loop if fallback also fails
    event.target.src = fallbackImage;
    event.target.classList.add('small-image');
  };

  return (
    <div className='bg-peach'>
      <>
      <Navbar />
      <p className="heading text-green-900">POSTS</p>
      <div className="flex justify-center">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-bar border rounded p-2"
          placeholder="Search by title or author..."
        />
      </div>
      {currentPosts.length > 0 ? (
        <ul>
          {currentPosts.map(post => (
            <div className='page' key={post._id}>
              <div className='template bg-white'>
                <li>
                  <div className='left'>
                    <h3>
                      <span className='username'>POST BY: {post.CreatedBy.username}</span>
                    </h3>
                    <h3 className='title text-green-900'>SUBJECT: {post.title}</h3>
                    <p className='text-md font-semibold mt-2'>
                      <span className='description text-green-900'>CONTENTS: {post.description}</span>
                    </p>
                    <button onClick={e => handleDownload(e, post)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mt-2">
                      Download
                    </button>
                    <p>{new Date(post.date).toLocaleDateString()}</p>
                  </div>
                  <div className='right'>
                    <img
                      src={`${apiUrl}/${post.image}`}
                      alt={post.title}
                      className="image"
                      onClick={() => handleImageClick(post.image)}
                      onError={handleError} // Add onError handler here
                    />
                  </div>
                  {selectedImage && (
                    <div className="modal" onClick={handleCloseModal}>
                      <span className="close">&times;</span>
                      <img className="modal-content" src={`${apiUrl}/${selectedImage}`} alt="Full Size" />
                    </div>
                  )}
                </li>
              </div>
            </div>
          ))}
        </ul>
      ) : (
        <p>No posts yet</p>
      )}
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={filteredPosts.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </>
    </div>
  );
};

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    
    <nav className="pagination-container">
      <ul className="flex">
        {pageNumbers.map(number => (
          <li key={number} className="page-item">
            <button
              onClick={() => paginate(number)}
              className={`page-link ${number === currentPage ? 'active' : ''}`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  
  );
};

export default Display;
