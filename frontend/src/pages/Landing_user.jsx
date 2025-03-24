import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calender";
import ProgressPage from "../components/ProgressPage";
import EventsDisplay from "../components/EventsDisplay";
import { checkAuth } from "../utils/profile";
import FadeLoader from 'react-spinners/FadeLoader'
import Navbar from "../components/Navbar";
import SessionExpired from "../components/SessionExpired";

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
    return <div>
      <FadeLoader color='#ff4800' radius={6} height={20} width={5} />
      <p>Loading...</p>
    </div>;
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex h-full flex-col md:flex-row gap-4 p-6 bg-gradient-to-br from-[var(--mp-custom-peach)] to-[var(--mp-custom-white)] min-h-screen">
        <div className="h-[85vh] w-full md:w-1/3 bg-[var(--custom-white)] rounded-2xl shadow-lg p-4">
          <Calendar />
        </div>

        <div className="h-[85vh] w-full md:w-1/3 bg-[var(--custom-white)] rounded-2xl shadow-lg p-4">
          <ProgressPage isLandingPage={true} />
        </div>

        <div className="h-[85vh] w-full md:w-1/3 bg-[var(--custom-white)] rounded-2xl shadow-lg p-4 overflow-y-auto">
          <EventsDisplay />
        </div>
      </div>
    </div>
  );
};

export default Landing_user;
