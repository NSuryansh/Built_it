import React from "react";
import DoctorNavbar from "../../components/doctor/Navbar";
import { Calendar, MapPin, User, ChevronRight } from "lucide-react";

const DoctorLanding = () => {
  const appointments = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      time: "09:00 AM",
      date: "Today",
      type: "General Checkup",
    },
    {
      id: 2,
      patientName: "Michael Brown",
      time: "10:30 AM",
      date: "Today",
      type: "Follow-up",
    },
    {
      id: 3,
      patientName: "Emily Davis",
      time: "02:00 PM",
      date: "Tomorrow",
      type: "Consultation",
    },
  ];

  const events = [
    {
      id: 1,
      title: "Medical Conference",
      date: "March 15, 2024",
      location: "City Medical Center",
      type: "Conference",
    },
    {
      id: 2,
      title: "Staff Meeting",
      date: "March 18, 2024",
      location: "Main Office",
      type: "Meeting",
    },
  ];
  return (
    <div className="min-h-screen flex flex-col">
      <DoctorNavbar />
      <div className="h-full bg-gray-50">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Appointments Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Upcoming Appointments
                </h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>

              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {appointment.patientName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {appointment.type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {appointment.time}
                      </p>
                      <p className="text-sm text-gray-500">
                        {appointment.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Events Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Upcoming Events
                </h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>

              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900">
                        {event.title}
                      </h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        {event.type}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{event.date}</span>
                      <MapPin className="h-4 w-4 ml-4 mr-1" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLanding;
