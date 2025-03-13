import React from 'react';
import { Bell, User } from 'lucide-react';
const Navbar = () => {
  return (
    <nav className="bg-transperent">
      <div className="px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">CalmNest</div>
          <div className="flex space-x-8">
            <a href="/" className="hover:text-[#FFDDC0]0 transition-colors">Home</a>
            <a href="/Mood" className="hover:text-[#FFDDC0]0 transition-colors">Mood</a>
            <a href="/Peer" className="hover:text-[#FFDDC0]0 transition-colors">Peer</a>
            <a href="/" className="hover:text-[#FFDDC0]0 transition-colors">Book</a>
            <a href="/" className="hover:text-[#FFDDC0]0 transition-colors">Stress</a>
          </div>
          <div className="flex items-center space-x-4">
            <button className='cursor-pointer'><Bell className="w-5 h-5" /></button>
            <button className='cursor-pointer'><User className="w-5 h-5" /></button>
            <button className="bg-[#FF7700] text-white px-4 py-1 rounded cursor-pointer">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;