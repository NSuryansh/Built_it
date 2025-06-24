import React, { useEffect, useState } from "react";
import DoctorNavbar from "../../components/doctor/Navbar";
import {
  CalendarIcon,
  MapPin,
  User,
  ChevronRight,
  Clock,
  Bell,
  Calendar,
  Activity,
} from "lucide-react";
import { checkAuth } from "../../utils/profile";
import SessionExpired from "../../components/common/SessionExpired";
import Footer from "../../components/common/Footer";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import DoctorCalendar from "../../components/doctor/Calendar";
import CustomToast from "../../components/common/CustomToast";
import { TimeChange } from "../../components/common/TimeChange";
import CustomLoader from "../../components/common/CustomLoader";
import CustomModal from "../../components/common/CustomModal";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [events, setEvents] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [newAppoinments, setNewAppoinments] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isProfileDone = localStorage.getItem("isProfileDone");
  const [showCustomModal, setShowCustomModal] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("doc");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  useEffect(() => {
    if (isProfileDone === "false" || !isProfileDone) {
      setShowCustomModal(true);
    }
  }, [isProfileDone]);

  useEffect(() => {
    const docId = localStorage.getItem("userid");
    if (!docId) return;

    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/doc/currentdocappt?doctorId=${docId}`,
          { headers: { Authorization: "Bearer " + token } }
        );
        const data = await response.json();

        const formattedAppointments = data.map((appt) => {
          const dateObj = new Date(appt.dateTime);
          const newDate = TimeChange(dateObj.getTime());
          return {
            id: appt.id,
            patientName: `${appt.user.username}`,
            time: newDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            date: newDate.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            type: appt.reason,
          };
        });

        setAppointments(formattedAppointments);
      } catch (error) {
        console.error("Error fetching appointments", error);
        CustomToast("Error while fetching data", "blue");
      }
    };

    fetchAppointments();
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/common/events",
          {
            headers: { Authorization: "Bearer " + token },
          }
        );
        const data = await response.json();

        const formattedEvents = data.map((event) => {
          const date = new Date(event.dateTime);
          return {
            id: event.id,
            title: event.title,
            date: date.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            location: event.venue,
            type: event.description ? "Session/Conference" : "Meeting",
          };
        });

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events", error);
        CustomToast("Error while fetching data", "blue");
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    setNewAppoinments(appointments.slice(0, 5));
  }, [appointments]);

  if (isAuthenticated === null) {
    return <CustomLoader color="blue" text="Loading your dashboard..." />;
  }

  const handleClosePopup = () => {
    navigate("/doctor/login");
  };

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="blue" />;
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[var(--custom-gray-50)] to-[var(--custom-blue-50)]">
      <DoctorNavbar className="shadow-sm" />
      <ToastContainer position="top-right" />

      <motion.div
        className="flex-1 px-4 sm:px-6 lg:px-8 py-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            className="mb-8 bg-[var(--custom-white)] rounded-2xl p-6 shadow-sm border border-[var(--custom-gray-100)]"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-[var(--custom-blue-800)] mb-1">
                  {greeting},
                </h1>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--custom-blue-800)] mb-2">
                  Dr. {localStorage.getItem("username")}
                </h2>
                <p className="text-[var(--custom-gray-600)] flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {format(new Date(), "EEEE, dd MMM yyyy")}
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <motion.div
                  className="flex items-center p-3 bg-[var(--custom-blue-50)] rounded-xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <Calendar className="h-6 w-6 text-[var(--custom-blue-600)]" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-[var(--custom-blue-900)]">
                      Upcoming Appointments
                    </p>
                    <p className="text-2xl font-bold text-[var(--custom-blue-600)]">
                      {appointments.length}
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-center p-3 bg-[var(--custom-green-50)] rounded-xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <Activity className="h-6 w-6 text-[var(--custom-green-600)]" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-[var(--custom-green-900)]">
                      Upcoming Events
                    </p>
                    <p className="text-2xl font-bold text-[var(--custom-green-600)]">
                      {events.length}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar Card */}
            <motion.div className="lg:col-span-1" variants={itemVariants}>
              <div className="bg-[var(--custom-white)] rounded-2xl shadow-sm p-6 h-full border border-[var(--custom-gray-100)] hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-xl font-semibold text-[var(--custom-gray-900)] mb-4 flex justify-center items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-[var(--custom-blue-600)]" />
                  Calendar
                </h2>
                <DoctorCalendar className="w-full" />
              </div>
            </motion.div>

            {/* Appointments Card */}
            <motion.div className="lg:col-span-2" variants={itemVariants}>
              <div className="bg-[var(--custom-white)] rounded-2xl shadow-sm p-6 border border-[var(--custom-gray-100)] hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-[var(--custom-gray-900)] flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-[var(--custom-blue-600)]" />
                    Upcoming Appointments
                  </h2>
                  <Link
                    to="/doctor/appointments"
                    className="flex items-center px-4 py-2 bg-[var(--custom-blue-50)] text-[var(--custom-blue-600)] rounded-lg hover:bg-[var(--custom-blue-100)] transition-all duration-300 font-medium"
                  >
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>

                {newAppoinments.length > 0 ? (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {newAppoinments.map((appointment, index) => (
                        <motion.div
                          key={appointment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center p-4 bg-[var(--custom-white)] border border-[var(--custom-gray-100)] rounded-xl hover:shadow-md transition-all cursor-pointer hover:border-[var(--custom-blue-200)] group"
                        >
                          <div className="h-12 w-12 rounded-full bg-[var(--custom-blue-50)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--custom-blue-100)] transition-colors">
                            <User className="h-6 w-6 text-[var(--custom-blue-600)]" />
                          </div>
                          <div className="ml-4 flex-1 min-w-0">
                            <h3 className="font-medium text-[var(--custom-gray-900)] truncate group-hover:text-[var(--custom-blue-700)] transition-colors">
                              {appointment.patientName}
                            </h3>
                            <p className="text-sm text-[var(--custom-gray-600)]">
                              {appointment.type}
                            </p>
                          </div>
                          <div className="ml-4 text-right flex-shrink-0">
                            <p className="text-sm font-medium text-[var(--custom-gray-900)]">
                              {appointment.time}
                            </p>
                            <p className="text-sm text-[var(--custom-gray-600)]">
                              {appointment.date}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex flex-col bg-[var(--custom-white)]/80 backdrop-blur-lg rounded-3xl shadow-md border border-[var(--custom-blue-100)] items-center justify-center py-8 px-4">
                    <div className="h-24 w-24 rounded-full bg-[var(--custom-blue-50)] flex items-center justify-center mb-6">
                      <Clock className="h-12 w-12 text-[var(--custom-blue-400)]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--custom-gray-800)] mb-2">
                      No Current Appointments
                    </h3>
                    <p className="text-[var(--custom-gray-600)] text-center max-w-md">
                      You don't have any appointments scheduled at the moment.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Events Card */}
            <motion.div className="lg:col-span-3" variants={itemVariants}>
              <div className="bg-[var(--custom-white)] rounded-2xl shadow-sm p-6 border border-[var(--custom-gray-100)] hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-[var(--custom-gray-900)] flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-[var(--custom-blue-600)]" />
                    Upcoming Events
                  </h2>
                </div>

                {events.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {events.map((event, index) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-[var(--custom-white)] border border-[var(--custom-gray-100)] rounded-xl hover:shadow-md transition-all cursor-pointer hover:border-[var(--custom-blue-200)] group"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-[var(--custom-gray-900)] truncate group-hover:text-[var(--custom-blue-700)] transition-colors">
                              {event.title}
                            </h3>
                            <span className="px-2 py-1 bg-[var(--custom-blue-50)] text-[var(--custom-blue-700)] text-xs font-medium rounded-full group-hover:bg-[var(--custom-blue-100)] transition-colors">
                              {event.type}
                            </span>
                          </div>
                          <div className="space-y-2 text-sm text-[var(--custom-gray-600)]">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-2 text-[var(--custom-blue-500)]" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-[var(--custom-blue-500)]" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex flex-col bg-[var(--custom-white)]/80 backdrop-blur-lg rounded-3xl shadow-md border border-[var(--custom-blue-100)] items-center justify-center py-8 px-4">
                    <div className="h-24 w-24 rounded-full bg-[var(--custom-blue-50)] flex items-center justify-center mb-6">
                      <Clock className="h-12 w-12 text-[var(--custom-blue-400)]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--custom-gray-800)] mb-2">
                      No Upcoming Events
                    </h3>
                    <p className="text-[var(--custom-gray-600)] text-center max-w-md">
                      There are no upcoming events scheduled.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <Footer color={"blue"} className="mt-8" />
      {showCustomModal && (
        <CustomModal
          handleLogout={() => navigate("/doctor/profile")}
          handleCancel={() => setShowCustomModal(false)}
          title="Complete Your Profile"
          text="Please complete your profile for better functionality."
          buttonText="Complete Profile"
          theme="blue"
        />
      )}
    </div>
  );
};

export default DoctorDashboard;
