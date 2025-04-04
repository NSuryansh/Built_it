import React, { useEffect } from "react";
import { User, CircleUser, Clock, Phone, FileText } from "lucide-react";
import DoctorNavbar from "../../components/doctor/Navbar_doctor";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { DateTimePicker } from "../../components/doctor/DateTimePicker";
import Footer from "../../components/Footer";
import { format } from "date-fns";
import PacmanLoader from "react-spinners/PacmanLoader";
import { checkAuth } from "../../utils/profile";
import { useNavigate } from "react-router-dom";
import SessionExpired from "../../components/SessionExpired";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TimeChange, TimeReduce } from "../../components/Time_Change";
import CustomToast from "../../components/CustomToast";

const DoctorAppointment = () => {
  const [fixed, setFixed] = useState(false);
  const [completedNotes, setCompletedNotes] = useState({});
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setapp] = useState([]);
  const [curr, setcurr] = useState([]);
  const [comp, setcomp] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [timePeriodData, setTimePeriodData] = useState({
    "Last 1 Month": { UG: 0, PG: 0, PhD: 0 },
    "Last 3 Months": { UG: 0, PG: 0, PhD: 0 },
    "Last 6 Months": { UG: 0, PG: 0, PhD: 0 },
    "Last 12 Months": { UG: 0, PG: 0, PhD: 0 },
  });
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("doc");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  const handleMarkAsDone = (id) => {
    setCompletedNotes((prev) => ({
      ...prev,
      [id]: prev[id] ? "" : "",
    }));
  };

  const [note, setNote] = useState("");

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  useEffect(() => {
    const docId = localStorage.getItem("userid");
    if (!docId) return;
    const fetchData = async () => {
      const docId = localStorage.getItem("userid");
      const res = await fetch(`http://localhost:3000/reqApp?docId=${docId}`);
      const res2 = await fetch(
        `http://localhost:3000/currentdocappt?doctorId=${docId}`
      );
      const resp2 = await res.json();
      const resp = await res2.json();
      for (var i = 0; i < resp2.length; i++) {
        resp2[i].dateTime = TimeChange(new Date(resp2[i].dateTime).getTime());
      }
      for (var i = 0; i < resp.length; i++) {
        resp[i].dateTime = TimeChange(new Date(resp[i].dateTime).getTime());
      }
      setapp(resp2);
      setcurr(resp);
    };

    fetchData();
  }, [fixed]);

  useEffect(() => {
    const docId = localStorage.getItem("userid");
    if (!docId) return;

    const fetchPastAppointments = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/pastdocappt?doctorId=${docId}`
        );
        const data = await response.json();
        if (response.ok) {
          const periods = {
            "Last 1 Month": { UG: 0, PG: 0, PhD: 0 },
            "Last 3 Months": { UG: 0, PG: 0, PhD: 0 },
            "Last 6 Months": { UG: 0, PG: 0, PhD: 0 },
            "Last 12 Months": { UG: 0, PG: 0, PhD: 0 },
          };

          const now = new Date();

          data.forEach((app) => {
            const apptDate = new Date(app.createdAt);
            const diffTime = now - apptDate;
            const diffDays = diffTime / (1000 * 3600 * 24);
            const branch = app.user.acadProg;

            if (diffDays <= 30) {
              periods["Last 1 Month"][branch] += 1;
              periods["Last 3 Months"][branch] += 1;
              periods["Last 6 Months"][branch] += 1;
              periods["Last 12 Months"][branch] += 1;
            } else if (diffDays <= 90) {
              periods["Last 3 Months"][branch] += 1;
              periods["Last 6 Months"][branch] += 1;
              periods["Last 12 Months"][branch] += 1;
            } else if (diffDays <= 180) {
              periods["Last 6 Months"][branch] += 1;
              periods["Last 12 Months"][branch] += 1;
            } else if (diffDays <= 365) {
              periods["Last 12 Months"][branch] += 1;
            }
          });

          setTimePeriodData(periods);
        } else {
          console.error("Error in fetching past appointments: ", data.message);
        }
      } catch (error) {
        console.error("Error fetching past appointments: ", error);
        CustomToast("Error while fetching past appointments");
      }
    };
    fetchPastAppointments();
  }, []);

  const histogramData = Object.keys(timePeriodData).map((period) => ({
    name: period,
    UG: timePeriodData[period].UG || 0,
    PG: timePeriodData[period].PG || 0,
    PhD: timePeriodData[period].PhD || 0,
  }));

  const acceptApp = async (appointment) => {
    appointment.dateTime = new Date(appointment.dateTime);
    const res = await fetch("http://localhost:3000/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: appointment["user_id"],
        doctorId: appointment["doctor_id"],
        dateTime: appointment["dateTime"],
        reason: appointment["reason"],
        id: appointment["id"],
      }),
    });

    const resp = await res.json();
    const docName = localStorage.getItem("username");

    var params = {
      doctor: docName,
      dateTime: format(appointment.dateTime, "dd-MMM-yyyy hh:mm a"),
      email: appointment.user.email,
    };
    emailjs
      .send("service_coucldi", "template_9at0fnv", params, "5rqHkmhJJfAxWBFNo")
      .then(
        (repsonse) => {
          console.log("success", repsonse.status);
        },
        (error) => {
          console.log(error);
        }
      );
    setFixed(!fixed);
  };

  const deleteApp = async (appointment) => {
    const res = await fetch("http://localhost:3000/deleteApp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appId: appointment["id"],
        doctorId: appointment["doctor_id"],
        userId: appointment["user_id"],
        note: note,
      }),
    });
    const resp = await res.json();
    setFixed(!fixed);
  };

  const emailParams = async (appointment, time) => {
    const docName = localStorage.getItem("username");
    var params = {
      id: appointment["id"],
      username: appointment["user"]["username"],
      doctor: docName,
      origTime: format(appointment["dateTime"], "dd-MMM-yy hh:mm a"),
      newTime: time,
      email: appointment["user"]["email"],
    };
    const res = await fetch("http://localhost:3000/reschedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appId: appointment["id"],
      }),
    });
    const resp = await res.json();
    setFixed(!fixed);
    emailjs
      .send("service_coucldi", "template_b96adyb", params, "5rqHkmhJJfAxWBFNo")
      .then(
        (repsonse) => {
          console.log("success", repsonse.status);
        },
        (error) => {
          console.log(error);
        }
      );
  };
  const handleClosePopup = () => {
    navigate("/doctor/login");
  };

  const handleDateSelect = (date, appointmentId) => {
    setSelectedDate(date);
    if (date) {
      CustomToast("Booking Rescheduled");
      setSelectedAppointment(null);
    }
  };

  const handleReschedule = async (appointment) => {
    const appointmentId = appointment.id;
    setSelectedAppointment(
      appointmentId === selectedAppointment ? null : appointmentId
    );
    if (selectedDate) {
      const res = await emailParams(appointment, selectedDate);
      handleDateSelect(selectedDate, appointmentId);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <PacmanLoader color="#004ba8" radius={6} height={20} width={5} />
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-teal-50 font-sans antialiased">
      <DoctorNavbar />
      <div className="container mx-auto px-4 sm:px-8 lg:px-16 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Current Appointments */}
          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-500 to-teal-400 drop-shadow-lg">
                  Current Appointments
                </h1>
                <p className="mt-3 text-lg text-gray-600 tracking-wide font-light">
                  Seamlessly manage your upcoming appointments
                </p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-indigo-100/50 overflow-hidden">
              {curr.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-8 border-b border-indigo-100/50 hover:bg-gradient-to-r from-indigo-50/50 to-teal-50/50 transition-all duration-500"
                >
                  <div className="flex items-start space-x-7">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-200 to-teal-300 flex items-center justify-center shadow-lg shrink-0">
                      <User className="h-8 w-8 text-indigo-700" />
                    </div>
                    <div className="flex-1 space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center text-lg text-gray-800">
                          <CircleUser className="h-6 w-6 mr-4 text-indigo-600" />
                          <span className="font-semibold tracking-tight">{appointment.user.username}</span>
                        </div>
                        <div className="flex items-center text-lg text-gray-800">
                          <Clock className="h-6 w-6 mr-4 text-indigo-600" />
                          {format(appointment.dateTime, "dd-MMM-yyyy h:mm a")}
                        </div>
                        <div className="flex items-center text-lg text-gray-800">
                          <Phone className="h-6 w-6 mr-4 text-indigo-600" />
                          {appointment.user.mobile}
                        </div>
                        <div className="flex items-start text-lg text-gray-800">
                          <FileText className="h-6 w-6 mr-4 mt-1 text-indigo-600" />
                          <span>{appointment.reason}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-5">
                        {completedNotes[appointment.id] !== undefined ? (
                          <button
                            onClick={() => deleteApp(appointment)}
                            className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-base font-semibold rounded-full shadow-lg hover:from-red-600 hover:to-rose-700 transform hover:scale-105 transition-all duration-300"
                          >
                            Done
                          </button>
                        ) : (
                          <button
                            onClick={() => handleMarkAsDone(appointment.id)}
                            className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-teal-500 text-white text-base font-semibold rounded-full shadow-lg hover:from-indigo-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-300"
                          >
                            Mark as Done
                          </button>
                        )}
                      </div>
                      {completedNotes[appointment.id] !== undefined && (
                        <div className="mt-6">
                          <input
                            type="text"
                            placeholder="Enter completion notes..."
                            className="w-full p-4 bg-white/50 backdrop-blur-sm border border-indigo-200/50 rounded-xl focus:ring-2 focus:ring-teal-300 focus:border-teal-400 transition-all duration-300 text-gray-800 placeholder-gray-500"
                            value={note}
                            onChange={handleNoteChange}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incoming Requests */}
          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-400 to-rose-400 drop-shadow-lg">
                  Incoming Requests
                </h1>
                <p className="mt-3 text-lg text-gray-600 tracking-wide font-light">
                  Review and accept new appointment requests with ease
                </p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-amber-100/50 overflow-hidden">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-8 border-b border-amber-100/50 hover:bg-gradient-to-r from-amber-50/50 to-rose-50/50 transition-all duration-500"
                >
                  <div className="flex items-start space-x-7">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-200 to-rose-300 flex items-center justify-center shadow-lg shrink-0">
                      <User className="h-8 w-8 text-amber-700" />
                    </div>
                    <div className="flex-1 space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center text-lg text-gray-800">
                          <CircleUser className="h-6 w-6 mr-4 text-amber-600" />
                          <span className="font-semibold tracking-tight">{appointment.user.username}</span>
                        </div>
                        <div className="flex items-center text-lg text-gray-800">
                          <Clock className="h-6 w-6 mr-4 text-amber-600" />
                          {format(appointment.dateTime, "dd-MMM-yyyy h:mm a")}
                        </div>
                        <div className="flex items-center text-lg text-gray-800">
                          <Phone className="h-6 w-6 mr-4 text-amber-600" />
                          {appointment.user.mobile}
                        </div>
                        <div className="flex items-start text-lg text-gray-800">
                          <FileText className="h-6 w-6 mr-4 mt-1 text-amber-600" />
                          <span>{appointment.reason}</span>
                        </div>
                      </div>
                      <div className="flex space-x-5">
                        <button
                          onClick={() => acceptApp(appointment)}
                          className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-base font-semibold rounded-full shadow-lg hover:from-emerald-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-300"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReschedule(appointment)}
                          className="px-6 py-2.5 bg-gradient-to-r from-gray-200/80 to-gray-300/80 text-gray-800 text-base font-semibold rounded-full shadow-lg hover:from-gray-300/80 hover:to-gray-400/80 transform hover:scale-105 transition-all duration-300"
                        >
                          Reschedule
                        </button>
                      </div>
                      {selectedAppointment === appointment.id && (
                        <div className="mt-6 bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-inner border border-amber-200/50">
                          <h2 className="text-xl font-semibold text-gray-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-rose-500">
                            Select Date and Time
                          </h2>
                          <DateTimePicker
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Past Appointments Segregation Graph */}
        <div className="mt-20 bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-10 border border-purple-100/50">
          <h2 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-500 to-teal-400 drop-shadow-lg mb-8">
            Past Appointments
          </h2>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={histogramData}>
                <CartesianGrid strokeDasharray="5 5" stroke="#e5e7eb/50" />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  fontSize={16}
                  tickLine={false}
                  axisLine={{ stroke: "#d1d5db/50" }}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={16}
                  tickLine={false}
                  axisLine={{ stroke: "#d1d5db/50" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "12px",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                    border: "1px solid rgba(229, 231, 235, 0.5)",
                    backdropFilter: "blur(8px)",
                  }}
                  labelStyle={{ color: "#1f2937", fontWeight: "600" }}
                />
                <Legend wrapperStyle={{ paddingTop: "30px", fontSize: "16px", color: "#4b5563" }} />
                <Bar
                  dataKey="UG"
                  fill="url(#gradUG)"
                  name="UG Appointments"
                  radius={[8, 8, 0, 0]}
                  barSize={50}
                />
                <Bar
                  dataKey="PG"
                  fill="url(#gradPG)"
                  name="PG Appointments"
                  radius={[8, 8, 0, 0]}
                  barSize={50}
                />
                <Bar
                  dataKey="PhD"
                  fill="url(#gradPhD)"
                  name="PhD Appointments"
                  radius={[8, 8, 0, 0]}
                  barSize={50}
                />
                <defs>
                  <linearGradient id="gradUG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#155DFC" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="gradPG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFB703" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#FCD34D" stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="gradPhD" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FB8500" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#FDBA74" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <Footer color={"blue"} />
    </div>
  );
};

export default DoctorAppointment;
