import React, { useState, useMemo, useEffect } from "react";
import { Users, Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
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
    <div className="min-h-screen font-poppins bg-[var(--custom-primary-green-50)]">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-[var(--custom-primary-green-200)] rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-[var(--custom-primary-green-900)] px-6 py-8">
            <div className="flex items-center">
              <Users className="h-12 w-12 text-white" />
              <div className="ml-4">
                <h1 className="text-2xl font-semibold text-white">
                  Users Overview
                </h1>
                <p className="text-green-100">Administrative Dashboard</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--custom-primary-green-900)] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-gray-500" />
                  <select
                    className="rounded-lg border border-gray-300 py-2 px-4 focus:ring-2 focus:ring-[var(--custom-primary-green-900)] focus:border-transparent"
                    value={filterDegree}
                    onChange={(e) => setFilterDegree(e.target.value)}
                  >
                    {degrees.map((degree) => (
                      <option key={degree} value={degree}>
                        {degree === "all" ? "All Degrees" : degree}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Degree
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctors
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={handleSort}
                  >
                    <div className="flex items-center gap-2">
                      Appointments
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {user.acadProg}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {user.doctors.map((doc) => doc.name).join(", ")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[var(--custom-primary-green-900)]">
                        {user.appointmentCount}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer color="green" />
    </div>
  );
};

export default User;
