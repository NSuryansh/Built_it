import React, { useEffect, useState } from "react";
import { Calendar, MapPin, Users, ArrowRight, Clock } from "lucide-react";
import { format } from "date-fns";

const EventsDisplay = () => {
  const token = localStorage.getItem("token");

  const [events, setEvents] = useState([]);
  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch("http://localhost:3000/events", {
        headers: { Authorization: "Bearer " + token },
      });
      const resp = await res.json();
      setEvents(resp);
    };

    fetchEvents();
  }, []);

  useEffect(() => {}, [events]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-[var(--events-display-gray-800)]">
        Upcoming Events
      </h2>

      {events.length > 0 ? (
        events.map((event) => (
          <div
            key={event.id}
            className="group bg-[var(--custom-orange-100)] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="mt-3 text-xl font-bold text-[var(--events-display-gray-900)] group-hover:text-[var(--events-display-gray-800)]">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-[var(--events-display-gray-600)] line-clamp-2">
                    {event.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-1 sm:gap-4 text-[var(--events-display-gray-600)]">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-[var(--mp-custom-peach)]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">
                    {format(event.dateTime, "MMM d - h:mm a")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-[var(--mp-custom-peach)]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{event.venue}</span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col bg-white/80 backdrop-blur-lg rounded-3xl shadow-md border border-orange-100 items-center justify-center py-8 px-4">
          <div className="h-24 w-24 rounded-full bg-orange-50 flex items-center justify-center mb-6">
            <Clock className="h-12 w-12 text-orange-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Upcoming Events
          </h3>
          <p className="text-gray-600 text-center max-w-md">
            There are no upcoming events scheduled.
          </p>
        </div>
      )}
    </div>
  );
};

export default EventsDisplay;
