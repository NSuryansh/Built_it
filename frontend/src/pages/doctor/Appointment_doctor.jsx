import React, { useEffect } from "react";
import {
  User,
  CircleUser,
  Calendar,
  Clock,
  Phone,
  FileText,
  AlertCircle,
} from "lucide-react";
import DoctorNavbar from "../../components/doctor/Navbar_doctor";
import { useState } from "react";
const DoctorAppointment = () => {
  const [fixed, setFixed] = useState(false);

  const [appointments, setapp] = useState([]);
  const [curr, setcurr] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const docId = localStorage.getItem("userid");
      const res = await fetch(`http://localhost:3000/reqApp?docId=${docId}`);
      const res2 = await fetch(`http://localhost:3000/currentdocappt?doctorId=${docId}`)
      const resp2 = await res.json();
      const resp = await res2.json()
      console.log(resp)
      setapp(resp2);
      setcurr(resp)
    };

    fetchData();
  }, [fixed])

  useEffect(() => {
    console.log(appointments);
  }, [appointments]);

  const acceptApp = async (appointment) => {
    console.log(appointment);
    const res = await fetch("http://localhost:3000/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: appointment["user_id"],
        doctorId: appointment["doctor_id"],
        dateTime: appointment["dateTime"],
        reason: appointment["reason"],
        id: appointment["id"],
      }),
    });

    const resp = await res.json();
    console.log(resp);
    setFixed(!fixed);
  };

  return (
    <div>
      <DoctorNavbar />
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Appointments */}
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Current Appointments
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your upcoming appointments
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 divide-y divide-gray-200">
                  {curr.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start space-x-6">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                              {appointment.patientName}
                            </h3>
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              {appointment.status}
                            </span>
                          </div>

                          <div className="mt-2 grid grid-cols-1 gap-4">
                            <div className="space-y-3">
                              <div className="flex items-center text-sm text-gray-500">
                                <CircleUser className="h-4 w-4 mr-2" />
                                {appointment.user.username}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-2" />
                                {appointment.dateTime}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Phone className="h-4 w-4 mr-2" />
                                {appointment.user.mobile}
                              </div>
                              <div className="flex items-start text-sm text-gray-500">
                                <FileText className="h-4 w-4 mr-2 mt-1" />
                                <span>{appointment.reason}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex space-x-3">
                            <button className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                              Reschedule
                            </button>
                            <button className="px-4 py-2 bg-red-50 text-red-700 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-100 transition-colors">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Incoming Requests */}
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Incoming Requests
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Review and accept new appointment requests
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start space-x-6">
                        <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                          <User className="h-6 w-6 text-amber-600" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                              {appointment.patientName}
                            </h3>
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                              {appointment.status}
                            </span>
                          </div>

                          <div className="mt-2 grid grid-cols-1 gap-4">
                            <div className="space-y-3">
                              <div className="flex items-center text-sm text-gray-500">
                                <CircleUser className="h-4 w-4 mr-2" />
                                {appointment.user.username}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-2" />
                                {appointment.dateTime}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Phone className="h-4 w-4 mr-2" />
                                {appointment.user.mobile}
                              </div>
                              <div className="flex items-start text-sm text-gray-500">
                                <FileText className="h-4 w-4 mr-2 mt-1" />
                                <span>{appointment.reason}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex space-x-3">
                            <button onClick={() => { acceptApp(appointment) }} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                              Accept
                            </button>
                            <button className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                              Reschedule
                            </button>
                            {/* <button className="px-4 py-2 bg-red-50 text-red-700 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-100 transition-colors">
                              Decline
                            </button> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointment;
