"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/user/Navbar";
import {
  CalendarCheck,
  CalendarX,
  Clock,
  MapPin,
  Download,
  Search,
} from "lucide-react";
import Footer from "@/components/common/Footer";
import { format } from "date-fns";
import SessionExpired from "@/components/common/SessionExpired";
import { checkAuth } from "@/utils/profile";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import CustomLoader from "@/components/common/CustomLoader";

const Events = () => {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("user");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  useEffect(() => {
    getCurrEvents();
    getPastEvents();
  }, []);

  const handleClosePopup = () => {
    router.replace("/user/login");
  };

  if (isAuthenticated === null) {
    return <CustomLoader text="Loading your wellness journey..." />;
  }

  if (!isAuthenticated) {
    return (
      <SessionExpired handleClosePopup={handleClosePopup} theme="orange" />
    );
  }

  async function getCurrEvents() {
    const res = await fetch("http://localhost:3000/common/events", {
      headers: { Authorization: "Bearer " + token },
    });
    const resp = await res.json();
    setCurrentEvents(resp);
  }

  async function getPastEvents() {
    const res = await fetch("http://localhost:3000/common/getPastEvents", {
      headers: { Authorization: "Bearer " + token },
    });
    const resp = await res.json();
    setPastEvents(resp);
  }

  const filterEvents = (events) => {
    return events.filter((event) => {
      return (
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  const NoEventsMessage = ({ message }) => (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <td colSpan={4} className="px-6 py-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          <CalendarX className="h-12 w-12 text-custom-gray-400 animate-pulse" />
          <p className="text-lg text-custom-gray-500 font-medium">{message}</p>
        </div>
      </td>
    </motion.tr>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-custom-orange-100 via-custom-orange-50 to-rose-50">
      <Navbar />

      <main className="pt-10 md:pt-20 pb-12 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex justify-center"
        >
          <div className="relative w-full max-w-3xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-custom-orange-500" />
            <input
              type="text"
              placeholder="Search events by title, description, or venue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full border border-custom-gray-200 focus:border-custom-orange-400 focus:ring-4 focus:ring-custom-orange-100 bg-custom-white/90 text-custom-gray-800 placeholder-custom-gray-400 focus:outline-none transition-all duration-300 text-base shadow-sm hover:shadow-md"
            />
          </div>
        </motion.div>

        {/* Desktop View */}
        <div className="hidden lg:block space-y-16">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-10">
              <div className="relative">
                <CalendarCheck className="h-9 w-9 text-custom-orange-500" />
                <div className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-custom-green-400 rounded-full animate-pulse border-2 border-custom-white" />
              </div>
              <h2 className="ml-4 text-3xl font-semibold text-custom-gray-900 tracking-tight">
                Upcoming Events
              </h2>
            </div>
            <div className="bg-custom-white/95 rounded-2xl shadow-lg p-8 border border-custom-gray-100 transition-all duration-300 hover:shadow-xl max-h-[500px] overflow-y-auto">
              <table className="min-w-full">
                <thead className="bg-custom-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-custom-gray-600 uppercase tracking-wider rounded-tl-xl">
                      Event
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-custom-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-custom-gray-600 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-custom-gray-600 uppercase tracking-wider rounded-tr-xl">
                      Venue
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-custom-gray-100">
                  <AnimatePresence>
                    {filterEvents(currentEvents).length > 0 ? (
                      filterEvents(currentEvents).map((event) => (
                        <motion.tr
                          key={event.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="hover:bg-custom-orange-50/50 transition-colors duration-200"
                        >
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-2.5 w-2.5 bg-custom-green-400 rounded-full mr-3 transition-transform duration-200" />
                              <span className="text-sm font-medium text-custom-gray-900">
                                {event.title}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-custom-gray-600">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-custom-orange-500" />
                              {format(event.dateTime, "dd MMM h:mm a")}
                            </div>
                          </td>
                          <td className="px-6 py-5 max-w-sm">
                            <p className="text-sm text-custom-gray-600 line-clamp-2">
                              {event.description}
                            </p>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-custom-gray-600">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-custom-orange-500" />
                              {event.venue}
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <NoEventsMessage message="No upcoming events scheduled" />
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.section>

          <motion.section
            szó
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center mb-10">
              <CalendarX className="h-9 w-9 text-custom-gray-500" />
              <h2 className="ml-4 text-3xl font-semibold text-custom-gray-900 tracking-tight">
                Past Events
              </h2>
            </div>
            <div className="bg-custom-white/95 rounded-2xl shadow-lg p-8 border border-custom-gray-100 transition-all duration-300 hover:shadow-xl max-h-[500px] overflow-y-auto">
              <table className="min-w-full">
                <thead className="bg-custom-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-custom-gray-600 uppercase tracking-wider rounded-tl-xl">
                      Event
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-custom-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-custom-gray-600 uppercase tracking-wider">
                      Venue
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-custom-gray-600 uppercase tracking-wider rounded-tr-xl">
                      Resources
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-custom-gray-100">
                  <AnimatePresence>
                    {filterEvents(pastEvents).length > 0 ? (
                      filterEvents(pastEvents).map((event) => (
                        <motion.tr
                          key={event.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="hover:bg-custom-orange-50/50 transition-colors duration-200"
                        >
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-custom-gray-900">
                            {event.title}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-custom-gray-600">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-custom-gray-400" />
                              {format(event.dateTime, "dd MMM h:mm a")}
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-custom-gray-600">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-custom-gray-400" />
                              {event.venue}
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            {event.url ? (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.open(event.url, "_blank")}
                                className="inline-flex items-center px-4 py-2 bg-custom-orange-500 text-custom-white rounded-lg hover:bg-custom-orange-600 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Resources
                              </motion.button>
                            ) : (
                              <span className="text-custom-gray-400 text-sm italic">
                                Not available
                              </span>
                            )}
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <NoEventsMessage message="No past events to display" />
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.section>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden space-y-12">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-8">
              <div className="relative">
                <CalendarCheck className="h-8 w-8 text-custom-orange-500" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-custom-green-400 rounded-full animate-pulse border-2 border-custom-white" />
              </div>
              <h2 className="ml-3 text-2xl font-semibold text-custom-gray-900 tracking-tight">
                Upcoming Events
              </h2>
            </div>
            <div className="space-y-6 max-h-[500px] overflow-y-auto">
              <AnimatePresence>
                {filterEvents(currentEvents).length > 0 ? (
                  filterEvents(currentEvents).map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-custom-white/95 rounded-xl shadow-md p-6 border border-custom-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                      <div className="flex items-center mb-4">
                        <div className="h-2.5 w-2.5 bg-emercld-400 rounded-full mr-3" />
                        <h3 className="text-lg font-medium text-custom-gray-900">
                          {event.title}
                        </h3>
                      </div>
                      <div className="space-y-3 text-sm text-custom-gray-600">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-custom-orange-500" />
                          {format(event.dateTime, "dd-MMM-yyyy h:mm a")}
                        </div>
                        <p className="text-custom-gray-600 line-clamp-3">
                          {event.description}
                        </p>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-custom-orange-500" />
                          {event.venue}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-custom-white/95 rounded-xl shadow-md p-6 text-center border border-custom-gray-100"
                  >
                    <CalendarX className="h-12 w-12 text-custom-gray-300 mx-auto mb-4 animate-pulse" />
                    <p className="text-custom-gray-500 text-sm italic">
                      No upcoming events scheduled
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center mb-8">
              <CalendarX className="h-8 w-8 text-custom-gray-500" />
              <h2 className="ml-3 text-2xl font-semibold text-custom-gray-900 tracking-tight">
                Past Events
              </h2>
            </div>
            <div className="space-y-6 max-h-[500px] overflow-y-auto">
              <AnimatePresence>
                {filterEvents(pastEvents).length > 0 ? (
                  filterEvents(pastEvents).map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-custom-white/95 rounded-xl shadow-md p-6 border border-custom-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                      <h3 className="text-lg font-medium text-custom-gray-900 mb-4">
                        {event.title}
                      </h3>
                      <div className="space-y-3 text-sm text-custom-gray-600">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-custom-gray-400" />
                          {format(event.dateTime, "dd-MMM-yyyy h:mm a")}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-custom-gray-400" />
                          {event.venue}
                        </div>
                        <div className="pt-2">
                          {event.url ? (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => window.open(event.url, "_blank")}
                              className="w-full flex items-center justify-center px-4 py-2 bg-custom-orange-500 text-custom-white rounded-lg hover:bg-custom-orange-600 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Content
                            </motion.button>
                          ) : (
                            <span className="text-custom-gray-400 text-sm italic block text-center">
                              Content not available
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-custom-white/95 rounded-xl shadow-md p-6 text-center border border-custom-gray-100"
                  >
                    <CalendarX className="h-12 w-12 text-custom-gray-300 mx-auto mb-4 animate-pulse" />
                    <p className="text-custom-gray-500 text-sm italic">
                      No past events to display
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        </div>
      </main>
      <Footer color={"orange"} />
    </div>
  );
};

export default Events;
