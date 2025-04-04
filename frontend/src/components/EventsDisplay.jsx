import React, { useEffect, useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

const EventsDisplay = () => {
  // const events = [
  //   {
  //     name: "Interactive Session",
  //     detail: "Join us for an interactive session on mental health",
  //     date: "2022-10-10",
  //     time: "10:00 AM",
  //     location: "Zoom",
  //   },
  //   {
  //     name: "Yoga Session",
  //     detail: "Join us for a rejuvenating yoga session",
  //     date: "2022-10-12",
  //     time: "8:00 AM",
  //     location: "Community Center",
  //   },
  //   {
  //     name: "Yoga Session",
  //     detail: "Join us for a rejuvenating yoga session",
  //     date: "2022-10-12",
  //     time: "8:00 AM",
  //     location: "Community Center",
  //   },
  //   {
  //     name: "Yoga Session",
  //     detail: "Join us for a rejuvenating yoga session",
  //     date: "2022-10-12",
  //     time: "8:00 AM",
  //     location: "Community Center",
  //   },
  //   {
  //     name: "Yoga Session",
  //     detail: "Join us for a rejuvenating yoga session",
  //     date: "2022-10-12",
  //     time: "8:00 AM",
  //     location: "Community Center",
  //   },
  // ];

  const [events, setEvents] = useState([]);
  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch("http://localhost:3000/events");
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

      {events.map((event, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-[var(--mp-custom-peach)] to-[var(--mp-custom-white)] p-5 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <h3 className="text-lg font-semibold text-[var(--events-display-gray-900)]">
            {event.title}
          </h3>
          <p className="text-gray-700 mt-1">{event.description}</p>

          <div className="flex flex-wrap items-center mt-3 space-x-4 text-[var(--events-display-gray-600)]">
            <p className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-1" />{" "}
              {format(event.dateTime, "dd-MMM-yyyy h:mm")}
            </p>
            {/* <p className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-1" /> {event.time}
            </p> */}
            <p className="flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-1" /> {event.venue}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsDisplay;
