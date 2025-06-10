"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { useRouter } from "next/navigation";
import CustomLoader from "@/components/common/CustomLoader";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Events = () => {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const token = localStorage.getItem("token");
  const searchRef = useRef(null);
  const upcomingEventsRef = useRef(null);
  const pastEventsRef = useRef(null);

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

  useEffect(() => {
    if (isAuthenticated) {
      // Search Bar Animation
      gsap.fromTo(
        searchRef.current,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.3,
          duration: 1,
          ease: "power3.out",
        }
      );

      // Upcoming Events Animation (Desktop)
      if (upcomingEventsRef.current) {
        const upcomingEventRows = upcomingEventsRef.current.querySelectorAll("tbody .event-row");
        upcomingEventRows.forEach((row, index) => {
          const isOdd = index % 2 !== 0;
          gsap.fromTo(
            row,
            { opacity: 0, x: isOdd ? -400 : 400 },
            {
              opacity: 1,
              x: 0,
              duration: 1,
              stagger: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: upcomingEventsRef.current,
                start: "top 60%",
                toggleActions: "play none none none",
              },
            }
          );
        });
        // Animate NoEventsMessage if present
        const noEventsMessage = upcomingEventsRef.current.querySelector("tbody .no-events");
        if (noEventsMessage) {
          gsap.fromTo(
            noEventsMessage,
            { opacity: 0, y: 100 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              stagger: 0.4,
              ease: "power3.out",
              scrollTrigger: {
                trigger: upcomingEventsRef.current,
                start: "top 65%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      }

      // Past Events Animation (Desktop)
      if (pastEventsRef.current) {
        const pastEventRows = pastEventsRef.current.querySelectorAll("tbody .event-row");
        pastEventRows.forEach((row, index) => {
          const isOdd = index % 2 !== 0;
          gsap.fromTo(
            row,
            { opacity: 0, x: isOdd ? -400 : 400 },
            {
              opacity: 1,
              x: 0,
              duration: 1,
              stagger: 0.5,
              ease: "power3.out",
              scrollTrigger: {
                trigger: pastEventsRef.current,
                start: "top 60%",
                toggleActions: "play none none none",
              },
            }
          );
        });
        // Animate NoEventsMessage if present
        const noEventsMessage = pastEventsRef.current.querySelector("tbody .no-events");
        if (noEventsMessage) {
          gsap.fromTo(
            noEventsMessage,
            { opacity: 0, y: 100 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: pastEventsRef.current,
                start: "top 70%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      }

      // Upcoming Events Animation (Mobile)
      const mobileUpcomingEvents = document.querySelectorAll(".upcoming-mobile-events .event-card");
      mobileUpcomingEvents.forEach((event, index) => {
        const isOdd = index % 2 !== 0;
        gsap.fromTo(
          event,
          { opacity: 0, x: isOdd ? -300 : 300 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            stagger: 0.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: event,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      });
      // Animate NoEventsMessage for mobile upcoming events
      const mobileUpcomingNoEvents = document.querySelector(".upcoming-mobile-events .no-events");
      if (mobileUpcomingNoEvents) {
        gsap.fromTo(
          mobileUpcomingNoEvents,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger:0.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: mobileUpcomingNoEvents,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Past Events Animation (Mobile)
      const mobilePastEvents = document.querySelectorAll(".past-mobile-events .event-card");
      mobilePastEvents.forEach((event, index) => {
        const isOdd = index % 2 !== 0;
        gsap.fromTo(
          event,
          { opacity: 0, x: isOdd ? -300 : 300 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            stagger: 0.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: event,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          }
        );
      });
      // Animate NoEventsMessage for mobile past events
      const mobilePastNoEvents = document.querySelector(".past-mobile-events .no-events");
      if (mobilePastNoEvents) {
        gsap.fromTo(
          mobilePastNoEvents,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: mobilePastNoEvents,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }
  }, [isAuthenticated, currentEvents, pastEvents, searchTerm]);

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
    <tr className="no-events">
      <td colSpan={4} className="px-6 py-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          <CalendarX className="h-12 w-12 text-[var(--custom-gray-400)] animate-pulse" />
          <p className="text-lg text-[var(--custom-gray-500)] font-medium">
            {message}
          </p>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--custom-orange-100)] via-[var(--custom-orange-50)] to-rose-50">
      <Navbar />

      <main className="pt-10 md:pt-20 pb-12 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div ref={searchRef} className="mb-12 flex justify-center">
          <div className="relative w-full max-w-3xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[var(--custom-orange-500)]" />
            <input
              type="text"
              placeholder="Search events by title, description, or venue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full border border-[var(--custom-gray-200)] focus:border-[var(--custom-orange-400)] focus:ring-4 focus:ring-[var(--custom-orange-100)] bg-[var(--custom-white)]/90 text-[var(--custom-gray-800)] placeholder-[var(--custom-gray-400)] focus:outline-none transition-all duration-300 text-base shadow-sm hover:shadow-md"
            />
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block space-y-16">
          <section ref={upcomingEventsRef}>
            <div className="flex items-center mb-10">
              <div className="relative">
                <CalendarCheck className="h-9 w-9 text-[var(--custom-orange-500)]" />
                <div className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-[var(--custom-green-400)] rounded-full animate-pulse border-2 border-[var(--custom-white)]" />
              </div>
              <h2 className="ml-4 text-3xl font-semibold text-[var(--custom-gray-900)] tracking-tight">
                Upcoming Events
              </h2>
            </div>
            <div className="bg-[var(--custom-white)]/95 rounded-2xl shadow-lg p-8 border border-[var(--custom-gray-100)] transition-all duration-300 hover:shadow-xl max-h-[500px] overflow-y-auto">
              <table className="min-w-full">
                <thead className="bg-[var(--custom-gray-50)]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[var(--custom-gray-600)] uppercase tracking-wider rounded-tl-xl">
                      Event
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[var(--custom-gray-600)] uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[var(--custom-gray-600)] uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[var(--custom-gray-600)] uppercase tracking-wider rounded-tr-xl">
                      Venue
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--custom-gray-100)]">
                  {filterEvents(currentEvents).length > 0 ? (
                    filterEvents(currentEvents).map((event) => (
                      <tr
                        key={event.id}
                        className="event-row hover:bg-[var(--custom-orange-50)]/50 transition-colors duration-200"
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-2.5 w-2.5 bg-[var(--custom-green-400)] rounded-full mr-3 transition-transform duration-200" />
                            <span className="text-sm font-medium text-[var(--custom-gray-900)]">
                              {event.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-[var(--custom-gray-600)]">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-[var(--custom-orange-500)]" />
                            {format(event.dateTime, "dd MMM h:mm a")}
                          </div>
                        </td>
                        <td className="px-6 py-5 max-w-sm">
                          <p className="text-sm text-[var(--custom-gray-600)] line-clamp-2">
                            {event.description}
                          </p>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-[var(--custom-gray-600)]">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-[var(--custom-orange-500)]" />
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

          <section ref={pastEventsRef}>
            <div className="flex items-center mb-10">
              <CalendarX className="h-9 w-9 text-[var(--custom-gray-500)]" />
              <h2 className="ml-4 text-3xl font-semibold text-[var(--custom-gray-900)] tracking-tight">
                Past Events
              </h2>
            </div>
            <div className="bg-[var(--custom-white)]/95 rounded-2xl shadow-lg p-8 border border-[var(--custom-gray-100)] transition-all duration-300 hover:shadow-xl max-h-[500px] overflow-y-auto">
              <table className="min-w-full">
                <thead className="bg-[var(--custom-gray-50)]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[var(--custom-gray-600)] uppercase tracking-wider rounded-tl-xl">
                      Event
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[var(--custom-gray-600)] uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[var(--custom-gray-600)] uppercase tracking-wider">
                      Venue
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[var(--custom-gray-600)] uppercase tracking-wider rounded-tr-xl">
                      Resources
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--custom-gray-100)]">
                  {filterEvents(pastEvents).length > 0 ? (
                    filterEvents(pastEvents).map((event) => (
                      <tr
                        key={event.id}
                        className="event-row hover:bg-[var(--custom-orange-50)]/50 transition-colors duration-200"
                      >
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-[var(--custom-gray-900)]">
                          {event.title}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-[var(--custom-gray-600)]">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-[var(--custom-gray-400)]" />
                            {format(event.dateTime, "dd MMM h:mm a")}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-[var(--custom-gray-600)]">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-[var(--custom-gray-400)]" />
                            {event.venue}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          {event.url ? (
                            <button
                              onClick={() => window.open(event.url, "_blank")}
                              className="inline-flex items-center px-4 py-2 bg-[var(--custom-orange-500)] text-[var(--custom-white)] rounded-lg hover:bg-[var(--custom-orange-600)] transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Resources
                            </button>
                          ) : (
                            <span className="text-[var(--custom-gray-400)] text-sm italic">
                              Not available
                            </span>
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
        <div className="lg:hidden space-y-12">
          <section>
            <div className="flex items-center mb-8">
              <div className="relative">
                <CalendarCheck className="h-8 w-8 text-[var(--custom-orange-500)]" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-[var(--custom-green-400)] rounded-full animate-pulse border-2 border-[var(--custom-white)]" />
              </div>
              <h2 className="ml-3 text-2xl font-semibold text-[var(--custom-gray-900)] tracking-tight">
                Upcoming Events
              </h2>
            </div>
            <div className="upcoming-mobile-events space-y-6 max-h-[500px] overflow-y-auto">
              {filterEvents(currentEvents).length > 0 ? (
                filterEvents(currentEvents).map((event) => (
                  <div
                    key={event.id}
                    className="event-card bg-[var(--custom-white)]/95 rounded-xl shadow-md p-6 border border-[var(--custom-gray-100)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="flex items-center mb-4">
                      <div className="h-2.5 w-2.5 bg-[var(--custom-green-400)] rounded-full mr-3" />
                      <h3 className="text-lg font-medium text-[var(--custom-gray-900)]">
                        {event.title}
                      </h3>
                    </div>
                    <div className="space-y-3 text-sm text-[var(--custom-gray-600)]">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-[var(--custom-orange-500)]" />
                        {format(event.dateTime, "dd-MMM-yyyy h:mm a")}
                      </div>
                      <p className="text-[var(--custom-gray-600)] line-clamp-3">
                        {event.description}
                      </p>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-[var(--custom-orange-500)]" />
                        {event.venue}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-events bg-[var(--custom-white)]/95 rounded-xl shadow-md p-6 text-center border border-[var(--custom-gray-100)]">
                  <CalendarX className="h-12 w-12 text-[var(--custom-gray-300)] mx-auto mb-4 animate-pulse" />
                  <p className="text-[var(--custom-gray-500)] text-sm italic">
                    No upcoming events scheduled
                  </p>
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center mb-8">
              <CalendarX className="h-8 w-8 text-[var(--custom-gray-500)]" />
              <h2 className="ml-3 text-2xl font-semibold text-[var(--custom-gray-900)] tracking-tight">
                Past Events
              </h2>
            </div>
            <div className="past-mobile-events space-y-6 max-h-[500px] overflow-y-auto">
              {filterEvents(pastEvents).length > 0 ? (
                filterEvents(pastEvents).map((event) => (
                  <div
                    key={event.id}
                    className="event-card bg-[var(--custom-white)]/95 rounded-xl shadow-md p-6 border border-[var(--custom-gray-100)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <h3 className="text-lg font-medium text-[var(--custom-gray-900)] mb-4">
                      {event.title}
                    </h3>
                    <div className="space-y-3 text-sm text-[var(--custom-gray-600)]">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-[var(--custom-gray-400)]" />
                        {format(event.dateTime, "dd-MMM-yyyy h:mm a")}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-[var(--custom-gray-400)]" />
                        {event.venue}
                      </div>
                      <div className="pt-2">
                        {event.url ? (
                          <button
                            onClick={() => window.open(event.url, "_blank")}
                            className="w-full flex items-center justify-center px-4 py-2 bg-[var(--custom-orange-500)] text-[var(--custom-white)] rounded-lg hover:bg-[var(--custom-orange-600)] transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Content
                          </button>
                        ) : (
                          <span className="text-[var(--custom-gray-400)] text-sm italic block text-center">
                            Content not available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-events bg-[var(--custom-white)]/95 rounded-xl shadow-md p-6 text-center border border-[var(--custom-gray-100)]">
                  <CalendarX className="h-12 w-12 text-[var(--custom-gray-300)] mx-auto mb-4 animate-pulse" />
                  <p className="text-[var(--custom-gray-500)] text-sm italic">
                    No past events to display
                  </p>
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