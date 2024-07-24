import axios from 'axios';
import { useStore } from '../context/Store';
const apiUrl = import.meta.env.VITE_API_URL
export const usePost = () => {
    const { token } = useStore(state => ({
        token: state.token
      }));
    const post = async (title, description, image) => {
        try {
            // Create form data to handle image upload
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('image', image); // Ensure image is a file object
            
            const response = await axios.post(apiUrl+'/api/posts/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
        
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getPosts = async () => {
        try {
            const response = await axios.get(apiUrl+'/api/posts/getallpost', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };

  const approvePost = async (postId) => {
    try {
      const response = await axios.put(`${apiUrl}/api/posts/approve/${postId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  
  const deletePost = async (id) => {
    try {
      await axios.delete(`${apiURL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      throw new Error('Error deleting post');
    }
  };

  const rejectPost = async (postId) => {
    try {
        const response = await axios.delete(`${apiUrl}/api/posts/reject/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  return { post,getPosts, approvePost, rejectPost,deletePost };
};
  
