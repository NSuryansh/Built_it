import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PacmanLoader from "react-spinners/PacmanLoader";
import { checkAuth } from "../../utils/profile";
import AdminNavbar from "../../components/admin/admin_navbar";
import { ToastContainer } from "react-toastify";
import CustomToast from "../../components/CustomToast";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Plus,
  X,
  AlertCircle,
} from "lucide-react";
const AddEvent = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(null);

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
      const response = await fetch("http://localhost:3000/addEvent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        navigate("/admin/event_list");
      }
    } catch (err) {
      console.error("Error adding event:", err);
      CustomToast("Internal error while adding event");
      setError("Internal error while adding event");
    }
  };

  const handleClosePopup = () => {
    navigate("/doctor/login");
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
    return (<SessionExpired handleClosePopup={handleClosePopup} theme="green" />);
  }

  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">
      <AdminNavbar />
      <ToastContainer />
      <div className="space-y-10 px-4 sm:px-6 lg:px-8 py-6 w-full mx-auto flex flex-col justify-center items-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-900 to-green-600 tracking-tight">
          Add New Event
        </h1>

        <div className="bg-white p-8 w-full rounded-3xl shadow-2xl max-w-2xl border border-green-100/50 transform hover:shadow-3xl transition-all duration-300">
          {error && (
            <p className="text-red-600 mb-6 bg-red-50/80 p-4 rounded-xl text-sm flex items-center gap-2 shadow-sm">
              <AlertCircle size={18} className="text-red-500" />
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="space-y-3">
              <label
                htmlFor="title"
                className="text-sm font-medium text-green-900 flex items-center gap-2"
              >
                <Calendar size={16} className="text-green-600" />
                Event Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-5 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent bg-green-50/30 transition-all duration-200 shadow-md hover:shadow-lg text-gray-800 placeholder-gray-400"
                required
                placeholder="Enter event title"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label
                  htmlFor="date"
                  className="text-sm font-medium text-green-900 flex items-center gap-2"
                >
                  <Clock size={16} className="text-green-600" />
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-5 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent bg-green-50/30 transition-all duration-200 shadow-md hover:shadow-lg text-gray-800"
                  required
                />
              </div>

              <div className="space-y-3">
                <label
                  htmlFor="time"
                  className="text-sm font-medium text-green-900 flex items-center gap-2"
                >
                  <Clock size={16} className="text-green-600" />
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-5 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent bg-green-50/30 transition-all duration-200 shadow-md hover:shadow-lg text-gray-800"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label
                htmlFor="location"
                className="text-sm font-medium text-green-900 flex items-center gap-2"
              >
                <MapPin size={16} className="text-green-600" />
                Location
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-5 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent bg-green-50/30 transition-all duration-200 shadow-md hover:shadow-lg text-gray-800 placeholder-gray-400"
                required
                placeholder="Enter event location"
              />
            </div>

            <div className="space-y-3">
              <label
                htmlFor="description"
                className="text-sm font-medium text-green-900 flex items-center gap-2"
              >
                <FileText size={16} className="text-green-600" />
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-5 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent bg-green-50/30 transition-all duration-200 shadow-md hover:shadow-lg text-gray-800 placeholder-gray-400 resize-y"
                required
                placeholder="Describe your event..."
              ></textarea>
            </div>

            <div className="flex gap-4 justify-end pt-2">
              <button
                type="button"
                onClick={() => navigate("/admin/event_list")}
                className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-50 text-green-900 rounded-xl hover:from-gray-200 hover:to-gray-100 transition-all duration-200 shadow-md hover:shadow-lg font-medium flex items-center gap-2"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-md hover:shadow-lg font-medium flex items-center gap-2"
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
