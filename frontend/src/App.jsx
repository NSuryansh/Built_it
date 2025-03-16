import React from 'react';
import Navbar from './components/Navbar';
import Peer from './pages/Peer';
import Mood from './pages/Mood';
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import { Route, Routes, useLocation } from 'react-router-dom';

export default function App() {
  const location = useLocation();
  const isLandingPage = (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup');

  return (
    <div
      className={`h-screen flex flex-col ${
        isLandingPage ? "bg-cover" : "bg-white"
      }`}
      style={isLandingPage ? { backgroundImage: "url('/assests/Pexels Photo by Loc Dang.png')" } : {}}
    >
      <Navbar />
      <Routes>
            <Route path="/" element={<Landing/>}/>
            <Route path="/peer" element={<Peer />} />
            <Route path="/mood" element={<Mood />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

        </Routes>
    </div>
  );
}