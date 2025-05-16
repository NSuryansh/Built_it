import { useEffect, useState } from "react";
import { Calendar, History } from "lucide-react";
import Navbar from "../components/Navbar";
import PacmanLoader from "react-spinners/PacmanLoader";
import { checkAuth } from "../utils/profile";
import SessionExpired from "../components/SessionExpired";
import { useNavigate } from "react-router-dom";
import CustomToast from "../components/CustomToast";
import Footer from "../components/Footer";
import AppointmentCard from "../components/AppointmentCard";

const UserAppointments = () => {
  const [previousAppointments, setpreviousAppointments] = useState([]);
  const [upcomingAppointments, setupcomingAppointments] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const user_id = localStorage.getItem("userid");
  const [submittedRatings, setSubmittedRatings] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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
        `http://localhost:3000/pastuserappt?userId=${user_id}`,
        { headers: { Authorization: "Bearer " + token } }
      );
      const resp = await res.json();
      setpreviousAppointments(resp);
    } catch (error) {
      console.error(error);
      CustomToast("Error fetching past appointments");
    }
  }

  async function getCurrApp() {
    try {
      const res = await fetch(
        `http://localhost:3000/currentuserappt?userId=${user_id}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      const resp = await res.json();
      setupcomingAppointments(resp);
    } catch (error) {
      console.error(error);
      CustomToast("Error fetching current appointments");
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
        <div className="grid gap-8">
          {/* Upcoming Appointments Section */}
          <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-[var(--custom-orange-100)] transition-all duration-300 hover:shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[var(--custom-orange-900)] flex items-center gap-3">
                <Calendar className="w-6 h-6 text-[var(--custom-orange-600)]" />
                Upcoming Appointments
              </h2>
              <span className="px-4 py-1 mt-4 sm:mt-0 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-sm font-semibold shadow-sm">
                {upcomingAppointments.length} Total
              </span>
            </div>

            <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-6">
                  {upcomingAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      feedbackSubmitted={appointment.stars !== null}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <NoAppointmentsMessage message="No upcoming appointments scheduled" />
                </div>
              )}
            </div>
          </div>

          {/* Previous Appointments Section */}
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
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      feedbackSubmitted={appointment.stars !== null}
                      upcoming={false}
                    />
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
      <Footer color="orange" />
    </div>
  );
};

export default UserAppointments;
