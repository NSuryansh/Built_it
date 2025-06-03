"use client";

import React, { useEffect, useState } from "react";
import {
  UserMinus,
  UserPlus,
  Search,
  Filter,
  RefreshCw,
  Stethoscope,
  Mail,
  StarIcon,
} from "lucide-react";
import AdminNavbar from "@/components/admin/Navbar";
import Footer from "@/components/common/Footer";
import { checkAuth } from "@/utils/profile";
import { ToastContainer } from "react-toastify";
import CustomToast from "@/components/common/CustomToast";
import DeletePopup from "@/components/admin/DeletePopup";
import SessionExpired from "@/components/common/SessionExpired";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CustomLoader from "@/components/common/CustomLoader";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [toggleDocPopupOpen, setToggleDocPopupOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetched, setfetched] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("admin");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  const fetchDoctors = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "http://localhost:3000/user_admin/getdoctors?user_type=admin",
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      const resp = await res.json();
      setDoctors(resp);
      setfetched(true);
    } catch (e) {
      console.error(e);
      CustomToast("Error fetching doctors", "green");
      setfetched(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleToggleDoc = async (doctor) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3000/admin/toggleDoc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          doctorID: doctor.id,
          isInactive: doctor.isInactive,
        }),
      });
      const resp = await res.json();
      await fetchDoctors();
      if (res.ok) {
        if (doctor.isInactive) {
          CustomToast("Doctor activated successfully", "green");
        } else {
          CustomToast("Doctor deactivated successfully", "green");
        }
      } else {
        CustomToast("Error updating doctor", "green");
      }
      setToggleDocPopupOpen(false);
    } catch (error) {
      console.error(error);
      CustomToast("Error updating doctor", "green");
    }
  };

  const handleToggleDocPopup = (doctor, isOpen) => {
    if (isOpen == true) {
      setToggleDocPopupOpen(true);
      setSelectedDoc(doctor);
    } else {
      setToggleDocPopupOpen(false);
    }
  };

  const handleClosePopup = () => {
    router.replace("/admin/login");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDoctors();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isAuthenticated === null || fetched === null) {
    return <CustomLoader color="green" text="Loading your dashboard..." />;
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="green" />;
  }

  return (
    <div
      className={`flex flex-col min-h-screen bg-gradient-to-br from-custom-green-50 via-custom-white to-custom-green-100`}
    >
      <AdminNavbar />
      <ToastContainer />

      <div className="w-full max-w-7xl mx-auto p-6 space-y-10">
        {/* Header with Enhanced Styling */}
        <div className="relative overflow-hidden bg-gradient-to-r from-custom-white to-custom-teal-100 rounded-3xl shadow-2xl p-8 mb-12">
          <div className="absolute inset-0 bg-grid-custom-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
          <div className="relative flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-custom-green-700 mb-2 tracking-tight">
                Doctors Directory
              </h1>
              <p className="text-custom-teal-700 text-md md:text-lg">
                Managing {doctors.length} Healthcare Professionals
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleRefresh}
                className={`p-3 bg-custom-white hover:scale-105 shadow-sm hover:shadow-md hover:bg-custom-white/80 rounded-xl transition-all duration-300 text-custom-green-700 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
                title="Refresh List"
              >
                <RefreshCw size={24} />
              </button>
              <Link
                href="/admin/add_doctor"
                className="inline-flex items-center gap-2 bg-custom-white text-custom-green-700 font-semibold px-3 py-1.5 md:px-6 md:py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-102 hover:bg-custom-white/80"
              >
                <UserPlus size={20} />
                Add Doctor
              </Link>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-custom-white rounded-2xl shadow-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-custom-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name, specialty, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-custom-gray-200 focus:ring-2 focus:ring-custom-green-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-custom-gray-200 hover:border-custom-green-500 hover:bg-custom-green-50 transition-all duration-300">
              <Filter size={20} className="text-custom-gray-500" />
              <span className="text-custom-gray-700">Filters</span>
            </button>
          </div>
        </div>

        {/* Enhanced Table View for Desktop */}
        <div className="hidden md:block overflow-hidden bg-custom-white rounded-3xl shadow-xl border border-custom-green-100 animate-fade-in-up">
          <table className="w-full text-sm text-left">
            <thead className="bg-gradient-to-r from-custom-green-100 to-custom-teal-100 text-custom-green-900 font-semibold">
              <tr>
                <th className="px-6 py-5">Name</th>
                <th className="px-6 py-5">Rating</th>
                <th className="px-6 py-5">Email</th>
                <th className="px-6 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-custom-green-50">
              {filteredDoctors.map((doctor) => (
                <tr
                  key={doctor.id}
                  className="hover:bg-custom-green-50/50 transition-colors duration-300"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-custom-green-200 to-custom-teal-300 flex items-center justify-center">
                        <Stethoscope size={20} className="text-custom-green-700" />
                      </div>
                      <div>
                        <div className="font-semibold text-custom-gray-900">
                          {doctor.name}
                        </div>
                        {/* <div className="text-xs text-custom-gray-500">ID: {doctor.id}</div> */}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex">
                      <span className="px-1 py-1 rounded-full text-sm font-medium text-custom-green-700">
                        {parseFloat(doctor.avgRating).toPrecision(2)}
                      </span>
                      <div>
                        <StarIcon
                          fill="#ff7700"
                          className="text-custom-orange-500"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-custom-gray-600">{doctor.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-5">
                      <button
                        onClick={() => handleToggleDocPopup(doctor, true)}
                        className={`p-2 ${
                          doctor.isInactive
                            ? "text-custom-green-600 hover:text-custom-green-700"
                            : "text-custom-red-600 hover:text-custom-red-700"
                        } transition-colors rounded-full hover:bg-custom-red-50 group relative`}
                        title="Set Doctor Inactive"
                      >
                        {doctor.isInactive ? (
                          <UserPlus size={18} />
                        ) : (
                          <UserMinus size={18} />
                        )}
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-custom-gray-800 text-custom-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {doctor.isInactive ? (
                            <div>Set Active</div>
                          ) : (
                            <div>Set Inactive</div>
                          )}
                        </span>
                      </button>
                      <Link
                        href={`/admin/doctor_profile?id=${doctor.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-custom-green-100 text-custom-green-700 hover:bg-custom-green-200 transition-colors duration-300"
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
              className="backdrop-blur-sm bg-custom-white/90 border border-custom-green-100 rounded-2xl shadow-lg p-6 space-y-4 animate-fade-in-up hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-custom-green-200 to-custom-teal-300 flex items-center justify-center">
                    <Stethoscope size={24} className="text-custom-green-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-custom-gray-900">
                      {doctor.name}
                    </h3>
                    <div className="flex">
                      <span className="pr-2 py-1 rounded-full text-sm font-medium text-custom-green-700">
                        {parseFloat(doctor.avgRating).toPrecision(2)}
                      </span>
                      <div>
                        <StarIcon
                          fill="#ff7700"
                          className="text-custom-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleToggleDocPopup(doctor, true)}
                    className={`p-2 ${
                      doctor.isInactive
                        ? "text-custom-green-600 hover:text-custom-green-700"
                        : "text-custom-red-600 hover:text-custom-red-700"
                    } transition-colors rounded-full hover:bg-custom-red-50`}
                  >
                    {doctor.isInactive ? (
                      <UserPlus size={20} />
                    ) : (
                      <UserMinus size={20} />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-custom-green-100">
                <div className="flex items-center gap-2 text-custom-gray-600">
                  <Mail size={16} className="text-custom-green-600" />
                  <span>{doctor.email}</span>
                </div>
                <Link
                  href={`/admin/doctor_profile?id=${doctor.id}`}
                  className="block w-full text-center py-3 mt-4 rounded-xl bg-custom-green-100 text-custom-green-700 font-semibold hover:bg-custom-green-200 transition-all duration-300"
                >
                  View Full Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {toggleDocPopupOpen && (
        <DeletePopup
          doc={selectedDoc}
          handleToggleDocPopup={handleToggleDocPopup}
          handleToggleDoc={handleToggleDoc}
          text={
            selectedDoc.isInactive
              ? "Are you sure you want to activate the doctor?"
              : "Are you sure you want to deactivate the doctor?"
          }
        />
      )}

      <div className="mt-auto"></div>
      <Footer color="green" />
    </div>
  );
};

export default DoctorsList;
