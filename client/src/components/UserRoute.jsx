import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../context/Store';

const UserRoute = ({ children }) => {
  const { token, user } = useStore();
  return token && user ? children : <Navigate to="/login" />;
};

export default UserRoute;
