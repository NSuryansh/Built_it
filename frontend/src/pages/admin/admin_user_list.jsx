import React, { useState, useMemo, useEffect } from "react";
import { Users, Search, SlidersHorizontal, ArrowUpDown , ChevronDown} from "lucide-react";
import AdminNavbar from "../../components/admin/admin_navbar";

import Footer from "../../components/Footer";

const User = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [userCounts, setUserCounts] = useState([]);
  const [filterDegree, setFilterDegree] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "appointmentsCount",
    direction: "desc",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://built-it-backend.onrender.com/getUsers");
        const data = await res.json();
        setUsersData(data);

        const counts = await Promise.all(
          data.map(async (user) => {
            const userId = user.id;
            try {
              const [countRes, doctorRes] = await Promise.all([
                fetch(`https://built-it-backend.onrender.com/appointments-count?id=${userId}`),
                fetch(`https://built-it-backend.onrender.com/user-doctors?userId=${userId}`),
              ]);

              const countData = await countRes.json();
              const doctorData = await doctorRes.json();

              return {
                userId,
                appointmentCount: countData.count || 0,
                doctors: doctorData.doctors || [],
              };
            } catch (error) {
              console.error(`Failed to fetch data for user ${userId}:`, error);
              return {
                userId,
                appointmentCount: 0,
                doctors: [],
              };
            }
          })
        );

        setUserCounts(counts);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchData();
  }, []);

  const degrees = useMemo(
    () => ["all", ...new Set(usersData.map((user) => user.acadProg))],
    [usersData]
  );

  const filteredAndSortedUsers = useMemo(() => {
    return usersData
      .map((user) => {
        const userData = userCounts.find((u) => u.userId === user.id);
        return {
          ...user,
          appointmentCount: userData?.appointmentCount || 0,
          doctors: userData?.doctors || [],
          degree: user.acadProg,
        };
      })
      .filter((user) => {
        const matchesSearch =
          user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.doctors.some((doc) =>
            doc.name?.toLowerCase().includes(searchTerm.toLowerCase())
          );

        const matchesDegree =
          filterDegree === "all" || user.degree === filterDegree;

        return matchesSearch && matchesDegree;
      })
      .sort((a, b) => {
        if (sortConfig.key === "appointmentsCount") {
          return sortConfig.direction === "desc"
            ? b.appointmentCount - a.appointmentCount
            : a.appointmentCount - b.appointmentCount;
        }
        return 0;
      });
  }, [usersData, userCounts, searchTerm, filterDegree, sortConfig]);

  const handleSort = () => {
    setSortConfig((current) => ({
      key: "appointmentsCount",
      direction: current.direction === "desc" ? "asc" : "desc",
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-10">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[var(--custom-primary-green-100)]">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-white to-emerald-100 px-8 py-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
              <svg viewBox="0 0 200 200" className="fill-white">
                <path d="M0 0 L200 200 M200 0 L0 200" strokeWidth="20"/>
              </svg>
            </div>
            <div className="flex items-center relative z-10">
              <Users className="h-14 w-14 text-green-700 flex-shrink-0" />
              <div className="ml-6">
                <h1 className="text-green-700 text-3xl font-bold tracking-tight">
                  Users Overview
                </h1>
                <p className="text-emerald-700 mt-1 text-lg opacity-90">
                  Administrative Dashboard
                </p>
              </div>
            </div>
          </div>
  
          {/* Controls Section */}
          <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-[var(--custom-primary-green-700)] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <select
                    className="appearance-none pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-[var(--custom-primary-green-700)] focus:border-transparent transition-all duration-200 hover:border-gray-300 cursor-pointer"
                    value={filterDegree}
                    onChange={(e) => setFilterDegree(e.target.value)}
                  >
                    {degrees.map((degree) => (
                      <option key={degree} value={degree}>
                        {degree === "all" ? "All Degrees" : degree}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute top-4 right-3 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
  
          {/* Table Section */}
          <div className="p-4">
            <div className="overflow-x-auto rounded-xl bg-white">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    {["User", "Degree", "Doctors", "Appointments"].map((header, idx) => (
                      <th 
                        key={header}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
                        onClick={header === "Appointments" ? handleSort : undefined}
                      >
                        <div className={`flex items-center gap-2 ${header === "Appointments" ? "cursor-pointer hover:text-[var(--custom-primary-green-700)]" : ""}`}>
                          {header}
                          {header === "Appointments" && <ArrowUpDown className="h-4 w-4" />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAndSortedUsers.map((user) => (
                    <tr 
                      key={user.id}
                      className="hover:bg-[var(--custom-primary-green-50)] transition-all duration-200 group"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 group-hover:text-[var(--custom-primary-green-900)]">
                          {user.username}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--custom-primary-green-100)] text-[var(--custom-primary-green-800)]">
                            {user.acadProg}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm text-gray-600 max-w-md truncate">
                          {user.doctors.map((doc) => doc.name).join(", ")}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm font-semibold text-[var(--custom-primary-green-900)]">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--custom-primary-green-100)]">
                            {user.appointmentCount}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer color="green" />
    </div>
  );
};

export default User;
