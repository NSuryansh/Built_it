import React, { useState, useEffect, useMemo } from "react";
import {Calendar, Users, Clock, Search,
  User,
  Stethoscope,
  CalendarClock,
  CheckCircle2,
  Clock3,
  CheckCircle,
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
import AdminNavbar from "../../components/admin/admin_navbar";
import Footer from "../../components/Footer";
import { format } from "date-fns";

const AdminAppointments = () => {
  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [searchUser, setSearchUser] = useState("");
  const [searchDoctor, setSearchDoctor] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchDoctors = async () => {
      try {
        const res = await fetch(`https://built-it-backend.onrender.com/getdoctors`);
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

    const fetchAppointments = async () => {
      try {
        const res = await fetch(`https://built-it-backend.onrender.com/all-appointments`);
        const data = await res.json();
        const formattedCurData = data.appts.map((appt) => ({
          id: appt.id,
          doctorId: appt.doctor_id,
          patientName: appt.user.username,
          time: new Date(appt.dateTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: new Date(appt.dateTime).toISOString().split("T")[0],
          status: "Pending",
        }));
        const formattedPastData = data.pastApp.map((appt) => ({
          id: appt.id,
          doctorId: appt.doc_id,
          patientName: appt.user.username,
          time: new Date(appt.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: new Date(appt.createdAt).toISOString().split("T")[0],
          status: "Done",
        }));
        if (isMounted)
          setAppointments([...formattedCurData, ...formattedPastData]);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchDoctors(), fetchAppointments()]);
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const getWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates();

  const formatDate = (date) => {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    return `${dd}/${mm}`;
  };

  const appWeek = (weekDates, appointments) => {
    return weekDates.map((date) => {
      const formatted = formatDate(date);
      const count = appointments.filter(
        (appt) => formatDate(new Date(appt.date)) === formatted
      ).length;
      return { date: formatted, appointments: count };
    });
  };

  const filteredAppointments = useMemo(() => {
    let filtered = appointments;

    if (selectedDoctor !== "all") {
      filtered = filtered.filter(
        (app) => Number(app.doctorId) === Number(selectedDoctor)
      );
    }

    if (searchUser.trim()) {
      filtered = filtered.filter((app) =>
        app.patientName.toLowerCase().includes(searchUser.toLowerCase())
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
  }, [selectedDoctor, searchUser, searchDoctor, appointments, doctors]);

  const filteredGraphData = useMemo(
    () => appWeek(weekDates, filteredAppointments),
    [filteredAppointments, weekDates]
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "Done":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "Pending":
        return <Clock3 className="h-5 w-5 text-yellow-600" />;
      default:
        return <CheckCircle className="h-5 w-5 text-black-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-12 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10">
          <h1 className="text-3xl md:text-4xl text-center font-extrabold text-gray-900 flex items-center gap-4">
            <Calendar className="h-10 w-10 text-blue-600 " />
            Appointments Dashboard
          </h1>
          <select
            className="bg-white mt-4 md:mt-0 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option value="all">All Doctors</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="relative">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by User..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <div className="relative">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by Doctor..."
              value={searchDoctor}
              onChange={(e) => setSearchDoctor(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Weekly Appointments
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={filteredGraphData}>
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="appointments"
                stroke="blue"
                fillOpacity={4}
                fill="url(#colorAppt)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            All Appointments
          </h2>
          <div className="overflow-x-auto bg-white rounded-xl shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-green-50 divide-y divide-gray-200">
                {filteredAppointments.map((appt, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {appt.patientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {doctors.find((d) => d.id === appt.doctorId)?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {appt.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {appt.time}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap font-semibold text-sm flex items-center gap-2 ${
                        appt.status === "Done"
                          ? "text-green-500"
                          : appt.status === "Pending"
                          ? "text-yellow-500"
                          : "text-gray-700"
                      }`}
                    >
                      {getStatusIcon(appt.status)} {appt.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer color="green" />
    </div>
  );
};

export default AdminAppointments;
