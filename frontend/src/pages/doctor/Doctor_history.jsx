import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  Users,
  Clock,
  Search,
  User,
  Stethoscope,
  CalendarClock,
  CheckCircle2,
  Clock3,
  AlertCircle,
  X,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
} from "lucide-react";
import Footer from "../../components/Footer";
import { format } from "date-fns";
import DoctorNavbar from "../../components/doctor/Navbar_doctor";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../../utils/profile";
import PacmanLoader from "react-spinners/PacmanLoader";
import SessionExpired from "../../components/SessionExpired";

const History = () => {
  const [app, setApp] = useState([]);
  const [showFollowupModal, setShowFollowupModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [followupDate, setFollowupDate] = useState("");
  const [followupTime, setFollowupTime] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [reason, setReason] = useState("");
  const [fetched, setfetched] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("doc");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const getPastAppointments = async () => {
    try {
      const docId = localStorage.getItem("userid");
      const response = await fetch(
        `http://localhost:3000/pastdocappt?doctorId=${docId}`
      );
      const data = await response.json();
      setApp(data);
      setfetched(true);
    } catch (e) {
      console.error(e);
      setfetched(false);
    }
  };

  const handleFollowup = async (appointment) => {
    setSelectedAppointment(appointment);
    setShowFollowupModal(true);
  };

  const handleSubmitFollowup = async () => {
    try {
      const datetime = new Date(
        `${followupDate}T${followupTime}`
      ).toISOString();
      const response = await fetch(
        "http://localhost:3000/request-to-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            doctorId: localStorage.getItem("userid"),
            userId: selectedAppointment.user.id,
            dateTime: datetime,
            reason: reason,
          }),
        }
      );

      if (response.ok) {
        const notif = await fetch(
          "http://localhost:3000/send-notification",
          {
            method: "POST",
            headers: { "Content-type": "Application/json" },
            body: JSON.stringify({
              userId: selectedAppointment.user.id,
              message: "Doctor has requested an appointment with you",
              userType: "user",
            }),
          }
        );
        setShowFollowupModal(false);
        setFollowupDate("");
        setFollowupTime("");
        setSelectedAppointment(null);
      } else {
        alert("Failed to schedule follow-up appointment");
      }
    } catch (error) {
      console.error("Error scheduling follow-up:", error);
      alert("Error scheduling follow-up appointment");
    }
  };

  useEffect(() => {
    getPastAppointments();
  }, []);

  useEffect(() => {
    console.log(app);
  }, [app]);

  const filteredAppointments = useMemo(() => {
    let filtered = app;
    console.log(filtered, "hello");

    if (searchUser.trim()) {
      filtered = filtered.filter((app) =>
        app.user.username.toLowerCase().includes(searchUser.toLowerCase())
      );
    }

    return filtered;
  }, [searchUser, app]);

  const handleClosePopup = () => {
    navigate("/doctor/login");
  };

  if (isAuthenticated === null || fetched === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl">
          <PacmanLoader color="#004ba8" radius={6} height={20} width={5} />
          <p className="mt-6 text-gray-700 font-medium animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="blue" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">
      <DoctorNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-blue-100/50 overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-violet-600/10 pointer-events-none" />
            <div className="relative flex flex-col space-y-4 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
                    Past Appointments
                  </h2>
                </div>
                <div className="relative w-full sm:w-96">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by patient name..."
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 placeholder-gray-400 text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-4 space-y-4">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100/50 group"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Patient</h3>
                    </div>
                    <p className="text-base sm:text-lg font-medium text-blue-900 ml-11">
                      {appointment.user.username}
                    </p>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                        <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Notes</h3>
                    </div>
                    <p className="text-sm sm:text-base text-gray-700 ml-11">{appointment.note}</p>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-violet-100 rounded-lg group-hover:bg-violet-200 transition-colors">
                        <CalendarClock className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Date</h3>
                    </div>
                    <p className="text-base sm:text-lg font-medium text-violet-900 ml-11">
                      {format(new Date(appointment.createdAt), "dd MMM yyyy")}
                    </p>
                  </div>

                  <div className="flex items-center justify-start sm:justify-end mt-4 sm:mt-0">
                    <button
                      onClick={() => handleFollowup(appointment)}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm sm:text-base rounded-xl hover:from-blue-600 hover:to-violet-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      Schedule Follow-up
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Follow-up Modal */}
      {showFollowupModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 p-6 sm:p-8 transform scale-95 animate-modal-in border border-blue-100">
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-violet-100 rounded-xl">
                  <CalendarClock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
                  Schedule Follow-up
                </h3>
              </div>
              <button
                onClick={() => setShowFollowupModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 sm:p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 sm:space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    min={minDate}
                    value={followupDate}
                    onChange={(e) => setFollowupDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ClockIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="time"
                    value={followupTime}
                    onChange={(e) => setFollowupTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Reason
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for follow-up"
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-6 sm:mt-8">
                <button
                  onClick={() => setShowFollowupModal(false)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitFollowup}
                  disabled={!followupDate || !followupTime}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-xl hover:from-blue-600 hover:to-violet-600 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  Schedule Follow-up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer color="blue" />
    </div>
  );
};

export default History;