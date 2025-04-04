import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Calendar, Trash2 } from "lucide-react";
import AdminNavbar from "../../components/admin/admin_navbar";
import Footer from "../../components/Footer";
import PacmanLoader from "react-spinners/PacmanLoader";
import { checkAuth } from "../../utils/profile";
import { ToastContainer, toast } from "react-toastify";
import CustomToast from "../../components/CustomToast";

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await fetch(`http://localhost:3000/events`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          id: id,
        }),
      });

      if (response.ok) {
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== id)
        );
      } else {
        console.error("Failed to delete the event");
        CustomToast("Failed to delete the event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      CustomToast("Failed to delete the event");
    }
  };
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("admin");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3000/events");
        const data = await response.json();

        const formattedEvents = data.map((event) => {
          const date = new Date(event.dateTime);
          return {
            id: event.id,
            title: event.title,
            date: date.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            location: event.venue,
            type: event.description ? "Session/Conference" : "Meeting",
          };
        });

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events", error);
        CustomToast("Error while fetching events");
      }
    };

    fetchEvents();
  }, []);

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
    <div className="flex bg-[var(--custom-primary-green-50)] flex-col min-h-screen">
      <AdminNavbar />
      <ToastContainer />
      <div className="space-y-6 md:min-w-5xl max-w-7xl p-4 md:p-6 mx-auto mb-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-[var(--custom-primary-green-900)]">
            Events List
          </h1>
          <Link
            to="/admin/add_event"
            className="flex mt-2 md:mt-0 items-center gap-2 bg-[var(--custom-primary-green-600)] text-[var(--custom-white)] px-4 py-2 rounded-lg hover:bg-[var(--custom-primary-green-700)] transition-colors"
          >
            <Calendar size={20} />
            Add New Event
          </Link>
        </div>

        <div className="grid gap-6 mb-10">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-[var(--custom-white)] p-6 rounded-xl shadow-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--custom-primary-green-900)]">
                    {event.title}
                  </h2>
                  <p className="text-[var(--custom-primary-green-600)] mt-1">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[var(--custom-primary-green-600)]">
                    Location
                  </p>
                  <p className="font-medium">{event.location}</p>
                </div>
                {/* <div>
                  <p className="text-sm text-[var(--custom-primary-green-600)]">Expected Attendees</p>
                  <p className="font-medium">{event.attendees}</p>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-auto"></div>
      <Footer color={"green"} />
    </div>
  );
};

export default EventsList;
