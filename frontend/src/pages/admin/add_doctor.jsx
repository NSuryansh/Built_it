import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { checkAuth } from "../../utils/profile";
import AdminNavbar from "../../components/admin/Navbar";
import SessionExpired from "../../components/common/SessionExpired";
import CustomToast from "../../components/common/CustomToast";
import { ToastContainer } from "react-toastify";
import CustomLoader from "../../components/common/CustomLoader";
import { ChevronDown, X } from "lucide-react";

const AddDoctor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    regId: "",
    desc: "",
    weekOffs: [],
  });
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const token = localStorage.getItem("token");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("admin");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDay = (day) => {
    const currentDays = formData.weekOffs || [];
    const updatedDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];

    setFormData({ ...formData, weekOffs: updatedDays });
  };

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  // In add_doctor.jsx

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, mobile, password, regId, desc, weekOffs } = formData;

    try {
      const res = await fetch("http://localhost:3000/api/admin/addDoc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          name: name,
          mobile: mobile,
          email: email,
          password: password,
          reg_id: regId,
          desc: desc,
          weekOff: weekOffs,
          address: "<Please Change>",
          office_address: "<Please Change>",
          experience: "<Please Change>",
          img: "",
        }),
      });

      const resp = await res.json();

      // ✅ CRITICAL FIX: Check if the request failed
      if (!res.ok || resp.error) {
        CustomToast(resp.error || "Failed to add therapist", "red"); // Show RED error
        console.error("Server Error:", resp);
        return; // Stop here, do not redirect
      }

      // Only run this if success
      CustomToast("Therapist Added Successfully", "green");
      navigate("/admin/doctor_list");
    } catch (e) {
      console.error(e);
      CustomToast("Network connection failed", "red");
    }
  };

  const handleClosePopup = () => {
    navigate("/admin/login");
  };

  if (isAuthenticated === null) {
    return <CustomLoader color="green" text="Loading your dashboard..." />;
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="green" />;
  }

  return (
    <div className="bg-[var(--custom-green-50)] min-h-screen flex flex-col">
      <AdminNavbar />
      <ToastContainer />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--custom-green-900)] mb-8 text-center">
            Add New Therapist
          </h1>

          <div className="bg-[var(--custom-white)] p-6 sm:p-8 rounded-xl shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-[var(--custom-green-900)]"
                  >
                    Full Name{" "}
                    <span className="text-[var(--custom-red-500)]">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Therapist's full name"
                    className="w-full px-4 py-2 border border-[var(--custom-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-green-500)] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[var(--custom-green-900)]"
                  >
                    Email{" "}
                    <span className="text-[var(--custom-red-500)]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="therapist@example.com"
                    className="w-full px-4 py-2 border border-[var(--custom-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-green-500)] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-[var(--custom-green-900)]"
                  >
                    Phone Number{" "}
                    <span className="text-[var(--custom-red-500)]">*</span>
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-2 border border-[var(--custom-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-green-500)] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="regId"
                    className="block text-sm font-medium text-[var(--custom-green-900)]"
                  >
                    Registration ID{" "}
                    <span className="text-[var(--custom-red-500)]">*</span>
                  </label>
                  <input
                    type="text"
                    id="regId"
                    name="regId"
                    value={formData.regId}
                    onChange={handleChange}
                    placeholder="Enter registration ID"
                    className="w-full px-4 py-2 border border-[var(--custom-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-green-500)] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2" ref={dropdownRef}>
                <label className="block text-sm font-medium text-[var(--custom-green-900)]">
                  WeekOffs{" "}
                  <span className="text-[var(--custom-red-500)]">*</span>
                </label>

                <div className="relative">
                  <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="min-h-[42px] w-full px-3 py-1.5 border border-[var(--custom-green-200)] rounded-lg bg-white cursor-pointer flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-[var(--custom-green-500)] transition-all duration-200"
                  >
                    {formData.weekOffs && formData.weekOffs.length > 0 ? (
                      formData.weekOffs.map((day) => (
                        <span
                          key={day}
                          className="flex items-center gap-1 px-2 py-0.5 bg-[var(--custom-green-100)] text-[var(--custom-green-800)] text-xs font-semibold rounded-md border border-[var(--custom-green-200)]"
                        >
                          {day}
                          <X
                            size={12}
                            className="cursor-pointer hover:text-[var(--custom-red-500)]"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDay(day);
                            }}
                          />
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Select off days...
                      </span>
                    )}

                    <ChevronDown
                      size={18}
                      className={`ml-auto text-[var(--custom-green-600)] transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-white border border-[var(--custom-green-200)] rounded-lg shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100">
                      {daysOfWeek.map((day) => {
                        const isSelected = formData.weekOffs?.includes(day);
                        return (
                          <div
                            key={day}
                            onClick={() => toggleDay(day)}
                            className={`px-4 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors ${
                              isSelected
                                ? "bg-[var(--custom-green-50)] text-[var(--custom-green-800)] font-medium"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {day}
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-[var(--custom-green-500)]" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="desc"
                  className="block text-sm font-medium text-[var(--custom-green-900)]"
                >
                  Description{" "}
                  <span className="text-[var(--custom-red-500)]">*</span>
                </label>
                <textarea
                  id="desc"
                  name="desc"
                  value={formData.desc}
                  onChange={handleChange}
                  placeholder="Enter Therapist's specialization and details"
                  rows="3"
                  className="w-full px-4 py-2 border border-[var(--custom-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-green-500)] focus:border-transparent transition-all duration-200 resize-y"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[var(--custom-green-900)]"
                >
                  Password{" "}
                  <span className="text-[var(--custom-red-500)]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter a strong password"
                    className="w-full px-4 py-2 border border-[var(--custom-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-green-500)] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/admin/doctor_list")}
                  className="px-6 py-2 bg-[var(--custom-green-100)] text-[var(--custom-green-900)] rounded-lg hover:bg-[var(--custom-green-200)] transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[var(--custom-green-600)] text-[var(--custom-white)] rounded-lg hover:bg-[var(--custom-green-700)] transition-colors duration-200 font-medium"
                >
                  Add Therapist
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDoctor;
