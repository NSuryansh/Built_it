import React, { useEffect, useState } from "react";
import { Calendar, History } from "lucide-react";
import { checkAuth } from "../../utils/profile";
import { useNavigate } from "react-router-dom";
import CustomToast from "../../components/common/CustomToast";
import SessionExpired from "../../components/common/SessionExpired";
import Navbar from "../../components/user/Navbar";
import AppointmentCard from "../../components/user/AppointmentCard";
import Footer from "../../components/common/Footer";
import CustomLoader from "../../components/common/CustomLoader";

const UserAppointments = () => {
  const [previousAppointments, setpreviousAppointments] = useState([]);
  const [upcomingAppointments, setupcomingAppointments] = useState([]);
  const [requestedAppoinments, setrequestedAppoinments] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [fixed, setFixed] = useState(false); 
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
        `http://localhost:3000/api/user/pastuserappt?userId=${user_id}`,
        { headers: { Authorization: "Bearer " + token } }
      );
      if (!res.ok) throw new Error("Failed to fetch past appointments");
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
        `http://localhost:3000/api/user/currentuserappt?userId=${user_id}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch current appointments");
      const resp = await res.json();
      setupcomingAppointments(resp);
    } catch (error) {
      console.error(error);
      CustomToast("Error fetching current appointments");
    }
  }

  async function getReqApp() {
    try {
      const res = await fetch(`http://localhost:3000/api/user/getRequests?userId=${user_id}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      if (!res.ok) throw new Error("Failed to fetch appointment requests");
      const resp = await res.json();
      console.log(resp, "re")
      setrequestedAppoinments(resp)
    } catch (error) {
      console.error(error);
      CustomToast("Error fetching appointment requests");
    }
  }
  const sendNotif = async (appointment, type = "accepted") => {
    try {
      await fetch("http://localhost:3000/api/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          toUserId: appointment.user_id || appointment.userId,
          title: type === "accepted" ? "Appointment confirmed" : "Appointment response",
          message:
            type === "accepted"
              ? `Your appointment with ${appointment.doctor?.name || "doctor"} on ${new Date(
                  appointment.dateTime
                ).toLocaleString()} is confirmed.`
              : `Your appointment request was ${type}.`,
          metadata: { appointmentId: appointment.id },
        }),
      });
    } catch (err) {
      console.warn("Failed to send notification", err);
    }
  };

  const onAccepted = async (appointment) => {
    try {
      const dateTime = new Date(appointment.dateTime);
      const res = await fetch("http://localhost:3000/api/user_doc/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          userId: appointment.user_id || appointment.userId,
          doctorId: appointment.doctor_id || appointment.doctorId,
          dateTime,
          reason: appointment.reason || "",
          id: appointment.id,
          forDoctor: false
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to accept appointment");
      }

      const resp = await res.json();

      
      setrequestedAppoinments((prev) => prev.filter((a) => a.id !== appointment.id));

      const bookedAppointment = resp.appointment || {
        ...appointment,
        dateTime: dateTime.toISOString(),
      };
      setupcomingAppointments((prev) => [bookedAppointment, ...prev]);

      await sendNotif(appointment, "accepted");

      CustomToast("Appointment accepted and booked");
      setFixed((f) => !f);
    } catch (error) {
      console.error(error);
      CustomToast("Failed to accept appointment");
    }
  };

  const onRejected = async (appointment, reason) => {
    console.log(appointment, "Rejected", reason)
    try {
      const res = await fetch("http://localhost:3000/api/user_doc/cancelRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          id: appointment.id,
          reason: reason,
        }),
      });
 
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to reject appointment");
      }

      setrequestedAppoinments((prev) => prev.filter((a) => a.id !== appointment.id));

      await sendNotif(appointment, "rejected");
      CustomToast("Appointment request rejected");
      setFixed((f) => !f);
    } catch (error) {
      console.error(error);
      CustomToast("Failed to reject appointment");
    }
  };

  useEffect(() => {
    getPrevApp();
    getCurrApp();
    getReqApp();
  }, [submittedRatings, fixed]);

  const handleClosePopup = () => {
    navigate("/user/login");
  };

  if (isAuthenticated === null) {
    return <CustomLoader text="Loading your wellness journey..." />;
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
          <div className="bg-[var(--custom-white)] bg-opacity-90 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-[var(--custom-orange-100)] transition-all duration-300 hover:shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[var(--custom-orange-900)] flex items-center gap-3">
                <Calendar className="w-6 h-6 text-[var(--custom-orange-600)]" />
                Requested Appoinments
              </h2>
              <span className="px-4 py-1 mt-4 sm:mt-0 bg-gradient-to-r from-[var(--custom-gray-100)] to-[var(--custom-gray-200)] text-[var(--custom-gray-700)] rounded-full text-sm font-semibold shadow-sm">
                {requestedAppoinments.length} Total
              </span>
            </div>

            <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
              {requestedAppoinments.length > 0 ? (
                <div className="space-y-6">
                  {requestedAppoinments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      feedbackSubmitted={appointment.stars !== null}
                      requested={true}
                      upcoming={false}
                      onAccepted={onAccepted}
                      onRejected={onRejected}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <NoAppointmentsMessage message="No appoinments requested" />
                </div>
              )}
            </div>
          </div>

          <div className="bg-[var(--custom-white)] bg-opacity-90 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-[var(--custom-orange-100)] transition-all duration-300 hover:shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[var(--custom-orange-900)] flex items-center gap-3">
                <Calendar className="w-6 h-6 text-[var(--custom-orange-600)]" />
                Upcoming Appointments
              </h2>
              <span className="px-4 py-1 mt-4 sm:mt-0 bg-gradient-to-r from-[var(--custom-gray-100)] to-[var(--custom-gray-200)] text-[var(--custom-gray-700)] rounded-full text-sm font-semibold shadow-sm">
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
                      requested={false}
                      upcoming={true}
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

          <div className="bg-[var(--custom-white)] bg-opacity-90 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-[var(--custom-orange-100)] transition-all duration-300 hover:shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[var(--custom-orange-900)] flex items-center gap-3">
                <History className="w-6 h-6 text-[var(--custom-orange-600)]" />
                Previous Appointments
              </h2>
              <span className="px-4 py-1 mt-4 sm:mt-0 bg-gradient-to-r from-[var(--custom-gray-100)] to-[var(--custom-gray-200)] text-[var(--custom-gray-700)] rounded-full text-sm font-semibold shadow-sm">
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
                      requested={false}
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
