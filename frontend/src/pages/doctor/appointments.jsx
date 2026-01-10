import React, { useEffect, useState } from "react";
import { User, CircleUser, Clock, Phone, FileText, Loader } from "lucide-react";
import DoctorNavbar from "../../components/doctor/Navbar";
import emailjs from "@emailjs/browser";
import Footer from "../../components/common/Footer";
import { format } from "date-fns";
import { checkAuth } from "../../utils/profile";
import { useNavigate } from "react-router-dom";
import SessionExpired from "../../components/common/SessionExpired";
import { TimeChange, TimeReduce } from "../../components/common/TimeChange";
import CustomToast from "../../components/common/CustomToast";
import { TfiEmail } from "react-icons/tfi";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CustomLoader from "../../components/common/CustomLoader";

const DoctorAppointment = () => {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];
  const [fixed, setFixed] = useState(false);
  const [completedNotes, setCompletedNotes] = useState({});
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [appointments, setapp] = useState([]);
  const [curr, setcurr] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isBar, setIsBar] = useState(false);
  const [isRescheduling, setisRescheduling] = useState(false);
  const [isFetched, setisFetched] = useState(null);
  const [timePeriodData, setTimePeriodData] = useState({
    "Last 1 Month": { UG: 0, PG: 0, PHD: 0 },
    "Last 3 Months": { UG: 0, PG: 0, PHD: 0 },
    "Last 6 Months": { UG: 0, PG: 0, PHD: 0 },
    "Last 12 Months": { UG: 0, PG: 0, PHD: 0 },
  });
  const [note, setNote] = useState("");
  // Added Category State
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  const [slots, setAvailableSlots] = useState([]);
  const [time, setSelectedTime] = useState("");
  const token = localStorage.getItem("token");

  // Define Appointment Categories
  const APPOINTMENT_CATEGORIES = [
    "General Consultation",
    "Mental Health",
    "Routine Checkup",
    "Prescription Refill",
    "Lab Results",
    "Follow-up",
    "Emergency",
    "Other"
  ];

  const fetchAvailableSlots = async (date) => {
    try {
      const doctorId = localStorage.getItem("userid");
      const response = await fetch(
        `http://localhost:3000/api/common/available-slots?date=${date}&docId=${doctorId}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      const data = await response.json();
      setAvailableSlots(data.availableSlots);
    } catch (error) {
      console.error("Error fetching available slots:", error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime("");
    setAvailableSlots([]);
    fetchAvailableSlots(date);
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleGraphTypeChange = (e) => {
    setIsBar(e.target.value === "bar");
  };

  const getPieData = (period) => [
    { name: "UG", value: timePeriodData[period].UG || 0 },
    { name: "PG", value: timePeriodData[period].PG || 0 },
    { name: "PHD", value: timePeriodData[period].PHD || 0 },
  ];

  const PastAppointmentGraphs = ({
    timePeriodData,
    getPieData,
    COLORS,
    handleGraphTypeChange,
    isBar,
  }) => {
    const timePeriods = [
      "Last 1 Month",
      "Last 3 Months",
      "Last 6 Months",
      "Last 12 Months",
    ];

    return (
      <div className="mt-12 bg-[var(--custom-white)]/80 backdrop-blur-lg rounded-3xl shadow-xl border border-[var(--custom-blue-100)] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--custom-blue-600)] mb-2">
              Past Appointments Analytics
            </h2>
            <p className="text-[var(--custom-gray-600)]">
              View distribution of students by academic program
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              onChange={handleGraphTypeChange}
              className="px-4 py-2 rounded-lg border-2 border-[var(--custom-blue-200)] focus:border-[var(--custom-blue-400)] focus:ring-2 focus:ring-[var(--custom-blue-200)] transition-all duration-200 outline-none bg-[var(--custom-white)]"
            >
              <option value="pie">Pie Chart</option>
              <option value="bar">Bar Chart</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {timePeriods.map((period) => (
            <div
              key={period}
              className="bg-[var(--custom-white)]/50 backdrop-blur-sm rounded-xl p-4 border border-[var(--custom-blue-100)] shadow-md"
            >
              <h3 className="text-xl font-semibold text-[var(--custom-blue-600)] mb-4 text-center">
                {period}
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  {isBar ? (
                    <BarChart
                      data={[
                        {
                          name: period,
                          UG: timePeriodData[period].UG || 0,
                          PG: timePeriodData[period].PG || 0,
                          PHD: timePeriodData[period].PHD || 0,
                        },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="UG" fill="#0088FE" />
                      <Bar dataKey="PG" fill="#00C49F" />
                      <Bar dataKey="PHD" fill="#FFBB28" />
                    </BarChart>
                  ) : (
                    <PieChart>
                      <Pie
                        data={getPieData(period)}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
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
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const sendNotif = async (appointment) => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/common/send-notification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            userid: appointment["user_id"],
            message: `Your appointment request has been accepted!`,
            userType: "user",
          }),
        }
      );

      if (!res.ok) {
        console.error("Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
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
      const res = await fetch(
        `http://localhost:3000/api/doc/reqApp?docId=${docId}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      const res2 = await fetch(
        `http://localhost:3000/api/doc/currentdocappt?doctorId=${docId}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
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
      setisFetched(true);
    };

    fetchData();
  }, [fixed]);

  useEffect(() => {
    const docId = localStorage.getItem("userid");
    if (!docId) return;

    const fetchPastAppointments = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/doc/pastdocappt?doctorId=${docId}`,
          {
            headers: { Authorization: "Bearer " + token },
          }
        );
        const data = await response.json();
        if (response.ok) {
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
        CustomToast("Error while fetching past appointments", "blue");
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

  // Added handler for category change
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const acceptApp = async (appointment) => {
    appointment.dateTime = new Date(appointment.dateTime);
    const res = await fetch("http://localhost:3000/api/doc/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
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
    const office_address = localStorage.getItem("office_address");

    sendNotif(appointment);
    setFixed(!fixed);
  };

  const deleteApp = async (appointment) => {
    // If you want to enforce a category selection, check here
    // if (!category) { CustomToast("Please select a category", "red"); return; }
    
    const res = await fetch("http://localhost:3000/api/doc/deleteApp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        appId: appointment["id"],
        doctorId: appointment["doctor_id"],
        userId: appointment["user_id"],
        note: note,
        category: category, // Added category to body
      }),
    });
    const resp = await res.json();
    setNote(""); // Reset note
    setCategory(""); // Reset category
    setFixed(!fixed);
  };

  const emailParams = async (appointment, time) => {
    const newTime = TimeChange(new Date(time).getTime());
    const docName = localStorage.getItem("username");
    try {
      console.log("hello");
      const res = await fetch("http://localhost:3000/api/doc/reschedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          id: appointment["id"],
          docId: localStorage.getItem("userid"),
          username: appointment["user"]["username"],
          docName: docName,
          origTime: format(
            new Date(
              new Date(appointment["dateTime"]).setTime(
                appointment["dateTime"].getTime() + 5.5 * 60 * 60 * 1000
              )
            ),
            "dd-MMM-yy hh:mm a"
          ),
          newTime: format(
            new Date(
              new Date(newTime).setTime(
                newTime.getTime() + 5.5 * 60 * 60 * 1000
              )
            ),
            "dd-MMM-yy hh:mm a"
          ),
          email: appointment["user"]["email"],
        }),
      });
      const resp = await res.json();
      console.log(resp, "response");
      setFixed(!fixed);
      CustomToast("Rescheduling request successfully sent", "blue");
      setSelectedDate("");
      setSelectedTime("");
    } catch (error) {
      console.error(error);
      CustomToast("Error rescheduling appointment", "blue");
      setSelectedDate("");
      setSelectedTime("");
    }
  };

  const handleClosePopup = () => {
    navigate("/doctor/login");
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (date) {
      CustomToast("Booking Rescheduled", "blue");
      setSelectedAppointment(null);
    }
  };

  const handleReschedule = async (appointment) => {
    const appointmentId = appointment.id;
    if (selectedDate != "" && time != "") {
      setisRescheduling(true);
      await emailParams(
        appointment,
        new Date(new Date(selectedDate).getTime() + new Date(time).getTime())
      );
      handleDateSelect(selectedDate, appointmentId);
    }
    setSelectedAppointment(
      appointmentId === selectedAppointment ? null : appointmentId
    );
    setisRescheduling(false);
  };

  if (isAuthenticated === null || isFetched === null) {
    return <CustomLoader color="blue" text="Loading your dashboard..." />;
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="blue" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--custom-white)] via-[var(--custom-purple-50)] to-[var(--custom-teal-50)]">
      <DoctorNavbar />
      <div className="container mx-auto px-4 sm:px-8 lg:px-4 xl:px-16 py-5 md:py-10 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          <div className="space-y-8">
            <div className="flex items-center justify-between w-full">
              <div className="w-full">
                <h1 className="text-center sm:text-left text-3xl sm:text-4xl font-extrabold text-[var(--custom-blue-600)]">
                  Current Appointments
                </h1>
                <p className="mt-2 text-center sm:text-left text-md sm:text-lg text-[var(--custom-gray-600)] tracking-wide font-light">
                  Seamlessly manage your upcoming appointments
                </p>
              </div>
            </div>

            {curr.length > 0 ? (
              <div className="bg-[var(--custom-white)]/80 backdrop-blur-lg rounded-3xl shadow-xl border border-[var(--custom-blue-100)] overflow-y-scroll overflow-x-hidden max-h-150">
                {curr.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 sm:p-8 border-b border-[var(--custom-blue-100)] hover:bg-[var(--custom-blue-50)]/50 transition-all duration-500"
                  >
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-x-7">
                      <div className="h-16 w-16 rounded-full bg-[var(--custom-blue-100)] flex items-center justify-center shadow-lg shrink-0">
                        <User className="h-8 w-8 text-[var(--custom-blue-600)]" />
                      </div>
                      <div className="flex-1 mt-4 sm:mt-0 scale-90 sm:scale-100 space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center text-lg text-[var(--custom-gray-800)]">
                            <CircleUser className="h-6 w-6 mr-4 text-[var(--custom-blue-600)]" />
                            <span className="font-semibold tracking-tight">
                              {appointment.user.username}
                            </span>
                          </div>
                          <div className="flex items-center text-lg text-[var(--custom-gray-800)]">
                            <Clock className="h-6 w-6 mr-4 text-[var(--custom-blue-600)]" />
                            {format(
                              TimeReduce(
                                new Date(appointment.dateTime).getTime()
                              ),
                              "dd MMM h:mm a"
                            )}
                          </div>
                          <div className="flex items-center text-lg text-[var(--custom-gray-800)]">
                            <Mail className="h-6 w-6 mr-4 text-[var(--custom-blue-600)]" />
                            {appointment.user.email}
                          </div>
                          <div className="flex items-center text-lg text-[var(--custom-gray-800)]">
                            <Phone className="h-6 w-6 mr-4 text-[var(--custom-blue-600)]" />
                            {appointment.user.mobile}
                          </div>
                          {appointment.user.alt_mobile ? (
                            <div className="flex items-center text-lg text-[var(--custom-gray-800)]">
                              <Phone className="h-6 w-6 mr-4 text-[var(--custom-blue-600)]" />
                              {appointment.user.alt_mobile}
                            </div>
                          ) : null}
                          <div className="flex items-start text-lg text-[var(--custom-gray-800)]">
                            <FileText className="h-6 w-6 mr-4 mt-1 text-[var(--custom-blue-600)]" />
                            <span>{appointment.reason}</span>
                          </div>
                        </div>
                        <div className="flex flex-col xl:flex-row xl:space-x-5 space-y-3 xl:space-y-0">
                          {completedNotes[appointment.id] !== undefined ? (
                            <button
                              onClick={() => deleteApp(appointment)}
                              className="px-6 py-2.5 bg-[var(--custom-red-500)] text-[var(--custom-white)] font-semibold rounded-full shadow-lg hover:bg-[var(--custom-red-600)] transform hover:scale-105 transition-all duration-300"
                            >
                              Done
                            </button>
                          ) : (
                            <button
                              onClick={() => handleMarkAsDone(appointment.id)}
                              className="px-6 py-2.5 bg-[var(--custom-blue-500)] text-[var(--custom-white)] font-semibold rounded-full shadow-lg hover:bg-[var(--custom-blue-600)] transform hover:scale-105 transition-all duration-300"
                            >
                              Mark as Done
                            </button>
                          )}
                          {selectedAppointment !== appointment.id && (
                            <button
                              onClick={() => handleReschedule(appointment)}
                              className="px-6 py-2.5 bg-[var(--custom-gray-200)] text-[var(--custom-gray-800)] font-semibold rounded-full shadow-lg hover:bg-[var(--custom-gray-300)] transform hover:scale-105 transition-all duration-300"
                            >
                              Reschedule
                            </button>
                          )}
                          <button
                            onClick={() =>
                              navigate(
                                `/doctor/history?username=${appointment.user.username}`
                              )
                            }
                            className="px-6 py-2.5 bg-[var(--custom-gray-200)] text-[var(--custom-gray-800)] font-semibold rounded-full shadow-lg hover:bg-[var(--custom-gray-300)] transform hover:scale-105 transition-all duration-300"
                          >
                            Check History
                          </button>
                        </div>
                        {selectedAppointment === appointment.id && (
                          <div className="mt-6 bg-[var(--custom-white)]/50 backdrop-blur-sm rounded-xl p-6 shadow-inner border border-[var(--custom-blue-200)]">
                            <h2 className="text-xl font-semibold mb-4 text-[var(--custom-blue-600)]">
                              Select Date and Time
                            </h2>
                            <div>
                              <select
                                name="date"
                                value={selectedDate.split("T")[0]}
                                onChange={(e) => {
                                  const newDate = e.target.value;
                                  const currentTime =
                                    selectedDate.split("T")[2] || "09:00";
                                  handleDateChange(newDate);
                                  fetchAvailableSlots(newDate);
                                }}
                                className="w-full px-4 py-3 rounded-lg border-2 border-[var(--custom-blue-200)] focus:border-[var(--custom-blue-400)] focus:ring-2 focus:ring-[var(--custom-blue-200)] transition-all duration-200 outline-none bg-[var(--custom-white)]"
                                required
                              >
                                <option value="">Select Date</option>
                                {[...Array(14)].map((_, index) => {
                                  const date = new Date();
                                  date.setDate(date.getDate() + index);
                                  const formattedDate = format(
                                    date,
                                    "yyyy-MM-dd"
                                  );
                                  const displayDate = format(date, "d MMM");
                                  return (
                                    <option
                                      key={formattedDate}
                                      value={formattedDate}
                                    >
                                      {displayDate}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>

                            <div className="mt-4">
                              <select
                                name="time"
                                value={time}
                                onChange={(e) => {
                                  const currentDate =
                                    selectedDate.split("T")[0];
                                  handleTimeChange(e);
                                }}
                                className="w-full px-4 py-3 rounded-lg border-2 border-[var(--custom-blue-200)] focus:border-[var(--custom-blue-400)] focus:ring-2 focus:ring-[var(--custom-blue-200)] transition-all duration-200 outline-none bg-[var(--custom-white)]"
                              >
                                <option value="">Select Time</option>
                                {Array.isArray(slots) &&
                                  slots.map((slot) => (
                                    <option
                                      key={slot.id}
                                      value={slot.starting_time}
                                    >
                                      {format(
                                        new Date(slot.starting_time).getTime(),
                                        "HH:mm"
                                      )}
                                    </option>
                                  ))}
                              </select>
                            </div>
                            <center>
                              <button
                                disabled={isRescheduling}
                                onClick={() => handleReschedule(appointment)}
                                className="px-6 mt-4 py-2.5 bg-[var(--custom-gray-200)] text-[var(--custom-gray-800)] font-semibold rounded-full shadow-lg hover:bg-[var(--custom-gray-300)] transform hover:scale-105 transition-all duration-300"
                              >
                                {isRescheduling ? (
                                  <Loader className="mx-auto" />
                                ) : (
                                  <div>Reschedule</div>
                                )}
                              </button>
                            </center>
                          </div>
                        )}
                        {completedNotes[appointment.id] !== undefined && (
                          <div className="mt-6 space-y-4">
                             {/* Category Dropdown */}
                            <div className="relative">
                              <select
                                value={category}
                                onChange={handleCategoryChange}
                                className="w-full p-4 bg-[var(--custom-white)]/50 backdrop-blur-sm border border-[var(--custom-blue-200)] rounded-xl focus:ring-2 focus:ring-[var(--custom-blue-300)] focus:border-[var(--custom-blue-400)] transition-all duration-300 text-[var(--custom-gray-800)] outline-none appearance-none"
                              >
                                <option value="" disabled>Select Category</option>
                                {APPOINTMENT_CATEGORIES.map((cat) => (
                                  <option key={cat} value={cat}>
                                    {cat}
                                  </option>
                                ))}
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--custom-blue-600)]">
                                <ChevronDown className="h-5 w-5" />
                              </div>
                            </div>
                            {/* Notes Input */}
                            <input
                              type="text"
                              placeholder="Enter completion notes..."
                              className="w-full p-4 bg-[var(--custom-white)]/50 backdrop-blur-sm border border-[var(--custom-blue-200)] rounded-xl focus:ring-2 focus:ring-[var(--custom-blue-300)] focus:border-[var(--custom-blue-400)] transition-all duration-300 text-[var(--custom-gray-800)] placeholder-[var(--custom-gray-500)]"
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
            ) : (
              <div className="flex flex-col bg-[var(--custom-white)]/80 backdrop-blur-lg rounded-3xl shadow-md border border-[var(--custom-blue-100)] items-center justify-center py-8 px-4">
                <div className="h-24 w-24 rounded-full bg-[var(--custom-blue-50)] flex items-center justify-center mb-6">
                  <Clock className="h-12 w-12 text-[var(--custom-blue-400)]" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--custom-gray-800)] mb-2">
                  No Current Appointments
                </h3>
                <p className="text-[var(--custom-gray-600)] text-center max-w-md">
                  No appointments scheduled at the moment.
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 lg:mt-0 space-y-8">
            <div className="flex items-center justify-between w-full">
              <div className="w-full">
                <h1 className="text-center sm:text-left text-3xl sm:text-4xl font-extrabold text-[var(--custom-blue-600)]">
                  Incoming Requests
                </h1>
                <p className="mt-2 text-center sm:text-left text-md sm:text-lg text-[var(--custom-gray-600)] tracking-wide font-light">
                  Review and accept new appointment requests with ease
                </p>
              </div>
            </div>

            {appointments.length > 0 ? (
              <div className="bg-[var(--custom-white)]/80 backdrop-blur-lg rounded-3xl shadow-xl border border-[var(--custom-blue-100)] overflow-y-scroll overflow-x-hidden max-h-150">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 sm:p-8 border-b border-[var(--custom-blue-100)] hover:bg-custom-blue-50/50 transition-all duration-500"
                  >
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-x-7">
                      <div className="h-16 w-16 rounded-full bg-[var(--custom-blue-100)] flex items-center justify-center shadow-lg shrink-0">
                        <User className="h-8 w-8 text-[var(--custom-blue-600)]" />
                      </div>
                      <div className="flex-1 mt-4 sm:mt-0 scale-90 sm:scale-100 space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center text-lg text-[var(--custom-gray-800)]">
                            <CircleUser className="h-6 w-6 mr-4 text-[var(--custom-blue-600)]" />
                            <span className="font-semibold tracking-tight">
                              {appointment.user.username}
                            </span>
                          </div>
                          <div className="flex items-center text-lg text-[var(--custom-gray-800)]">
                            <Clock className="h-6 w-6 mr-4 text-[var(--custom-blue-600)]" />
                            {format(
                              TimeReduce(
                                new Date(appointment.dateTime).getTime()
                              ),
                              "dd MMM h:mm a"
                            )}
                          </div>
                          <div className="flex items-center text-lg text-[var(--custom-gray-800)]">
                            <Mail className="h-6 w-6 mr-4 text-[var(--custom-blue-600)]" />
                            {appointment.user.email}
                          </div>
                          <div className="flex items-center text-lg text-[var(--custom-gray-800)]">
                            <Phone className="h-6 w-6 mr-4 text-[var(--custom-blue-600)]" />
                            {appointment.user.mobile}
                          </div>
                          {appointment.user.alt_mobile ? (
                            <div className="flex items-center text-lg text-[var(--custom-gray-800)]">
                              <Phone className="h-6 w-6 mr-4 text-[var(--custom-blue-600)]" />
                              {appointment.user.alt_mobile}
                            </div>
                          ) : null}
                          <div className="flex items-start text-lg text-[var(--custom-gray-800)]">
                            <FileText className="h-6 w-6 mr-4 mt-1 text-[var(--custom-blue-600)]" />
                            <span>{appointment.reason}</span>
                          </div>
                        </div>
                        <div className="flex flex-col xl:flex-row xl:space-x-5 space-y-3 xl:space-y-0">
                          <button
                            onClick={() => acceptApp(appointment)}
                            className="px-6 py-2.5 bg-[var(--custom-blue-500)] text-[var(--custom-white)] font-semibold rounded-full shadow-lg hover:bg-[var(--custom-blue-600)] transform hover:scale-105 transition-all duration-300"
                          >
                            Accept
                          </button>
                          {selectedAppointment !== appointment.id && (
                            <button
                              onClick={() => handleReschedule(appointment)}
                              className="px-6 py-2.5 bg-[var(--custom-gray-200)] text-[var(--custom-gray-800)] font-semibold rounded-full shadow-lg hover:bg-[var(--custom-gray-300)] transform hover:scale-105 transition-all duration-300"
                            >
                              Reschedule
                            </button>
                          )}
                          <button
                            onClick={() =>
                              navigate(
                                `/doctor/history?username=${appointment.user.username}`
                              )
                            }
                            className="px-6 py-2.5 bg-[var(--custom-gray-200)] text-[var(--custom-gray-800)] font-semibold rounded-full shadow-lg hover:bg-[var(--custom-gray-300)] transform hover:scale-105 transition-all duration-300"
                          >
                            Check History
                          </button>
                        </div>
                        {selectedAppointment === appointment.id && (
                          <div className="mt-6 bg-[var(--custom-white)]/50 backdrop-blur-sm rounded-xl p-6 shadow-inner border border-[var(--custom-blue-200)]">
                            <h2 className="text-xl font-semibold mb-4 text-[var(--custom-blue-600)]">
                              Select Date and Time
                            </h2>
                            <div>
                              <select
                                name="date"
                                value={selectedDate.split("T")[0]}
                                onChange={(e) => {
                                  const newDate = e.target.value;
                                  const currentTime =
                                    selectedDate.split("T")[2] || "09:00";
                                  handleDateChange(newDate);
                                  fetchAvailableSlots(newDate);
                                }}
                                className="w-full px-4 py-3 rounded-lg border-2 border-[var(--custom-blue-200)] focus:border-[var(--custom-blue-400)] focus:ring-2 focus:ring-[var(--custom-blue-200)] transition-all duration-200 outline-none bg-[var(--custom-white)]"
                                required
                              >
                                <option value="">Select Date</option>
                                {[...Array(14)].map((_, index) => {
                                  const date = new Date();
                                  date.setDate(date.getDate() + index);
                                  const formattedDate = format(
                                    date,
                                    "yyyy-MM-dd"
                                  );
                                  const displayDate = format(date, "d MMM");
                                  return (
                                    <option
                                      key={formattedDate}
                                      value={formattedDate}
                                    >
                                      {displayDate}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>

                            <div className="mt-4">
                              <select
                                name="time"
                                value={time}
                                onChange={(e) => {
                                  const currentDate =
                                    selectedDate.split("T")[0];
                                  handleTimeChange(e);
                                }}
                                className="w-full px-4 py-3 rounded-lg border-2 border-[var(--custom-blue-200)] focus:border-[var(--custom-blue-400)] focus:ring-2 focus:ring-[var(--custom-blue-200)] transition-all duration-200 outline-none bg-[var(--custom-white)]"
                              >
                                <option value="">Select Time</option>
                                {Array.isArray(slots) &&
                                  slots.map((slot) => (
                                    <option
                                      key={slot.id}
                                      value={slot.starting_time}
                                    >
                                      {format(
                                        new Date(slot.starting_time).getTime(),
                                        "HH:mm"
                                      )}
                                    </option>
                                  ))}
                              </select>
                            </div>
                            <center>
                              <button
                                disabled={isRescheduling}
                                onClick={() => handleReschedule(appointment)}
                                className="px-6 mt-4 py-2.5 bg-[var(--custom-gray-200)] text-[var(--custom-gray-800)] font-semibold rounded-full shadow-lg hover:bg-[var(--custom-gray-300)] transform hover:scale-105 transition-all duration-300"
                              >
                                {isRescheduling ? (
                                  <Loader className="mx-auto" />
                                ) : (
                                  <div>Reschedule</div>
                                )}
                              </button>
                            </center>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col bg-[var(--custom-white)]/80 backdrop-blur-lg rounded-3xl shadow-md border border-[var(--custom-blue-100)] items-center justify-center py-8 px-4">
                <div className="h-24 w-24 rounded-full bg-[var(--custom-blue-50)] flex items-center justify-center mb-6">
                  <Clock className="h-12 w-12 text-[var(--custom-blue-400)]" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--custom-gray-800)] mb-2">
                  No Incoming Requests
                </h3>
                <p className="text-[var(--custom-gray-600)] text-center max-w-md">
                  You don't have any requests at the moment.
                </p>
              </div>
            )}
          </div>
        </div>

        <PastAppointmentGraphs
          timePeriodData={timePeriodData}
          getPieData={getPieData}
          COLORS={COLORS}
          handleGraphTypeChange={handleGraphTypeChange}
          isBar={isBar}
        />
      </div>
      <Footer color={"blue"} />
    </div>
  );
};

export default DoctorAppointment;