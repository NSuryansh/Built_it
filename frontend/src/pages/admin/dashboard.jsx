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
  const [dataMap, setDataMap] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isPie, setIsPie] = useState(true);
  const [selectedView, setSelectedView] = useState("academic");
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const viewConfig = {
    academic: {
      title: "Appointments Distribution by Academic Program",
      keys: ["UG", "PG", "PHD"],
      colors: ["#048A81", "#FFB703", "#FB8500"],
    },
    gender: {
      title: "Gender Ratio of Appointments",
      keys: ["MALE", "FEMALE", "OTHERS"],
      colors: ["#048A81", "#FFB703", "#FB8500"],
    },
    criticality: {
      title: "Criticality Distribution",
      keys: ["GREEN", "YELLOW", "ORANGE", "RED"],
      colors: ["#16A34A", "#EAB308", "#F97316", "#DC2626"],
    },
  };

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("admin");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/admin/pastApp", {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await response.json();
      if (response.ok) {
        const result = {};
        data.forEach((app) => {
          const doc = app.doc.name.split(" ")[1];
          if (!result[doc]) {
            result[doc] = {
              UG: 0,
              PG: 0,
              PHD: 0,
              MALE: 0,
              FEMALE: 0,
              OTHERS: 0,
              GREEN: 0,
              YELLOW: 0,
              ORANGE: 0,
              RED: 0,
            };
          }
          result[doc][app.user.acadProg] += 1;
          result[doc][app.user.gender] += 1;
          const crit = app.user.criticality?.toUpperCase();
          if (result[doc][crit] !== undefined) {
            result[doc][crit] += 1;
          }

        });
        setDataMap(result);
      } else {
        CustomToast("Error while fetching data", "green");
      }
    } catch (error) {
      CustomToast("Error while fetching data", "green");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (isAuthenticated === null)
    return <CustomLoader color="green" text="Loading your dashboard..." />;

  if (!isAuthenticated)
    return (
      <SessionExpired
        handleClosePopup={() => navigate("/admin/login")}
        theme="green"
      />
    );

  const config = viewConfig[selectedView];

  const barData = Object.keys(dataMap).map((doc) => ({
    name: doc,
    ...config.keys.reduce((acc, key) => {
      acc[key] = dataMap[doc][key] || 0;
      return acc;
    }, {}),
  }));

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[var(--custom-green-50)] to-custom-teal-50">
      <AdminNavbar />
      <ToastContainer />

      <main className="flex-grow p-6 md:p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--custom-green-900)]">
            Dashboard Overview
          </h1>

          <div className="flex items-center gap-4">
            <button
              onClick={fetchAppointments}
              className="p-2 rounded-full hover:bg-[var(--custom-green-100)]"
            >
              <RefreshCw
                className={`w-5 h-5 text-[var(--custom-green-700)] ${isLoading ? "animate-spin" : ""
                  }`}
              />
            </button>

            <div className="relative">
              <select
                onChange={(e) => setIsPie(e.target.value === "pie")}
                value={isPie ? "pie" : "bar"}
                className="appearance-none bg-white pl-8 pr-4 py-2 rounded-lg border border-[var(--custom-green-200)]"
              >
                <option value="pie">Pie Charts</option>
                <option value="bar">Bar Graph</option>
              </select>
              {isPie ? (
                <PieChartIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4" />
              ) : (
                <BarChart3 className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4" />
              )}
            </div>

            <select
              onChange={(e) => setSelectedView(e.target.value)}
              value={selectedView}
              className="appearance-none bg-white px-4 py-2 rounded-lg border border-[var(--custom-green-200)]"
            >
              <option value="academic">Academic Program</option>
              <option value="gender">Gender Ratio</option>
              <option value="criticality">Criticality</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold mb-6 text-[var(--custom-green-800)]">
            {config.title}
          </h2>

          {isPie ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.keys(dataMap).map((doc) => {
                const pieData = config.keys.map((key) => ({
                  name: key,
                  value: dataMap[doc][key] || 0,
                }));
                return (
                  <div
                    key={doc}
                    className="bg-gradient-to-br from-[var(--custom-green-50)] to-[var(--custom-teal-50)] p-6 rounded-xl"
                  >
                    <h3 className="text-xl font-semibold mb-4 text-center">
                      Therapist {doc}
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          innerRadius={60}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {pieData.map((_, i) => (
                            <Cell key={i} fill={config.colors[i]} />
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
          ) : (
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {config.keys.map((key, i) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      fill={config.colors[i]}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </main>

      <Footer color="green" />
    </div>
  );
};

export default AdminDashboard;
