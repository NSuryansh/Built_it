import React, { useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import { Button } from "@mui/material";
import { User, Calendar, CalendarClock, History, Clock, FileText, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import PacmanLoader from "react-spinners/PacmanLoader";
import { format } from "date-fns";
import { checkAuth } from "../utils/profile";
import SessionExpired from "../components/SessionExpired";
import { useNavigate } from "react-router-dom";

const UserAppointments = () => {
  const [previousAppointments, setpreviousAppointments] = useState([]);
  const [upcomingAppointments, setupcomingAppointments] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const user_id = localStorage.getItem("userid");
  const [ratings, setRatings] = useState({});
  const [submittedRatings, setSubmittedRatings] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("user");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  async function getPrevApp() {
    try {
      const res = await fetch(
        `http://localhost:3000/pastuserappt?userId=${user_id}`
      );
      const resp = await res.json();
      setpreviousAppointments(resp);
      console.log(resp);
    } catch (error) {
      console.error(error);
    }
  }

  async function getCurrApp() {
    try {
      const res = await fetch(
        `http://localhost:3000/currentuserappt?userId=${user_id}`
      );
      const resp = await res.json();
      setupcomingAppointments(resp);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getPrevApp();
    getCurrApp();
  }, [submittedRatings]);

  const handleClosePopup = () => {
    navigate("/login");
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <PacmanLoader color="#ff4800" radius={6} height={20} width={5} />
        <p className="mt-4 text-gray-600">Loading your wellness journey...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <SessionExpired handleClosePopup={handleClosePopup} theme="orange" />
    );
  }

  // Only handles submitting data, not the event
  const submitRating = async (appointmentId, ratingValue, docId) => {
    try {
      const res = await fetch("http://localhost:3000/setRating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: appointmentId,
          stars: ratingValue,
          doctorId: docId,
        }),
      });

      if (res.ok) {
        setSubmittedRatings((prev) => ({
          ...prev,
          [appointmentId]: true,
        }));
      } else {
        console.error("Failed to submit rating");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const NoAppointmentsMessage = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-8">
      <Calendar className="h-12 w-12 text-gray-400 mb-3" />
      <p className="text-lg text-gray-500 font-medium">{message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--custom-orange-50)] to-[var(--custom-orange-100)]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Upcoming Appointments */}
        <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-xl mb-10 p-8 border border-[var(--custom-orange-100)] transition-all duration-300 hover:shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[var(--custom-orange-900)] flex items-center gap-3">
              <CalendarClock className="w-6 h-6 text-[var(--custom-orange-600)]" />
              Upcoming Appointments
            </h2>
            <span className="px-4 py-1 mt-4 sm:mt-0 bg-gradient-to-r from-[var(--custom-orange-100)] to-[var(--custom-orange-200)] text-[var(--custom-orange-700)] rounded-full text-sm font-semibold shadow-sm">
              {upcomingAppointments.length} Scheduled
            </span>
          </div>
          <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="group bg-white hover:bg-[var(--custom-orange-50)] rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-[var(--custom-orange-100)]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-br from-[var(--custom-orange-100)] to-[var(--custom-orange-200)] p-3 rounded-full group-hover:from-[var(--custom-orange-200)] group-hover:to-[var(--custom-orange-300)] transition-all duration-300">
                        <User className="h-6 w-6 text-[var(--custom-orange-700)]" />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-[var(--custom-orange-900)] text-lg">
                              {appointment.doctor.name}
                            </h3>
                          </div>
                          <p className="text-sm text-[var(--custom-orange-600)]">
                            {appointment.doctor.specialty}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          <p className="text-sm text-[var(--custom-orange-700)]">
                            {appointment.reason}
                          </p>
                          <div className="mt-2 sm:mt-0 flex items-center gap-2 text-sm text-[var(--custom-orange-600)]">
                            <Clock className="w-4 h-4" />
                            <span>
                              {format(
                                appointment.dateTime,
                                "MMM d 'at' h:mm a"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <NoAppointmentsMessage message="No upcoming appointments scheduled" />
              </div>
            )}
          </div>
        </div>

        {/* Previous Appointments */}
        <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-[var(--custom-orange-100)] transition-all duration-300 hover:shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[var(--custom-orange-900)] flex items-center gap-3">
              <History className="w-6 h-6 text-[var(--custom-orange-600)]" />
              Previous Appointments
            </h2>
            <span className="px-4 py-1 mt-4 sm:mt-0 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-sm font-semibold shadow-sm">
              {previousAppointments.length} Total
            </span>
          </div>
          <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
            {previousAppointments.length > 0 ? (
              <div className="space-y-6">
                {previousAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-gray-50 bg-opacity-80 rounded-xl p-6 transition-all duration-300 hover:bg-gray-100 hover:shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-5">
                        <div className="bg-white p-3 rounded-full shadow-md">
                          <User className="h-7 w-7 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[var(--custom-orange-900)] text-lg">
                            {appointment.doc.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            {format(appointment.createdAt, "dd MMM hh:mm a")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {!appointment.stars ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              submitRating(
                                appointment.id,
                                ratings[appointment.id] || 3,
                                appointment.doc.id
                              );
                            }}
                            className="flex items-center gap-3"
                          >
                            <Rating
                              name={`rating-${appointment.id}`}
                              value={ratings[appointment.id] || 3}
                              onChange={(event, newValue) => {
                                setRatings((prev) => ({
                                  ...prev,
                                  [appointment.id]: newValue,
                                }));
                              }}
                              sx={{
                                "& .MuiRating-iconFilled": {
                                  color: "var(--custom-orange-600)",
                                },
                                "& .MuiRating-iconHover": {
                                  color: "var(--custom-orange-700)",
                                },
                              }}
                            />
                            <button
                              type="submit"
                              className="bg-gradient-to-r from-[var(--custom-orange-500)] to-[var(--custom-orange-600)] text-white px-4 py-1 rounded-lg text-sm font-semibold hover:from-[var(--custom-orange-600)] hover:to-[var(--custom-orange-700)] transition-all duration-200"
                            >
                              Submit
                            </button>
                          </form>
                        ) : (
                          <span className="text-[var(--custom-orange-600)] font-semibold text-sm flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" /> Rating
                            Submitted!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
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
