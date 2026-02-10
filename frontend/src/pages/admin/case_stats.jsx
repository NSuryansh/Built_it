import React, { useEffect, useRef, useState } from "react";
import AdminNavbar from "../../components/admin/Navbar";
import { checkAuth } from "../../utils/profile";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useReactToPrint } from "react-to-print";
import CustomLoader from "../../components/common/CustomLoader";
import SessionExpired from "../../components/common/SessionExpired";
import { Report } from "../../utils/report";

const AdminCaseStats = () => {
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [timeframe, setTimeframe] = useState("this-week");
  const navigate = useNavigate();
  const reportRef = useRef();

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("admin");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/admin/case-stats?period=${timeframe}`,
        {
          headers: { Authorization: "Bearer " + token },
        },
      );
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [timeframe ]);

  const handleReport = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Case-Report-${timeframe}`,
  });

  const handleClosePopup = () => navigate("/admin/login");

  if (isAuthenticated === null || (isLoading && stats.length === 0)) {
    return <CustomLoader color="green" text="Loading the case stats..." />;
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="green" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Doctor Case Analytics
          </h1>

          <div className="flex items-center gap-4">
            {/* Timeframe Dropdown */}
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer"
            >
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
              <option value="past-month">Past Month</option>
              <option value="last-3-months">Last 3 Months</option>
              <option value="last-6-months">Last 6 Months</option>
              <option value="last-12-months">Last 12 Months</option>
              <option value="all-time">All Time</option>
            </select>

            <button
              onClick={handleReport}
              className="bg-green-600 hover:bg-green-700 transition-colors px-4 py-2 text-white font-bold rounded-2xl shadow-md"
            >
              Generate Report
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
          {isLoading ? (
            <div className="p-10 text-center text-gray-500">
              Updating statistics...
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Doctor Name
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-green-600">
                    New Cases
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600">
                    Ongoing Cases
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                    Terminated
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-800">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {doc.name}
                    </td>
                    <td className="px-6 py-4 text-center text-green-600 font-bold">
                      {doc.stats.new}
                    </td>
                    <td className="px-6 py-4 text-center text-blue-600 font-bold">
                      {doc.stats.open}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-500 font-bold">
                      {doc.stats.closed}
                    </td>
                    <td className="px-6 py-4 text-center font-bold">
                      {doc.stats.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Chart View */}
        <div className="bg-white p-6 rounded-xl shadow-md h-128">
          <h2 className="text-xl font-bold mb-4 text-gray-700">
            Case Distribution ({timeframe.replace(/-/g, " ")})
          </h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.map((d) => ({ name: d.name, ...d.stats }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{ fill: "#F3F4F6" }} />
                <Legend />
                <Bar
                  dataKey="new"
                  name="New"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="open"
                  name="Ongoing"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="closed"
                  name="Terminated"
                  fill="#6B7280"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Hidden Report Container */}
      <div className="hidden">
        {/* <Report ref={reportRef} stats={stats} timeframe={timeframe} /> */}
      </div>
    </div>
  );
};

export default AdminCaseStats;
