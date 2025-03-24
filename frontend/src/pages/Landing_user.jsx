import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calender";
import ProgressPage from "../components/ProgressPage";
import EventsDisplay from "../components/EventsDisplay";
import { checkAuth } from "../utils/profile";
import FadeLoader from 'react-spinners/FadeLoader'

const Landing_user = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth();
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
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold text-red-600">Session Timeout</h2>
          <p className="mt-2">Your session has expired. Please log in again.</p>
          <button
            onClick={handleClosePopup}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 p-6 bg-gradient-to-br from-[var(--mp-custom-peach)] to-[var(--mp-custom-white)] min-h-screen">
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
  );
};

export default Landing_user;
