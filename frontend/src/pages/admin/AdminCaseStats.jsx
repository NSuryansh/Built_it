import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/admin/Navbar";
import { checkAuth } from "../../utils/profile";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminCaseStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        setLoading(false);
      }
    };

    checkAuth("admin").then(auth => {
        if(auth) fetchStats();
        else navigate("/admin/login");
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Doctor Case Analytics</h1>
        
        {/* Table View */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Doctor Name</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-green-600">New Cases</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600">Open Cases</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Closed Cases</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-800">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-800 font-medium">{doc.name}</td>
                  <td className="px-6 py-4 text-center text-green-600 font-bold">{doc.stats.new}</td>
                  <td className="px-6 py-4 text-center text-blue-600 font-bold">{doc.stats.open}</td>
                  <td className="px-6 py-4 text-center text-gray-500 font-bold">{doc.stats.closed}</td>
                  <td className="px-6 py-4 text-center font-bold">{doc.stats.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chart View */}
        <div className="bg-white p-6 rounded-xl shadow-md h-96">
            <h2 className="text-xl font-bold mb-4">Case Distribution</h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.map(d => ({name: d.name, ...d.stats}))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="new" name="New" fill="#10B981" />
                    <Bar dataKey="open" name="Open" fill="#3B82F6" />
                    <Bar dataKey="closed" name="Closed" fill="#6B7280" />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminCaseStats;