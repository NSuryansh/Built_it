import React, { useEffect, useRef, useState } from "react";
import {
  User,
  CircleUser,
  Clock,
  Phone,
  FileText,
  Loader,
  Mail,
  ChevronDown,
  X,
} from "lucide-react";
import DoctorNavbar from "../../components/doctor/Navbar";
import Footer from "../../components/common/Footer";
import { format } from "date-fns";
import { checkAuth } from "../../utils/profile";
import { useNavigate } from "react-router-dom";
import SessionExpired from "../../components/common/SessionExpired";
import { TimeChange, TimeReduce } from "../../components/common/TimeChange";
import CustomToast from "../../components/common/CustomToast";
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
import { pdfDB } from "../../db/pdfDB";

const REASONS = [
  "Man nahi kar raha ab",
  "backchodi kar raha tha haahhaha",
  "Nahi aunga jao jo karna karo",
  "None of the above",
];

// ✅ NEW: Component to display Case Status Badge
const StatusBadge = ({ status }) => {
  const styles = {
    NEW: "bg-green-100 text-green-800 border-green-200",
    OPEN: "bg-blue-100 text-blue-800 border-blue-200",
    CLOSED: "bg-gray-100 text-gray-800 border-gray-200",
  };
  const currentStatus = status || "OPEN";
  
  return (
    <span className={`ml-3 px-2 py-0.5 text-[10px] sm:text-xs font-bold uppercase rounded-md border ${styles[currentStatus]}`}>
      {currentStatus} CASE
    </span>
  );
};

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
  const [acceptingId, setAcceptingId] = useState(null);
  const [doneId, setDoneId] = useState(null);
  const [isFetched, setisFetched] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [cancellingAppointment, setCancellingAppointment] = useState(null);
  const [timePeriodData, setTimePeriodData] = useState({
    "Last 1 Month": { UG: 0, PG: 0, PHD: 0 },
    "Last 3 Months": { UG: 0, PG: 0, PHD: 0 },
    "Last 6 Months": { UG: 0, PG: 0, PHD: 0 },
    "Last 12 Months": { UG: 0, PG: 0, PHD: 0 },
  });
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  const [slots, setAvailableSlots] = useState([]);
  const [time, setSelectedTime] = useState("");
  const token = localStorage.getItem("token");
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [cancelledAppoinments, setCancelledAppoinments] = useState([])
  const urlSetRef = useRef(new Set());

  const APPOINTMENT_CATEGORIES = [
    "General Consultation",
    "Mental Health",
    "Routine Checkup",
    "Prescription Refill",
    "Lab Results",
    "Follow-up",
    "Emergency",
    "Other",
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
            message: `Your appointment request has been updated.`,
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
    return () => {
      urlSetRef.current.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch (e) { }
      });
      urlSetRef.current.clear();
    };
  }, []);

  const handleUpload = async (e) => {
    const chosen = e.target.files;
    if (!chosen || !chosen.length) return;

    const newEntries = [];

    for (const f of chosen) {
      if (f.type !== "application/pdf") continue;
      try {
        const buffer = await f.arrayBuffer();
        const id = await pdfDB.pdfs.add({
          name: f.name,
          size: f.size,
          type: f.type,
          uploadedAt: new Date().toISOString(),
          data: buffer,
        });

        const savedFile = new File([buffer], f.name, { type: f.type });
        const blobUrl = URL.createObjectURL(savedFile);
        urlSetRef.current.add(blobUrl);

        newEntries.push({
          id,
          name: f.name,
          size: f.size,
          uploadedAt: new Date().toISOString(),
          type: f.type,
          data: buffer,
          file: savedFile,
          blobUrl,
        });
      } catch (err) {
        console.error("Failed to save file:", f.name, err);
      }
    }

    if (newEntries.length) setFiles((prev) => [...newEntries, ...prev]);
    if (fileInputRef.current) fileInputRef.current.value = "";
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

      const res3 = await fetch(
        `http://localhost:3000/api/doc/fetchCancelledAppoinments?doctorId=${docId}`,
        {
          headers: { Authorization: "Bearer " + token }
        }
      )
      const resp = await res.json();
      const resp2 = await res2.json();
      const resp3 = await res3.json();
      for (let i = 0; i < resp.length; i++) {
        resp[i].dateTime = TimeChange(new Date(resp[i].dateTime).getTime());
      }
      for (let i = 0; i < resp2.length; i++) {
        resp2[i].dateTime = TimeChange(new Date(resp2[i].dateTime).getTime());
      }
      for (let i = 0; i < resp3.length; i++) {
        resp3[i].dateTime = TimeChange(new Date(resp3[i].dateTime).getTime());
      }
      setapp(resp);
      setcurr(resp2);
      setCancelledAppoinments(resp3)
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

  const handleView = (fileObj) => {
    if (fileObj?.blobUrl)
      window.open(fileObj.blobUrl, "_blank", "noopener,noreferrer");
    else alert("No preview available.");
  };

  const handleRemove = async (id) => {
    try {
      const toRemove = files.find((p) => p.id === id);
      if (toRemove?.blobUrl) {
        try {
          URL.revokeObjectURL(toRemove.blobUrl);
          urlSetRef.current.delete(toRemove.blobUrl);
        } catch (e) { }
      }
      await pdfDB.pdfs.delete(id);
      setFiles((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const acceptApp = async (appointment) => {
    setAcceptingId(appointment.id);
    appointment.dateTime = new Date(appointment.dateTime);
    const res = await fetch("http://localhost:3000/api/user_doc/book", {
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
    sendNotif(appointment);
    setFixed(!fixed);
  };

  // ✅ UPDATED: deleteApp to handle Close Case vs Mark as Done
  const deleteApp = async (appointment, isClosing = false) => {
    setDoneId(appointment.id);
    const formData = new FormData();
    for (const f of files) {
      const pdf = await pdfDB.pdfs.get(f.id);
      const blob = new Blob([pdf.data], { type: pdf.type });
      const file = new File([blob], pdf.name, { type: pdf.type });
      formData.append("files", file);
      formData.append("pdfIds[]", f.id);
    }
    formData.append("appId", appointment.id);
    formData.append("doctorId", appointment.doctor_id);
    formData.append("userId", appointment.user_id);
    formData.append("note", note);
    formData.append("category", category);
    
    // ✅ PASS THE STATUS ACTION
    formData.append("statusAction", isClosing ? "CLOSED" : "DONE");

    const res = await fetch("http://localhost:3000/api/doc/deleteApp", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    });

    const resp = await res.json();

    setNote("");
    setCategory("");
    setFiles([]);
    setFixed(!fixed);
    setDoneId(null);
  };

  const emailParams = async (appointment, time) => {
    const newTime = TimeChange(new Date(time).getTime());
    const docName = localStorage.getItem("username");
    try {
      const res = await fetch("http://localhost:3000/api/doc/reschedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          id: appointment["id"],
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
              new Date(newTime).setTime(newTime.getTime() + 5.5 * 60 * 60 * 1000)
            ),
            "dd-MMM-yy hh:mm a"
          ),
          email: appointment["user"]["email"],
        }),
      });
      const resp = await res.json();
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
    setSelectedAppointment(appointmentId === selectedAppointment ? null : appointmentId);
    setisRescheduling(false);
  };

  const openCancelModal = (e, appointment) => {
    e && e.stopPropagation();
    setSelectedReason("");
    setCustomReason("");
    setCancellingAppointment(appointment);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setCancellingAppointment(null);
    setSelectedReason("");
    setCustomReason("");
  };

  const submitRejection = async () => {
    const reason = selectedReason === "None of the above" ? customReason.trim() : selectedReason;
    if (!reason || reason.length === 0) {
      CustomToast("Please select or type a reason for cancelling.", "blue");
      return;
    }
    if (!cancellingAppointment) {
      CustomToast("No appointment selected.", "blue");
      closeCancelModal();
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/api/user_doc/cancelRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          id: cancellingAppointment.id,
          reason: reason,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to reject appointment");
      }

      setapp((prev) => prev.filter((a) => a.id !== cancellingAppointment.id));
      sendNotif(cancellingAppointment);
      CustomToast("Appointment request rejected", "blue");
      setFixed((f) => !f);
    } catch (error) {
      console.error(error);
      CustomToast("Failed to reject appointment", "blue");
    } finally {
      closeCancelModal();
    }
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
        {/* CHANGED: Replaced grid with flex-col to stack vertically */}
        <div className="flex flex-col gap-12">
          
          {/* SECTION 1: Current Appointments */}
          <div className="space-y-8">
            <div className="flex items-center justify-between w-full">
              <div className="w-full">
                <h1 className="text-center sm:text-left text-3xl sm:text-4xl font-extrabold text-[var(--custom-blue-600)]">
                  Current Appointments
                </h1>
                
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
                            <span className="font-semibold tracking-tight mr-2">
                              {appointment.user.username}
                            </span>
                            {/* ✅ ADDED BADGE HERE */}
                            <StatusBadge status={appointment.caseStatus} />
                          </div>
                          <div className="flex items-center text-lg text-[var(--custom-gray-800)]">
                            <Clock className="h-6 w-6 mr-4 text-[var(--custom-blue-600)]" />
                            {format(
                              TimeReduce(new Date(appointment.dateTime).getTime()),
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
                          {completedNotes[appointment.id] !== undefined ? doneId !== appointment.id ? (
                            <div className="flex flex-col sm:flex-row gap-2">
                                {/* ✅ UPDATED BUTTONS */}
                                <button
                                  onClick={() => deleteApp(appointment, false)}
                                  className="px-6 py-2.5 bg-[var(--custom-blue-500)] text-[var(--custom-white)] font-semibold rounded-full shadow-lg hover:bg-[var(--custom-blue-600)] transform hover:scale-105 transition-all duration-300"
                                >
                                  Mark as Done
                                </button>
                                <button
                                  onClick={() => deleteApp(appointment, true)}
                                  className="px-6 py-2.5 bg-[var(--custom-red-500)] text-[var(--custom-white)] font-semibold rounded-full shadow-lg hover:bg-[var(--custom-red-600)] transform hover:scale-105 transition-all duration-300"
                                >
                                  Close Case
                                </button>
                            </div>
                          ) :
                            (<Loader className="mx-auto animate-spin" />) :
                            (<button
                              onClick={() => handleMarkAsDone(appointment.id)}
                              className="px-6 py-2.5 bg-[var(--custom-blue-500)] text-[var(--custom-white)] font-semibold rounded-full shadow-lg hover:bg-[var(--custom-blue-600)] transform hover:scale-105 transition-all duration-300"
                            >
                              Action
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
                            <div className="relative">
                              <select
                                value={category}
                                onChange={handleCategoryChange}
                                className="w-full p-4 bg-[var(--custom-white)]/50 backdrop-blur-sm border border-[var(--custom-blue-200)] rounded-xl focus:ring-2 focus:ring-[var(--custom-blue-300)] focus:border-[var(--custom-blue-400)] transition-all duration-300 text-[var(--custom-gray-800)] outline-none appearance-none"
                              >
                                <option value="" disabled>
                                  Select Category
                                </option>
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
                            <input
                              type="text"
                              placeholder="Enter completion notes..."
                              className="w-full p-4 bg-[var(--custom-white)]/50 backdrop-blur-sm border border-[var(--custom-blue-200)] rounded-xl focus:ring-2 focus:ring-[var(--custom-blue-300)] focus:border-[var(--custom-blue-400)] transition-all duration-300 text-[var(--custom-gray-800)] placeholder-[var(--custom-gray-500)]"
                              value={note}
                              onChange={handleNoteChange}
                            />
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="application/pdf"
                              multiple
                              onChange={handleUpload}
                              style={{ display: "none" }}
                            />
                            <button
                              className="btn upload-btn"
                              onClick={() => fileInputRef.current.click()}
                            >
                              Upload PDFs
                            </button>
                            <div className="dashboard-list">
                              {files.length === 0 ? (
                                <p className="empty-msg">No PDFs uploaded yet.</p>
                              ) : (
                                <ul>
                                  {files.map((f) => (
                                    <li key={f.id} className="pdf-item">
                                      <div className="pdf-meta">
                                        <strong>{f.name}</strong>
                                        <small>
                                          {Math.round(f.size / 1024)} KB •{" "}
                                          {new Date(f.uploadedAt).toLocaleString()}
                                        </small>
                                      </div>
                                      <div className="pdf-actions">
                                        <button onClick={() => handleView(f)}>
                                          View
                                        </button>
                                        <button
                                          className="remove-btn"
                                          onClick={() => handleRemove(f.id)}
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
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

          {/* SECTION 2: Incoming Requests */}
          <div className="space-y-8">
            <div className="flex items-center justify-between w-full">
              <div className="w-full">
                <h1 className="text-center sm:text-left text-3xl sm:text-4xl font-extrabold text-[var(--custom-blue-600)]">
                  Incoming Requests
                </h1>
                
              </div>
            </div>

            {appointments.length > 0 ? (
              <div className="bg-[var(--custom-white)]/80 backdrop-blur-lg rounded-3xl shadow-xl border border-[var(--custom-blue-100)] overflow-y-scroll overflow-x-hidden max-h-150">
                {appointments.map((appointment) => {
                  return (
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
                                TimeReduce(new Date(appointment.dateTime).getTime()),
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

                            {appointment.user.alt_mobile && (
                              <div className="flex items-center text-lg text-[var(--custom-gray-800)]">
                                <Phone className="h-6 w-6 mr-4 text-[var(--custom-blue-600)]" />
                                {appointment.user.alt_mobile}
                              </div>
                            )}

                            <div className="flex items-start text-lg text-[var(--custom-gray-800)]">
                              <FileText className="h-6 w-6 mr-4 mt-1 text-[var(--custom-blue-600)]" />
                              <span>{appointment.reason}</span>
                            </div>
                          </div>

                          {appointment.forDoctor ? (
                            <div className="flex flex-col xl:flex-row xl:space-x-5 space-y-3 xl:space-y-0">
                              {acceptingId === appointment.id ? (
                                <Loader className="mx-auto animate-spin" />
                              ) : (
                                <button
                                  onClick={() => acceptApp(appointment)}
                                  className="px-6 py-2.5 bg-[var(--custom-blue-500)] text-[var(--custom-white)] font-semibold rounded-full shadow-lg hover:bg-[var(--custom-blue-600)] transform hover:scale-105 transition-all duration-300"
                                >
                                  Accept
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

                              {selectedAppointment !== appointment.id && (
                                <button
                                  onClick={(e) => openCancelModal(e, appointment)}
                                  className="px-6 py-2.5 bg-[var(--custom-gray-200)] text-[var(--custom-gray-800)] font-semibold rounded-full shadow-lg hover:bg-[var(--custom-gray-300)] transform hover:scale-105 transition-all duration-300"
                                >
                                  Cancel
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
                          ) : (
                            <div className="text-sm text-[var(--custom-gray-600)]">
                              You have asked to reschedulethe appointment. Waiting for the user response
                            </div>
                          )}

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
                                    const formattedDate = format(date, "yyyy-MM-dd");
                                    const displayDate = format(date, "d MMM");
                                    return (
                                      <option key={formattedDate} value={formattedDate}>
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
                                    handleTimeChange(e);
                                  }}
                                  className="w-full px-4 py-3 rounded-lg border-2 border-[var(--custom-blue-200)] focus:border-[var(--custom-blue-400)] focus:ring-2 focus:ring-[var(--custom-blue-200)] transition-all duration-200 outline-none bg-[var(--custom-white)]"
                                >
                                  <option value="">Select Time</option>
                                  {Array.isArray(slots) &&
                                    slots.map((slot) => (
                                      <option key={slot.id} value={slot.starting_time}>
                                        {format(new Date(slot.starting_time).getTime(), "HH:mm")}
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
                                  {isRescheduling ? <Loader className="mx-auto" /> : "Reschedule"}
                                </button>
                              </center>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
        <div className="w-full mt-6">
          <h1 className="text-center sm:text-left text-3xl sm:text-4xl font-extrabold text-[var(--custom-blue-600)]">
            Cancelled Appoinments
          </h1>
          
        </div>

        {cancelledAppoinments?.length > 0 ? (
          <div className="bg-[var(--custom-white)]/80 backdrop-blur-lg rounded-3xl shadow-xl border border-[var(--custom-blue-100)] overflow-y-auto max-h-150 p-4 space-y-4">

            {cancelledAppoinments.map((app) => (
              <div
                key={app.id}
                className="w-full bg-[var(--custom-gray-50)] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-[var(--custom-gray-200)]"
              >
                
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-semibold text-[var(--custom-orange-900)]">
                    {app.user?.username || "Unknown User"}
                  </p>

                  <p className="text-sm text-[var(--custom-gray-600)]">
                    Appointment Time:{" "}
                    {app.appointmentTime
                      ? new Date(app.appointmentTime).toLocaleString()
                      : "Not specified"}
                  </p>

                  <p className="text-sm text-[var(--custom-gray-600)]">
                    Cancelled On: {new Date(app.dateTime).toLocaleString()}
                  </p>

                  <p className="text-sm text-[var(--custom-red-500)] font-medium">
                    Reason: {app.reason}
                  </p>
                </div>

                <div className="self-start sm:self-center">
                  <span className="bg-[var(--custom-red-100)] text-[var(--custom-red-700)] px-3 py-1 rounded-full text-sm font-semibold">
                    Cancelled
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[var(--custom-white)]/80 backdrop-blur-lg rounded-3xl shadow-xl border border-[var(--custom-blue-100)] flex items-center justify-center py-8">
            You do not have any cancelled appointments
          </div>
        )
        }

        <PastAppointmentGraphs
          timePeriodData={timePeriodData}
          getPieData={getPieData}
          COLORS={COLORS}
          handleGraphTypeChange={handleGraphTypeChange}
          isBar={isBar}
        />
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 backdrop-blur-sm" onClick={closeCancelModal} />
          <div className="relative bg-white rounded-xl p-6 w-full max-w-md shadow-lg z-10">
            <h4 className="text-lg font-semibold mb-3">Reason for cancelling</h4>
            <label className="block text-sm font-medium mb-2">Select reason</label>
            <select
              value={selectedReason}
              onChange={(e) => {
                setSelectedReason(e.target.value);
              }}
              className="w-full border rounded-md px-3 py-2 mb-3"
            >
              <option value="">-- Select a reason --</option>
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {selectedReason === "None of the above" && (
              <div className="mb-3">
                <label className="block text-sm font-medium mb-2">Please type your reason</label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  rows={4}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Type the reason for cancelling..."
                />
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={closeCancelModal} className="px-4 py-2 rounded-md border">
                Cancel
              </button>
              <button
                onClick={submitRejection}
                className="px-4 py-2 rounded-md bg-[var(--custom-red-500)] text-white font-semibold"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer color={"blue"} />
    </div>
  );
};

export default DoctorAppointment;