import React, { useState, useEffect } from "react";
import { Calendar, Clock, CalendarDays, ArrowLeft } from "lucide-react";
import { ToastContainer } from "react-toastify";
import DoctorNavbar from "../../components/doctor/Navbar_doctor";
import { checkAuth } from "../../utils/profile";
import { useNavigate } from "react-router-dom";

const DoctorLeave = () => {
  const [leaveType, setLeaveType] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedSlot, setSelectedSlot] = useState("");
  const [reason, setReason] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();
  const [name, setname] = useState(localStorage.getItem("username"));
  const [desc, setDesc] = useState(localStorage.getItem("desc"));
  const docId = localStorage.getItem("userid");
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("doc");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  const fetchAvailableSlots = async (date) => {
    try {
      const response = await fetch(
        `http://localhost:3000/available-slots?date=${date}&docId=${docId}`
      );
      const data = await response.json();
      setSlots(data.availableSlots);
    } catch (error) {
      console.error("Error fetching available slots:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      leaveType,
      selectedDate,
      dateRange,
      selectedSlot,
      reason,
    });
  };

  const handleGoBack = () => {
    setLeaveType(null);
    setSelectedDate("");
    setDateRange({ start: "", end: "" });
    setSelectedSlot("");
    setReason("");
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <DoctorNavbar />
      <ToastContainer />
      <div className="max-w-4xl my-auto w-full mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-900">
              Leave Management
            </h1>
            <div className="mt-2 flex items-center">
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop"
                alt="Doctor profile"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-blue-800">
                  Dr. {name}
                </h2>
                <p className="text-blue-600">{desc}</p>
              </div>
            </div>
          </div>

          {leaveType ? (
            <div>
              <button
                onClick={handleGoBack}
                className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </button>
              <form onSubmit={handleSubmit} className="space-y-6">
                {leaveType === "slot" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-blue-900 mb-2">
                        Select Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-900 mb-2">
                        Select Slot
                      </label>
                      <select
                        value={selectedSlot}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Choose a slot</option>
                        {slots.map((slot) => (
                          <option key={slot.id} value={slot.id}>
                            {slot.time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {(leaveType === "day" || leaveType === "range") && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-900 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) =>
                          setDateRange((prev) => ({
                            ...prev,
                            start: e.target.value,
                          }))
                        }
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    {leaveType === "range" && (
                      <div>
                        <label className="block text-sm font-medium text-blue-900 mb-2">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={dateRange.end}
                          onChange={(e) =>
                            setDateRange((prev) => ({
                              ...prev,
                              end: e.target.value,
                            }))
                          }
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    Reason for Leave
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
                    placeholder="Please provide a reason for your leave request..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Submit Leave Request
                </button>
              </form>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <button
                onClick={() => setLeaveType("slot")}
                className={`p-4 rounded-lg border-2 flex flex-col items-center transition-all ${
                  leaveType === "slot"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <Clock className="w-8 h-8 text-blue-600 mb-2" />
                <span className="font-medium text-blue-900">Slot Leave</span>
              </button>

              <button
                onClick={() => setLeaveType("day")}
                className={`p-4 rounded-lg border-2 flex flex-col items-center transition-all ${
                  leaveType === "day"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <Calendar className="w-8 h-8 text-blue-600 mb-2" />
                <span className="font-medium text-blue-900">
                  Full Day Leave
                </span>
              </button>

              <button
                onClick={() => setLeaveType("range")}
                className={`p-4 rounded-lg border-2 flex flex-col items-center transition-all ${
                  leaveType === "range"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <CalendarDays className="w-8 h-8 text-blue-600 mb-2" />
                <span className="font-medium text-blue-900">
                  Date Range Leave
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorLeave;
