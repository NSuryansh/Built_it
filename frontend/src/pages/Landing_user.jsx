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
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar - Assuming it's a separate component */}
      <Navbar />
  
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-8 lg:p-10 bg-gradient-to-br from-orange-50 to-orange-100 min-h-screen">
        {/* Calendar Section */}
        <div className="w-full lg:w-1/3 h-fit lg:min-h-[85vh] bg-white rounded-3xl shadow-xl p-4 md:p-6 transform hover:scale-[1.02] transition-all duration-300">
          <div className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Calendar</div>
          <Calendar />
        </div>
  
        {/* Progress Section */}
        <div className="w-full lg:w-1/3 h-fit lg:min-h-[85vh] bg-white rounded-3xl shadow-xl p-4 md:p-6 overflow-y-auto transform hover:scale-[1.02] transition-all duration-300">
          <div className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Your Progress</div>
          <ProgressPage isLandingPage={true} />
        </div>
  
        {/* Events Section */}
        <div className="w-full lg:w-1/3 h-fit lg:min-h-[85vh] bg-white rounded-3xl shadow-xl p-4 md:p-6 overflow-y-auto transform hover:scale-[1.02] transition-all duration-300">
          <div className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Upcoming Events</div>
          <EventsDisplay />
        </div>
      </div>
  
      {/* Footer */}
      <Footer color={"orange"} />
    </div>
  );
};

export default Landing_user;
