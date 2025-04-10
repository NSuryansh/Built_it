import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CustomToast from "../components/CustomToast";
import { ToastContainer } from "react-toastify";
import SessionExpired from "../components/SessionExpired";
import PacmanLoader from "react-spinners/PacmanLoader";
import { checkAuth } from "../utils/profile";

const ModifyProfile = ({ username, email, mobile, alt_mobile }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const [formData, setFormData] = useState({
    username,
    email,
    mobile,
    alt_mobile,
  });

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("user");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  const handleClosePopup = () => {
    navigate("/login");
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <PacmanLoader color="#ff4800" radius={6} height={20} width={5} />
        <p className="mt-4 text-gray-600">Loading your wellness journey...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <SessionExpired handleClosePopup={handleClosePopup} theme="orange" />
    );
  }

  const dataToSend = {
    id: localStorage.getItem("userid"), // Correctly assigning id
    ...formData, // Spreading formData properties
  };

  const onSave = async (dataToSend) => {
    try {
      const response = await fetch("http://localhost:3000/modifyUser", {
        method: "PUT", // Use PUT to modify user details
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (response.ok) {
        CustomToast("User details updated successfully!");
      } else {
        CustomToast("Error while updating details");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      CustomToast("Error while updating details");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(dataToSend);
  };

  const onCancel = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="bg-[var(--custom-orange-50)]">
      <Navbar />
      <ToastContainer />
      <div className="min-h-screen py-16 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto bg-[var(--custom-white)] bg-opacity-90 backdrop-blur-md rounded-2xl shadow-xl border border-[var(--custom-orange-100)] overflow-hidden">
          <div className="px-10 py-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-[var(--custom-orange-900)] tracking-tight">
                Modify Profile
              </h2>
              <p className="mt-3 text-[var(--custom-orange-600)]">
                Update your profile information
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Username Field */}
              <div className="relative">
                <span className="absolute inset-0 flex items-center px-5 text-[var(--custom-orange-400)] opacity-50 pointer-events-none truncate peer-focus:opacity-0 transition-opacity duration-300">
                  {localStorage.getItem("username") || "Your username"}
                </span>
                <input
                  type="text"
                  id="username"
                  className="peer w-full rounded-lg border border-[var(--custom-orange-300)] px-5 py-4 text-[var(--custom-orange-900)] bg-transparent focus:border-[var(--custom-orange-600)] focus:ring-2 focus:ring-[var(--custom-orange-200)] focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                />
                <label
                  htmlFor="username"
                  className="absolute left-5 top-4 text-[var(--custom-orange-500)] text-sm transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-focus:top-[-1rem] peer-focus:text-sm peer-focus:text-[var(--custom-orange-700)] peer-valid:top-[-1rem] peer-valid:text-sm peer-valid:text-[var(--custom-orange-700)] bg-[var(--custom-white)] bg-opacity-90 px-2"
                >
                  Username
                </label>
              </div>

              {/* Email Field */}
              <div className="relative">
                <span className="absolute inset-0 flex items-center px-5 text-[var(--custom-orange-400)] opacity-50 pointer-events-none truncate peer-focus:opacity-0 transition-opacity duration-300">
                  {localStorage.getItem("user_email") || "Your email"}
                </span>
                <input
                  type="email"
                  disabled
                  id="email"
                  className="peer w-full rounded-lg border border-[var(--custom-orange-300)] px-5 py-4 text-[var(--custom-orange-900)] bg-transparent focus:border-[var(--custom-orange-600)] focus:ring-2 focus:ring-[var(--custom-orange-200)] focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
                <label
                  htmlFor="email"
                  className="absolute left-5 top-4 text-[var(--custom-orange-500)] text-sm transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-focus:top-[-1rem] peer-focus:text-sm peer-focus:text-[var(--custom-orange-700)] peer-valid:top-[-1rem] peer-valid:text-sm peer-valid:text-[var(--custom-orange-700)] bg-[var(--custom-white)] bg-opacity-90 px-2"
                >
                  Email
                </label>
              </div>

              {/* Phone Number Field */}
              <div className="relative">
                <span className="absolute inset-0 flex items-center px-5 text-[var(--custom-orange-400)] opacity-50 pointer-events-none truncate peer-focus:opacity-0 transition-opacity duration-300">
                  {localStorage.getItem("user_mobile") || "Your phone number"}
                </span>
                <input
                  type="tel"
                  id="mobile"
                  className="peer w-full rounded-lg border border-[var(--custom-orange-300)] px-5 py-4 text-[var(--custom-orange-900)] bg-transparent focus:border-[var(--custom-orange-600)] focus:ring-2 focus:ring-[var(--custom-orange-200)] focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, mobile: e.target.value }))
                  }
                />
                <label
                  htmlFor="mobile"
                  className="absolute left-5 top-4 text-[var(--custom-orange-500)] text-sm transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-focus:top-[-1rem] peer-focus:text-sm peer-focus:text-[var(--custom-orange-700)] peer-valid:top-[-1rem] peer-valid:text-sm peer-valid:text-[var(--custom-orange-700)] bg-[var(--custom-white)] bg-opacity-90 px-2"
                >
                  Phone Number
                </label>
              </div>

              {/* Emergency Contact Number Field */}
              <div className="relative">
                <span className="absolute inset-0 flex items-center px-5 text-[var(--custom-orange-400)] opacity-50 pointer-events-none truncate peer-focus:opacity-0 transition-opacity duration-300">
                  {localStorage.getItem("user_alt_mobile") ||
                    "Your emergency contact"}
                </span>
                <input
                  type="tel"
                  id="alt_mobile"
                  className="peer w-full rounded-lg border border-[var(--custom-orange-300)] px-5 py-4 text-[var(--custom-orange-900)] bg-transparent focus:border-[var(--custom-orange-600)] focus:ring-2 focus:ring-[var(--custom-orange-200)] focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                  value={formData.alt_mobile}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      alt_mobile: e.target.value,
                    }))
                  }
                />
                <label
                  htmlFor="alt_mobile"
                  className="absolute left-5 top-4 text-[var(--custom-orange-500)] text-sm transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-focus:top-[-1rem] peer-focus:text-sm peer-focus:text-[var(--custom-orange-700)] peer-valid:top-[-1rem] peer-valid:text-sm peer-valid:text-[var(--custom-orange-700)] bg-[var(--custom-white)] bg-opacity-90 px-2"
                >
                  Emergency Contact Number
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-6 pt-6">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[var(--custom-orange-500)] to-[var(--custom-orange-600)] text-[var(--custom-white)] rounded-xl px-8 py-4  font-semibold hover:from-[var(--custom-orange-600)] hover:to-[var(--custom-orange-700)] hover:shadow-lg transition-all duration-300 shadow-md"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 bg-[var(--custom-white)] text-[var(--custom-orange-700)] rounded-xl px-8 py-4 font-semibold border border-[var(--custom-orange-300)] hover:bg-[var(--custom-orange-50)] hover:shadow-md transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyProfile;
