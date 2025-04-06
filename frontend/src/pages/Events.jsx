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
    return <SessionExpired handleClosePopup={handleClosePopup} />;
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
          <CalendarX className="h-12 w-12 text-gray-400" />
          <p className="text-lg text-gray-500 font-medium">{message}</p>
        </div>
      </td>
    </tr>
  );

  const EventCard = ({ event, isPast = false }) => (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
      <div className="space-y-2 text-sm">
        <div className="flex items-center text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          {format(event.dateTime, "dd-MMM-yyyy h:mm a")}
        </div>
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          {event.venue}
        </div>
        {!isPast && <p className="text-gray-600 mt-2">{event.description}</p>}
        {isPast && event.content && (
          <button
            onClick={() => window.open(event.content.url, "_blank")}
            className="flex items-center mt-2 text-[var(--custom-orange-600)] hover:text-[var(--custom-orange-700)]"
          >
            <Download className="h-4 w-4 mr-1" />
            Download {event.content.type.toUpperCase()}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--custom-orange-50)]">
  <Navbar />

  <main className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    {/* Desktop View */}
    <div className="hidden lg:block space-y-10">
      <section>
        <div className="flex items-center mb-6">
          <CalendarCheck className="h-7 w-7 text-[var(--custom-orange-600)] mr-3" />
          <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Upcoming Events
          </h2>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto border border-[var(--custom-orange-100)]">
          <table className="min-w-full">
            <thead className="bg-[var(--custom-orange-50)] sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Venue
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--custom-orange-100)]">
              {currentEvents.length > 0 ? (
                currentEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="hover:bg-[var(--custom-orange-50)] transition-colors duration-200"
                  >
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                      {event.title}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                      {format(event.dateTime, "dd-MMM-yyyy h:mm a")}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600 max-w-xs truncate">
                      {event.description}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                      {event.venue}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-5 text-center text-gray-500 italic">
                    No upcoming events scheduled
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="flex items-center mb-6">
          <CalendarX className="h-7 w-7 text-gray-600 mr-3" />
          <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Past Events
          </h2>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto border border-[var(--custom-orange-100)]">
          <table className="min-w-full">
            <thead className="bg-[var(--custom-orange-50)] sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Venue
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Content
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--custom-orange-100)]">
              {pastEvents.length > 0 ? (
                pastEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="hover:bg-[var(--custom-orange-50)] transition-colors duration-200"
                  >
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                      {event.title}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                      {format(event.dateTime, "dd-MMM-yyyy h:mm a")}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                      {event.venue}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm">
                      {event.url ? (
                        <button
                          onClick={() => window.open(event.url, "_blank")}
                          className="inline-flex items-center px-3 py-1.5 bg-[var(--custom-orange-600)] text-white rounded-md hover:bg-[var(--custom-orange-700)] transition-colors duration-200 text-sm font-medium"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </button>
                      ) : (
                        <span className="text-gray-400 italic">Not available</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-5 text-center text-gray-500 italic">
                    No past events to display
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>

    {/* Mobile View */}
    <div className="lg:hidden space-y-10">
      <section>
        <div className="flex items-center mb-5">
          <CalendarCheck className="h-6 w-6 text-[var(--custom-orange-600)] mr-2" />
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Upcoming Events
          </h2>
        </div>
        <div className="space-y-5">
          {currentEvents.length > 0 ? (
            currentEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-md p-5 border border-[var(--custom-orange-100)] hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {format(event.dateTime, "dd-MMM-yyyy h:mm a")}
                </p>
                <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  <span className="font-medium">Venue:</span> {event.venue}
                </p>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-md p-5 text-center text-gray-500 italic border border-[var(--custom-orange-100)]">
              No upcoming events scheduled
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center mb-5">
          <CalendarX className="h-6 w-6 text-gray-600 mr-2" />
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Past Events
          </h2>
        </div>
        <div className="space-y-5">
          {pastEvents.length > 0 ? (
            pastEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-md p-5 border border-[var(--custom-orange-100)] hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {format(event.dateTime, "dd-MMM-yyyy h:mm a")}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  <span className="font-medium">Venue:</span> {event.venue}
                </p>
                <div className="mt-3">
                  {event.url ? (
                    <button
                      onClick={() => window.open(event.url, "_blank")}
                      className="inline-flex items-center px-3 py-1.5 bg-[var(--custom-orange-600)] text-white rounded-md hover:bg-[var(--custom-orange-700)] transition-colors duration-200 text-sm font-medium"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                  ) : (
                    <span className="text-gray-400 italic text-sm">Not available</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-md p-5 text-center text-gray-500 italic border border-[var(--custom-orange-100)]">
              No past events to display
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
