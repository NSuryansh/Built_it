import React, { useState, useEffect } from "react";
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
  // New state: if true, show pie charts; if false, show bar graph.
  const [isPie, setIsPie] = useState(true);

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
        const response = await fetch("https://built-it.onrender.com/pastApp");
        const data = await response.json();
        if (response.ok) {
          const result = {};
          data.forEach((app) => {
            const branch = app.user.acadProg;
            const docName = app.doc.name.split(" ")[0];
            if (!result[docName]) {
              result[docName] = { UG: 0, PG: 0, PHD: 0 };
            }
            result[docName][branch] += 1;
          });

          const ugAppointments = {};
          const pgAppointments = {};
          const phdAppointments = {};

          Object.entries(result).forEach(([doc, counts]) => {
            ugAppointments[doc] = counts.UG;
            pgAppointments[doc] = counts.PG;
            phdAppointments[doc] = counts.PHD;
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

  // Data for the aggregated BarChart
  const histogramData = Object.keys(appointmentsUG).map((doc) => ({
    name: doc,
    UG: appointmentsUG[doc] || 0,
    PG: appointmentsPG[doc] || 0,
    PHD: appointmentsPHD[doc] || 0,
  }));

  // Colors for the charts
  const COLORS = [
    "#048A81",
    "#FFB703",
    "#FB8500",
    "#6A4C93",
    "#2A9D8F",
    "#E76F51",
  ];

  // Handler for graph type change via dropdown.
  const handleGraphTypeChange = (e) => {
    setIsPie(e.target.value === "pie");
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <PacmanLoader color="#047857" size={30} />
        <p className="mt-4 text-emerald-800 font-medium">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[var(--custom-primary-green-50)]">
      <AdminNavbar />
      <ToastContainer />
      <div className="space-y-4 max-w-7xl md:min-w-5xl mt-10 mx-auto mb-10">
        <h1 className="text-3xl font-bold text-center md:text-left text-[var(--custom-primary-green-900)]">
          Dashboard Overview
        </h1>

        {/* Dropdown to choose graph type */}
        {/* <div className="flex justify-end">

        </div> */}

        {/* Conditional Rendering based on graph type */}
        {isPie ? (
          // Render multiple Pie Charts for each doctor.
          <div className="bg-[var(--custom-white)] p-2 md:p-6 rounded-xl shadow-lg mt-8">
            <div className="flex flex-row flex-wrap justify-between">
              <h2 className="text-xl font-semibold text-[var(--custom-primary-green-800)] mb-4">
                Appointments Breakdown by Doctor
              </h2>
              <div className="flex justify-end gap-8">
                <select
                  onChange={handleGraphTypeChange}
                  value={isPie ? "pie" : "bar"}
                  className="mb-10 cursor-pointer"
                >
                  <option value="pie">Pie Charts</option>
                  <option value="bar">Bar Graph</option>
                </select>
                <select name="" id="" className="mb-10 cursor-pointer">
                  <option value="Acad Program">Academic Program</option>
                  <option value="Gender Ratio">Gender Ratio</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.keys(appointmentsUG).map((doc) => {
                // Data for each doctor's pie chart
                const pieData = [
                  { name: "UG", value: appointmentsUG[doc] || 0 },
                  { name: "PG", value: appointmentsPG[doc] || 0 },
                  { name: "PHD", value: appointmentsPHD[doc] || 0 },
                ];
                return (
                  <div key={doc} className="flex flex-col items-center">
                    <h3 className="text-lg font-semibold mb-2 text-[var(--custom-primary-green-900)]">
                      Dr. {doc}
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {pieData.map((entry, index) => (
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
                );
              })}
            </div>
          </div>
        ) : (
          // Render a single aggregated Bar Chart.
          <div className="bg-[var(--custom-white)] p-2 md:p-6 rounded-xl shadow-lg mt-8">
            <div className="flex flex-row flex-wrap justify-between">
              <h2 className="text-xl font-semibold text-[var(--custom-primary-green-800)] mb-4">
                Appointments per Doctor
              </h2>
              <div className="flex justify-end gap-8">
                <select
                  onChange={handleGraphTypeChange}
                  value={isPie ? "pie" : "bar"}
                  className="mb-10 cursor-pointer"
                >
                  <option value="pie">Pie Charts</option>
                  <option value="bar">Bar Graph</option>
                </select>
                <select name="" id="" className="mb-10 cursor-pointer">
                  <option value="Acad Program">Academic Program</option>
                  <option value="Gender Ratio">Gender Ratio</option>
                </select>
              </div>
            </div>
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
                  <Bar dataKey="PHD" fill="#FB8500" name="PhD Appointments" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
      <Footer color={"green"} />
    </div>
  );
};

export default AdminDashboard;
