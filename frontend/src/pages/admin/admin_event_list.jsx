import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Calendar, Trash2, Search, MapPin, ChevronRight, Clock, Filter, CalendarDays } from "lucide-react";
import AdminNavbar from "../../components/admin/admin_navbar";
import Footer from "../../components/Footer";
import PacmanLoader from "react-spinners/PacmanLoader";
import { checkAuth } from "../../utils/profile";
import { ToastContainer } from "react-toastify";
import CustomToast from "../../components/CustomToast";
import { subDays, isWithinInterval, startOfToday } from 'date-fns';

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

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
            date: date,
            formattedDate: date.toLocaleDateString(undefined, {
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

    return events.filter(event => 
      isWithinInterval(new Date(event.date), {
        start: startDate,
        end: today
      })
    );
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "" || event.type === selectedType;
    return matchesSearch && matchesType;
  });

  const dateFilteredEvents = getFilteredEventsByDate(filteredEvents, dateFilter);

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <PacmanLoader color="#047857" size={30} />
        <p className="mt-4 text-emerald-800 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} />;
  }

  return (
    <div className="flex bg-gradient-to-br from-emerald-50 to-teal-50 flex-col min-h-screen">
      <AdminNavbar />
      <ToastContainer />
      
      <div className="max-w-7xl w-full p-4 md:p-8 mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-emerald-900 mb-2">
              Events Dashboard
            </h1>
            <p className="text-emerald-600">Manage and track your upcoming events</p>
          </div>
          
          <Link
            to="/admin/add_event"
            className="group flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-emerald-200 mt-4 md:mt-0"
          >
            <Calendar className="w-5 h-5" />
            <span>Create Event</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-md mb-8 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Filter className="w-5 h-5 text-emerald-600" />
                Filters
              </h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              />
            </div>
          </div>
          
          {showFilters && (
            <div className="p-6 bg-gray-50 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    Event Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                  >
                    <option value="">All Types</option>
                    <option value="Session/Conference">Session/Conference</option>
                    <option value="Meeting">Meeting</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-emerald-600" />
                    Time Period
                  </label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
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

        {/* Events Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">Total Events</h3>
            <p className="text-3xl font-bold text-emerald-600 mt-2">{dateFilteredEvents.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">Conferences</h3>
            <p className="text-3xl font-bold text-emerald-600 mt-2">
              {dateFilteredEvents.filter(e => e.type === 'Session/Conference').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">Meetings</h3>
            <p className="text-3xl font-bold text-emerald-600 mt-2">
              {dateFilteredEvents.filter(e => e.type === 'Meeting').length}
            </p>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 mb-10">
          {dateFilteredEvents.map((event) => (
            <div
              key={event.id}
              className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      event.type === 'Session/Conference' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {event.title}
                  </h2>
                </div>
                
                <button
                  onClick={() => handleDelete(event.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-500" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">{event.formattedDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-500" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">{event.location}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                <Link
                  to={`/admin/events/${event.id}`}
                  className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 group"
                >
                  View Details
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <Footer color="green" />
      </div>
    </div>
  );
};

export default EventsList;