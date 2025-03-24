import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  // Sample data for the chart
  const data = [
    { name: 'Jan', appointments: 65 },
    { name: 'Feb', appointments: 59 },
    { name: 'Mar', appointments: 80 },
    { name: 'Apr', appointments: 81 },
    { name: 'May', appointments: 56 },
    { name: 'Jun', appointments: 55 },
  ];

  // Sample doctors data
  const doctors = [
    { id: 1, name: 'Dr. Sarah Wilson', specialty: 'Cardiologist' },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Neurologist' },
    { id: 3, name: 'Dr. Emily Brown', specialty: 'Pediatrician' },
  ];

  // Sample upcoming events
  const events = [
    { id: 1, title: 'Medical Conference', date: '2024-03-25' },
    { id: 2, title: 'Staff Training', date: '2024-03-28' },
    { id: 3, title: 'Vaccination Drive', date: '2024-04-01' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-orange-900">Dashboard Overview</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-orange-800 mb-4">Monthly Appointments</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="appointments" fill="#F97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-orange-800 mb-4">Available Doctors</h2>
          <div className="space-y-4">
            {doctors.map(doctor => (
              <div key={doctor.id} className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-900">{doctor.name}</h3>
                <p className="text-orange-600">{doctor.specialty}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-orange-800 mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {events.map(event => (
              <div key={event.id} className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-900">{event.title}</h3>
                <p className="text-orange-600">{new Date(event.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;