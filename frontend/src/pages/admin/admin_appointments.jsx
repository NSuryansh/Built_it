import React, { useState, useMemo } from "react";
import { Calendar, Users, Clock } from "lucide-react";
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

const fetchDoctors = async () => {
  const res = await fetch(`http://localhost:3000/getdoctors`, {
    method: "GET",
  });
  const data = await res.json();
  const formattedData = data.map((doc) => {
    return { id: doc.id, name: doc.name };
  });
  return formattedData;
};

const fetchAppointments = async () => {
  const res = await fetch(`http://localhost:3000/all-appointments`, {
    method: "GET",
  });
  const data = await res.json();
  const formattedCurData = data.appts.map((appt) => {
    return {
      id: appt.id,
      doctorId: appt.doctor_id,
      patientName: appt.user.username,
      time: new Date(appt.dateTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date(appt.dateTime).toISOString().split("T")[0],
      status: "Pending",
    };
  });
  const formattedPastData = data.pastApp.map((appt) => {
    return {
      id: appt.id,
      doctorId: appt.doc_id,
      patientName: appt.user.username,
      time: new Date(appt.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date(appt.createdAt).toISOString().split("T")[0],
      status: "Done",
    };
  });

  return [...formattedCurData, ...formattedPastData];
};

const doctors = await fetchDoctors();

const appointments = await fetchAppointments();

const graphData = [
  { date: "03/20", appointments: 3 },
  { date: "03/21", appointments: 2 },
  { date: "03/22", appointments: 1 },
  { date: "03/23", appointments: 4 },
  { date: "03/24", appointments: 2 },
  { date: "03/25", appointments: 3 },
  { date: "03/26", appointments: 5 },
];

const AdminAppointments = () => {
  const [selectedDoctor, setSelectedDoctor] = useState("all");

  const filteredAppointments = useMemo(() => {
    return selectedDoctor === "all"
      ? appointments
      : appointments.filter((app) => app.doctorId === selectedDoctor);
  }, [selectedDoctor]);

  const filteredGraphData = useMemo(() => {
    if (selectedDoctor === "all") return graphData;

    return graphData.map((data) => ({
      ...data,
      appointments: Math.floor(data.appointments * 0.4), // Simulate filtered data
    }));
  }, [selectedDoctor]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-4">
            <Calendar className="h-10 w-10 text-blue-600 animate-pulse" />
            Appointments Dashboard
          </h1>
          <select
            className="bg-white border border-gray-200 rounded-xl px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 font-medium"
            value={selectedDoctor}
            onChange={(e) =>
              setSelectedDoctor(
                e.target.value === "all" ? "all" : Number(e.target.value)
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-blue-100 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Total Appointments
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {filteredAppointments.length}
                </p>
              </div>
              <Calendar className="h-10 w-10 text-blue-600 animate-bounce" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-green-100 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Total Doctors
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {doctors.length}
                </p>
              </div>
              <Users className="h-10 w-10 text-green-600 animate-pulse" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-purple-100 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Today's Appointments
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {
                    filteredAppointments.filter(
                      (app) => app.date === "2024-03-20"
                    ).length
                  }
                </p>
              </div>
              <Clock className="h-10 w-10 text-purple-600 animate-spin-slow" />
            </div>
          </div>
        </div>

        {/* Graph */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Appointments Overview
          </h2>
          <div className="h-[400px] bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl p-4 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredGraphData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={14} />
                <YAxis stroke="#6b7280" fontSize={14} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
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
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
            <h2 className="text-2xl font-semibold text-gray-900">
              Recent Appointments
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="px-6 py-5 hover:bg-blue-50/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="w-1/3">
                    <p className="font-medium text-gray-900 text-lg">
                      {appointment.patientName}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {doctors.find((d) => d.id === appointment.doctorId)?.name}
                    </p>
                  </div>
                  <div className="w-1/3 text-center">
                    <p className="text-sm font-medium text-gray-900">
                      {appointment.date}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {appointment.time}
                    </p>
                  </div>
                  <div className="w-1/3 flex justify-end">
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-medium shadow-sm border transition-colors duration-200 ${
                      appointment.status === "Confirmed"
                        ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                        : appointment.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200"
                        : "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
                    }`}
                  >
                    {appointment.status}
                  </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAppointments;
