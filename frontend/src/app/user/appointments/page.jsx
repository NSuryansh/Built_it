"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/user/Navbar";
import { checkAuth } from "@/utils/profile";
import SessionExpired from "@/components/common/SessionExpired";
import Footer from "@/components/common/Footer";
import CustomLoader from "@/components/common/CustomLoader";
import { useRouter } from "next/navigation";
import { getCurrApp, getPrevApp } from "./controller";
import UpcomingAppointments from "./components/UpcomingAppointments";
import PreviousAppointments from "./components/PreviousAppointments";

const UserAppointments = () => {
  const [previousAppointments, setpreviousAppointments] = useState([]);
  const [upcomingAppointments, setupcomingAppointments] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("user");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  useEffect(() => {
    getPrevApp(setpreviousAppointments);
    getCurrApp(setupcomingAppointments);
  }, []);

  const handleClosePopup = () => {
    router.replace("/user/login");
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
    <div className="min-h-screen bg-gradient-to-br from-[var(--custom-orange-50)] to-[var(--custom-orange-100)]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8">
          <UpcomingAppointments upcomingAppointments={upcomingAppointments} />
          <PreviousAppointments previousAppointments={previousAppointments} />
        </div>
      </div>
      <Footer color="orange" />
    </div>
  );
};

export default UserAppointments;
