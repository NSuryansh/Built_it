import React, { useEffect, useState } from "react";
import DoctorNavbar from "../../components/doctor/Navbar_doctor";
import { CalendarIcon, MapPin, User, ChevronRight } from "lucide-react";
import PacmanLoader from "react-spinners/PacmanLoader";
import { checkAuth } from "../../utils/profile";
import SessionExpired from "../../components/SessionExpired"; // Ensure this exists
import Footer from "../../components/Footer";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { format } from "date-fns";

import DoctorCalendar from "../../components/DoctorCalendar";
import CustomToast from "../../components/CustomToast";
import { TimeChange } from "../../components/Time_Change";

const DoctorLanding = () => {
  const [appointments, setAppointments] = useState([]);
  const [events, setEvents] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("doc");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  // Fetch upcoming appointments
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
          console.log(appt)
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

  // Fetch events
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

  // Fetch past appointments for bar graph (segregation)

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <PacmanLoader color="#004ba8" radius={6} height={20} width={5} />
        <p>Loading...</p>
      </div>
    );
  }

  const handleClosePopup = () => {
    navigate("/doctor/login");
  };

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <DoctorNavbar className="shadow-sm" />
      <ToastContainer position="top-right" />
      
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-800">
              Welcome, Dr. {localStorage.getItem('username')}
            </h1>
            <p className="text-gray-600 mt-1">
              Your schedule for {format(new Date(), 'dd MMM yyyy')}
            </p>
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 h-full border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Calendar
                </h2>
                <DoctorCalendar className="w-full" />
              </div>
            </div>
  
            {/* Appointments Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Upcoming Appointments
                  </h2>
                  <button className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
  
                <div className="space-y-3">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <h3 className="text-base font-medium text-gray-900 truncate">
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
  
            {/* Events Card */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Upcoming Events
                  </h2>
                  <button className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
  
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-base font-medium text-gray-900 truncate">
                          {event.title}
                        </h3>
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <Footer color={"blue"} className="mt-8" />
    </div>
  )
};

export default DoctorLanding;
