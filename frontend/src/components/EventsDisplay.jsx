import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";

const EventsDisplay = () => {
  const events = [
    {
      name: "Interactive Session",
      detail: "Join us for an interactive session on mental health",
      date: "2022-10-10",
      time: "10:00 AM",
      location: "Zoom",
    },
    {
      name: "Yoga Session",
      detail: "Join us for a rejuvenating yoga session",
      date: "2022-10-12",
      time: "8:00 AM",
      location: "Community Center",
    },
    {
      name: "Yoga Session",
      detail: "Join us for a rejuvenating yoga session",
      date: "2022-10-12",
      time: "8:00 AM",
      location: "Community Center",
    },
    {
      name: "Yoga Session",
      detail: "Join us for a rejuvenating yoga session",
      date: "2022-10-12",
      time: "8:00 AM",
      location: "Community Center",
    },
    {
      name: "Yoga Session",
      detail: "Join us for a rejuvenating yoga session",
      date: "2022-10-12",
      time: "8:00 AM",
      location: "Community Center",
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-[var(--events-display-gray-800)]">Upcoming Events</h2>

      {events.map((event, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-[var(--mp-custom-peach)] to-[var(--mp-custom-white)] p-5 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <h3 className="text-lg font-semibold text-[var(--events-display-gray-900)]">{event.name}</h3>
          <p className="text-gray-700 mt-1">{event.detail}</p>

          <div className="flex items-center mt-3 space-x-4 text-[var(--events-display-gray-600)]">
            <p className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-1" /> {event.date}
            </p>
            <p className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-1" /> {event.time}
            </p>
            <p className="flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-1" /> {event.location}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsDisplay;
