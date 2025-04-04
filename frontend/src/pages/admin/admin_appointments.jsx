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

// Mock data
const doctors = [
  { id: 1, name: "Dr. Sarah Wilson" },
  { id: 2, name: "Dr. James Smith" },
  { id: 3, name: "Dr. Emily Brown" },
];

const appointments = [
  {
    id: 1,
    doctorId: 1,
    patientName: "John Doe",
    date: "2024-03-20",
    time: "09:00 AM",
    status: "Confirmed",
  },
  {
    id: 2,
    doctorId: 2,
    patientName: "Jane Smith",
    date: "2024-03-20",
    time: "10:00 AM",
    status: "Pending",
  },
  {
    id: 3,
    doctorId: 3,
    patientName: "Mike Johnson",
    date: "2024-03-20",
    time: "11:00 AM",
    status: "Confirmed",
  },
  {
    id: 4,
    doctorId: 1,
    patientName: "Sarah Davis",
    date: "2024-03-21",
    time: "09:30 AM",
    status: "Confirmed",
  },
  {
    id: 5,
    doctorId: 2,
    patientName: "Tom Wilson",
    date: "2024-03-21",
    time: "02:00 PM",
    status: "Cancelled",
  },
  {
    id: 6,
    doctorId: 3,
    patientName: "Emma Brown",
    date: "2024-03-22",
    time: "11:30 AM",
    status: "Confirmed",
  },
];

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
    <div className="min-h-screen bg-[var(--custom-primary-green-50)]">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-8 w-8 text-blue-600" />
            Appointments Dashboard
          </h1>
          <select
            className="bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Appointments</p>
                <p className="text-2xl font-semibold">
                  {filteredAppointments.length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Doctors</p>
                <p className="text-2xl font-semibold">{doctors.length}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-semibold">
                  {
                    filteredAppointments.filter(
                      (app) => app.date === "2024-03-20"
                    ).length
                  }
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Graph */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Appointments Overview</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredGraphData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="appointments"
                  stroke="#3B82F6"
                  fill="#93C5FD"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Recent Appointments</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{appointment.patientName}</p>
                    <p className="text-sm text-gray-600">
                      {doctors.find((d) => d.id === appointment.doctorId)?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{appointment.date}</p>
                    <p className="text-sm text-gray-600">{appointment.time}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      appointment.status === "Confirmed"
                        ? "bg-green-100 text-green-800"
                        : appointment.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {appointment.status}
                  </span>
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
