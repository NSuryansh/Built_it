import React, { useState, useEffect } from "react";
import { Calendar, Clock, CalendarDays, ArrowLeft, User } from "lucide-react";
import { ToastContainer } from "react-toastify";
import DoctorNavbar from "../../components/doctor/Navbar_doctor";
import { checkAuth } from "../../utils/profile";
import { useNavigate } from "react-router-dom";
import CustomToast from "../../components/CustomToast";
import SessionExpired from "../../components/SessionExpired";
import PacmanLoader from "react-spinners/PacmanLoader";

const DoctorLeave = () => {
  const [leaveDetails, setLeaveDetails] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();
  const name = localStorage.getItem("username");
  const desc = localStorage.getItem(" اسپ");
  const docId = localStorage.getItem("userid");
  const img = localStorage.getItem("docImage");
  const [startSlots, setStartSlots] = useState([]);
  const [endSlots, setEndSlots] = useState([]);
  const [startSelectedSlot, setstartSelectedSlot] = useState([]);
  const [endSelectedSlot, setEndSelectedSlot] = useState([]);

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("doc");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  const fetchAvailableSlots = async (date, start) => {
    try {
      const response = await fetch(
        `http://localhost:3000/available-slots?date=${date}&docId=${docId}`
      );
      const data = await response.json();
      console.log(data);
      if (start) {
        setStartSlots(data.availableSlots);
      } else {
        setEndSlots(data.availableSlots);
      }
    } catch (error) {
      console.error("Error fetching available slots:", error);
    }
  };

  const handleInputChange = (e) => {
    console.log(leaveDetails);
    const { name, value } = e.target;
    setLeaveDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const startDate = new Date(
      new Date(leaveDetails.startDate).getTime() +
        new Date(startSelectedSlot).getTime()
    );
    const endDate = new Date(
      new Date(leaveDetails.endDate).getTime() +
        new Date(endSelectedSlot).getTime()
    );
    console.log(startDate, endDate);

    const today = new Date();
    if (startDate > endDate || startDate < today) {
      CustomToast("Please select valid dates", "blue");
      return;
    }

    const setLeave = async () => {
      try {
        const response = await fetch(`http://localhost:3000/addLeave`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            doc_id: docId,
            start: startDate,
            end: endDate,
          }),
        });
        console.log(response.json());
        navigate("/doctor/profile");
        CustomToast("Leave added successfully", "blue");
      } catch (e) {
        console.error(e);
        CustomToast("Error taking leave", "blue");
      }
    };
    setLeave();
  };

  const handleClosePopup = () => {
    navigate("/doctor/login");
  };

  // Handler for back button
  const handleBack = () => {
    navigate("/doctor/profile");
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <PacmanLoader color="#004ba8" radius={6} height={20} width={5} />
        <p className="mt-4 text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="blue" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DoctorNavbar />
      <ToastContainer />
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="mr-4 text-blue-600 hover:text-blue-800 transition-colors"
                aria-label="Go back to history"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-3xl font-bold text-blue-900">
                Leave Management
              </h1>
            </div>
          </div>

          <div className="mb-8">
            <div className="mt-2 flex items-center">
              {img ? (
                <img
                  src={img}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 rounded-full text-blue-600 transform transition-all duration-300 group-hover:scale-110" />
              )}
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-blue-800">
                  Dr. {name}
                </h2>
                <p className="text-blue-600">{desc}</p>
              </div>
            </div>
          </div>

          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center text-blue-800">
              <Clock className="w-5 h-5 mr-2" />
              <h3 className="font-medium">Request Leave</h3>
            </div>
            <p className="mt-2 text-sm text-blue-600">
              Please select your leave duration by specifying start and end
              times.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={leaveDetails.startDate}
                    onChange={(e) => {
                      handleInputChange(e);
                      fetchAvailableSlots(e.target.value, true);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    Start Slot
                  </label>
                  <select
                    value={startSelectedSlot}
                    onChange={(e) => {
                      setstartSelectedSlot(e.target.value);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose a slot</option>
                    {startSlots.map((slot) => (
                      <option key={slot.id} value={slot.starting_time}>
                        {slot.starting_time.split("T")[1].slice(0, 5)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={leaveDetails.endDate}
                    onChange={(e) => {
                      handleInputChange(e);
                      fetchAvailableSlots(e.target.value, false);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    End Slot
                  </label>
                  <select
                    value={endSelectedSlot}
                    onChange={(e) => {
                      setEndSelectedSlot(e.target.value);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose a slot</option>
                    {endSlots.map((slot) => (
                      <option key={slot.id} value={slot.starting_time}>
                        {slot.starting_time.split("T")[1].slice(0, 5)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Reason for Leave
              </label>
              <textarea
                name="reason"
                value={leaveDetails.reason}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
                placeholder="Please provide a reason for your leave request..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorLeave;