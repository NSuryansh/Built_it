import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Calendar,
  Trash2,
  Search,
  MapPin,
  ChevronRight,
  Clock,
  Filter,
  CalendarDays,
  Link as LinkIcon,
} from "lucide-react";
import AdminNavbar from "../../components/admin/Navbar";
import Footer from "../../components/common/Footer";
import { checkAuth } from "../../utils/profile";
import { ToastContainer } from "react-toastify";
import CustomToast from "../../components/common/CustomToast";
import { subDays, isWithinInterval, startOfToday } from "date-fns";
import SessionExpired from "../../components/common/SessionExpired";
import DeletePopup from "../../components/admin/DeletePopup";
import CustomLoader from "../../components/common/CustomLoader";

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // const [selectedType, setSelectedType] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [newLink, setNewLink] = useState("");
  const [fetched, setfetched] = useState(null);
  const navigate = useNavigate();
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [eventId, setEventId] = useState(null);
  const token = localStorage.getItem("token");

  const handleDelete = async (id) => {
    // if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await fetch(`http://localhost:3000/admin/events`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          id: id,
        }),
      });

      if (response.ok) {
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== id)
        );

        setDeletePopupOpen(false);
      } else {
        console.error("Failed to delete the event");
        CustomToast("Failed to delete the event", "green");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      CustomToast("Failed to delete the event", "green");
    }
  };

  const handleDeletePopup = (eventId, isOpen) => {
    if (isOpen == true) {
      setDeletePopupOpen(true);
      setEventId(eventId);
    } else {
      setDeletePopupOpen(false);
    }
  };

  const handleLinkSubmit = async (eventId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/admin/uploadURL?id=${eventId}&url=${newLink}`,
        { method: "PUT", headers: { Authorization: "Bearer " + token } }
      );
      CustomToast("URL uploaded successfully", "green");
    } catch (e) {
      console.error(e.message);
      CustomToast(e.message, "green");
    }
    setEvents(
      events.map((event) =>
        event.id === eventId ? { ...event, link: newLink } : event
      )
    );
    setEditingLinkId(null);
    setNewLink("");
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
        const response = await fetch("http://localhost:3000/common/events", {
          headers: { Authorization: "Bearer " + token },
        });
        const response2 = await fetch(
          "http://localhost:3000/common/getPastEvents",
          {
            headers: { Authorization: "Bearer " + token },
          }
        );
        const data = await response.json();
        const data2 = await response2.json();

        const formattedEvents = data.map((event) => {
          const date = new Date(event.dateTime);
          return {
            id: event.id,
            title: event.title,
            date: date,
            formattedDate: date.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            location: event.venue,
            link: event.url,
          };
        });

        for (let i = 0; i < data2.length; i++) {
          const date = new Date(data2[i].dateTime);
          formattedEvents.push({
            id: data2[i].id,
            title: data2[i].title,
            date: date,
            formattedDate: date.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            location: data2[i].venue,
            link: data2[i].url,
          });
        }

        setEvents(formattedEvents);
        setfetched(true);
      } catch (error) {
        console.error("Error fetching events", error);
        CustomToast("Error while fetching events", "green");
        setfetched(false);
      }
    };

    fetchEvents();
  }, []);

  const getFilteredEventsByDate = (events, filter) => {
    const today = startOfToday();
    let startDate;

    switch (filter) {
      case "7days":
        startDate = subDays(today, 7);
        break;
      case "15days":
        startDate = subDays(today, 15);
        break;
      case "30days":
        startDate = subDays(today, 30);
        break;
      default:
        return events;
    }

    return events.filter((event) =>
      isWithinInterval(new Date(event.date), {
        start: startDate,
        end: today,
      })
    );
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const dateFilteredEvents = getFilteredEventsByDate(
    filteredEvents,
    dateFilter
  );

  const isEventPast = (eventDate) => {
    return new Date(eventDate) < new Date();
  };

  const handleClosePopup = () => {
    navigate("/admin/login");
  };

  if (isAuthenticated === null || fetched === null) {
    return <CustomLoader color="green" text="Loading your dashboard..." />;
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="green" />;
  }

  return (
    <div className="flex bg-gradient-to-br from-[var(--custom-green-50)] to-[var(--custom-teal-50)] flex-col min-h-screen">
      <AdminNavbar />
      <ToastContainer />

      <div className="max-w-7xl w-full p-4 md:p-8 mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl text-center md:text-start md:text-3xl lg:text-4xl font-bold text-[var(--custom-green-900)] mb-2">
              Events Dashboard
            </h1>
            <p className="text-[var(--custom-green-600)]">
              Manage and track your upcoming events
            </p>
          </div>

          <Link
            href="/admin/add_event"
            className="group flex items-center gap-2 bg-[var(--custom-green-600)] text-[var(--custom-white)] px-3 py-1.5 md:px-6 md:py-3 rounded-full hover:bg-[var(--custom-green-700)] transition-all duration-300 shadow-lg hover:shadow-[var(--custom-green-200)] mt-4 md:mt-0"
          >
            <Calendar className="w-5 h-5" />
            <span>Create Event</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-[var(--custom-white)] rounded-2xl shadow-md mb-8 overflow-hidden">
          <div className="p-6 border-b border-[var(--custom-gray-100)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[var(--custom-gray-900)] flex items-center gap-2">
                <Filter className="w-5 h-5 text-[var(--custom-green-600)]" />
                Filters
              </h2>
              <button
                onClick={() => {
                  if (showFilters) {
                    setDateFilter("all");
                  }
                  setShowFilters(!showFilters);
                }}
                className="text-[var(--custom-green-600)] hover:text-[var(--custom-green-700)] font-medium text-sm"
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>

            <div className="flex flex-col gap-6 justify-between items-center sm:flex-row">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--custom-gray-400)] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-[var(--custom-gray-200)] focus:border-[var(--custom-green-500)] focus:ring-2 focus:ring-[var(--custom-green-200)] outline-none transition-all"
                />
              </div>
              <div className="bg-[var(--custom-white)] p-2 md:p-4 flex justify-center gap-4 items-center rounded-2xl border-2 border-[var(--custom-green-500)]">
                <h3 className="text-[var(--custom-green-600)] font-semibold text-nowrap text-lg">
                  Total Events
                </h3>
                <p className="text-3xl font-bold text-[var(--custom-green-600)]">
                  {dateFilteredEvents.length}
                </p>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="p-6 bg-[var(--custom-gray-50)] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[var(--custom-gray-700)] mb-2 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-[var(--custom-green-600)]" />
                    Time Period
                  </label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-[var(--custom-gray-200)] focus:border-[var(--custom-green-500)] focus:ring-2 focus:ring-[var(--custom-green-200)] outline-none"
                  >
                    <option value="all">All Time</option>
                    <option value="7days">Last 7 Days</option>
                    <option value="15days">Last 15 Days</option>
                    <option value="30days">Last 30 Days</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 mb-10">
          {dateFilteredEvents.map((event) => (
            <div
              key={event.id}
              className="group bg-[var(--custom-white)] p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-[var(--custom-gray-100)]"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-[var(--custom-gray-900)] group-hover:text-[var(--custom-green-700)] transition-colors">
                    {event.title}
                  </h2>
                </div>

                {!isEventPast(event.date) ? (
                  <button
                    onClick={() => handleDeletePopup(event.id, true)}
                    className="p-2 text-[var(--custom-gray-400)] hover:text-[var(--custom-red-600)] hover:bg-[var(--custom-red-50)] rounded-full transition-all duration-300"
                  >
                    <Trash2 size={20} />
                  </button>
                ) : null}
              </div>

              <div className="mt-6 grid sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[var(--custom-green-500)]" />
                  <div>
                    <p className="text-sm text-[var(--custom-gray-500)]">
                      Date
                    </p>
                    <p className="font-medium text-[var(--custom-gray-900)]">
                      {event.formattedDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[var(--custom-green-500)]" />
                  <div>
                    <p className="text-sm text-[var(--custom-gray-500)]">
                      Location
                    </p>
                    <p className="font-medium text-[var(--custom-gray-900)]">
                      {event.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Link Section */}
              <div className="mt-4 pt-4 border-t border-[var(--custom-gray-100)]">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="w-4 h-4 text-[var(--custom-green-500)]" />
                  <span className="text-sm text-[var(--custom-gray-500)]">
                    Event Document
                  </span>
                </div>

                {editingLinkId === event.id ? (
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    <input
                      type="text"
                      value={newLink}
                      onChange={(e) => setNewLink(e.target.value)}
                      placeholder="Enter google drive link"
                      className="flex-1 text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--custom-green-200)] focus:border-[var(--custom-green-500)] outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLinkSubmit(event.id)}
                        className="bg-[var(--custom-green-500)] text-[var(--custom-white)] px-4 py-2 rounded-lg hover:bg-[var(--custom-green-600)] transition-colors text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingLinkId(null);
                          setNewLink("");
                        }}
                        className="bg-[var(--custom-gray-200)] text-[var(--custom-gray-600)] px-4 py-2 rounded-lg hover:bg-[var(--custom-gray-300)] transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {event.link ? (
                      <>
                        <a
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--custom-green-600)] hover:text-[var(--custom-green-700)] text-sm font-medium"
                        >
                          View Document
                        </a>
                        <button
                          onClick={() => {
                            setEditingLinkId(event.id);
                            setNewLink(event.link);
                          }}
                          className="text-[var(--custom-gray-400)] hover:text-[var(--custom-gray-600)] text-sm"
                        >
                          (Edit)
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingLinkId(event.id);
                          setNewLink("");
                        }}
                        className="text-[var(--custom-green-600)] hover:text-[var(--custom-green-700)] text-sm font-medium"
                      >
                        + Add Document Link
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {deletePopupOpen && (
        <DeletePopup
          docId={eventId}
          handleDeletePopup={handleDeletePopup}
          handleDelete={handleDelete}
          text={"Are you sure you want to remove the event?"}
        />
      )}

      <div className="mt-auto">
        <Footer color="green" />
      </div>
    </div>
  );
};

export default EventsList;
