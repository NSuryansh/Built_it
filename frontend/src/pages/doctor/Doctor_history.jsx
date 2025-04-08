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
        `https://built-it-backend.onrender.com/pastdocappt?doctorId=${docId}`
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
        "https://built-it-backend.onrender.com/request-to-user",
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
        // alert('Follow-up appointment scheduled successfully!');
        const notif = await fetch(
          "https://built-it-backend.onrender.com/send-notification",
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
      <div className="flex flex-col items-center justify-center h-screen">
        <PacmanLoader color="#004ba8" radius={6} height={20} width={5} />
        <p className="mt-4 text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="blue" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-teal-50">
      <DoctorNavbar />

      <main className="max-w-7xl mt-8 mx-auto px-4 sm:px-6 lg:px-8 md:py-6 mb-6">
        {/* Appointments List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between px-8 pb-0 py-6 md:mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Past Appointments
            </h2>
            <div className="relative w-full md:w-1/2 mt-2 md:mt-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by patient name..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm hover:shadow-md transition-all duration-200"
              />
            </div>
          </div>
          <div className="divide-y divide-gray-100 flex flex-col items-center lg:gap-3 mt-3 mb-3">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-6 px-8 rounded-xl w-full lg:w-[95%] hover:bg-blue-100 bg-blue-50 scale-[0.9] md:scale-[0.95] lg:scale-[1] transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row gap-2">
                  {/* Patient Info */}
                  <div className="flex-1 bg-gradient-to-br from-blue-50/50 to-transparent p-1 rounded-xl">
                    <div className="flex items-center gap-3 mb-1">
                      <User className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">
                        Patient Details
                      </h3>
                    </div>
                    <p className="text-md font-medium text-blue-900 mb-1">
                      {appointment.user.username}
                    </p>
                  </div>

                  {/* Doctor Info */}
                  <div className="flex-1 bg-gradient-to-br from-green-50/50 to-transparent p-1 rounded-xl">
                    <div className="flex items-center gap-3 mb-1">
                      <Stethoscope className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Notes</h3>
                    </div>
                    <p className="text-md font-medium text-green-900 mb-1">
                      {appointment.note}
                    </p>
                  </div>

                  {/* Appointment Info */}
                  <div className="flex-1 bg-gradient-to-br from-purple-50/50 to-transparent p-1 rounded-xl">
                    <div className="flex items-center gap-3 mb-1">
                      <CalendarClock className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-900">
                        Appointment Details
                      </h3>
                    </div>
                    <div className="flex flex-col items-start sm:flex-row sm:items-center justify-between">
                      <div>
                        <p className="text-md font-medium text-purple-900 mb-1">
                          {format(
                            new Date(appointment.createdAt),
                            "dd MMM yyyy"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:justify-end lg:justify-center sm:absolute sm:bottom-8 sm:right-6 lg:relative lg:bottom-0 lg:right-0">
                    <button
                      className="cursor-pointer h-11 w-30 px-3 py-2 mt-3 rounded-lg bg-white shadow-sm border font-semibold border-gray-100"
                      onClick={() => handleFollowup(appointment)}
                    >
                      Follow Up
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showFollowupModal && (
        <div className="fixed inset-0 bg-blue-100 bg-opacity-40 backdrop-blur-md flex items-center justify-center p-4 z-50 transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform scale-95 animate-modal-in border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-emerald-600">
                Schedule Follow-Up
              </h3>
              <button
                onClick={() => setShowFollowupModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-hover:text-teal-600">
                  Select Date
                </label>
                <input
                  type="date"
                  min={minDate}
                  value={followupDate}
                  onChange={(e) => setFollowupDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 hover:border-teal-300 shadow-sm text-gray-700"
                />
              </div>

              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-hover:text-teal-600">
                  Select Time
                </label>
                <input
                  type="time"
                  value={followupTime}
                  onChange={(e) => setFollowupTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 hover:border-teal-300 shadow-sm text-gray-700"
                />
              </div>

              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-hover:text-teal-600">
                  Enter Reason
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 hover:border-teal-300 shadow-sm text-gray-700"
                />
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => setShowFollowupModal(false)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitFollowup}
                  className="px-6 py-2.5 bg-amber-600 text-white rounded-xl hover:from-teal-600 hover:to-indigo-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                  disabled={!followupDate || !followupTime}
                >
                  Schedule Follow-Up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mt-auto"></div>
      <Footer color="blue" />
    </div>
  );
};

export default History;
