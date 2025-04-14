import React, { useEffect, useState } from "react";
import DoctorNavbar from "../../components/doctor/Navbar_doctor";
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
import PacmanLoader from "react-spinners/PacmanLoader";
import { checkAuth } from "../../utils/profile";
import SessionExpired from "../../components/SessionExpired";
import Footer from "../../components/Footer";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import DoctorCalendar from "../../components/doctor/DoctorCalendar";
import CustomToast from "../../components/CustomToast";
import { TimeChange } from "../../components/Time_Change";

const DoctorLanding = () => {
  const [appointments, setAppointments] = useState([]);
  const [events, setEvents] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [newAppoinments, setNewAppoinments] = useState([]);

  const navigate = useNavigate();

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
    const docId = localStorage.getItem("userid");
    if (!docId) return;

    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/currentdocappt?doctorId=${docId}`
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
        CustomToast("Error while fetching data");
      }
    };

    fetchAppointments();
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3000/events");
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
        CustomToast("Error while fetching data");
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    setNewAppoinments(appointments.slice(0, 5));
  }, [appointments]);

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <PacmanLoader color="#004ba8" radius={6} height={20} width={5} />
        </motion.div>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-gray-600 font-medium"
        >
          Loading your dashboard...
        </motion.p>
      </div>
    );
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
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
            className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-blue-800 mb-1">
                  {greeting},
                </h1>
                <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">
                  Dr. {localStorage.getItem("username")}
                </h2>
                <p className="text-gray-600 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {format(new Date(), "EEEE, dd MMM yyyy")}
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <motion.div
                  className="flex items-center p-3 bg-blue-50 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-900">
                      Upcoming Appointments
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {appointments.length}
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-center p-3 bg-green-50 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <Activity className="h-6 w-6 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-900">
                      Upcoming Events
                    </p>
                    <p className="text-2xl font-bold text-green-600">
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
              <div className="bg-white rounded-2xl shadow-sm p-6 h-full border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex justify-center items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Calendar
                </h2>
                <DoctorCalendar className="w-full" />
              </div>
            </motion.div>

            {/* Appointments Card */}
            <motion.div className="lg:col-span-2" variants={itemVariants}>
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-blue-600" />
                    Upcoming Appointments
                  </h2>
                  <Link
                    to="/doctor/appointments"
                    className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-300 font-medium"
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
                          className="flex items-center p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all cursor-pointer hover:border-blue-200 group"
                        >
                          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="ml-4 flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                              {appointment.patientName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {appointment.type}
                            </p>
                          </div>
                          <div className="ml-4 text-right flex-shrink-0">
                            <p className="text-sm font-medium text-gray-900">
                              {appointment.time}
                            </p>
                            <p className="text-sm text-gray-600">
                              {appointment.date}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex flex-col bg-white/80 backdrop-blur-lg rounded-3xl shadow-md border border-blue-100 items-center justify-center py-8 px-4">
                    <div className="h-24 w-24 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                      <Clock className="h-12 w-12 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      No Current Appointments
                    </h3>
                    <p className="text-gray-600 text-center max-w-md">
                      You don't have any appointments scheduled at the moment.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Events Card */}
            <motion.div className="lg:col-span-3" variants={itemVariants}>
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
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
                          className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all cursor-pointer hover:border-blue-200 group"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                              {event.title}
                            </h3>
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full group-hover:bg-blue-100 transition-colors">
                              {event.type}
                            </span>
                          </div>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-2 text-blue-500" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex flex-col bg-white/80 backdrop-blur-lg rounded-3xl shadow-md border border-blue-100 items-center justify-center py-8 px-4">
                    <div className="h-24 w-24 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                      <Clock className="h-12 w-12 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      No Upcoming Events
                    </h3>
                    <p className="text-gray-600 text-center max-w-md">
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
    </div>
  );
};

export default DoctorLanding;
