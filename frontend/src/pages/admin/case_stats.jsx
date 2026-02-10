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
  const navigate = useNavigate();
  const reportRef = useRef();

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("admin");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:3000/api/admin/case-stats", {
          headers: { Authorization: "Bearer " + token },
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth("admin").then((auth) => {
      if (auth) fetchStats();
      else navigate("/admin/login");
    });
  }, []);

  const handleReport = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Report-${1}`,
  });

  const handleClosePopup = () => {
    navigate("/admin/login");
  };

  if (isAuthenticated === null || isLoading) {
    return <CustomLoader color="green" text="Loading the case stats..." />;
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="green" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="container mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Doctor Case Analytics
          </h1>
          <button
            onClick={handleReport}
            className="bg-green-600 px-4 py-2 text-white font-bold rounded-2xl"
          >
            Generate Report
          </button>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
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
                  Terminated Cases
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
        </div>

        {/* Chart View */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Case Distribution</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.map((d) => ({ name: d.name, ...d.stats }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="new" name="New" fill="#10B981" />
              <Bar dataKey="open" name="Ongoing" fill="#3B82F6" />
              <Bar dataKey="closed" name="Terminated" fill="#6B7280" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="hidden">
        <Report ref={reportRef} stats={stats} />
      </div>
    </div>
  );
};

export default AdminCaseStats;
