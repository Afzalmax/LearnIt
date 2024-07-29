import axios from 'axios';
import { useStore } from '../context/Store';

export const useLogin = () => {
  const { apiURL, setToken, setUser, setAdmin } = useStore();

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${apiURL}/api/users/login`, {
        username,
        password
      });
      if (response.data.token && response.data.user) {
        setToken(response.data.token);
        setUser(response.data.user);
      }
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  
  const adminLogin = async (username, password) => {
    try {
      const response = await axios.post(`${apiURL}/api/admin/login`, { username, password });
      if (response.data.token && response.data.admin) {
        setToken(response.data.token);
        setAdmin(response.data.admin);
      }
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  return { login, adminLogin };
};
