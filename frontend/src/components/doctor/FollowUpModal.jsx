import React, { useState, useEffect } from "react";
import { CalendarClock, X, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import PacmanLoader from "react-spinners/PacmanLoader";

const FollowUpModal = ({
  isOpen,
  onClose,
  onSubmit,
  selectedUser,
  isLoading,
}) => {
  const [followupDate, setFollowupDate] = useState("");
  const [followupTime, setFollowupTime] = useState("");
  const [reason, setReason] = useState("");
  const [slots, setSlots] = useState([]);

  const minDate = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    if (followupDate) {
      const fetchAvailableSlots = async (date) => {
        try {
          const doctorId = localStorage.getItem("userid");
          const response = await fetch(
            `http://localhost:3000/available-slots?date=${date}&docId=${doctorId}`,
            { headers: { Authorization: "Bearer " + token } }
          );
          const data = await response.json();
          setAvailableSlots(data.availableSlots);
        } catch (error) {
          console.error("Error fetching available slots:", error);
        }
      };
      fetchAvailableSlots(followupDate);
    }
  }, [followupDate]);

  const handleSubmit = () => {
    if (!selectedUser || !followupDate || !followupTime) return;

    onSubmit({
      userId: selectedUser.id,
      date: followupDate,
      time: followupTime,
      reason,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 sm:p-8 transform scale-95 animate-in fade-in slide-in-from-bottom-4 duration-300 border border-blue-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-violet-100 rounded-xl">
              <CalendarClock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-blue-500">
              Schedule Follow-up
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 sm:p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {selectedUser && (
          <div className="mb-5 flex items-center p-3 bg-blue-50 rounded-xl">
            <img
              src={selectedUser.profileImage}
              alt={selectedUser.username}
              className="w-10 h-10 rounded-full mr-3 object-cover border border-blue-200"
            />
            <div>
              <p className="font-medium text-blue-900">
                {selectedUser.username}
              </p>
              <p className="text-xs text-blue-600">{selectedUser.phone}</p>
            </div>
          </div>
        )}

        <div className="space-y-5 sm:space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                min={minDate}
                value={followupDate}
                onChange={(e) => {
                  setFollowupDate(e.target.value);
                  setFollowupTime("");
                }}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-none transition-all duration-200 text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Time
            </label>
            <div className="relative">
              <select
                value={followupTime}
                onChange={(e) => setFollowupTime(e.target.value)}
                disabled={!followupDate}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none bg-white disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="">Select Time</option>
                {slots.map((slot) => (
                  <option key={slot.id} value={slot.starting_time}>
                    {slot.starting_time.split("T")[1].slice(0, 5)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Reason
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for follow-up"
              className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-none transition-all duration-200 text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-6 sm:mt-8">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!followupDate || !followupTime || isLoading}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-500 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              {isLoading ? <PacmanLoader /> : "Schedule Follow-up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowUpModal;
