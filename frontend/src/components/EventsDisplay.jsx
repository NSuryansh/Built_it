import React from "react";

const EventsDisplay = () => {
  // Sample events array
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
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
      <div className="space-y-4">
        {events.map((event, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-md shadow hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold">{event.name}</h3>
            <p className="text-gray-600 mt-1">{event.detail}</p>
            
            <div className="flex items-center mt-2 space-x-4">
              <p className="text-sm text-gray-500">
                <strong>Date:</strong> {event.date}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Time:</strong> {event.time}
              </p>
            </div>
            
            <p className="text-sm text-gray-500 mt-1">
              <strong>Location:</strong> {event.location}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsDisplay;
