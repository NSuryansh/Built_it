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
  const [roomNumber, setRoomNumber] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

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

  const handleSaveRoom = () => {
    setIsEditing(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
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
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-blue-100/50 p-4 sm:p-6 lg:p-8">
           
              {/* Room Number Input */}
              <div className="absolute top-3 right-3">
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      placeholder="Room #"
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveRoom}
                      className="bg-blue-500 text-white rounded px-3 py-1 text-sm hover:bg-blue-600 transition-colors duration-200"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    {roomNumber && (
                      <span className="text-sm text-gray-700 mr-2">
                        Room: <span className="font-medium">{roomNumber}</span>
                      </span>
                    )}
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      {roomNumber ? 'Edit' : 'Add Room #'}
                    </button>
                    {isSaved && (
                      <span className="ml-2 text-green-500 text-xs animate-fade-in-out">
                        Saved!
                      </span>
                    )}
                  </div>
                )}
              </div>
              <UserProfile user={userWithAppointments} />
          
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-blue-100/50 p-4 sm:p-6 lg:p-8">
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