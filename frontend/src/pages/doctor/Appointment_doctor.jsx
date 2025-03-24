import React, { useEffect } from "react";
import {User, CircleUser , Calendar, Clock, Phone, FileText, AlertCircle,} from "lucide-react";
import DoctorNavbar from "../../components/doctor/Navbar_doctor";
import { useState } from "react";
const DoctorAppointment = () => {
  const [fixed, setFixed] = useState(false);
  // const appointments = [
  //   {
  //     id: 1,
  //     patientName: "Sarah Johnson",
  //     time: "09:00 AM",
  //     date: "March 14, 2024",
  //     type: "General Checkup",
  //     phone: "+1 (555) 123-4567",
  //     status: "Confirmed",
  //     notes: "Annual physical examination",
  //     lastVisit: "September 15, 2023",
  //   },
  //   {
  //     id: 2,
  //     patientName: "Michael Brown",
  //     time: "10:30 AM",
  //     date: "March 14, 2024",
  //     type: "Follow-up",
  //     phone: "+1 (555) 234-5678",
  //     status: "Confirmed",
  //     notes: "Post-surgery follow-up",
  //     lastVisit: "February 28, 2024",
  //   },
  //   {
  //     id: 3,
  //     patientName: "Emily Davis",
  //     time: "02:00 PM",
  //     date: "March 15, 2024",
  //     type: "Consultation",
  //     phone: "+1 (555) 345-6789",
  //     status: "Pending",
  //     notes: "First time visit - knee pain",
  //     lastVisit: "N/A",
  //   },
  // ];

  const [appointments, setapp] = useState([])
  useEffect(()=>{
    const fetchData = async () => {
    const docId = localStorage.getItem("userid");
    const res = await fetch(`http://localhost:3000/reqApp?docId=${docId}`);
    const resp2 = await res.json();
    setapp(resp2);
  };

  fetchData();
  }, [fixed])

  useEffect(() => {
    console.log(appointments)
  }, [appointments])

  const acceptApp=async (appointment)=>{
    console.log(appointment)
    const res = await fetch("http://localhost:3000/book",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        userId: appointment["user_id"],
        doctorId: appointment["doctor_id"],
        dateTime: appointment["dateTime"],
        reason: appointment["reason"],
        id: appointment["id"]
      })
    })

    const resp = await res.json()
    console.log(resp)
    setFixed(!fixed)
  }
  
  
  return (
    <div>
      <DoctorNavbar />
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your upcoming appointments
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
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        {appointment.patientName}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          appointment.status === "Confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start text-sm text-gray-500">
                          <FileText className="h-4 w-4 mr-2 mt-1" />
                          <span>{appointment.reason}</span>
                        </div>
                        
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-3">
                      <button onClick={()=>acceptApp(appointment)} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        Accept
                      </button>
                      <button className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                        Reschedule
                      </button>
                      
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointment;
