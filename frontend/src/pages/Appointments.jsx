import React, { useEffect, useState } from "react";
import { Bell, User, Calendar } from "lucide-react";
import Navbar from "../components/Navbar";
import PacmanLoader from "react-spinners/PacmanLoader";

// Sample data for appointments
// const previousAppointments = [
//   {
//     id: 1,
//     doctor: "Dr. Sarah Wilson",
//     details: "Cardiologist - Heart Center",
//     date: "2024-02-15",
//     timing: "10:00 AM",
//   },
//   {
//     id: 2,
//     doctor: "Dr. Michael Chen",
//     details: "Neurologist - Brain & Spine Institute",
//     date: "2024-02-10",
//     timing: "2:30 PM",
//   },
//   {
//     id: 3,
//     doctor: "Dr. Emily Brooks",
//     details: "Dermatologist - Skin Care Clinic",
//     date: "2024-02-01",
//     timing: "11:15 AM",
//   },
//   {
//     id: 4,
//     doctor: "Dr. James Miller",
//     details: "Orthopedist - Joint Care Center",
//     date: "2024-01-25",
//     timing: "3:45 PM",
//   },
//   {
//     id: 5,
//     doctor: "Dr. Lisa Thompson",
//     details: "Psychiatrist - Mental Health Center",
//     date: "2024-01-20",
//     timing: "1:00 PM",
//   },
// ];

// const upcomingAppointments = [
//   {
//     id: 1,
//     doctor: "Dr. Robert Johnson",
//     details: "Dentist - Dental Care Plus",
//     date: "2024-03-05",
//     timing: "9:30 AM",
//   },
//   {
//     id: 2,
//     doctor: "Dr. Patricia Lee",
//     details: "Ophthalmologist - Vision Care",
//     date: "2024-03-10",
//     timing: "2:00 PM",
//   },
//   {
//     id: 3,
//     doctor: "Dr. David Clark",
//     details: "ENT Specialist - Ear & Throat Center",
//     date: "2024-03-15",
//     timing: "11:45 AM",
//   },
//   {
//     id: 4,
//     doctor: "Dr. Susan White",
//     details: "Gynecologist - Women's Health",
//     date: "2024-03-20",
//     timing: "4:15 PM",
//   },
//   {
//     id: 5,
//     doctor: "Dr. Kevin Martinez",
//     details: "Physiotherapist - Physical Rehab",
//     date: "2024-03-25",
//     timing: "10:30 AM",
//   },
// ];

const UserAppointments = () => {
  const [previousAppointments, setpreviousAppointments] = useState([]);
  const [upcomingAppointments, setupcomingAppointments] = useState([]);
  const user_id = localStorage.getItem("userid");

  async function getPrevApp() {
    const res = await fetch(
      `https://built-it-xjiq.onrender.com/pastuserappt?userId=${user_id}`
    );
    const resp = await res.json();
    setpreviousAppointments(resp);
  }

  async function getCurrApp() {
    const res = await fetch(
      `https://built-it-xjiq.onrender.com/currentuserappt?userId=${user_id}`
    );
    const resp = await res.json();
    setupcomingAppointments(resp);
  }

  useEffect(() => {
    getPrevApp();
    getCurrApp();
  }, []);

  const NoAppointmentsMessage = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-8">
      <Calendar className="h-12 w-12 text-gray-400 mb-3" />
      <p className="text-lg text-gray-500 font-medium">{message}</p>
    </div>
  );

  return (
    <div>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Previous Appointments Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Previous Appointments
          </h2>
          <div className="max-h-[300px] overflow-y-auto">
            {previousAppointments.length > 0 ? (
              previousAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border-b border-gray-200 py-4 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <User className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {appointment.doctor}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {appointment.details}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-800">
                        {appointment.date}
                      </p>
                      <p className="text-sm text-gray-600">
                        {appointment.timing}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <NoAppointmentsMessage message="No previous appointments found" />
            )}
          </div>
        </div>

        {/* Upcoming Appointments Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Upcoming Appointments
          </h2>
          <div className="max-h-[300px] overflow-y-auto">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border-b border-gray-200 py-4 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <User className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {appointment.doctor}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {appointment.details}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-800">
                        {appointment.date}
                      </p>
                      <p className="text-sm text-gray-600">
                        {appointment.timing}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <NoAppointmentsMessage message="No upcoming appointments scheduled" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAppointments;
