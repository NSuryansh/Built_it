import React, { useState, useMemo, useEffect } from "react";
import { Calendar, Users, Clock, Search, User, Stethoscope, CalendarClock, CheckCircle2, Clock3, AlertCircle, X } from "lucide-react";
import Footer from "../../components/Footer";
import { format } from "date-fns";
import DoctorNavbar from "../../components/doctor/Navbar_doctor";


const History = () => {
    const [app, setApp] = useState([])
    const [showFollowupModal, setShowFollowupModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [followupDate, setFollowupDate] = useState("");
    const [followupTime, setFollowupTime] = useState("");
    const [searchUser, setSearchUser] = useState("");
    const [reason, setReason] = useState("")

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    const getPastAppointments = async()=>{
        const docId = localStorage.getItem("userid")
        const response = await fetch(`http://localhost:3000/pastdocappt?doctorId=${docId}`)
        const data = await response.json()
        setApp(data)
    }

    const handleFollowup = async(appointment)=>{
        setSelectedAppointment(appointment);
        setShowFollowupModal(true);
    }

    const handleSubmitFollowup = async () => {
        try {
            const response = await fetch('http://localhost:3000/request-to-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    doctorId: localStorage.getItem("userid"),
                    userId: selectedAppointment.user.id,
                    datetime: followupDate,
                    reason: reason
                }),
            });

            if (response.ok) {
                alert('Follow-up appointment scheduled successfully!');
                setShowFollowupModal(false);
                setFollowupDate("");
                setFollowupTime("");
                setSelectedAppointment(null);
            } else {
                alert('Failed to schedule follow-up appointment');
            }
        } catch (error) {
            console.error('Error scheduling follow-up:', error);
            alert('Error scheduling follow-up appointment');
        }
    };


    useEffect(() => {
      getPastAppointments()
    }, [])

    useEffect(() => {
    console.log(app)
    }, [app])
    
  

  const filteredAppointments = useMemo(() => {
    let filtered = app;
    console.log(filtered, "hello")
    if (searchUser.trim()) {
      console.log(searchUser)
      filtered = filtered.filter((app) =>{
        
        app.user.username.toLowerCase().includes(searchUser.toLowerCase())
      }
      );
    }

    return filtered;
  }, [ searchUser, app]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-teal-50">
      <DoctorNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-12 py-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by patient name..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md hover:shadow-lg transition-all duration-300"
            />
          </div>
       
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-6 mb-6">
       
        {/* Appointments List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
            <h2 className="text-2xl font-semibold text-gray-900">
              Recent Appointments
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {app.map((appointment) => (
              <div
                key={appointment.id}
                className="p-6 hover:bg-blue-50/50 transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Patient Info */}
                  <div className="flex-1 bg-gradient-to-br from-blue-50/50 to-transparent p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <User className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">Patient Details</h3>
                    </div>
                    <p className="text-lg font-medium text-blue-900 mb-1">
                      {appointment.user.username}
                    </p>
                   
                  </div>

                  {/* Doctor Info */}
                  <div className="flex-1 bg-gradient-to-br from-green-50/50 to-transparent p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <Stethoscope className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Notes</h3>
                    </div>
                    <p className="text-lg font-medium text-green-900 mb-1">
                      {appointment.note}
                    </p>
                   
                  </div>

                  {/* Appointment Info */}
                  <div className="flex-1 bg-gradient-to-br from-purple-50/50 to-transparent p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <CalendarClock className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-900">Appointment Details</h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-medium text-purple-900 mb-1">
                          {format(new Date(appointment.createdAt), "dd MMM yyyy")}
                        </p>
                        {/* <p className="text-sm text-purple-600/80">{appointment.time}</p> */}
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-sm border border-gray-100">
                        {/* {getStatusIcon(appointment.status)} */}
                        {/* <span className={`text-sm font-medium ${
                          appointment.status === "Confirmed"
                            ? "text-green-600"
                            : appointment.status === "Pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}>
                          {appointment.status}
                        </span> */}
                        <button onClick={()=>handleFollowup(appointment)}>Followup</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      {showFollowupModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">Schedule Follow-up</h3>
                            <button
                                onClick={() => setShowFollowupModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Select Date
                                </label>
                                <input
                                    type="date"
                                    min={minDate}
                                    value={followupDate}
                                    onChange={(e) => setFollowupDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Select Time
                                </label>
                                <input
                                    type="time"
                                    value={followupTime}
                                    onChange={(e) => setFollowupTime(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Enter reason
                                </label>
                                <input
                                    type="text"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowFollowupModal(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitFollowup}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    disabled={!followupDate || !followupTime}
                                >
                                    Schedule Follow-up
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
      <Footer color="green" />
    </div>
  );
};

export default History;