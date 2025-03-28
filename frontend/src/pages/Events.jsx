import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { CalendarCheck, CalendarX } from 'lucide-react';
import Footer from '../components/Footer';
// Mock data for events
// const pastEvents = Array.from({ length: 10 }, (_, i) => ({
//   id: `past-${i + 1}`,
//   name: `Event-${i + 1}`,
//   date: '2024-02-15',
//   detail: 'A wonderful past event that brought people together',
//   venue: 'Grand Plaza Hotel'
// }));

// const currentEvents = Array.from({ length: 10 }, (_, i) => ({
//   id: `current-${i + 1}`,
//   name: `Event-${i + 1}`,
//   date: '2024-03-15',
//   detail: 'An exciting ongoing event you won\'t want to miss',
//   venue: 'City Convention Center'
// }));
function Events() {
  const [currentEvents, setcurrentEvents] = useState([]);
  const [pastEvents, setpastEvents] = useState([]);

  async function getCurrEvents() {
    const res = await fetch("https://built-it-xjiq.onrender.com/events");
    const resp = await res.json();
    setcurrentEvents(resp);
  }

  async function getPastEvents() {
    const res = await fetch("https://built-it-xjiq.onrender.com/getPastEvents");
    const resp = await res.json();
    setpastEvents(resp);
  }

  useEffect(() => {
    getCurrEvents();
  }, []);

  useEffect(() => {
    getPastEvents();
  }, []);

  useEffect(() => {
    console.log(currentEvents);
  }, [currentEvents]);

  useEffect(() => {
    console.log(pastEvents);
  }, [pastEvents]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 via-pink-100 to-orange-100">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Past Events Section */}
        <section className="mb-12">
          <div className="flex items-center mb-4">
            <CalendarX className="h-6 w-6 text-gray-600 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Past Events
            </h2>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 overflow-auto max-h-[300px]">
            <table className="min-w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Venue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pastEvents.length > 0 ? (
                  pastEvents.map((event) => (
                    <tr key={event.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {event.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(event.dateTime, "dd-MMM-yyyy h:mm")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {event.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.venue}
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

        {/* Current Events Section */}
        <section className="mb-12">
          <div className="flex items-center mb-4">
            <CalendarCheck className="h-6 w-6 text-orange-500 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Upcoming Events
            </h2>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 overflow-auto max-h-[300px]">
            <table className="min-w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Venue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentEvents.length > 0 ? (
                  currentEvents.map((event) => (
                    <tr key={event.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {event.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(event.dateTime, "dd-MMM-yyyy h:mm")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {event.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.venue}
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
      </main>
      <Footer color={"orange"} />
    </div>
  );
}

export default Events;
