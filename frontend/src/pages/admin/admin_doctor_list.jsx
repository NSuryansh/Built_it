import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserMinus,
  UserPlus,
  Search,
  Filter,
  RefreshCw,
  Stethoscope,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  StarIcon,
} from "lucide-react";
import AdminNavbar from "../../components/admin/admin_navbar";
import Footer from "../../components/Footer";
import PacmanLoader from "react-spinners/PacmanLoader";
import { checkAuth } from "../../utils/profile";
import { ToastContainer } from "react-toastify";
import CustomToast from "../../components/CustomToast";
import DeletePopup from "../../components/admin/DeletePopup";
import SessionExpired from "../../components/SessionExpired";

const DoctorsList = () => {
  const [doctors, setDoc] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [docId, setDocId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetched, setfetched] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("admin");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://localhost:3000/getdoctors", {
          headers: { Authorization: "Bearer " + token },
        });
        const resp = await res.json();
        setDoc(resp);
        setfetched(true);
      } catch (e) {
        console.error(e);
        CustomToast("Error fetching doctors", "green");
        setfetched(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleDelete = async (doctorId) => {
    try {
      const res = await fetch("http://localhost:3000/deletedoc", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ doctorID: doctorId }),
      });
      const resp = await res.json();
      setDoc((prevDoctors) =>
        prevDoctors.filter((doctor) => doctor.id !== doctorId)
      );
      CustomToast("Doctor removed successfully", "green");
      setDeletePopupOpen(false);
    } catch (error) {
      console.error("Error deleting doctor:", error);
      CustomToast("Error while fetching data", "green");
    }
  };

  const handleDeletePopup = (doctorId, isOpen) => {
    if (isOpen == true) {
      setDeletePopupOpen(true);
      setDocId(doctorId);
    } else {
      setDeletePopupOpen(false);
    }
  };

  const handleClosePopup = () => {
    navigate("/admin/login");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const res = await fetch("http://localhost:3000/getdoctors", {
      headers: { Authorization: "Bearer " + token },
    });
    const resp = await res.json();
    setDoc(resp);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isAuthenticated === null || fetched === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="relative">
          <PacmanLoader color="#047857" size={30} />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-200/20 to-transparent animate-pulse"></div>
        </div>
        <p className="mt-4 text-emerald-800 font-medium animate-pulse">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="green" />;
  }

  return (
    <div
      className={`flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100`}
    >
      <AdminNavbar />
      <ToastContainer />

      <div className="w-full max-w-7xl mx-auto p-6 space-y-10">
        {/* Header with Enhanced Styling */}
        <div className="relative overflow-hidden bg-gradient-to-r from-white to-emerald-100 rounded-3xl shadow-2xl p-8 mb-12">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
          <div className="relative flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-green-700 mb-2 tracking-tight">
                Doctors Directory
              </h1>
              <p className="text-emerald-700 text-md md:text-lg">
                Managing {doctors.length} Healthcare Professionals
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleRefresh}
                className={`p-3 bg-white hover:scale-105 shadow-sm hover:shadow-md hover:bg-white/80 rounded-xl transition-all duration-300 text-green-700 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
                title="Refresh List"
              >
                <RefreshCw size={24} />
              </button>
              <Link
                to="/admin/add_doctor"
                className="inline-flex items-center gap-2 bg-white text-green-700 font-semibold px-3 py-1.5 md:px-6 md:py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-102 hover:bg-white/80"
              >
                <UserPlus size={20} />
                Add Doctor
              </Link>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name, specialty, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all duration-300">
              <Filter size={20} className="text-gray-500" />
              <span className="text-gray-700">Filters</span>
            </button>
          </div>
        </div>

        {/* Enhanced Table View for Desktop */}
        <div className="hidden md:block overflow-hidden bg-white rounded-3xl shadow-xl border border-green-100 animate-fade-in-up">
          <table className="w-full text-sm text-left">
            <thead className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-900 font-semibold">
              <tr>
                <th className="px-6 py-5">Name</th>
                <th className="px-6 py-5">Rating</th>
                <th className="px-6 py-5">Email</th>
                <th className="px-6 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-50">
              {filteredDoctors.map((doctor) => (
                <tr
                  key={doctor.id}
                  className="hover:bg-green-50/50 transition-colors duration-300"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-200 to-emerald-300 flex items-center justify-center">
                        <Stethoscope size={20} className="text-green-700" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {doctor.name}
                        </div>
                        {/* <div className="text-xs text-gray-500">ID: {doctor.id}</div> */}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex">
                      <span className="px-1 py-1 rounded-full text-sm font-medium text-green-700">
                        {parseFloat(doctor.avgRating).toPrecision(2)}
                      </span>
                      <div>
                        <StarIcon
                          fill="#ff7700"
                          className="text-[var(--custom-primary-orange)]"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{doctor.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-5">
                      <button
                        onClick={() => handleDeletePopup(doctor.id, true)}
                        className="p-2 text-red-600 hover:text-red-700 transition-colors rounded-full hover:bg-red-50 group relative"
                        title="Set Doctor Inactive"
                      >
                        <UserMinus size={18} />
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Set Inactive
                        </span>
                      </button>
                      <Link
                        to={`/admin/doctor_profile?id=${doctor.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors duration-300"
                        title="View Profile"
                      >
                        <span className="text-center">View Profile</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Enhanced Mobile Card View */}
        <div className="md:hidden space-y-6">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="backdrop-blur-sm bg-white/90 border border-green-100 rounded-2xl shadow-lg p-6 space-y-4 animate-fade-in-up hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-200 to-emerald-300 flex items-center justify-center">
                    <Stethoscope size={24} className="text-green-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {doctor.name}
                    </h3>
                    <div className="flex">
                      <span className="pr-2 py-1 rounded-full text-sm font-medium text-green-700">
                        {parseFloat(doctor.avgRating).toPrecision(2)}
                      </span>
                      <div>
                        <StarIcon
                          fill="#ff7700"
                          className="text-[var(--custom-primary-orange)]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDeletePopup(doctor.id, true)}
                    className="p-2 text-red-600 hover:text-red-700 transition-colors rounded-full hover:bg-red-50"
                  >
                    <UserMinus size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-green-100">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={16} className="text-green-600" />
                  <span>{doctor.email}</span>
                </div>
                <Link
                  to={`/admin/doctor_profile?id=${doctor.id}`}
                  className="block w-full text-center py-3 mt-4 rounded-xl bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition-all duration-300"
                >
                  View Full Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {deletePopupOpen && (
        <DeletePopup
          docId={docId}
          handleDeletePopup={handleDeletePopup}
          handleDelete={handleDelete}
          text={"Are you sure you want to remove the doctor?"}
        />
      )}

      <div className="mt-auto"></div>
      <Footer color="green" />
    </div>
  );
};

export default DoctorsList;