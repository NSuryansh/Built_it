import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { CalendarCheck, CalendarX, Clock, MapPin, Download } from "lucide-react";
import Footer from "../components/Footer";
import { format } from "date-fns";
import SessionExpired from "../components/SessionExpired";
import { checkAuth } from "../utils/profile";
import PacmanLoader from "react-spinners/PacmanLoader";
import { useNavigate } from "react-router-dom";

const Events = () => {
  const [currentEvents, setcurrentEvents] = useState([]);
  const [pastEvents, setpastEvents] = useState([]);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  // Verify authentication
  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("user");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  useEffect(() => {
    getCurrEvents();
  }, []);

  useEffect(() => {
    getPastEvents();
  }, []);

  const handleClosePopup = () => {
    navigate("/login");
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[var(--custom-orange-50)] to-red-50">
        <PacmanLoader color="#ff4800" radius={6} height={20} width={5} />
        <p className="mt-4 text-gray-600">Loading your wellness journey...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (<SessionExpired handleClosePopup={handleClosePopup} theme="orange" />);
  }

  async function getCurrEvents() {
    const res = await fetch("http://localhost:3000/events");
    const resp = await res.json();
    setcurrentEvents(resp);
  }

  async function getPastEvents() {
    const res = await fetch("http://localhost:3000/getPastEvents");
    const resp = await res.json();
    console.log(resp);
    setpastEvents(resp);
  }

  const NoEventsMessage = ({ message }) => (
    <tr>
      <td colSpan={4} className="px-6 py-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          <CalendarX className="h-12 w-12 text-gray-400 animate-pulse" />
          <p className="text-lg text-gray-500 font-medium">{message}</p>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--custom-orange-50)] to-red-50">
      <Navbar />

      <main className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Desktop View */}
        <div className="hidden lg:block space-y-12">
          <section>
            <div className="flex items-center mb-8">
              <div className="relative">
                <CalendarCheck className="h-8 w-8 text-[var(--custom-orange-600)]" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse" />
              </div>
              <h2 className="ml-4 text-4xl font-bold text-gray-900 tracking-tight">
                Upcoming Events
              </h2>
            </div>
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 overflow-hidden border border-[var(--custom-orange-100)] transition-all duration-300 hover:shadow-2xl">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-[var(--custom-orange-50)] to-red-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider rounded-l-lg">
                      Event
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider rounded-r-lg">
                      Venue
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--custom-orange-100)]">
                  {currentEvents.length > 0 ? (
                    currentEvents.map((event) => (
                      <tr
                        key={event.id}
                        className="hover:bg-[var(--custom-orange-50)]/50 transition-colors duration-300 group"
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-2 w-2 bg-green-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300" />
                            <span className="text-sm font-medium text-gray-900">{event.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2 text-[var(--custom-orange-600)]" />
                            {format(event.dateTime, "dd-MMM-yyyy h:mm a")}
                          </div>
                        </td>
                        <td className="px-6 py-5 max-w-xs">
                          <p className="text-sm text-gray-600 truncate">{event.description}</p>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 text-[var(--custom-orange-600)]" />
                            {event.venue}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <NoEventsMessage message="No upcoming events scheduled" />
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-8">
              <CalendarX className="h-8 w-8 text-gray-600" />
              <h2 className="ml-4 text-4xl font-bold text-gray-900 tracking-tight">
                Past Events
              </h2>
            </div>
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 overflow-hidden border border-[var(--custom-orange-100)] transition-all duration-300 hover:shadow-2xl">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-[var(--custom-orange-50)] to-red-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider rounded-l-lg">
                      Event
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Venue
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider rounded-r-lg">
                      Content
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--custom-orange-100)]">
                  {pastEvents.length > 0 ? (
                    pastEvents.map((event) => (
                      <tr
                        key={event.id}
                        className="hover:bg-[var(--custom-orange-50)]/50 transition-colors duration-300"
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{event.title}</span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            {format(event.dateTime, "dd-MMM-yyyy h:mm a")}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            {event.venue}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          {event.url ? (
                            <button
                              onClick={() => window.open(event.url, "_blank")}
                              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[var(--custom-orange-600)] to-[var(--custom-orange-700)] text-white rounded-lg hover:from-[var(--custom-orange-700)] hover:to-[var(--custom-orange-800)] transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </button>
                          ) : (
                            <span className="text-gray-400 italic">Not available</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <NoEventsMessage message="No past events to display" />
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden space-y-10">
          <section>
            <div className="flex items-center mb-6">
              <div className="relative">
                <CalendarCheck className="h-7 w-7 text-[var(--custom-orange-600)]" />
                <div className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-green-400 rounded-full animate-pulse" />
              </div>
              <h2 className="ml-3 text-2xl font-bold text-gray-900 tracking-tight">
                Upcoming Events
              </h2>
            </div>
            <div className="space-y-4">
              {currentEvents.length > 0 ? (
                currentEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-[var(--custom-orange-100)] transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <div className="flex items-center mb-3">
                      <div className="h-2 w-2 bg-green-400 rounded-full mr-3" />
                      <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-[var(--custom-orange-600)]" />
                        {format(event.dateTime, "dd-MMM-yyyy h:mm a")}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-[var(--custom-orange-600)]" />
                        {event.venue}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 text-center border border-[var(--custom-orange-100)]">
                  <CalendarX className="h-10 w-10 text-gray-400 mx-auto mb-3 animate-pulse" />
                  <p className="text-gray-500 italic">No upcoming events scheduled</p>
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center mb-6">
              <CalendarX className="h-7 w-7 text-gray-600" />
              <h2 className="ml-3 text-2xl font-bold text-gray-900 tracking-tight">
                Past Events
              </h2>
            </div>
            <div className="space-y-4">
              {pastEvents.length > 0 ? (
                pastEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-[var(--custom-orange-100)] transition-all duration-300 hover:shadow-xl"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{event.title}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        {format(event.dateTime, "dd-MMM-yyyy h:mm a")}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {event.venue}
                      </div>
                      <div className="mt-4">
                        {event.url ? (
                          <button
                            onClick={() => window.open(event.url, "_blank")}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[var(--custom-orange-600)] to-[var(--custom-orange-700)] text-white rounded-lg hover:from-[var(--custom-orange-700)] hover:to-[var(--custom-orange-800)] transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 w-full justify-center"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Content
                          </button>
                        ) : (
                          <span className="text-gray-400 italic text-sm block text-center">
                            Content not available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 text-center border border-[var(--custom-orange-100)]">
                  <CalendarX className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 italic">No past events to display</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer color={"orange"} />
    </div>
  );
};

export default Events;