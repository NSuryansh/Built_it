import React, { useState, useMemo } from "react";
import { Users, Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import AdminNavbar from "../../components/admin/admin_navbar";
import Footer from "../../components/Footer";

const fetchUsers = async () => {
  const res = await fetch("http://localhost:3000/getUsers");
  const userData = await res.json();
  return userData;
};

const fetchUserAppointmentData = async (usersData) => {
  const result = await Promise.all(
    usersData.map(async (user) => {
      const userId = user.id;

      try {
        // Fetch appointment count
        const countRes = await fetch(
          `http://localhost:3000/appointments-count?id=${userId}`
        );
        const countData = await countRes.json();
        const appointmentCount = countData.count || 0;

        // Fetch doctors
        const doctorRes = await fetch(
          `http://localhost:3000/user-doctors?userId=${userId}`
        );
        const doctorData = await doctorRes.json();
        const doctors = doctorData.doctors || [];

        // Combine results
        return {
          userId,
          appointmentCount,
          doctors,
        };
      } catch (err) {
        console.error(`Error fetching data for user ${userId}:`, err);
        return {
          userId,
          appointmentCount: 0,
          doctors: [],
        };
      }
    })
  );

  return result;
};

const usersData = await fetchUsers();
console.log("ALL DA USERS R: ", usersData);
const userCounts = await fetchUserAppointmentData(usersData);
console.log(userCounts);

function User() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDegree, setFilterDegree] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "appointmentsCount",
    direction: "desc",
  });

  // Get unique degrees for filter dropdown
  const degrees = useMemo(() => {
    return ["all", ...new Set(usersData.map((user) => user.acadProg))];
  }, []);

  console.log("HAHAHAHAHHA I AM WORKING", usersData);
  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    return usersData
      .map((user) => {
        const userData = userCounts.find((u) => u.id === user.id);
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
            doc.toLowerCase().includes(searchTerm.toLowerCase())
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

  const filteredUserCounts = useMemo(() => {
    return userCounts.filter((uc) =>
      filteredAndSortedUsers.some((user) => user.id === uc.userId)
    );
  }, [userCounts, filteredAndSortedUsers]);

  console.log("IAM NORMAL STUFF", userCounts);
  console.log("IAM FILTERED STUFF", filteredAndSortedUsers);
  console.log("IAM FILTERED counts wowoow", filteredUserCounts);

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
          {/* Header */}
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

          {/* Search and Filters */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or doctor..."
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Degree
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Doctors
                  </th>
                  <th
                    scope="col"
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
                        {filteredUserCounts
                          .find((item) => item.userId === user.id)
                          .doctors.map((doc) => doc.name)
                          .join(", ")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[var(--custom-primary-green-900)]">
                        {
                          filteredUserCounts.find(
                            (item) => item.userId === user.id
                          ).appointmentCount
                        }
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
}

export default User;
