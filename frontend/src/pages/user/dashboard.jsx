import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../../components/user/Calender";
import ProgressPage from "../../components/user/ProgressPage";
import EventsDisplay from "../../components/user/EventsDisplay";
import { checkAuth } from "../../utils/profile";
import Navbar from "../../components/user/Navbar";
import SessionExpired from "../../components/common/SessionExpired";
import Footer from "../../components/common/Footer";
import EmergencyCallButton from "../../components/user/EmergencyCallButton";
import CustomLoader from "../../components/common/CustomLoader";

const Dashboard = () => {
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
    navigate("/user/login");
  };

  if (isAuthenticated === null) {
    return <CustomLoader text="Loading your wellness journey..." />;
  }

  if (!isAuthenticated) {
    return (
      <SessionExpired handleClosePopup={handleClosePopup} theme="orange" />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top,_rgba(255,182,153,0.3)_0%,_rgba(255,255,255,1)_70%)] text-[var(--custom-gray-900)] overflow-hidden">
      <Navbar />

      {/* Main Content */}
      <div className="relative flex flex-col px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 lg:py-12 min-h-screen">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-tr from-[var(--custom-orange-200)]/40 to-pink-200/40 rounded-full blur-3xl absolute top-[-80px] sm:top-[-100px] md:top-[-120px] lg:top-[-150px] left-[-80px] sm:left-[-100px] md:left-[-120px] lg:left-[-150px] animate-glow-slow"></div>
          <div className="w-[250px] sm:w-[300px] md:w-[400px] lg:w-[500px] h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] bg-gradient-to-tr from-[var(--custom-purple-200)]/30 to-[var(--custom-orange-200)]/30 rounded-full blur-3xl absolute bottom-[-60px] sm:bottom-[-80px] md:bottom-[-100px] lg:bottom-[-100px] right-[-60px] sm:right-[-80px] md:right-[-100px] lg:right-[-100px] animate-glow-slow"></div>
          <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')] opacity-5"></div>
        </div>

        {/* Main Container - Responsive Flex */}
        <div className="flex flex-col xl:flex-row gap-4 w-full">
          {/* Calendar Section - Holographic Glass */}
          <div className="flex flex-col md:flex-row w-full xl:w-2/3 gap-4">
            <div className="w-full h-fit min-h-[27rem] sm:min-h-[33.75rem]  md:min-h-[40.5rem] lg:min-h-[57.375] bg-[var(--custom-white)]/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(255,147,51,0.2),_inset_0_4px_12px_rgba(255,255,255,0.6)] p-4 lg:p-8 border border-[var(--custom-orange-200)]/40 transform hover:scale-[1.02] hover:shadow-[0_15px_50px_rgba(255,147,51,0.3)] hover:border-[var(--custom-orange-300)]/60 transition-all duration-200 ease-out group">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-[var(--custom-orange-500)] tracking-wide mb-4 drop-shadow-[0_2px_4px_rgba(255,147,51,0.4)] group-hover:text-[var(--custom-orange-600)] transition-colors duration-200">
                Calendar
              </div>
              <Calendar />
            </div>

            {/* Progress Section - Vibrant 3D Effect, No Scrollbar */}
            <div className="w-full h-fit min-h-[27rem] sm:min-h-[33.75rem]  md:min-h-[40.5rem] lg:min-h-[57.375] bg-gradient-to-br from-[var(--custom-white)]/70 to-pink-50/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(236,72,153,0.2),_inset_0_4px_12px_rgba(255,255,255,0.6)] p-4 lg:p-8 overflow-y-hidden border border-[var(--custom-orange-200)]/40 transform hover:scale-[1.02] hover:shadow-[0_15px_50px_rgba(255,147,51,0.3)] hover:border-[var(--custom-orange-300)]/60 transition-all duration-200 ease-out group">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-[var(--custom-orange-500)] tracking-wide mb-4 drop-shadow-[0_2px_4px_rgba(255,147,51,0.4)] group-hover:text-[var(--custom-orange-600)] transition-colors duration-200">
                Your Progress
              </div>
              <ProgressPage isLandingPage={true} />
            </div>
          </div>

          {/* Events Section - Luxurious Holography with Visible Scrollbar */}
          <div className="w-full xl:w-1/3 min-h-[27rem] sm:min-h-[33.75rem]  md:min-h-[40.5rem] lg:min-h-[57.375] bg-[var(--custom-white)]/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(147,51,234,0.2),_inset_0_4px_12px_rgba(255,255,255,0.6)] p-4 sm:p-6 md:p-8 border overflow-hidden border-[var(--custom-orange-200)]/40 transform hover:scale-[1.02] hover:shadow-[0_15px_50px_rgba(255,147,51,0.3)] hover:border-[var(--custom-orange-300)]/60 transition-all duration-200 ease-out group">
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-[var(--custom-orange-500)] tracking-wide mb-4 drop-shadow-[0_2px_4px_rgba(255,147,51,0.4)] group-hover:text-[var(--custom-orange-600)] transition-colors duration-200">
              Upcoming Events
            </div>
            <div className="h-full pr-2 overflow-y-scroll">
              <EventsDisplay />
              <div className="h-10"></div>
            </div>
          </div>
        </div>
      </div>

      <EmergencyCallButton phoneNumber="9711249305" />

      <Footer color={"orange"} />
    </div>
  );
};

export default Dashboard;
