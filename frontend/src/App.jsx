import React from 'react';
import Navbar from './components/Navbar';
import ChatList from './components/ChatList';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import Peer from './pages/Peer';
import Mood from './pages/Mood';
import { Route,Routes } from 'react-router-dom';

function App() {
  return (
    <div className="h-screen flex flex-col bg-white">
      <Navbar />
      <Routes>
            <Route path="/" element={<div>Welcome to the Home page</div>} />
            <Route path="/Peer" element={<Peer />} />
            <Route path="/Mood" element={<Mood />} />

        </Routes>
    </div>
  );
}

export default App;