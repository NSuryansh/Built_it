"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Users,
  Search,
  User,
  GraduationCap,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";
import AdminNavbar from "@/components/admin/Navbar";
import CustomToast from "@/components/common/CustomToast";
import { checkAuth } from "@/utils/profile";
import SessionExpired from "@/components/common/SessionExpired";
import Footer from "@/components/common/Footer";
import CustomLoader from "@/components/common/CustomLoader";
import { useRouter } from "next/navigation";

const Controls = ({
  searchTerm,
  setSearchTerm,
  filterDegree,
  setFilterDegree,
  degrees,
}) => (
  <div className="px-8 py-6 bg-[var(--custom-gray-50)]/50 border-b border-[var(--custom-gray-100)]">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div className="relative flex-1 max-w-lg">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--custom-gray-500)]" />
        <input
          type="text"
          placeholder="Search by name..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--custom-gray-200)] bg-[var(--custom-white)] shadow-sm focus:ring-2 focus:ring-[var(--custom-green-700)] focus:border-transparent transition-all duration-200 hover:border-[var(--custom-gray-300)]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <select
            className="appearance-none pl-4 pr-10 py-3 rounded-xl border border-[var(--custom-gray-200)] bg-[var(--custom-white)] shadow-sm focus:ring-2 focus:ring-[var(--custom-green-700)] focus:border-transparent transition-all duration-200 hover:border-[var(--custom-gray-300)] cursor-pointer"
            value={filterDegree}
            onChange={(e) => setFilterDegree(e.target.value)}
          >
            {degrees.map((degree) => (
              <option key={degree} value={degree}>
                {degree === "all" ? "All Degrees" : degree}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute top-4 right-3 h-4 w-4 text-[var(--custom-gray-500)] pointer-events-none" />
        </div>
      </div>
    </div>
  </div>
);

const DesktopLayout = ({ filteredAndSortedUsers, setSortConfig }) => {
  const handleSort = () => {
    setSortConfig((current) => ({
      key: "appointmentsCount",
      direction: current.direction === "desc" ? "asc" : "desc",
    }));
  };
  return (
    <div className="hidden md:block p-4">
      <div className="overflow-x-auto rounded-xl bg-[var(--custom-white)]">
        <table className="min-w-full divide-y divide-[var(--custom-gray-100)]">
          <thead className="bg-[var(--custom-gray-50)]">
            <tr>
              {["User", "Degree", "Doctors", "Appointments"].map(
                (header, idx) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-sm font-semibold text-[var(--custom-gray-600)] uppercase tracking-wider"
                    onClick={header === "Appointments" ? handleSort : undefined}
                  >
                    <div
                      className={`flex items-center gap-2 ${
                        header === "Appointments"
                          ? "cursor-pointer hover:text-[var(--custom-green-700)]"
                          : ""
                      }`}
                    >
                      {header}
                      {header === "Appointments" && (
                        <ArrowUpDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--custom-gray-100)]">
            {filteredAndSortedUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-[var(--custom-green-50)] transition-all duration-200 group"
              >
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm font-medium text-[var(--custom-gray-900)] group-hover:text-[var(--custom-green-900)]">
                    {user.username}
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm text-[var(--custom-gray-600)]">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--custom-green-100)] text-[var(--custom-green-800)]">
                      {user.acadProg}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm text-[var(--custom-gray-600)] max-w-md truncate">
                    {user.doctors.map((doc) => doc.name).join(", ")}
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm font-semibold text-[var(--custom-green-900)]">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--custom-green-100)]">
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
  );
};

const MobileLayout = ({ filteredAndSortedUsers }) => (
  <div className="space-y-4 p-4 md:hidden">
    {filteredAndSortedUsers.map((user) => (
      <div
        key={user.id}
        className="bg-[var(--custom-white)] rounded-xl shadow-sm border border-[var(--custom-gray-200)] overflow-hidden hover:border-[var(--custom-green-200)] transition-all duration-200"
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-[var(--custom-green-100)] p-2 rounded-full">
                <User className="h-5 w-5 text-[var(--custom-green-700)]" />
              </div>
              <div>
                <h3 className="font-medium text-[var(--custom-gray-900)]">
                  {user.username}
                </h3>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--custom-green-100)] text-[var(--custom-green-800)]">
                    {user.acadProg}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-[var(--custom-green-100)] px-3 py-1 rounded-full">
                <span className="text-sm font-semibold text-[var(--custom-green-900)]">
                  {user.appointmentCount}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--custom-gray-100)]">
            <div className="flex items-center space-x-2 text-sm text-[var(--custom-gray-600)]">
              <GraduationCap className="h-4 w-4" />
              <span className="truncate">
                {user.doctors.map((doc) => doc.name).join(", ")}
              </span>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const AdminUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [userCounts, setUserCounts] = useState([]);
  const [filterDegree, setFilterDegree] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "appointmentsCount",
    direction: "desc",
  });
  const router = useRouter();
  const [fetched, setfetched] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("admin");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:3000/doc_admin/getUsers", {
          headers: { Authorization: "Bearer " + token },
        });
        const data = await res.json();
        setUsersData(data);

        const counts = await Promise.all(
          data.map(async (user) => {
            const userId = user.id;
            try {
              const [countRes, doctorRes] = await Promise.all([
                fetch(
                  `http://localhost:3000/admin/appointments-count?id=${userId}`,
                  {
                    headers: { Authorization: "Bearer " + token },
                  }
                ),
                fetch(
                  `http://localhost:3000/admin/user-doctors?userId=${userId}`,
                  {
                    headers: { Authorization: "Bearer " + token },
                  }
                ),
              ]);

              const countData = await countRes.json();
              const doctorData = await doctorRes.json();
              setfetched(true);
              return {
                userId,
                appointmentCount: countData.count || 0,
                doctors: doctorData.doctors || [],
              };
            } catch (error) {
              console.error(`Failed to fetch data for user ${userId}:`, error);
              CustomToast("Error fetching user", "green");
              setfetched(false);
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
        CustomToast("Error fetching users.", "green");
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

  const handleClosePopup = () => {
    router.replace("/admin/login");
  };

  if (isAuthenticated === null || fetched === null) {
    return <CustomLoader color="green" text={"Loading your dashboard..."} />;
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="green" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--custom-green-50)] to-[var(--custom-green-100)]">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto py-8 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-[var(--custom-white)] rounded-3xl shadow-xl overflow-hidden border border-[var(--custom-green-100)]">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[var(--custom-white)] to-[var(--custom-teal-100)] px-5 py-8 md:px-8 md:py-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
              <svg viewBox="0 0 200 200" className="fill-[var(--custom-white)]">
                <path d="M0 0 L200 200 M200 0 L0 200" strokeWidth="20" />
              </svg>
            </div>
            <div className="flex items-center relative">
              <Users className="h-14 w-14 text-[var(--custom-green-700)] flex-shrink-0" />
              <div className="ml-6">
                <h1 className="text-[var(--custom-green-700)] text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                  Users Overview
                </h1>
                <p className="text-[var(--custom-teal-700)] mt-1 text-lg opacity-90">
                  Administrative Dashboard
                </p>
              </div>
            </div>
          </div>

          <Controls
            filterDegree={filterDegree}
            setFilterDegree={setFilterDegree}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            degrees={degrees}
          />
          <MobileLayout filteredAndSortedUsers={filteredAndSortedUsers} />
          <DesktopLayout
            filteredAndSortedUsers={filteredAndSortedUsers}
            setSortConfig={setSortConfig}
          />
        </div>
      </div>
      <Footer color="green" />
    </div>
  );
};

export default AdminUser;
