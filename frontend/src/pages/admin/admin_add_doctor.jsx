import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PacmanLoader from "react-spinners/PacmanLoader";
import { checkAuth } from "../../utils/profile";
import AdminNavbar from "../../components/admin/admin_navbar";
import SessionExpired from "../../components/SessionExpired";
import CustomToast from "../../components/CustomToast";
import { ToastContainer } from "react-toastify";

const AddDoctor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    regId: "",
    desc: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("admin");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, mobile, password, regId, desc } = formData;

    try {
      const res = await fetch("https://built-it.onrender.com/addDoc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          mobile: mobile,
          email: email,
          password: password,
          reg_id: regId,
          desc: desc,
          address: "<Please Change>",
          city: "<Please Change>",
          experience: "<Please Change>",
          img: "",
        }),
      });
      const resp = await res.json();
      CustomToast("Doctor Added", "green");
      navigate("/admin/doctor_list");
    } catch (e) {
      CustomToast("Some error occured", "green");
    }
    // Handle form submission
  };

  const handleClosePopup = () => {
    navigate("/admin/login");
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <PacmanLoader color="#047857" size={30} />
        <p className="mt-4 text-emerald-800 font-medium">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="green" />;
  }

  return (
    <div className="bg-[var(--custom-primary-green-50)] min-h-screen flex flex-col">
      <AdminNavbar />
      <ToastContainer />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--custom-primary-green-900)] mb-8 text-center">
            Add New Doctor
          </h1>

          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-[var(--custom-primary-green-900)]"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter doctor's full name"
                    className="w-full px-4 py-2 border border-[var(--custom-primary-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-primary-green-500)] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[var(--custom-primary-green-900)]"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="doctor@example.com"
                    className="w-full px-4 py-2 border border-[var(--custom-primary-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-primary-green-500)] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-[var(--custom-primary-green-900)]"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-2 border border-[var(--custom-primary-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-primary-green-500)] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="regId"
                    className="block text-sm font-medium text-[var(--custom-primary-green-900)]"
                  >
                    Registration ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="regId"
                    name="regId"
                    value={formData.regId}
                    onChange={handleChange}
                    placeholder="Enter registration ID"
                    className="w-full px-4 py-2 border border-[var(--custom-primary-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-primary-green-500)] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="desc"
                  className="block text-sm font-medium text-[var(--custom-primary-green-900)]"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="desc"
                  name="desc"
                  value={formData.desc}
                  onChange={handleChange}
                  placeholder="Enter doctor's specialization and details"
                  rows="3"
                  className="w-full px-4 py-2 border border-[var(--custom-primary-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-primary-green-500)] focus:border-transparent transition-all duration-200 resize-y"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[var(--custom-primary-green-900)]"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter a strong password"
                    className="w-full px-4 py-2 border border-[var(--custom-primary-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-primary-green-500)] focus:border-transparent transition-all duration-200"
                    required
                  />
                  {/* Optional: Add password visibility toggle */}
                  {/* <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--custom-primary-green-600)]"
              >
                Show
              </button> */}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/admin/doctor_list")}
                  className="px-6 py-2 bg-[var(--custom-primary-green-100)] text-[var(--custom-primary-green-900)] rounded-lg hover:bg-[var(--custom-primary-green-200)] transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[var(--custom-primary-green-600)] text-white rounded-lg hover:bg-[var(--custom-primary-green-700)] transition-colors duration-200 font-medium"
                >
                  Add Doctor
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
