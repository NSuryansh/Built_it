import React, { useState, useMemo, useEffect } from "react";
import {
  Users,
  Search,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
} from "lucide-react";
import Footer from "../../components/common/Footer";
import DoctorNavbar from "../../components/doctor/Navbar";
import { useNavigate, useSearchParams } from "react-router-dom";
import { checkAuth } from "../../utils/profile";
import SessionExpired from "../../components/common/SessionExpired";
import CustomToast from "../../components/common/CustomToast";
import { ToastContainer } from "react-toastify";
import UserCard from "../../components/doctor/UserCard";
import CustomLoader from "../../components/common/CustomLoader";

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fetched, setfetched] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchParams] = useSearchParams();
  const [searchUsername, setSearchUsername] = useState("");

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("doc");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
    getPastAppointments();
    setSearchUsername(searchParams.get("username"));
  }, []);

  useEffect(() => {
    if (searchUsername) {
      setSearchTerm(searchUsername);
    }
  }, [searchUsername]);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const getPastAppointments = async () => {
    try {
      const docId = localStorage.getItem("userid");
      const response = await fetch(
        `https://built-it.onrender.com/pastdocappt?doctorId=${docId}`,
        { headers: { Authorization: "Bearer " + token } }
      );
      const data = await response.json();
      setFilteredUsers(data);
      setAllUsers(data);
      setfetched(true);
    } catch (e) {
      console.error(e);
      CustomToast("Error fetching past appointments", "blue");
      setfetched(false);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(allUsers);
    } else {
      console.log(searchTerm);
      setFilteredUsers(searchUsers(searchTerm));
    }
  }, [searchTerm, allUsers]);

  const searchUsers = (searchTerm) => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    return allUsers.filter(
      (item) =>
        item.user.username.toLowerCase().includes(lowerSearchTerm) ||
        item.user.email.toLowerCase().includes(lowerSearchTerm)
    );
  };

  const handleClosePopup = () => {
    navigate("/doctor/login");
  };

  if (isAuthenticated === null || fetched === null) {
    return <CustomLoader color="blue" text="Loading your dashboard..." />;
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="blue" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">
      <ToastContainer />
      <DoctorNavbar />

      <main className="max-w-7xl xl:min-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-blue-100/50 overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
                  Patient Directory
                </h2>
              </div>
              <div className="relative w-full sm:w-64 md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search patients by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-black transition-all duration-200 placeholder-gray-400 text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-500">
                  No patients match your search criteria
                </p>
              </div>
            ) : (
              filteredUsers.map((userWithAppointments) => (
                <UserCard
                  key={userWithAppointments.id}
                  userWithAppointments={userWithAppointments}
                />
              ))
            )}
          </div>
        </div>
      </main>
      <div className="mt-auto"></div>
      <Footer color="blue" />
    </div>
  );
};

export default History;
