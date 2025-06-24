import React, { useState, useEffect } from "react";
import {
  CalendarClock,
  X,
  Calendar as CalendarIcon,
  Loader,
} from "lucide-react";
import { format } from "date-fns";
import CustomToast from "../common/CustomToast";
import { useSearchParams } from "react-router-dom";

const FollowUpModal = ({ isOpen, onClose, selectedAppointment }) => {
  const [followupDate, setFollowupDate] = useState("");
  const [followupTime, setFollowupTime] = useState("");
  const [reason, setReason] = useState("");
  const [slots, setAvailableSlots] = useState([]);
  const [isScheduling, setisScheduling] = useState(false);
  const minDate = format(new Date(), "yyyy-MM-dd");
  const token = localStorage.getItem("token");
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  useEffect(() => {
    if (followupDate) {
      const fetchAvailableSlots = async (date) => {
        try {
          const doctorId = localStorage.getItem("userid");
          const response = await fetch(
            `https://built-it.onrender.com/api/common/available-slots?date=${date}&docId=${doctorId}`,
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

  const handleSubmitFollowup = async () => {
    setisScheduling(true);
    try {
      const datetime = new Date(
        `${followupDate}T${followupTime.split("T")[1]}`
      ).toISOString();
      console.log(selectedAppointment);
      const response = await fetch(
        "https://built-it.onrender.com/api/doc/request-to-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            doctorId: localStorage.getItem("userid"),
            userId: userId,
            dateTime: datetime,
            reason: reason,
          }),
        }
      );
      const data = await response.json();
      CustomToast("Follow-up appointment scheduled", "blue");

      if (data["message"] === "Appointment requested successfully") {
        const notif = await fetch(
          "https://built-it.onrender.com/api/common/send-notification",
          {
            method: "POST",
            headers: {
              "Content-type": "Application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
              userId: userId,
              message: "Doctor has requested an appointment with you",
              userType: "user",
            }),
          }
        );
        setFollowupDate("");
        setFollowupTime("");
        setReason("");
        onClose();
        // setSelectedAppointment(null);
      } else {
        CustomToast("Failed to schedule follow-up appointment", "blue");
      }
    } catch (error) {
      console.error("Error scheduling follow-up:", error);
      CustomToast("Error scheduling follow-up appointment", "blue");
    }
    setisScheduling(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[var(--custom-black)]/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className="bg-[var(--custom-white)] rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 sm:p-8 transform scale-95 animate-in fade-in slide-in-from-bottom-4 duration-300 border border-[var(--custom-blue-100)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-[var(--custom-blue-100)] to-[var(--custom-purple-100)] rounded-xl">
              <CalendarClock className="h-5 w-5 sm:h-6 sm:w-6 text-[var(--custom-blue-600)]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-[var(--custom-blue-500)]">
              Schedule Follow-up
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--custom-gray-400)] hover:text-[var(--custom-gray-600)] transition-colors p-1.5 sm:p-2 hover:bg-[var(--custom-gray-100)] rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 sm:space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--custom-gray-700)]">
              Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-[var(--custom-gray-400)]" />
              </div>
              <input
                type="date"
                min={minDate}
                value={followupDate}
                onChange={(e) => {
                  setFollowupDate(e.target.value);
                  setFollowupTime("");
                }}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-[var(--custom-gray-200)] focus:ring-2 focus:ring-[var(--custom-blue-500)] focus:border-none transition-all duration-200 text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--custom-gray-700)]">
              Time
            </label>
            <div className="relative">
              <select
                value={followupTime}
                onChange={(e) => setFollowupTime(e.target.value)}
                disabled={!followupDate}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--custom-gray-200)] focus:ring-2 focus:ring-[var(--custom-blue-500)] focus:border-transparent transition-all duration-200 outline-none bg-[var(--custom-white)] disabled:bg-[var(--custom-gray-100)] disabled:text-[var(--custom-gray-400)]"
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
            <label className="block text-sm font-medium text-[var(--custom-gray-700)]">
              Reason
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for follow-up"
              className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-[var(--custom-gray-200)] focus:ring-2 focus:ring-[var(--custom-blue-500)] focus:border-none transition-all duration-200 text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-6 sm:mt-8">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border border-[var(--custom-gray-200)] text-[var(--custom-gray-700)] rounded-xl hover:bg-[var(--custom-gray-50)] transition-all duration-200 font-medium text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitFollowup}
              disabled={!followupDate || !followupTime || isScheduling}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-[var(--custom-blue-500)] text-[var(--custom-white)] font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              {isScheduling ? <Loader /> : "Schedule Follow-up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowUpModal;
