import React, { useEffect } from "react";
import { User, CircleUser, Clock, Phone, FileText } from "lucide-react";
import DoctorNavbar from "../../components/doctor/Navbar_doctor";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { DateTimePicker } from "../../components/doctor/DateTimePicker";
import Footer from "../../components/Footer";

import PacmanLoader from "react-spinners/PacmanLoader";
import { checkAuth } from "../../utils/profile";
import { useNavigate } from "react-router-dom";
import SessionExpired from "../../components/SessionExpired";

const DoctorAppointment = () => {
  const [fixed, setFixed] = useState(false);
  const [completedNotes, setCompletedNotes] = useState({});
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setapp] = useState([]);
  const [curr, setcurr] = useState([]);
  const [comp, setcomp] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
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

  const handleDone = (e) => {
    e.preventDefault();
  };

  const [note, setNote] = useState("");

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  useEffect(() => {
    const docId = localStorage.getItem("userid");
    console.log(docId);
    if (!docId) return;
    const fetchData = async () => {
      const docId = localStorage.getItem("userid");
      const res = await fetch(
        `https://built-it-xjiq.onrender.com/reqApp?docId=${docId}`
      );
      const res2 = await fetch(
        `https://built-it-xjiq.onrender.com/currentdocappt?doctorId=${docId}`
      );
      const resp2 = await res.json();
      const resp = await res2.json();
      console.log(resp);
      setapp(resp2);
      setcurr(resp);
    };

    fetchData();
  }, [fixed]);

  useEffect(() => {
    console.log(appointments);
  }, [appointments]);

  const acceptApp = async (appointment) => {
    console.log(appointment);
    const res = await fetch("https://built-it-xjiq.onrender.com/book", {
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
    console.log(resp);
    const docName = localStorage.getItem("username");

    var params = {
      doctor: docName, 
      dateTime: appointment.dateTime,
      email: appointment.user.email
    }
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
    console.log(note);
    const res = await fetch("https://built-it-xjiq.onrender.com/deleteApp", {
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
    console.log(resp);
  };

  const emailParams = async (appointment, time) => {
    const docName = localStorage.getItem("username");
    console.log(appointment);
    var params = {
      id: appointment["id"],
      username: appointment["user"]["username"],
      doctor: docName,
      origTime: appointment["dateTime"],
      newTime: time,
      email: appointment["user"]["email"],
    };
    const res = await fetch("https://built-it-xjiq.onrender.com/reschedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appId: appointment["id"],
      }),
    });
    const resp = await res.json();
    console.log(resp);
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

  const handleReschedule = async (appointment) => {
    console.log("in reschedule");
    console.log(appointment);
    const appointmentId = appointment.id;
    setSelectedAppointment(
      appointmentId === selectedAppointment ? null : appointmentId
    );
    if (selectedDate) {
      const res = await emailParams(appointment, selectedDate);
    }
  };

  const handleDateSelect = (date, appointmentId) => {
    setSelectedDate(date);
    if (date) {
      console.log(`Rescheduling appointment ${appointmentId} to ${date}`);
      setSelectedAppointment(null);
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
    <div>
      <DoctorNavbar />
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Appointments */}
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Current Appointments
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your upcoming appointments
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 divide-y divide-gray-200">
                  {curr.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start space-x-6">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                              {appointment.patientName}
                            </h3>
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              {appointment.status}
                            </span>
                          </div>

                          <div className="mt-2 grid grid-cols-1 gap-4">
                            <div className="space-y-3">
                              <div className="flex items-center text-sm text-gray-500">
                                <CircleUser className="h-4 w-4 mr-2" />
                                {appointment.user.username}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-2" />
                                {appointment.dateTime}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Phone className="h-4 w-4 mr-2" />
                                {appointment.user.mobile}
                              </div>
                              <div className="flex items-start text-sm text-gray-500">
                                <FileText className="h-4 w-4 mr-2 mt-1" />
                                <span>{appointment.reason}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center space-x-3">
                            {completedNotes[appointment.id] !== undefined ? (
                              <button
                                onClick={() => {
                                  deleteApp(appointment);
                                }}
                                className="px-4 py-2 bg-red-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                              >
                                Done
                              </button>
                            ) : (
                              <button
                                onClick={() => handleMarkAsDone(appointment.id)}
                                className="px-4 py-2 bg-red-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                              >
                                Mark as Done
                              </button>
                            )}
                          </div>
                          {completedNotes[appointment.id] !== undefined && (
                            <div className="mt-4">
                              <input
                                type="text"
                                placeholder="Enter completion notes..."
                                className="w-full p-2 border border-gray-300 rounded-lg"
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
            </div>

            {/* Incoming Requests */}
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Incoming Requests
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Review and accept new appointment requests
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start space-x-6">
                        <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                          <User className="h-6 w-6 text-amber-600" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                              {appointment.patientName}
                            </h3>
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                              {appointment.status}
                            </span>
                          </div>

                          <div className="mt-2 grid grid-cols-1 gap-4">
                            <div className="space-y-3">
                              <div className="flex items-center text-sm text-gray-500">
                                <CircleUser className="h-4 w-4 mr-2" />
                                {appointment.user.username}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-2" />
                                {appointment.dateTime}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Phone className="h-4 w-4 mr-2" />
                                {appointment.user.mobile}
                              </div>
                              <div className="flex items-start text-sm text-gray-500">
                                <FileText className="h-4 w-4 mr-2 mt-1" />
                                <span>{appointment.reason}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex space-x-3">
                            <button
                              onClick={() => {
                                acceptApp(appointment);
                              }}
                              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleReschedule(appointment)}
                              className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                              Reschedule
                            </button>
                          </div>
                          {selectedAppointment === appointment.id && (
                            <div className="mt-4 bg-white w-fit rounded-lg border border-gray-200 p-4">
                              <h2 className="text-lg font-semibold text-gray-900 mb-4">
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
          </div>
        </div>
      </div>
      <Footer color={"blue"} />
    </div>
  );
};

export default DoctorAppointment;
