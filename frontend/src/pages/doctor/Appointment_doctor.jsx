import React, { useEffect, useState } from "react";
import { User, CircleUser, Clock, Phone, FileText } from "lucide-react";
import DoctorNavbar from "../../components/doctor/Navbar_doctor";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TimeChange } from "../../components/Time_Change";
import CustomToast from "../../components/CustomToast";

const DoctorAppointment = () => {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];
  const [fixed, setFixed] = useState(false);
  const [completedNotes, setCompletedNotes] = useState({});
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setapp] = useState([]);
  const [curr, setcurr] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isBar, setIsBar] = useState(true);
  // Updated keys to use "PhD" for consistency
  const [timePeriodData, setTimePeriodData] = useState({
    "Last 1 Month": { UG: 0, PG: 0, PHD: 0 },
    "Last 3 Months": { UG: 0, PG: 0, PHD: 0 },
    "Last 6 Months": { UG: 0, PG: 0, PHD: 0 },
    "Last 12 Months": { UG: 0, PG: 0, PHD: 0 },
  });
  const [note, setNote] = useState("");
  const navigate = useNavigate();

  const histogramData = Object.keys(timePeriodData).map((period) => ({
    name: period,
    UG: timePeriodData[period].UG || 0,
    PG: timePeriodData[period].PG || 0,
    PHD: timePeriodData[period].PHD || 0,
  }));

  const sendNotif = async (appointment) => {
    try {
      const res = await fetch("https://built-it.onrender.com/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userid: appointment["user_id"],
          message: `Your appointment request has been accepted!`,
          userType: "user",
        }),
      });

      if (!res.ok) {
        console.error("Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const getPieData = (period) => [
    { name: "UG", value: timePeriodData[period].UG || 0 },
    { name: "PG", value: timePeriodData[period].PG || 0 },
    { name: "PHD", value: timePeriodData[period].PHD || 0 },
  ];

  const handleGraphTypeChange = (e) => {
    setIsBar(e.target.value === "bar");
  };

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
    const fetchData = async () => {
      const docId = localStorage.getItem("userid");
      const res = await fetch(`https://built-it.onrender.com/reqApp?docId=${docId}`);
      const res2 = await fetch(
        `https://built-it.onrender.com/currentdocappt?doctorId=${docId}`
      );
      const resp2 = await res2.json();
      const resp = await res.json();
      for (let i = 0; i < resp2.length; i++) {
        resp2[i].dateTime = TimeChange(new Date(resp2[i].dateTime).getTime());
      }
      for (let i = 0; i < resp.length; i++) {
        resp[i].dateTime = TimeChange(new Date(resp[i].dateTime).getTime());
      }
      setapp(resp);
      setcurr(resp2);
    };

    fetchData();
  }, [fixed]);

  useEffect(() => {
    const docId = localStorage.getItem("userid");
    if (!docId) return;

    const fetchPastAppointments = async () => {
      try {
        const response = await fetch(
          `https://built-it.onrender.com/pastdocappt?doctorId=${docId}`
        );
        const data = await response.json();
        if (response.ok) {
          // Use "PhD" as the key here
          const periods = {
            "Last 1 Month": { UG: 0, PG: 0, PHD: 0 },
            "Last 3 Months": { UG: 0, PG: 0, PHD: 0 },
            "Last 6 Months": { UG: 0, PG: 0, PHD: 0 },
            "Last 12 Months": { UG: 0, PG: 0, PHD: 0 },
          };

          const now = new Date();

          data.forEach((app) => {
            const apptDate = new Date(app.createdAt);
            const diffTime = now - apptDate;
            const diffDays = diffTime / (1000 * 3600 * 24);
            const branch = app.user.acadProg;
            console.log(app);

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

  const handleMarkAsDone = (id) => {
    setCompletedNotes((prev) => ({
      ...prev,
      [id]: prev[id] ? "" : "",
    }));
  };

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const acceptApp = async (appointment) => {
    appointment.dateTime = new Date(appointment.dateTime);
    const res = await fetch("https://built-it.onrender.com/book", {
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
        (response) => {
          console.log("success", response.status);
        },
        (error) => {
          console.log(error);
        }
      );

    sendNotif(appointment);
    setFixed(!fixed);
  };

  const deleteApp = async (appointment) => {
    const res = await fetch("https://built-it.onrender.com/deleteApp", {
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
    const res = await fetch("https://built-it.onrender.com/reschedule", {
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
        (response) => {
          console.log("success", response.status);
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
      await emailParams(appointment, selectedDate);
      handleDateSelect(selectedDate, appointmentId);
    }
  };

  if (isAuthenticated === null) {
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
      <div className="container mx-auto px-4 sm:px-8 lg:px-4 xl:px-16 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-10">
            <div className="flex items-center justify-between w-full">
              <div className="w-full">
                <h1 className="text-center sm:text-left text-3xl sm:text-4xl font-extrabold text-blue-600">
                  Current Appointments
                </h1>
                <p className="mt-3 text-center sm:text-left text-lg text-gray-600 tracking-wide font-light">
                  Seamlessly manage your upcoming appointments
                </p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-100 overflow-y-scroll overflow-x-hidden max-h-150">
              {curr.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 sm:p-8 border-b border-blue-100 hover:bg-blue-50/50 transition-all duration-500"
                >
                  <div className="flex flex-col sm:flex-row items-center sm:items-start space-x-7">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center shadow-lg shrink-0">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex-1 mt-4 sm:mt-0 scale-90 sm:scale-100 space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center text-lg text-gray-800">
                          <CircleUser className="h-6 w-6 mr-4 text-blue-600" />
                          <span className="font-semibold tracking-tight">
                            {appointment.user.username}
                          </span>
                        </div>
                        <div className="flex items-center text-lg text-gray-800">
                          <Clock className="h-6 w-6 mr-4 text-blue-600" />
                          {format(appointment.dateTime, "dd MMM h:mm a")}
                        </div>
                        <div className="flex items-center text-lg text-gray-800">
                          <Phone className="h-6 w-6 mr-4 text-blue-600" />
                          {appointment.user.mobile}
                        </div>
                        <div className="flex items-start text-lg text-gray-800">
                          <FileText className="h-6 w-6 mr-4 mt-1 text-blue-600" />
                          <span>{appointment.reason}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-5">
                        {completedNotes[appointment.id] !== undefined ? (
                          <button
                            onClick={() => deleteApp(appointment)}
                            className="px-6 py-2.5 bg-red-500 text-white font-semibold rounded-full shadow-lg hover:bg-red-600 transform hover:scale-105 transition-all duration-300"
                          >
                            Done
                          </button>
                        ) : (
                          <button
                            onClick={() => handleMarkAsDone(appointment.id)}
                            className="px-6 py-2.5 bg-blue-500 text-white font-semibold rounded-full shadow-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-300"
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
                            className="w-full p-4 bg-white/50 backdrop-blur-sm border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300 text-gray-800 placeholder-gray-500"
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

          <div className="mt-5 lg:mt-0 space-y-10">
            <div className="flex items-center justify-between w-full">
              <div className="w-full">
                <h1 className="text-center sm:text-left text-3xl sm:text-4xl font-extrabold text-blue-600">
                  Incoming Requests
                </h1>
                <p className="mt-3 text-center sm:text-left text-lg text-gray-600 tracking-wide font-light">
                  Review and accept new appointment requests with ease
                </p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-100 overflow-y-scroll overflow-x-hidden max-h-150">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 sm:p-8 border-b border-blue-100 hover:bg-blue-50/50 transition-all duration-500"
                >
                  <div className="flex flex-col sm:flex-row items-center sm:items-start space-x-7">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center shadow-lg shrink-0">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex-1 mt-4 sm:mt-0 scale-90 sm:scale-100 space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center text-lg text-gray-800">
                          <CircleUser className="h-6 w-6 mr-4 text-blue-600" />
                          <span className="font-semibold tracking-tight">
                            {appointment.user.username}
                          </span>
                        </div>
                        <div className="flex items-center text-lg text-gray-800">
                          <Clock className="h-6 w-6 mr-4 text-blue-600" />
                          {format(appointment.dateTime, "dd MMM h:mm a")}
                        </div>
                        <div className="flex items-center text-lg text-gray-800">
                          <Phone className="h-6 w-6 mr-4 text-blue-600" />
                          {appointment.user.mobile}
                        </div>
                        <div className="flex items-start text-lg text-gray-800">
                          <FileText className="h-6 w-6 mr-4 mt-1 text-blue-600" />
                          <span>{appointment.reason}</span>
                        </div>
                      </div>
                      <div className="flex space-x-5">
                        <button
                          onClick={() => acceptApp(appointment)}
                          className="px-6 py-2.5 bg-blue-500 text-white font-semibold rounded-full shadow-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-300"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReschedule(appointment)}
                          className="px-6 py-2.5 bg-gray-200 text-gray-800 font-semibold rounded-full shadow-lg hover:bg-gray-300 transform hover:scale-105 transition-all duration-300"
                        >
                          Reschedule
                        </button>
                      </div>
                      {selectedAppointment === appointment.id && (
                        <div className="mt-6 bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-inner border border-blue-200">
                          <h2 className="text-xl font-semibold mb-4 text-blue-600">
                            Select Date and Time
                          </h2>
                          {/* DateTimePicker component would go here */}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-10 border border-blue-100 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
              <h2 className="text-3xl font-semibold text-blue-600">
                Past Appointments Analysis
              </h2>
              <select
                onChange={handleGraphTypeChange}
                value={isBar ? "bar" : "pie"}
                className="px-4 mt-4 md:mt-0 py-2 border border-blue-200 rounded-lg bg-white/50 backdrop-blur-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="bar">Bar Graph</option>
                <option value="pie">Pie Charts</option>
              </select>
            </div>

            {isBar ? (
              <div className="h-96 w-full">
                <ResponsiveContainer>
                  <BarChart data={histogramData}>
                    <CartesianGrid strokeDasharray="5 5" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={14} />
                    <YAxis stroke="#6b7280" fontSize={14} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "8px",
                        border: "1px solid rgba(229, 231, 235, 0.5)",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="UG" fill={COLORS[0]} radius={[8, 8, 0, 0]} />
                    <Bar dataKey="PG" fill={COLORS[1]} radius={[8, 8, 0, 0]} />
                    <Bar dataKey="PHD" fill={COLORS[2]} radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {Object.keys(timePeriodData).map((period) => (
                  <div key={period} className="h-86 w-[340px]">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                      {period}
                    </h3>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={getPieData(period)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {getPieData(period).map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer color={"blue"} />
    </div>
  );
};

export default DoctorAppointment;
