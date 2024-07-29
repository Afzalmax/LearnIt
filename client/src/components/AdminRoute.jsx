import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../context/Store';

const AdminRoute = ({ children }) => {
  const { token, admin } = useStore();
  return token && admin ? children : <Navigate to="/adminlogin" />;
};

export default AdminRoute;
