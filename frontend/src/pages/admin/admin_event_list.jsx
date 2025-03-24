import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Trash2 } from 'lucide-react';

const EventsList = () => {
  const events = [
    { id: 1, title: 'Medical Conference', date: '2024-03-25', location: 'Main Auditorium', attendees: 50 },
    { id: 2, title: 'Staff Training', date: '2024-03-28', location: 'Training Room B', attendees: 25 },
    { id: 3, title: 'Vaccination Drive', date: '2024-04-01', location: 'Community Center', attendees: 100 },
    { id: 4, title: 'Board Meeting', date: '2024-04-05', location: 'Conference Room A', attendees: 15 },
    { id: 5, title: 'Health Workshop', date: '2024-04-10', location: 'Seminar Hall', attendees: 75 },
  ];

  const handleDelete = (id) => {
    // Handle event deletion
    console.log('Delete event with id:', id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-orange-900">Events List</h1>
        <Link
          to="/events/add"
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Calendar size={20} />
          Add New Event
        </Link>
      </div>

      <div className="grid gap-6">
        {events.map(event => (
          <div key={event.id} className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-orange-900">{event.title}</h2>
                <p className="text-orange-600 mt-1">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
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
                <p className="text-sm text-orange-600">Location</p>
                <p className="font-medium">{event.location}</p>
              </div>
              <div>
                <p className="text-sm text-orange-600">Expected Attendees</p>
                <p className="font-medium">{event.attendees}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsList;