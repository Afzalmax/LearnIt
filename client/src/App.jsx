import React,{useEffect} from 'react'
import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom'
import { useStore } from './context/Store';
import Register from './components/Register'
import Login from './components/Login';
import Addmaterials from './components/Addmaterials';
import Display from './components/Display';
import Home from './components/Home';


const App = () => {
  const {token} = useStore();
  const navigate = useNavigate();
  useEffect(()=>{ 
    if(!token) navigate('/login');
  },[]);
  return (
    <>
     
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create"  element={<Addmaterials/>}/>
        <Route path="/feed" element={<Display/>}/>
        <Route path='/' element={<Home/>} />
      </Routes>
    </>
  )
}

export default App
