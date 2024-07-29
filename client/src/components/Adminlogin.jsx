import React, { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import { useStore } from '../context/Store';
import { useNavigate } from 'react-router-dom';

const Adminlogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { adminLogin } = useLogin();
  const navigate = useNavigate();
  const { setToken, setAdmin } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await adminLogin(username, password);
    if (response) {
      setToken(response.token);
      setAdmin(response.admin);
      navigate('/dashboard'); // Adjust the route as needed
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-center h-screen w-full px-5 sm:px-0">
        <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full">
          <div className="hidden md:block lg:w-1/2 bg-cover bg-green-900"></div>
          <div className="w-full p-8 lg:w-1/2">
            <p className="text-xl text-green-900 text-center">Welcome back!</p>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
              <input
                className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mt-4 flex flex-col justify-between">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              </div>
              <input
                className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mt-8">
              <button className="bg-green-900 text-white font-bold py-2 px-4 w-full rounded hover:bg-green-900">Login</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Adminlogin;
