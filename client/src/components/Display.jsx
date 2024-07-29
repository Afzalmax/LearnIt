import React, { useState, useEffect } from 'react';
import { usePost } from '../hooks/usePost';
import { saveAs } from 'file-saver';
import './Display.css';
import fallbackImage from '../assets/pdf.png'; // Fallback image
import Navbar from './Navbar';
import * as pdfjsLib from 'pdfjs-dist/webpack';

const Display = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { getPosts } = usePost();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previews, setPreviews] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [searchQuery, posts, currentPage]);

  useEffect(() => {
    generatePreviews();
  }, [posts]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

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

  const filterPosts = () => {
    let filtered = posts;
    if (searchQuery) {
      filtered = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.CreatedBy?.username?.toLowerCase() || 'admin').includes(searchQuery.toLowerCase())
      );
    }
    setFilteredPosts(filtered);
  };

  // Generate previews for PDFs and Word documents
  const generatePreviews = async () => {
    const newPreviews = {};
    for (const post of posts) {
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
                        <span className='username'>POST BY: {post.CreatedBy?.username || 'admin'}</span>
                      </h3>
                      <h3 className='title text-green-900'>SUBJECT: {post.title}</h3>
                      <p className='text-md font-semibold mt-2'>
                        <span className='description text-green-900'>CONTENTS: {post.description}</span>
                      </p>
                      <button onClick={e => handleDownload(e, post)} className="text-white bg-green-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mt-2">
                        Download
                      </button>
                      <p>{new Date(post.date).toLocaleDateString()}</p>
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
