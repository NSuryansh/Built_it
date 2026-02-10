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
import { Loader } from "lucide-react";

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
  }, [timeframe, isAuthenticated]);

  const handleReport = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Case-Report-${timeframe}`,
  });

  const handleClosePopup = () => navigate("/admin/login");

  const aggregateTotals = () => {
    return stats.reduce(
      (acc, doc) => ({
        new: acc.new + (doc.stats.status?.NEW || 0),
        open: acc.open + (doc.stats.status?.OPEN || 0),
        closed: acc.closed + (doc.stats.status?.CLOSED || 0),
        total: acc.total + (doc.stats.total || 0),
      }),
      { new: 0, open: 0, closed: 0, total: 0 },
    );
  };

  const summary = aggregateTotals();

  if (isAuthenticated === null || (isLoading && stats.length === 0)) {
    return <CustomLoader color="green" text="Loading analytics..." />;
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="green" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <AdminNavbar />
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Therapist Case Analytics
            </h1>
            <p className="text-gray-500 mt-1">
              Monitoring consultation loads and case statuses
            </p>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 outline-none cursor-pointer"
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

            <button
              onClick={handleReport}
              className="bg-green-600 hover:bg-green-700 transition-colors px-6 py-2 text-white font-bold rounded-xl shadow-md"
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* Summary Mini Cards */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-4 flex gap-3 font-bold text-gray-500 items-center justify-center mb-8">
            Updating Statistics... <Loader />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[
                {
                  label: "Total Cases",
                  val: summary.total,
                  color: "text-gray-800",
                },
                {
                  label: "New Requests",
                  val: summary.new,
                  color: "text-green-600",
                },
                { label: "Ongoing", val: summary.open, color: "text-blue-600" },
                {
                  label: "Terminated",
                  val: summary.closed,
                  color: "text-gray-500",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500"
                >
                  <p className="text-sm text-gray-500 uppercase font-semibold">
                    {item.label}
                  </p>
                  <p className={`text-2xl font-black ${item.color}`}>
                    {item.val}
                  </p>
                </div>
              ))}
            </div>

            {/* Table View */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <table className="hidden md:table min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                      Therapist
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-green-600 uppercase">
                      New
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-blue-600 uppercase">
                      Ongoing
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">
                      Terminated
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-800 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.map((doc) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-green-50/30 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">
                          {doc.name}
                        </div>
                        <div className="text-xs text-gray-400">{doc.email}</div>
                      </td>
                      <td className="px-6 py-4 text-center text-green-600 font-bold">
                        {doc.stats.status.NEW}
                      </td>
                      <td className="px-6 py-4 text-center text-blue-600 font-bold">
                        {doc.stats.status.OPEN}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-400 font-bold">
                        {doc.stats.status.CLOSED}
                      </td>
                      <td className="px-6 py-4 text-center font-black text-gray-900">
                        {doc.stats.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Card View (Visible on mobile, hidden on MD screens and up) */}
              <div className="md:hidden divide-y divide-gray-100">
                {stats.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 hover:bg-green-50/30 transition"
                  >
                    {/* Header: Name and Email */}
                    <div className="mb-4">
                      <div className="font-bold text-gray-800 text-lg">
                        {doc.name}
                      </div>
                      <div className="text-sm text-gray-400">{doc.email}</div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <p className="text-[10px] font-bold text-green-600 uppercase">
                          New
                        </p>
                        <p className="text-lg font-bold text-green-700">
                          {doc.stats.status.NEW}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <p className="text-[10px] font-bold text-blue-600 uppercase">
                          Ongoing
                        </p>
                        <p className="text-lg font-bold text-blue-700">
                          {doc.stats.status.OPEN}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <p className="text-[10px] font-bold text-gray-500 uppercase">
                          Terminated
                        </p>
                        <p className="text-lg font-bold text-gray-600">
                          {doc.stats.status.CLOSED}
                        </p>
                      </div>
                      <div className="bg-green-100 p-2 rounded-lg">
                        <p className="text-[10px] font-bold text-gray-800 uppercase">
                          Total
                        </p>
                        <p className="text-lg font-black text-gray-900">
                          {doc.stats.total}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Chart View */}
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-6 text-gray-700">
            Visual Workload Distribution
          </h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.map((d) => ({
                  name: d.name,
                  new: d.stats.status.NEW,
                  open: d.stats.status.OPEN,
                  closed: d.stats.status.CLOSED,
                }))}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "#f9fafb" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend iconType="circle" />
                <Bar
                  dataKey="new"
                  name="New Cases"
                  fill="#10B981"
                  radius={[6, 6, 0, 0]}
                  barSize={30}
                />
                <Bar
                  dataKey="open"
                  name="Ongoing"
                  fill="#3B82F6"
                  radius={[6, 6, 0, 0]}
                  barSize={30}
                />
                <Bar
                  dataKey="closed"
                  name="Terminated"
                  fill="#9CA3AF"
                  radius={[6, 6, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCaseStats;
