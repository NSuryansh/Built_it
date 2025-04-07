import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calender";
import ProgressPage from "../components/ProgressPage";
import EventsDisplay from "../components/EventsDisplay";
import { checkAuth } from "../utils/profile";
import PacmanLoader from "react-spinners/PacmanLoader";
import Navbar from "../components/Navbar";
import SessionExpired from "../components/SessionExpired";
import Footer from "../components/Footer";

const Landing_user = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("user");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  const handleClosePopup = () => {
    navigate("/login");
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <PacmanLoader color="#ff4800" radius={6} height={20} width={5} />
        <p className="mt-4 text-gray-600">Loading your wellness journey...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-t from-gray-50 to-white text-gray-900 overflow-hidden">
      {/* Navbar - Holographic and Elevated */}
      <Navbar className="sticky top-0 z-30 bg-gradient-to-r from-orange-100/90 via-pink-100/90 to-purple-100/90 backdrop-blur-md p-4 shadow-[0_6px_25px_rgba(255,147,51,0.3)] border-b border-orange-200/50" />
  
      {/* Main Content */}
      <div className="relative flex flex-col lg:flex-row gap-10 p-6 md:p-12 lg:p-16 bg-[radial-gradient(ellipse_at_top,_rgba(255,182,153,0.3)_0%,_rgba(255,255,255,1)_70%)] min-h-screen">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-[600px] h-[600px] bg-gradient-to-tr from-orange-200/40 to-pink-200/40 rounded-full blur-3xl absolute top-[-150px] left-[-150px] animate-glow-slow"></div>
          <div className="w-[500px] h-[500px] bg-gradient-to-tr from-purple-200/30 to-orange-200/30 rounded-full blur-3xl absolute bottom-[-100px] right-[-100px] animate-glow-slow"></div>
          <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')] opacity-5"></div>
        </div>
  
        {/* Calendar Section - Holographic Glass */}
        <div className="relative w-full lg:w-1/3 h-fit lg:min-h-[85vh] bg-white/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(255,147,51,0.2),_inset_0_4px_12px_rgba(255,255,255,0.6)] p-6 md:p-8 border border-orange-200/40 transform hover:scale-[1.04] hover:shadow-[0_15px_50px_rgba(255,147,51,0.3)] hover:border-orange-300/60 transition-all duration-700 ease-out z-10 group">
          <div className="text-2xl md:text-3xl font-extrabold text-orange-500 tracking-wide mb-6 drop-shadow-[0_2px_4px_rgba(255,147,51,0.4)] group-hover:text-orange-600 transition-colors duration-300">Calendar</div>
          <Calendar className="animate-fade-in" />
        </div>
  
        {/* Progress Section - Vibrant 3D Effect */}
        <div className="relative w-full lg:w-1/3 h-fit lg:min-h-[85vh] bg-gradient-to-br from-white/70 to-pink-50/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(236,72,153,0.2),_inset_0_4px_12px_rgba(255,255,255,0.6)] p-6 md:p-8 overflow-y-auto border border-pink-200/40 transform hover:scale-[1.04] hover:shadow-[0_15px_50px_rgba(236,72,153,0.3)] hover:border-pink-300/60 transition-all duration-700 ease-out z-10 group">
          <div className="text-2xl md:text-3xl font-extrabold text-orange-500  tracking-wide mb-6 drop-shadow-[0_2px_4px_rgba(236,72,153,0.4)] group-hover:text-orange-500 transition-colors duration-300">Your Progress</div>
          <ProgressPage isLandingPage={true} className="animate-fade-in" />
        </div>
  
        {/* Events Section - Luxurious Holography */}
        <div className="relative w-full lg:w-1/3 h-fit lg:min-h-[85vh] bg-white/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(147,51,234,0.2),_inset_0_4px_12px_rgba(255,255,255,0.6)] p-6 md:p-8 overflow-y-auto border border-purple-200/40 transform hover:scale-[1.04] hover:shadow-[0_15px_50px_rgba(147,51,234,0.3)] hover:border-purple-300/60 transition-all duration-700 ease-out z-10 group">
          <div className="text-2xl md:text-3xl font-extrabold text-orange-500 tracking-wide mb-6 drop-shadow-[0_2px_4px_rgba(147,51,234,0.4)] group-hover:text-orange-500sition-colors duration-300">Upcoming Events</div>
          <EventsDisplay className="animate-fade-in" />
        </div>
      </div>
  
      {/* Footer - Radiant and Polished */}
      <Footer 
        className="bg-gradient-to-r from-orange-100/90 via-pink-100/90 to-purple-100/90 backdrop-blur-md p-8 text-center text-gray-900 shadow-[0_-6px_25px_rgba(255,147,51,0.3)] border-t border-orange-200/50"
        color={"orange"} 
      />
    </div>
    
  );
  
};


export default Landing_user;
