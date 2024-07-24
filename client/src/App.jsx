import React,{useEffect} from 'react'
import {BrowserRouter as Router, Routes, Route, useNavigate,useLocation} from 'react-router-dom'
import { useStore } from './context/Store';
import Register from './components/Register'
import Login from './components/Login';
import Addmaterials from './components/Addmaterials';
import Display from './components/Display';
import Home from './components/Home';
import Adminlogin from './components/Adminlogin';
import AdminDashboard from './components/AdminDashboard';
import AdminView from './components/AdminView';

const App = () => {
  const {token} = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=>{ 
    const isUserRoute = [ '/login', '/create', '/feed', '/'].includes(location.pathname);

    if (isUserRoute && !token) {
      navigate('/login');
    }
  }, [location.pathname, token, navigate]);
  return (
    <>
     
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create"  element={<Addmaterials/>}/>
        <Route path="/feed" element={<Display/>}/>
        <Route path='/' element={<Home/>} />
        <Route path='/adminlogin' element={<Adminlogin/>}/>
        <Route path='/dashboard' element={<AdminDashboard/>}/>
        <Route path='/adminview' element={<AdminView/>}/>
      </Routes>
    </>
  )
}

export default App
