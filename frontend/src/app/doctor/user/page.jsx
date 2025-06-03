"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { ToastContainer } from "react-toastify";
import DoctorNavbar from "@/components/doctor/Navbar";
import Footer from "@/components/common/Footer";
import AppointmentList from "@/components/doctor/AppointmentList";
import FollowUpModal from "@/components/doctor/FollowUpModal";
import UserProfile from "@/components/doctor/UserProfile";
import { checkAuth } from "@/utils/profile";
import SessionExpired from "@/components/common/SessionExpired";
import { useRouter } from "next/navigation";
import CustomLoader from "@/components/common/CustomLoader";

const UserDetail = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userWithAppointments, setUserWithAppointments] = useState(undefined);
  const [showFollowupModal, setShowFollowupModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("doc");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  const handleFollowup = async (appointment) => {
    setSelectedAppointment(appointment);
    setShowFollowupModal(true);
  };

  if (isAuthenticated === null) {
    return <CustomLoader color="blue" text="Loading your dashboard..." />;
  }

  const handleClosePopup = () => {
    router.replace("/doctor/login");
  };

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="blue" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-custom-blue-50 to-custom-purple-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <DoctorNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <button
          onClick={() => router.push("/doctor/history")}
          className="flex items-center text-custom-blue-600 hover:text-custom-blue-800 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Patient List</span>
        </button>

        <div className="space-y-6">
          <div className="bg-custom-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-custom-blue-100/50 p-4 sm:p-6 lg:p-8">
            <UserProfile user={userWithAppointments} />
          </div>

          <div className="bg-custom-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-custom-blue-100/50 p-4 sm:p-6 lg:p-8">
            <AppointmentList onFollowUp={handleFollowup} />
          </div>
        </div>
      </main>

      <FollowUpModal
        isOpen={showFollowupModal}
        onClose={() => setShowFollowupModal(false)}
        selectedAppointment={selectedAppointment}
      />

      <Footer color="blue" />
    </div>
  );
};

export default UserDetail;
