import React from 'react';
import { Bell,  User } from 'lucide-react';
import { Routes ,Route} from 'react-router-dom';
import Peer from '../pages/Peer';
const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">CalmNest</div>
          <div className="flex space-x-8">
            <a href="/" className="hover:text-[#FFDDC0]0 transition-colors">Home</a>
            <a href="/Mood" className="hover:text-[#FFDDC0]0 transition-colors">Mood</a>
            <a href="/Peer" className="hover:text-[#FFDDC0]0 transition-colors">Peer</a>
            <a href="#" className="hover:text-[#FFDDC0]0 transition-colors">Book</a>
            <a href="#" className="hover:text-[#FFDDC0]0 transition-colors">Stress</a>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="w-5 h-5" />
            <User className="w-5 h-5" />
            <button className="bg-[#FF7700] text-white px-4 py-1 rounded">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;