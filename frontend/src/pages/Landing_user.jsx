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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex h-full flex-col lg:flex-row gap-4 p-3 md:p-6 bg-[var(--custom-orange-100)] min-h-screen">
        <div className="w-full lg:min-h-[85vh] h-fit lg:w-1/3 bg-[var(--custom-white)] rounded-2xl shadow-lg p-2 md:p-4">
          <Calendar />
        </div>

        <div className="lg:min-h-[85vh] w-full h-fit lg:w-1/3 bg-[var(--custom-white)] rounded-2xl shadow-lg p-4 overflow-y-auto">
          <ProgressPage isLandingPage={true} />
        </div>

        <div className="lg:min-h-[85vh] h-fit w-full lg:w-1/3 bg-[var(--custom-white)] rounded-2xl shadow-lg p-4 overflow-y-auto">
          <EventsDisplay />
        </div>
      </div>

      <Footer color={"orange"} />
    </div>
  );
};

export default Landing_user;
