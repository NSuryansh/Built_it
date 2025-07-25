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
import AdminNavbar from "../../components/admin/Navbar";
import Footer from "../../components/common/Footer";
import { checkAuth } from "../../utils/profile";
import { ToastContainer } from "react-toastify";
import CustomToast from "../../components/common/CustomToast";
import { BarChart3, PieChart as PieChartIcon, RefreshCw } from "lucide-react";
import SessionExpired from "../../components/common/SessionExpired";
import { useNavigate } from "react-router-dom";
import CustomLoader from "../../components/common/CustomLoader";

const AdminDashboard = () => {
  const [appointmentsUG, setAppointmentsUG] = useState({});
  const [appointmentsPG, setAppointmentsPG] = useState({});
  const [appointmentsPHD, setAppointmentsPHD] = useState({});
  const [maleAppointments, setMaleAppointments] = useState({});
  const [femaleAppointments, setFemaleAppointments] = useState({});
  const [othersAppointments, setOthersAppointments] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isPie, setIsPie] = useState(true);
  const [selectedView, setSelectedView] = useState("academic");
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("admin");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "/api/admin/pastApp",
          {
            headers: { Authorization: "Bearer " + token },
          }
        );
        const data = await response.json();
        if (response.ok) {
          const result = {};
          data.forEach((app) => {
            const branch = app.user.acadProg;
            const docName = app.doc.name.split(" ")[0];
            const gender = app.user.gender;
            if (!result[docName]) {
              result[docName] = {
                UG: 0,
                PG: 0,
                PHD: 0,
                MALE: 0,
                FEMALE: 0,
                OTHERS: 0,
              };
            }
            result[docName][branch] += 1;
            result[docName][gender] += 1;
          });

          const ugAppointments = {};
          const pgAppointments = {};
          const phdAppointments = {};
          const maleAppointmentsData = {};
          const femaleAppointmentsData = {};
          const othersAppointmentsData = {};

          Object.entries(result).forEach(([doc, counts]) => {
            ugAppointments[doc] = counts.UG;
            pgAppointments[doc] = counts.PG;
            phdAppointments[doc] = counts.PHD;
            maleAppointmentsData[doc] = counts.MALE;
            femaleAppointmentsData[doc] = counts.FEMALE;
            othersAppointmentsData[doc] = counts.OTHERS;
          });

          setAppointmentsUG(ugAppointments);
          setAppointmentsPG(pgAppointments);
          setAppointmentsPHD(phdAppointments);
          setMaleAppointments(maleAppointmentsData);
          setFemaleAppointments(femaleAppointmentsData);
          setOthersAppointments(othersAppointmentsData);
        } else {
          console.error("Error in fetching appointments: ", data.message);
        }
      } catch (error) {
        console.error("Error fetching appointments: ", error);
        CustomToast("Error while fetching data", "green");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const academicData = Object.keys(appointmentsUG).map((doc) => ({
    name: doc,
    UG: appointmentsUG[doc] || 0,
    PG: appointmentsPG[doc] || 0,
    PHD: appointmentsPHD[doc] || 0,
  }));

  // Data for gender ratio chart
  const genderData = Object.keys(maleAppointments).map((doc) => ({
    name: doc,
    MALE: maleAppointments[doc] || 0,
    FEMALE: femaleAppointments[doc] || 0,
    OTHERS: othersAppointments[doc] || 0,
  }));

  const COLORS = [
    "#048A81",
    "#FFB703",
    "#FB8500",
    "#6A4C93",
    "#2A9D8F",
    "#E76F51",
  ];

  const handleGraphTypeChange = (e) => {
    setIsPie(e.target.value === "pie");
  };

  const handleViewChange = (e) => {
    setSelectedView(e.target.value === "Acad Program" ? "academic" : "gender");
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/pastApp", {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await response.json();
      if (response.ok) {
        const result = {};
        data.forEach((app) => {
          const branch = app.user.acadProg;
          const docName = app.doc.name.split(" ")[0];
          const gender = app.user.gender;
          if (!result[docName]) {
            result[docName] = { UG: 0, PG: 0, PHD: 0, MALE: 0, FEMALE: 0 };
          }
          result[docName][branch] += 1;
          result[docName][gender] += 1;
        });

        const ugAppointments = {};
        const pgAppointments = {};
        const phdAppointments = {};
        const maleAppointmentsData = {};
        const femaleAppointmentsData = {};

        Object.entries(result).forEach(([doc, counts]) => {
          ugAppointments[doc] = counts.UG;
          pgAppointments[doc] = counts.PG;
          phdAppointments[doc] = counts.PHD;
          maleAppointmentsData[doc] = counts.MALE;
          femaleAppointmentsData[doc] = counts.FEMALE;
        });

        setAppointmentsUG(ugAppointments);
        setAppointmentsPG(pgAppointments);
        setAppointmentsPHD(phdAppointments);
        setMaleAppointments(maleAppointmentsData);
        setFemaleAppointments(femaleAppointmentsData);
      } else {
        console.error("Error in refreshing data");
        CustomToast("Error while refreshing data", "green");
      }
    } catch (error) {
      console.error("Error fetching appointments: ", error);
      CustomToast("Error while refreshing data", "green");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log(maleAppointments, "male");
    console.log(femaleAppointments, "Femal:");
  }, [maleAppointments, femaleAppointments]);

  if (isAuthenticated === null) {
    return <CustomLoader color="green" text="Loading your dashboard..." />;
  }

  const handleClosePopup = () => {
    navigate("/admin/login");
  };

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="green" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[var(--custom-green-50)] to-custom-teal-50">
      <AdminNavbar />
      <ToastContainer />

      <main className="flex-grow p-6 md:p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--custom-green-900)] mb-4 md:mb-0">
            Dashboard Overview
          </h1>

          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              className="p-2 rounded-full hover:bg-[var(--custom-green-100)] transition-colors"
              title="Refresh data"
            >
              <RefreshCw
                className={`w-5 h-5 text-[var(--custom-green-700)] ${isLoading ? "animate-spin" : ""
                  }`}
              />
            </button>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  onChange={handleGraphTypeChange}
                  value={isPie ? "pie" : "bar"}
                  className="appearance-none bg-[var(--custom-white)] pl-8 pr-4 py-2 rounded-lg border border-[var(--custom-green-200)] text-[var(--custom-green-800)] focus:outline-none focus:ring-2 focus:ring-[var(--custom-green-500)] cursor-pointer"
                >
                  <option value="pie">Pie Charts</option>
                  <option value="bar">Bar Graph</option>
                </select>
                {isPie ? (
                  <PieChartIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--custom-green-600)]" />
                ) : (
                  <BarChart3 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--custom-green-600)]" />
                )}
              </div>

              <div className="relative">
                <select
                  onChange={handleViewChange}
                  value={
                    selectedView === "academic"
                      ? "Acad Program"
                      : "Gender Ratio"
                  }
                  className="appearance-none bg-[var(--custom-white)] px-4 py-2 rounded-lg border border-[var(--custom-green-200)] text-[var(--custom-green-800)] focus:outline-none focus:ring-2 focus:ring-[var(--custom-green-500)] cursor-pointer"
                >
                  <option value="Acad Program">Academic Program</option>
                  <option value="Gender Ratio">Gender Ratio</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[var(--custom-white)] rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
          {selectedView === "academic" ? (
            // Academic Program View
            isPie ? (
              <div className="space-y-8">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[var(--custom-green-800)] mb-6">
                  Appointments Distribution by Academic Program
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Object.keys(appointmentsUG).map((doc) => {
                    const pieData = [
                      { name: "UG", value: appointmentsUG[doc] || 0 },
                      { name: "PG", value: appointmentsPG[doc] || 0 },
                      { name: "PHD", value: appointmentsPHD[doc] || 0 },
                    ];

                    return (
                      <div
                        key={doc}
                        className="bg-gradient-to-br from-[var(--custom-green-50)] to-[var(--custom-teal-50)] p-6 rounded-xl"
                      >
                        <h3 className="text-xl font-semibold mb-4 text-[var(--custom-green-900)] text-center">
                          Dr. {doc}
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              innerRadius={60}
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
                            <Legend verticalAlign="bottom" height={36} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-[var(--custom-green-800)] mb-6">
                  Appointments Distribution Overview
                </h2>
                <div className="h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={academicData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#1F2937" }}
                        axisLine={{ stroke: "#CBD5E1" }}
                      />
                      <YAxis
                        tick={{ fill: "#1F2937" }}
                        axisLine={{ stroke: "#CBD5E1" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #CBD5E1",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="UG"
                        fill="#048A81"
                        name="UG Appointments"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="PG"
                        fill="#FFB703"
                        name="PG Appointments"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="PHD"
                        fill="#FB8500"
                        name="PhD Appointments"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )
          ) : // Gender Ratio View
            isPie ? (
              <div className="space-y-8">
                <h2 className="text-2xl font-semibold text-[var(--custom-green-800)] mb-6">
                  Gender Ratio of Appointments
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Object.keys(appointmentsUG).map((doc) => {
                    const pieData = [
                      { name: "Male", value: maleAppointments[doc] || 0 },
                      { name: "Female", value: femaleAppointments[doc] || 0 },
                      { name: "Others", value: othersAppointments[doc] || 0 },
                    ];

                    return (
                      <div
                        key={doc}
                        className="bg-gradient-to-br from-[var(--custom-green-50)] to-[var(--custom-teal-50)] p-6 rounded-xl"
                      >
                        <h3 className="text-xl font-semibold mb-4 text-[var(--custom-green-900)] text-center">
                          Dr. {doc}
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              innerRadius={60}
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
                            <Legend verticalAlign="bottom" height={36} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-[var(--custom-green-800)] mb-6">
                  Gender Ratio Overview
                </h2>
                <div className="h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={genderData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#1F2937" }}
                        axisLine={{ stroke: "#CBD5E1" }}
                      />
                      <YAxis
                        tick={{ fill: "#1F2937" }}
                        axisLine={{ stroke: "#CBD5E1" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #CBD5E1",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="MALE"
                        fill="#048A81"
                        name="Male Appointments"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="FEMALE"
                        fill="#FFB703"
                        name="Female Appointments"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="OTHERS"
                        fill="#FB8500"
                        name="Others Appointments"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
        </div>
      </main>

      <Footer color={"green"} />
    </div>
  );
};

export default AdminDashboard;
