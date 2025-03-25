import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Calendar, Trash2 } from "lucide-react";
import AdminNavbar from "../../components/admin/admin_navbar";

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const handleDelete = (id) => {
    
    console.log("Delete event with id:", id);
  };

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
              date: date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }),
              location: event.venue,
              type: event.description ? "Session/Conference" : "Meeting",
            };
          });
          
          setEvents(formattedEvents);
        } catch (error) {
          console.error("Error fetching events", error);
        }
      };
  
      fetchEvents();
    }, []);

  return (
    <div className="flex flex-col">
      <AdminNavbar />
      <div className="space-y-6 md:min-w-5xl max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[var(--custom-primary-green-900)]">Events List</h1>
          <Link
            to="/admin/add_event"
            className="flex items-center gap-2 bg-[var(--custom-primary-green-600)] text-[var(--custom-white)] px-4 py-2 rounded-lg hover:bg-[var(--custom-primary-green-700)] transition-colors"
          >
            <Calendar size={20} />
            Add New Event
          </Link>
        </div>

        <div className="grid gap-6 mb-10">
          {events.map((event) => (
            <div key={event.id} className="bg-[var(--custom-white)] p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--custom-primary-green-900)]">
                    {event.title}
                  </h2>
                  <p className="text-[var(--custom-primary-green-600)] mt-1">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[var(--custom-primary-green-600)]">Location</p>
                  <p className="font-medium">{event.location}</p>
                </div>
                {/* <div>
                  <p className="text-sm text-[var(--custom-primary-green-600)]">Expected Attendees</p>
                  <p className="font-medium">{event.attendees}</p>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsList;
