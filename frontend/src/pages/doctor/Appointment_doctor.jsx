import React, { useEffect, useState } from "react";
import { User, CircleUser, Clock, Phone, FileText, Loader } from "lucide-react";
import DoctorNavbar from "../../components/doctor/Navbar_doctor";
import emailjs from "@emailjs/browser";
import Footer from "../../components/Footer";
import { format } from "date-fns";
import PacmanLoader from "react-spinners/PacmanLoader";
import { checkAuth } from "../../utils/profile";
import { useNavigate } from "react-router-dom";
import SessionExpired from "../../components/SessionExpired";
import { TimeChange } from "../../components/Time_Change";
import CustomToast from "../../components/CustomToast";
import PastAppointmentGraphs from "../../components/doctor/PastAppointmentGraphs";

const DoctorAppointment = () => {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];
  const [fixed, setFixed] = useState(false);
  const [completedNotes, setCompletedNotes] = useState({});
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [appointments, setapp] = useState([]);
  const [curr, setcurr] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isBar, setIsBar] = useState(true);
  const [isRescheduling, setisRescheduling] = useState(false);
  const [isFetched, setisFetched] = useState(null);
  // Updated keys to use "PhD" for consistency
  const [timePeriodData, setTimePeriodData] = useState({
    "Last 1 Month": { UG: 0, PG: 0, PHD: 0 },
    "Last 3 Months": { UG: 0, PG: 0, PHD: 0 },
    "Last 6 Months": { UG: 0, PG: 0, PHD: 0 },
    "Last 12 Months": { UG: 0, PG: 0, PHD: 0 },
  });
  const [note, setNote] = useState("");
  const navigate = useNavigate();
  const [slots, setAvailableSlots] = useState([]);
  const [time, setSelectedTime] = useState("");
  const fetchAvailableSlots = async (date) => {
    try {
      const doctorId = localStorage.getItem("userid");
      const response = await fetch(
        `http://localhost:3000/available-slots?date=${date}&docId=${doctorId}`
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

  const histogramData = Object.keys(timePeriodData).map((period) => ({
    name: period,
    UG: timePeriodData[period].UG || 0,
    PG: timePeriodData[period].PG || 0,
    PHD: timePeriodData[period].PHD || 0,
  }));

  const sendNotif = async (appointment) => {
    try {
      const res = await fetch("http://localhost:3000/send-notification", {
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
      const res = await fetch(`http://localhost:3000/reqApp?docId=${docId}`);
      const res2 = await fetch(
        `http://localhost:3000/currentdocappt?doctorId=${docId}`
      );
      const resp2 = await res2.json();
      const resp = await res.json();
      // console.log(resp)
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
          `http://localhost:3000/pastdocappt?doctorId=${docId}`
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
            // console.log(app);

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
      newTime: format(time, "dd-MMM-yy hh:mm a"),
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
        (response) => {
          console.log("success", response.status);
          CustomToast("Rescheduling request successfully sent", "blue");
          setSelectedDate("");
          setSelectedTime("");
        },
        (error) => {
          console.log(error);
          CustomToast("Error rescheduling appointment", "blue");
        }
      );
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
                <p className="mt-3 text-center sm:text-left text-md sm:text-lg text-gray-600 tracking-wide font-light">
                  Seamlessly manage your upcoming appointments
                </p>
              </div>
            </div>

            {curr.length > 0 ? (
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

          <div className="mt-5 lg:mt-0 space-y-10">
            <div className="flex items-center justify-between w-full">
              <div className="w-full">
                <h1 className="text-center sm:text-left text-3xl sm:text-4xl font-extrabold text-blue-600">
                  Incoming Requests
                </h1>
                <p className="mt-3 text-center sm:text-left text-md sm:text-lg text-gray-600 tracking-wide font-light">
                  Review and accept new appointment requests with ease
                </p>
              </div>
            </div>

            {appointments.length > 0 ? (
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
                          {selectedAppointment !== appointment.id && (
                            <button
                              onClick={() => handleReschedule(appointment)}
                              className="px-6 py-2.5 bg-gray-200 text-gray-800 font-semibold rounded-full shadow-lg hover:bg-gray-300 transform hover:scale-105 transition-all duration-300"
                            >
                              Reschedule
                            </button>
                          )}
                        </div>
                        {selectedAppointment === appointment.id && (
                          <div className="mt-6 bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-inner border border-blue-200">
                            <h2 className="text-xl font-semibold mb-4 text-blue-600">
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
                                className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none bg-white"
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

                            {/* Time Selection */}
                            <div className="mt-4">
                              <select
                                name="time"
                                value={time}
                                onChange={(e) => {
                                  const currentDate =
                                    selectedDate.split("T")[0];
                                  handleTimeChange(e);
                                }}
                                className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none bg-white"
                              >
                                <option value="">Select Time</option>
                                {Array.isArray(slots) &&
                                  slots.map((slot) => (
                                    <option
                                      key={slot.id}
                                      value={slot.starting_time}
                                    >
                                      {slot.starting_time
                                        .split("T")[1]
                                        .slice(0, 5)}
                                    </option>
                                  ))}
                              </select>
                            </div>
                            <center>
                              <button
                                disabled={isRescheduling}
                                onClick={() => handleReschedule(appointment)}
                                className="px-6 mt-4 py-2.5 bg-gray-200 text-gray-800 font-semibold rounded-full shadow-lg hover:bg-gray-300 transform hover:scale-105 transition-all duration-300"
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
              <div className="flex flex-col bg-white/80 backdrop-blur-lg rounded-3xl shadow-md border border-blue-100 items-center justify-center py-8 px-4">
                <div className="h-24 w-24 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                  <Clock className="h-12 w-12 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Incoming Requests
                </h3>
                <p className="text-gray-600 text-center max-w-md">
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
          histogramData={histogramData}
        />
      </div>
      <Footer color={"blue"} />
    </div>
  );
};

export default DoctorAppointment;
