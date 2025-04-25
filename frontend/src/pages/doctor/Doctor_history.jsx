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
  Loader,
} from "lucide-react";
import Footer from "../../components/Footer";
import { format } from "date-fns";
import DoctorNavbar from "../../components/doctor/Navbar_doctor";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../../utils/profile";
import PacmanLoader from "react-spinners/PacmanLoader";
import SessionExpired from "../../components/SessionExpired";
import CustomToast from "../../components/CustomToast";
import { ToastContainer } from "react-toastify";

const History = () => {
  const [app, setApp] = useState([]);
  const [showFollowupModal, setShowFollowupModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [followupDate, setFollowupDate] = useState("");
  const [followupTime, setFollowupTime] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [reason, setReason] = useState("");
  const [fetched, setfetched] = useState(null);
  const [slots, setAvailableSlots] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded(!expanded);
  const [isScheduling, setisScheduling] = useState(false);

  const fetchAvailableSlots = async (date) => {
    try {
      const doctorId = localStorage.getItem("userid");
      const response = await fetch(
        `https://built-it.onrender.com/available-slots?date=${date}&docId=${doctorId}`
      );
      const data = await response.json();
      setAvailableSlots(data.availableSlots);
    } catch (error) {
      console.error("Error fetching available slots:", error);
    }
  };

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
        `https://built-it.onrender.com/pastdocappt?doctorId=${docId}`
      );
      const data = await response.json();
      console.log(data);
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
    setisScheduling(true);
    try {
      const datetime = new Date(
        `${followupDate}T${followupTime.split("T")[1]}`
      ).toISOString();
      const response = await fetch(
        "https://built-it.onrender.com/request-to-user",
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
      const data = await response.json();
      CustomToast("Follow-up appointment scheduled", "blue");

      if (data["message"] === "Appointment requested successfully") {
        const notif = await fetch(
          "https://built-it.onrender.com/send-notification",
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
        setReason("");
        setSelectedAppointment(null);
      } else {
        CustomToast("Failed to schedule follow-up appointment", "blue");
      }
    } catch (error) {
      console.error("Error scheduling follow-up:", error);
      CustomToast("Error scheduling follow-up appointment", "blue");
    }
    setisScheduling(false);
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

    if (searchTerm.trim()) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter((app) => {
        // Search by patient name
        const usernameMatch = app.user.username
          .toLowerCase()
          .includes(searchTermLower);

        // Search by date
        const appointmentDate = format(
          new Date(app.createdAt),
          "dd MMM yyyy"
        ).toLowerCase();
        const dateMatch = appointmentDate.includes(searchTermLower);

        // Search by notes
        const notesMatch = app.note.toLowerCase().includes(searchTermLower);

        // Return true if any of the fields match
        return usernameMatch || dateMatch || notesMatch;
      });
    }

    return filtered;
  }, [searchTerm, app]);

  const handleClosePopup = () => {
    navigate("/doctor/login");
  };

  if (isAuthenticated === null || fetched === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <PacmanLoader color="#004ba8" radius={6} height={20} width={5} />
        <p className="mt-6 text-gray-700 font-medium animate-pulse">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="blue" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">
      <ToastContainer />
      <DoctorNavbar />

      <main className="max-w-7xl mx-1 sm:mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-blue-100/50 overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-white pointer-events-none" />
            <div className="relative flex flex-col space-y-4 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-blue-500">
                    Past Appointments
                  </h2>
                </div>
                <div className="relative w-full sm:w-64 md:w-96">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by patient name, date, or notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-black transition-all duration-200 placeholder-gray-400 text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-4 space-y-4 max-h-170 overflow-y-scroll">
            {filteredAppointments.map((appointment, index) => {
              let users = [];
              for (let i = 0; i < filteredAppointments.length; i++) {
                users.push(filteredAppointments[i].user);
              }
              return (
                <div
                  key={appointment.id}
                  className="bg-gradient-to-br from-white to-blue-50/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100/50 group"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_2fr_2fr_1.5fr] gap-4 sm:gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                          Patient
                        </h3>
                      </div>
                      <p className="text-base sm:text-lg font-medium text-blue-900 ml-11">
                        {filteredAppointments[index].user != null
                          ? filteredAppointments[index].user.username
                          : null}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-violet-100 rounded-lg group-hover:bg-violet-200 transition-colors">
                          <CalendarClock className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                          Date
                        </h3>
                      </div>
                      <p className="text-base sm:text-lg font-medium text-violet-900 ml-11">
                        {format(new Date(appointment.createdAt), "dd MMM yyyy")}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                          <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                          Notes
                        </h3>
                      </div>
                      <p
                        className={`text-sm sm:text-base text-gray-700 mb-0 ml-11 ${
                          expanded ? "" : "line-clamp-2"
                        }`}
                      >
                        {appointment.note}
                      </p>
                      {appointment.note.length > 80 && (
                        <button
                          onClick={toggleExpanded}
                          className="text-blue-500 text-sm ml-11 cursor-pointer focus:outline-none"
                        >
                          {expanded ? "See less" : "See more"}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-start sm:justify-end mt-4 sm:mt-0">
                      <button
                        onClick={() => handleFollowup(appointment)}
                        className="mx-auto sm:mx-0 w-auto px-4 sm:px-4 py-2.5 sm:py-2 bg-blue-500 text-white text-sm sm:text-base rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        Follow-up
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Follow-up Modal */}
      {showFollowupModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 sm:p-8 transform scale-95 animate-modal-in border border-blue-100">
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-violet-100 rounded-xl">
                  <CalendarClock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-blue-500">
                  Schedule
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
                <label
                  className="block text-sm font-medium text-gray-7
                00"
                >
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
                    onChange={(e) => {
                      setFollowupDate(e.target.value);
                      fetchAvailableSlots(e.target.value);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-none transition-all duration-200 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <div className="relative">
                  <div>
                    <select
                      name="time"
                      value={followupTime}
                      onChange={(e) => {
                        setFollowupTime(e.target.value);
                      }}
                      className="w-full  px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black-500 focus:border-transparent transition-all duration-200 outline-none bg-white"
                    >
                      <option className="text-sm" value="">
                        Select Time
                      </option>
                      {Array.isArray(slots) &&
                        slots.map((slot) => (
                          <option
                            className="text-sm"
                            key={slot.id}
                            value={slot.starting_time}
                          >
                            {slot.starting_time.split("T")[1].slice(0, 5)}
                          </option>
                        ))}
                    </select>
                  </div>
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
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-none transition-all duration-200 text-sm sm:text-base"
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
                  disabled={!followupDate || !followupTime || isScheduling}
                  className="w-full mx-auto sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-100 text-blue-500 font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  {isScheduling ? <Loader /> : <>Schedule Follow-up</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mt-10"></div>
      <Footer color="blue" />
    </div>
  );
};

export default History;
