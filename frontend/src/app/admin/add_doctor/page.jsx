"use client";

import React from "react";
import { useState, useEffect } from "react";
import { checkAuth } from "@/utils/profile";
import AdminNavbar from "@/components/admin/Navbar";
import SessionExpired from "@/components/common/SessionExpired";
import CustomToast from "@/components/common/CustomToast";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import CustomLoader from "@/components/common/CustomLoader";

const AddDoctor = () => {
  const router = useRouter();
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
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3000/admin/addDoc", {
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
          address: "<Please Change>",
          office_address: "<Please Change>",
          experience: "<Please Change>",
          img: "",
        }),
      });
      const resp = await res.json();
      CustomToast("Doctor Added", "green");
      router.push("/admin/doctor_list");
    } catch (e) {
      CustomToast("Some error occured", "green");
    }
    // Handle form submission
  };

  const handleClosePopup = () => {
    router.replace("https://hms-sso.vercel.app/");
  };

  if (isAuthenticated === null) {
    return <CustomLoader color={"green"} text={"Loading your dashboard..."} />;
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
            Add New Doctor
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
                    placeholder="Enter doctor's full name"
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
                    placeholder="doctor@example.com"
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
                  placeholder="Enter doctor's specialization and details"
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
                  onClick={() => router.push("/admin/doctor_list")}
                  className="px-6 py-2 bg-[var(--custom-green-100)] text-[var(--custom-green-900)] rounded-lg hover:bg-[var(--custom-green-200)] transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[var(--custom-green-600)] text-[var(--custom-white)] rounded-lg hover:bg-[var(--custom-green-700)] transition-colors duration-200 font-medium"
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
