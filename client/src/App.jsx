import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from './context/Store';
import Register from './components/Register';
import Login from './components/Login';
import Addmaterials from './components/Addmaterials';
import Display from './components/Display';
import Home from './components/Home';
import Adminlogin from './components/Adminlogin';
import AdminDashboard from './components/AdminDashboard';
import AdminView from './components/AdminView';
import AdminAdd from './components/AdminAdd';

const App = () => {
  const { token, admin } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isUserRoute = ['/create', '/feed', '/'].includes(location.pathname);
    const isAdminRoute = ['/dashboard', '/adminview', '/adminpost'].includes(location.pathname);

    if (isUserRoute && !token) {
      navigate('/login');
    }

    if (isAdminRoute && !admin) {
      navigate('/adminlogin');
    }
  }, [location.pathname, token, admin, navigate]);

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/adminlogin" element={<Adminlogin />} />
      <Route path="/create" element={<Addmaterials />} />
      <Route path="/feed" element={<Display />} />
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/adminview" element={<AdminView />} />
      <Route path="/adminpost" element={<AdminAdd />} />
    </Routes>
  );
};

export default App;
