import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PacmanLoader from "react-spinners/PacmanLoader";
import { checkAuth } from "../../utils/profile";
import AdminNavbar from "../../components/admin/admin_navbar";

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
      const res = await fetch("https://built-it-xjiq.onrender.com/addDoc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          mobile: mobile,
          email: email,
          password: password,
          reg_id: regId,
          desc: desc,
          img: "",
        }),
      });
      const resp = await res.json();
      console.log(resp);
      console.log("Form submitted");
      navigate("/admin/doctor_list");
    } catch (e) {
      console.log(e);
    }
    // Handle form submission
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <PacmanLoader color="#048a81" radius={6} height={20} width={5} />
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} />;
  }

  return (
    <>
      <AdminNavbar />
      <div className="space-y-6 w-full bg-[var(--custom-primary-green-50)] mx-auto flex flex-col justify-center items-center h-screen ">
        <h1 className="text-3xl font-bold text-[var(--custom-primary-green-900)] mt-6">
          Add New Doctor
        </h1>

        <div className="bg-white p-6 min-w-2xl rounded-xl shadow-lg max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[var(--custom-primary-green-900)]"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--custom-primary-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-primary-green-500)] focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[var(--custom-primary-green-900)]"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--custom-primary-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-primary-green-500)] focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-[var(--custom-primary-green-900)]"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--custom-primary-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-primary-green-500)] focus:border-transparent"
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="regId"
                className="block text-sm font-medium text-[var(--custom-primary-green-900)]"
              >
                Registration ID
              </label>
              <input
                type="text"
                id="regId"
                name="regId"
                value={formData.regId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--custom-primary-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-primary-green-500)] focus:border-transparent"
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="desc"
                className="block text-sm font-medium text-[var(--custom-primary-green-900)]"
              >
                Description
              </label>
              <input
                type="text"
                id="desc"
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--custom-primary-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-primary-green-500)] focus:border-transparent"
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[var(--custom-primary-green-900)]"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--custom-primary-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-primary-green-500)] focus:border-transparent"
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-[var(--custom-primary-green-600)] text-white rounded-lg hover:bg-[var(--custom-primary-green-700)] transition-colors"
              >
                Add Doctor
              </button>
              <button
                type="button"
                // onClick={() => navigate('/admin/doctor_list')}
                className="px-6 py-2 bg-[var(--custom-primary-green-100)] text-[var(--custom-primary-green-900)] rounded-lg hover:bg-[var(--custom-primary-green-200)] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddDoctor;
