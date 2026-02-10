import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Users,
  Clock,
  Search,
  User,
  Stethoscope,
  CalendarClock,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AdminNavbar from "../../components/admin/Navbar";
import Footer from "../../components/common/Footer";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  addDays,
} from "date-fns";
import { checkAuth } from "../../utils/profile";
import SessionExpired from "../../components/common/SessionExpired";
import { useNavigate } from "react-router-dom";
import CustomToast from "../../components/common/CustomToast";
import CustomLoader from "../../components/common/CustomLoader";

const AdminAppointments = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [searchUser, setSearchUser] = useState("");
  const [searchDoctor, setSearchDoctor] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [fetched, setfetched] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState("this-week");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("admin");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/admin/all-appointments?period=${timeframe}`,
        {
          headers: { Authorization: "Bearer " + token },
        },
      );
      const data = await res.json();
      const formattedCurData = data.appts.map((appt) => ({
        id: appt.id,
        doctorId: appt.doctor_id,
        patientName: appt.user.randomName,
        time: new Date(appt.dateTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: new Date(appt.dateTime).toISOString().split("T")[0],
        fullDate: new Date(appt.dateTime),
        status: "Pending",
      }));
      const formattedPastData = data.pastApp.map((appt) => ({
        id: appt.id,
        doctorId: appt.doc_id,
        patientName: appt.user.randomName,
        time: new Date(appt.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: new Date(appt.createdAt).toISOString().split("T")[0],
        fullDate: new Date(appt.createdAt),
        status: "Done",
      }));
      setAppointments([...formattedCurData, ...formattedPastData]);
      setfetched(true);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      CustomToast("Failed to fetch appointments", "green");
      setfetched(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchDoctors = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/user_admin/getdoctors?user_type=admin",
          {
            headers: { Authorization: "Bearer " + token },
          },
        );
        const data = await res.json();
        const formattedData = data.map((doc) => ({
          id: doc.id,
          name: doc.name,
        }));
        if (isMounted) setDoctors(formattedData);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      }
    };

    fetchDoctors();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAppointments();
    }
  }, [isAuthenticated, timeframe]);

  const graphRange = useMemo(() => {
    const today = new Date();
    let start, end;

    switch (timeframe) {
      case "this-week":
        start = startOfWeek(today, { weekStartsOn: 1 });
        end = addDays(endOfWeek(today, { weekStartsOn: 1 }), 14);
        break;
      case "past-week":
        start = startOfWeek(addDays(today, -7), { weekStartsOn: 1 });
        end = endOfWeek(addDays(today, -7), { weekStartsOn: 1 });
        break;
      case "this-month":
        start = startOfMonth(today);
        end = addDays(endOfMonth(today), 14);
        break;
      case "past-month":
        const lastMonth = addDays(startOfMonth(today), -1);
        start = startOfMonth(lastMonth);
        end = endOfMonth(lastMonth);
        break;
      default:
        const earliest = appointments.reduce(
          (min, p) => (p.fullDate < min ? p.fullDate : min),
          today,
        );
        start = earliest;
        end = addDays(today, 14);
    }

    return eachDayOfInterval({ start, end });
  }, [timeframe, appointments]);

  const filteredAppointments = useMemo(() => {
    let filtered = appointments;
    if (selectedDoctor !== "all") {
      filtered = filtered.filter((app) => app.doctorId === selectedDoctor);
    }
    if (searchUser.trim()) {
      filtered = filtered.filter((app) =>
        app.patientName.toLowerCase().includes(searchUser.toLowerCase()),
      );
    }
    if (searchDoctor.trim()) {
      filtered = filtered.filter((app) => {
        const doctorName =
          doctors.find((d) => d.id === app.doctorId)?.name || "";
        return doctorName.toLowerCase().includes(searchDoctor.toLowerCase());
      });
    }
    return filtered;
  }, [appointments, doctors, selectedDoctor, searchUser, searchDoctor]);

  const graphData = useMemo(() => {
    return graphRange.map((date) => {
      const formatted = format(date, "yyyy-MM-dd");
      const count = filteredAppointments.filter(
        (appt) => appt.date === formatted,
      ).length;
      return {
        date: format(date, "dd/MM"),
        appointments: count,
      };
    });
  }, [graphRange, filteredAppointments]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock3 className="h-5 w-5 text-yellow-600" />;
      default:
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    }
  };

  const handleClosePopup = () => {
    navigate("/admin/login");
  };

  if (isAuthenticated === null || fetched === null || loading) {
    return (
      <CustomLoader
        color="green"
        text={loading ? "Updating data..." : "Loading your dashboard..."}
      />
    );
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="green" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--custom-green-50)] to-[var(--custom-green-100)]">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-12 py-6">
        <div className="flex flex-col gap-4 lg:flex-row items-center justify-between">
          <h1 className="text-2xl md:text-3xl lg:text-4xl text-center font-extrabold text-[var(--custom-gray-900)] flex items-center gap-4">
            <Calendar className="h-10 w-10 text-[var(--custom-blue-600)] animate-pulse" />
            Appointments Dashboard
          </h1>
          <div className="flex gap-3">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-[var(--custom-white)] border border-[var(--custom-gray-200)] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--custom-green-400)] shadow-md hover:shadow-lg transition-all duration-300 text-[var(--custom-gray-700)] font-medium cursor-pointer"
            >
              <option value="this-week">This Week</option>
              <option value="past-week">Past Week</option>
              <option value="this-month">This Month</option>
              <option value="past-month">Past Month</option>
              <option value="last-3-months">Last 3 Months</option>
              <option value="last-6-months">Last 6 Months</option>
              <option value="last-12-months">Last 12 Months</option>
              <option value="all-time">All Time</option>
            </select>

            <select
              className="bg-[var(--custom-white)] border border-[var(--custom-gray-200)] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--custom-green-400)] shadow-md hover:shadow-lg transition-all duration-300 text-[var(--custom-gray-700)] font-medium cursor-pointer"
              value={selectedDoctor}
              onChange={(e) =>
                setSelectedDoctor(
                  e.target.value === "all" ? "all" : Number(e.target.value),
                )
              }
            >
              <option value="all">All Doctors</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-6 mb-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gradient-to-br from-[var(--custom-white)] to-[var(--custom-blue-50)] rounded-2xl shadow-lg p-6 md:p-3 lg:p-6  hover:shadow-xl transition-all duration-300 border border-[var(--custom-blue-100)] transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--custom-gray-600)] font-medium">
                  Total Appointments
                </p>
                <p className="text-3xl font-bold text-[var(--custom-gray-900)] mt-2">
                  {filteredAppointments.length}
                </p>
              </div>
              <Calendar className="h-10 w-10 text-[var(--custom-blue-600)]" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-[var(--custom-white)] to-[var(--custom-green-50)] rounded-2xl shadow-lg p-6 md:p-3 lg:p-6 hover:shadow-xl transition-all duration-300 border border-[var(--custom-green-100)] transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--custom-gray-600)] font-medium">
                  Total Therapists
                </p>
                <p className="text-3xl font-bold text-[var(--custom-gray-900)] mt-2">
                  {doctors.length}
                </p>
              </div>
              <Users className="h-10 w-10 text-[var(--custom-green-600)] animate-pulse" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-[var(--custom-white)] to-[var(--custom-purple-50)] rounded-2xl shadow-lg p-6 md:p-3 lg:p-6 hover:shadow-xl transition-all duration-300 border border-[var(--custom-purple-100)] transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--custom-gray-600)] font-medium">
                  Today's Appointments
                </p>
                <p className="text-3xl font-bold text-[var(--custom-gray-900)] mt-2">
                  {
                    filteredAppointments.filter(
                      (app) =>
                        app.date === new Date().toISOString().split("T")[0],
                    ).length
                  }
                </p>
              </div>
              <Clock className="h-10 w-10 text-[var(--custom-purple-600)] animate-spin-slow" />
            </div>
          </div>
        </div>

        {/* Graph */}
        <div className="bg-[var(--custom-white)] rounded-2xl shadow-lg p-8 mb-12 border border-[var(--custom-gray-100)]">
          <h2 className="text-2xl font-semibold text-[var(--custom-gray-900)] mb-6">
            Appointments Overview
          </h2>
          <div className="h-[400px] bg-gradient-to-br from-[var(--custom-blue-50)] to-[var(--custom-gray-50)] rounded-xl md:p-4 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={14} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "[var(--custom-white)]",
                    borderRadius: "10px",
                    border: "none",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                    padding: "10px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="appointments"
                  stroke="#3B82F6"
                  fill="url(#gradient)"
                  strokeWidth={3}
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#93C5FD" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#93C5FD" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-[var(--custom-white)] rounded-2xl shadow-lg overflow-hidden border border-[var(--custom-gray-100)]">
          <div className="px-6 py-5 border-b border-[var(--custom-gray-100)] bg-gradient-to-r from-[var(--custom-gray-50)] to-[var(--custom-blue-50)]">
            <h2 className="text-2xl font-semibold text-[var(--custom-gray-900)] mb-4">
              Recent Appointments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--custom-gray-400)] h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by patient name..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--custom-gray-200)] focus:outline-none focus:ring-2 focus:ring-[var(--custom-blue-400)] shadow-md hover:shadow-lg transition-all duration-300 bg-[var(--custom-white)]"
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--custom-gray-400)] h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by doctor name..."
                  value={searchDoctor}
                  onChange={(e) => setSearchDoctor(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--custom-gray-200)] focus:outline-none focus:ring-2 focus:ring-[var(--custom-blue-400)] shadow-md hover:shadow-lg transition-all duration-300 bg-[var(--custom-white)]"
                />
              </div>
            </div>
          </div>
          <div className="divide-y max-h-screen overflow-y-auto divide-[var(--custom-gray-100)] flex flex-col items-center lg:gap-3 mt-3 mb-3">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-6 px-8 rounded-xl w-full lg:w-[95%] hover:bg-[var(--custom-blue-100)] bg-[var(--custom-blue-50)] scale-[0.9] md:scale-[0.95] lg:scale-[1] transition-all duration-200"
              >
                <div className="flex flex-col items-center lg:flex-row gap-2">
                  <div className="flex justify-evenly flex-col sm:flex-row w-full lg:w-1/2">
                    <div className="flex-1 bg-gradient-to-br from-[var(--custom-blue-50)]/50 to-transparent p-4 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <User className="h-5 w-5 text-[var(--custom-blue-600)]" />
                        <h3 className="font-semibold text-[var(--custom-gray-900)]">
                          Patient Details
                        </h3>
                      </div>
                      <p className="text-lg font-medium text-[var(--custom-blue-900)] mb-1">
                        {appointment.patientName}
                      </p>
                    </div>

                    <div className="flex-1 bg-gradient-to-br from-[var(--custom-green-50)]/50 to-transparent p-4 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <Stethoscope className="h-5 w-5 text-[var(--custom-green-600)]" />
                        <h3 className="font-semibold text-[var(--custom-gray-900)]">
                          Therapist Details
                        </h3>
                      </div>
                      <p className="text-lg font-medium text-[var(--custom-green-900)] mb-1">
                        {
                          doctors.find((d) => d.id === appointment.doctorId)
                            ?.name
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-evenly flex-col sm:flex-row w-full lg:w-1/2">
                    <div className="flex-1 bg-gradient-to-br from-[var(--custom-purple-50)]/50 to-transparent p-4 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <CalendarClock className="h-5 w-5 text-[var(--custom-purple-600)]" />
                        <h3 className="font-semibold text-[var(--custom-gray-900)]">
                          Appointment Details
                        </h3>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-lg font-medium text-[var(--custom-purple-900)] mb-1">
                            {format(new Date(appointment.date), "dd MMM yyyy")}
                          </p>
                          <p className="text-sm ml-4 text-[var(--custom-purple-600)]/80">
                            {appointment.time}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex h-fit self-center items-center gap-2 px-4 py-2 rounded-lg bg-[var(--custom-white)] shadow-sm border border-[var(--custom-gray-100)]">
                      {getStatusIcon(appointment.status)}
                      <span
                        className={`text-sm font-medium ${
                          appointment.status === "Pending"
                            ? "text-[var(--custom-yellow-600)]"
                            : "text-[var(--custom-green-600)]"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer color="green" />
    </div>
  );
};

export default AdminAppointments;
