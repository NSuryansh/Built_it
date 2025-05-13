import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ToastContainer } from "react-toastify";
import DoctorNavbar from "../../components/doctor/Navbar_doctor";
import Footer from "../../components/Footer";
import AppointmentList from "../../components/doctor/AppointmentList";
import FollowUpModal from "../../components/doctor/FollowUpModal";
import CustomToast from "../../components/CustomToast";
import UserProfile from "../../components/doctor/UserProfile";
import PacmanLoader from "react-spinners/PacmanLoader";
import { checkAuth } from "../../utils/profile";
import SessionExpired from "../../components/SessionExpired";

const UserDetail = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userWithAppointments, setUserWithAppointments] = useState(undefined);
  const [showFollowupModal, setShowFollowupModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isScheduling, setIsScheduling] = useState(false);

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

  const handleSubmitFollowup = async () => {
    setIsScheduling(true);
    try {
      const datetime = new Date(
        `${followupDate}T${followupTime.split("T")[1]}`
      ).toISOString();
      const response = await fetch("http://localhost:3000/request-to-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          doctorId: localStorage.getItem("userid"),
          userId: selectedAppointment.user.id,
          dateTime: datetime,
          reason: reason,
        }),
      });
      const data = await response.json();
      CustomToast("Follow-up appointment scheduled", "blue");

      if (data["message"] === "Appointment requested successfully") {
        const notif = await fetch("http://localhost:3000/send-notification", {
          method: "POST",
          headers: {
            "Content-type": "Application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            userId: selectedAppointment.user.id,
            message: "Doctor has requested an appointment with you",
            userType: "user",
          }),
        });
        setShowFollowupModal(false);
        setFollowupDate("");
        setFollowupTime("");
        setReason("");
        setSelectedAppointment(null);
      } else {
        CustomToast("Failed to schedule follow-up appointment", "blue");
      }
    } catch (error) {
      console.error("Error scheduling follow-up:", error);
      CustomToast("Error scheduling follow-up appointment", "blue");
    }
    setIsScheduling(false);
  };

  // if (!userWithAppointments) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  //     </div>
  //   );
  // }

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <PacmanLoader color="#004ba8" radius={6} height={20} width={5} />
        <p className="mt-6 text-gray-700 font-medium animate-pulse">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  const handleClosePopup = () => {
    navigate("/doctor/login");
  };

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="blue" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <DoctorNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <button
          onClick={() => navigate("/doctor/history")}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Patient List</span>
        </button>

        <div className="space-y-6">
          <UserProfile user={userWithAppointments} />

          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-blue-100/50 p-4 sm:p-6 lg:p-8">
            <AppointmentList onFollowUp={handleFollowup} />
          </div>
        </div>
      </main>

      <FollowUpModal
        isOpen={showFollowupModal}
        onClose={() => setShowFollowupModal(false)}
        onSubmit={handleSubmitFollowup}
        selectedUser={userWithAppointments}
        isLoading={isScheduling}
      />

      <Footer color="blue" />
    </div>
  );
};

export default UserDetail;
