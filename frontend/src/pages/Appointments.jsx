import React, { useEffect, useState } from "react";
import {
  User,
  Calendar,
  CalendarClock,
  History,
  Clock,
  FileText,
} from "lucide-react";
import Navbar from "../components/Navbar";
import PacmanLoader from "react-spinners/PacmanLoader";
import { format } from "date-fns";
import { checkAuth } from "../utils/profile";
import SessionExpired from "../components/SessionExpired";

const UserAppointments = () => {
  const [previousAppointments, setpreviousAppointments] = useState([]);
  const [upcomingAppointments, setupcomingAppointments] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const user_id = localStorage.getItem("userid");

  // Verify authentication
  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("user");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  async function getPrevApp() {
    const res = await fetch(
      `http://localhost:3000/pastuserappt?userId=${user_id}`
    );
    const resp = await res.json();
    setpreviousAppointments(resp);
  }
  
  async function getCurrApp() {
    const res = await fetch(
      `http://localhost:3000/currentuserappt?userId=${user_id}`
    );
    const resp = await res.json();
    setupcomingAppointments(resp);
  }
  
  useEffect(() => {
    getPrevApp();
    getCurrApp();
  }, []);
  
  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <PacmanLoader color="#ff4800" radius={6} height={20} width={5} />
        <p className="mt-4 text-gray-600">Loading your wellness journey...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} />;
  }

  const NoAppointmentsMessage = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-8">
      <Calendar className="h-12 w-12 text-gray-400 mb-3" />
      <p className="text-lg text-gray-500 font-medium">{message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--custom-orange-100)]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg mb-8 p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-gray-600" />
              Upcoming Appointments
            </h2>
            <span className="px-3 py-1 bg-[var(--custom-orange-50)] text-[var(--custom-orange-600)] rounded-full text-sm font-medium">
              {upcomingAppointments.length} Scheduled
            </span>
          </div>
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-[var(--custom-orange-50)] rounded-lg p-4 transition-all duration-200 hover:bg-[var(--custom-orange-100)]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-[var(--custom-white)] p-2 rounded-full shadow-sm">
                          <User className="h-6 w-6 text-[var(--custom-orange-600)]" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {appointment.doctor.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {appointment.reason}
                          </p>
                          <p className="text-sm text-[var(--custom-orange-600)] mt-2 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {format(
                              appointment.dateTime,
                              "dd-MMM-yyyy hh:mm a"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-[var(--custom-orange-500)] hover:text-[var(--custom-orange-700)] transition-colors">
                          <FileText className="w-5 h-5" />
                        </button>
                        <button className="text-[var(--custom-orange-500)] hover:text-[var(--custom-orange-700)] transition-colors">
                          <Calendar className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <NoAppointmentsMessage message="No upcoming appointments scheduled" />
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <History className="w-5 h-5 text-gray-600" />
              Previous Appointments
            </h2>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
              {previousAppointments.length} Total
            </span>
          </div>
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            {previousAppointments.length > 0 ? (
              <div className="space-y-4">
                {previousAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-gray-50 rounded-lg p-4 transition-all duration-200 hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-white p-2 rounded-full shadow-sm">
                          <User className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {appointment.doc.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(appointment.createdAt, 'dd-MMM-yyyy hh:mm a')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-gray-500 hover:text-gray-700 transition-colors">
                          <FileText className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <NoAppointmentsMessage message="No previous appointments found" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAppointments;
