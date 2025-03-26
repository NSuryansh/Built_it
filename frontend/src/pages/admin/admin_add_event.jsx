import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PacmanLoader from "react-spinners/PacmanLoader";
import { checkAuth } from "../../utils/profile";
import AdminNavbar from "../../components/admin/admin_navbar";

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
      const response = await fetch(
        "https://built-it-xjiq.onrender.com/addEvent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title,
            description: description,
            dateTime: dateTime,
            venue: location,
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        // Form submitted successfully, navigate to event list
        navigate("/admin/event_list");
      }
    } catch (err) {
      console.error("Error adding event:", err);
      setError("Internal error while adding event");
    }
  };
  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <PacmanLoader color="#ff4800" radius={6} height={20} width={5} />
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
      <div className="space-y-6 py-10 w-full bg-[var(--custom-primary-green-50)] mx-auto flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold text-[var(--custom-primary-green-900)] mt-[-20px]">
          Add New Event
        </h1>

        <div className="bg-white p-6 min-w-2xl rounded-xl shadow-lg max-w-2xl">
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-[var(--custom-primary-green-900)]"
              >
                Event Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--custom-primary-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-primary-green-500)] focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-[var(--custom-primary-green-900)]"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--custom-primary-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-primary-green-500)] focus:border-transparent"
                required
              />
            </div>

            {/* Added Time Field */}
            <div className="space-y-2">
              <label
                htmlFor="time"
                className="block text-sm font-medium text-[var(--custom-primary-green-900)]"
              >
                Time
              </label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--custom-primary-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-primary-green-500)] focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-[var(--custom-primary-green-900)]"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--custom-primary-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-primary-green-500)] focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-[var(--custom-primary-green-900)]"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--custom-primary-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-primary-green-500)] focus:border-transparent"
                required
              ></textarea>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-[var(--custom-primary-green-600)] text-white rounded-lg hover:bg-[var(--custom-primary-green-700)] transition-colors"
              >
                Add Event
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/event_list")}
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

export default AddEvent;
