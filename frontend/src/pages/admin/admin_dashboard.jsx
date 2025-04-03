import React, { useState, useEffect } from "react";
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
import AdminNavbar from "../../components/admin/admin_navbar";
import Footer from "../../components/Footer";
import { checkAuth } from "../../utils/profile";
import PacmanLoader from "react-spinners/PacmanLoader";
import { ToastContainer } from "react-toastify";
import CustomToast from "../../components/CustomToast";

const AdminDashboard = () => {
  const [appointmentsUG, setAppointmentsUG] = useState({});
  const [appointmentsPG, setAppointmentsPG] = useState({});
  const [appointmentsPHD, setAppointmentsPHD] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("admin");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost:3000/pastApp");
        const data = await response.json();
        if (response.ok) {
          const result = {};
          data.forEach((app) => {
            const branch = app.user.acadProg;
            const docName = app.doc.name.split(" ")[0];
            if (!result[docName]) {
              result[docName] = { UG: 0, PG: 0, PhD: 0 };
            }
            result[docName][branch] += 1;
          });

          const ugAppointments = {};
          const pgAppointments = {};
          const phdAppointments = {};

          Object.entries(result).forEach(([doc, counts]) => {
            ugAppointments[doc] = counts.UG;
            pgAppointments[doc] = counts.PG;
            phdAppointments[doc] = counts.PhD;
          });

          setAppointmentsUG(ugAppointments);
          setAppointmentsPG(pgAppointments);
          setAppointmentsPHD(phdAppointments);
        } else {
          console.error("Error in fetching appointments: ", data.message);
        }
      } catch (error) {
        console.error("Error fetching appointments: ", error);
        CustomToast("Error while fetching data");
      }
    };
    fetchAppointments();
  }, []);

  const histogramData = Object.keys(appointmentsUG).map((doc) => ({
    name: doc,
    UG: appointmentsUG[doc] || 0,
    PG: appointmentsPG[doc] || 0,
    PhD: appointmentsPHD[doc] || 0,
  }));

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <PacmanLoader color="#048a81" radius={6} height={20} width={5} />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <AdminNavbar />
      <ToastContainer />
      <div className="space-y-4 max-w-7xl md:min-w-5xl mx-auto mb-5">
        <h1 className="text-3xl font-bold text-center md:text-left text-[var(--custom-primary-green-900)]">
          Dashboard Overview
        </h1>

        <div className="bg-[var(--custom-white)] p-2 md:p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-[var(--custom-primary-green-800)] mb-4">
            Appointments per Doctor
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={histogramData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="UG" fill="#048A81" name="UG Appointments" />
                <Bar dataKey="PG" fill="#FFB703" name="PG Appointments" />
                <Bar dataKey="PhD" fill="#FB8500" name="PhD Appointments" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <Footer color={"green"} />
    </div>
  );
};

export default AdminDashboard;
