"use client";

import React, { useState, useEffect } from "react";
import { checkAuth } from "@/utils/profile";
import AdminNavbar from "@/components/admin/Navbar";
import { ToastContainer } from "react-toastify";
import CustomToast from "@/components/common/CustomToast";
import SessionExpired from "@/components/common/SessionExpired";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Plus,
  X,
  AlertCircle,
} from "lucide-react";
import CustomLoader from "@/components/common/CustomLoader";
import { useRouter } from "next/navigation";

const AddEvent = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("admin");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combine date and time to form a valid ISO date-time string
    const dateTime = new Date(`${date}T${time}`);

    try {
      const response = await fetch("http://localhost:3000/admin/addEvent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          title: title,
          description: description,
          dateTime: dateTime,
          venue: location,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        // Form submitted successfully, navigate to event list
        router.push("/admin/event_list");
      }
    } catch (err) {
      console.error("Error adding event:", err);
      CustomToast("Internal error while adding event", "green");
      setError("Internal error while adding event");
    }
  };

  const handleClosePopup = () => {
    router.replace("https://hms-sso.vercel.app/");
  };

  if (isAuthenticated === null) {
    return <CustomLoader color="green" text={"Loading your dashboard..."} />;
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="green" />;
  }

  return (
    <div className="bg-gradient-to-b from-[var(--custom-green-50)] to-[var(--custom-white)] min-h-screen">
      <AdminNavbar />
      <ToastContainer />
      <div className="space-y-10 px-4 sm:px-6 lg:px-8 py-6 w-full mx-auto flex flex-col justify-center items-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--custom-green-900)] to-[var(--custom-green-600)] tracking-tight">
          Add New Event
        </h1>

        <div className="bg-[var(--custom-white)] p-8 w-full rounded-3xl shadow-2xl max-w-2xl border border-[var(--custom-green-100)]/50 transform hover:shadow-3xl transition-all duration-300">
          {error && (
            <p className="text-[var(--custom-red-600)] mb-6 bg-[var(--custom-red-50)]/80 p-4 rounded-xl text-sm flex items-center gap-2 shadow-sm">
              <AlertCircle size={18} className="text-[var(--custom-red-500)]" />
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="space-y-3">
              <label
                htmlFor="title"
                className="text-sm font-medium text-[var(--custom-green-900)] flex items-center gap-2"
              >
                <Calendar
                  size={16}
                  className="text-[var(--custom-green-600)]"
                />
                Event Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-5 py-3 border border-[var(--custom-green-200)] rounded-xl focus:ring-2 focus:ring-[var(--custom-green-400)] focus:border-transparent bg-[var(--custom-green-50)]/30 transition-all duration-200 shadow-md hover:shadow-lg text-[var(--custom-gray-800)] placeholder-[var(--custom-gray-400)]"
                required
                placeholder="Enter event title"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label
                  htmlFor="date"
                  className="text-sm font-medium text-[var(--custom-green-900)] flex items-center gap-2"
                >
                  <Clock size={16} className="text-[var(--custom-green-600)]" />
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-5 py-3 border border-[var(--custom-green-200)] rounded-xl focus:ring-2 focus:ring-[var(--custom-green-400)] focus:border-transparent bg-[var(--custom-green-50)]/30 transition-all duration-200 shadow-md hover:shadow-lg text-[var(--custom-gray-800)]"
                  required
                />
              </div>

              <div className="space-y-3">
                <label
                  htmlFor="time"
                  className="text-sm font-medium text-[var(--custom-green-900)] flex items-center gap-2"
                >
                  <Clock size={16} className="text-[var(--custom-green-600)]" />
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-5 py-3 border border-[var(--custom-green-200)] rounded-xl focus:ring-2 focus:ring-[var(--custom-green-400)] focus:border-transparent bg-[var(--custom-green-50)]/30 transition-all duration-200 shadow-md hover:shadow-lg text-[var(--custom-gray-800)]"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label
                htmlFor="location"
                className="text-sm font-medium text-[var(--custom-green-900)] flex items-center gap-2"
              >
                <MapPin size={16} className="text-[var(--custom-green-600)]" />
                Location
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-5 py-3 border border-[var(--custom-green-200)] rounded-xl focus:ring-2 focus:ring-[var(--custom-green-400)] focus:border-transparent bg-[var(--custom-green-50)]/30 transition-all duration-200 shadow-md hover:shadow-lg text-[var(--custom-gray-800)] placeholder-[var(--custom-gray-400)]"
                required
                placeholder="Enter event location"
              />
            </div>

            <div className="space-y-3">
              <label
                htmlFor="description"
                className="text-sm font-medium text-[var(--custom-green-900)] flex items-center gap-2"
              >
                <FileText
                  size={16}
                  className="text-[var(--custom-green-600)]"
                />
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-5 py-3 border border-[var(--custom-green-200)] rounded-xl focus:ring-2 focus:ring-[var(--custom-green-400)] focus:border-transparent bg-[var(--custom-green-50)]/30 transition-all duration-200 shadow-md hover:shadow-lg text-[var(--custom-gray-800)] placeholder-gray-400 resize-y"
                required
                placeholder="Describe your event..."
              ></textarea>
            </div>

            <div className="flex gap-4 justify-end pt-2">
              <button
                type="button"
                onClick={() => router.push("/admin/event_list")}
                className="px-6 py-3 bg-gradient-to-r from-[var(--custom-gray-100)] to-[var(--custom-gray-50)] text-[var(--custom-green-900)] rounded-xl hover:from-[var(--custom-gray-200)] hover:to-[var(--custom-gray-100)] transition-all duration-200 shadow-md hover:shadow-lg font-medium flex items-center gap-2"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-[var(--custom-green-600)] to-[var(--custom-green-500)] text-[var(--custom-white)] rounded-xl hover:from-[var(--custom-green-700)] hover:to-[var(--custom-green-600)] transition-all duration-200 shadow-md hover:shadow-lg font-medium flex items-center gap-2"
              >
                <Plus size={18} />
                Add Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;
