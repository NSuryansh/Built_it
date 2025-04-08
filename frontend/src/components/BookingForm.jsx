import {
  ArrowLeft,
  Check,
  Clock,
  FileText,
  Mail,
  Phone,
  Stethoscope,
  User,
  Calendar,
} from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";

const BookingFormStep = ({
  formData,
  handleChange,
  onSubmit,
  onBack,
  selectedDoctor,
  isAuthenticated,
}) => {
  const [slots, setAvailableSlots] = useState([]);
  const [date, setSelectedDate] = useState("");
  const [time, setSelectedTime] = useState("");
  const fetchAvailableSlots = async (date) => {
    try {
      const doctorId = selectedDoctor.id;
      const response = await fetch(
        `http://localhost:3000/available-slots?date=${date}&docId=${doctorId}`
      );
      const data = await response.json();
      setAvailableSlots(data.availableSlots);
    } catch (error) {
      console.error("Error fetching available slots:", error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime("");
    fetchAvailableSlots(date);
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  //to get notifs for incoming requests
  const sendNotif = async () => {
    try {
      const res = await fetch("http://localhost:3000/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userid: selectedDoctor.id,
          message: `You have a new incoming appointment request!`,
          userType: "doc",
        }),
      });

      if (res.ok) {
        console.log("HALLELUJAH");
      } else {
        console.error("Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[var(--custom-orange-50)] to-white w-full max-w-[1200px] p-8 rounded-[20px] border-2 border-[var(--custom-orange-200)] shadow-xl">
      <div className="flex items-center justify-center gap-3 mb-8">
        <Stethoscope className="w-8 h-8 text-[var(--custom-orange-500)]" />
        <h2 className="text-center text-3xl font-bold text-[var(--custom-orange-500)] uppercase">
          Booking Details
        </h2>
      </div>

      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--custom-orange-100)] rounded-full">
          <User className="w-5 h-5 text-[var(--custom-orange-700)]" />
          <span className="text-[var(--custom-orange-800)] font-medium">
            {selectedDoctor.name}
          </span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group">
            <label className="flex items-center gap-2 text-[var(--custom-orange-800)] font-medium mb-2">
              <User className="w-4 h-4" />
              Full Name
              {isAuthenticated}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border-2 border-[var(--custom-orange-200)] focus:border-[var(--custom-orange-400)] focus:ring-2 focus:ring-[var(--custom-orange-200)] transition-all duration-200 outline-none ${
                isAuthenticated ? "bg-gray-200 cursor-not-allowed" : ""
              }`}
              placeholder="Enter your full name"
              required
              disabled={isAuthenticated}
            />
          </div>

          <div className="group">
            <label className="flex items-center gap-2 text-[var(--custom-orange-800)] font-medium mb-2">
              <Mail className="w-4 h-4" />
              Email Address
              {isAuthenticated}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border-2 border-[var(--custom-orange-200)] focus:border-[var(--custom-orange-400)] focus:ring-2 focus:ring-[var(--custom-orange-200)] transition-all duration-200 outline-none ${
                isAuthenticated ? "bg-gray-200 cursor-not-allowed" : ""
              }`}
              placeholder="Enter your email"
              required
              disabled={isAuthenticated}
            />
          </div>

          <div className="group">
            <label className="flex items-center gap-2 text-[var(--custom-orange-800)] font-medium mb-2">
              <Phone className="w-4 h-4" />
              Phone Number
              {isAuthenticated}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border-2 border-[var(--custom-orange-200)] focus:border-[var(--custom-orange-400)] focus:ring-2 focus:ring-[var(--custom-orange-200)] transition-all duration-200 outline-none ${
                isAuthenticated ? "bg-gray-200 cursor-not-allowed" : ""
              }`}
              placeholder="Enter your phone number"
              required
              disabled={isAuthenticated}
            />
          </div>

          <div className="group space-y-4">
            <label className="flex items-center gap-2 text-[var(--custom-orange-800)] font-medium">
              <Calendar className="w-4 h-4" />
              <Clock className="w-4 h-4" />
              Preferred Date & Time
            </label>

            <div className="grid grid-cols-2 gap-4">
              {/* Date Selection */}
              <div>
                <select
                  name="date"
                  value={formData.date.split("T")[0]}
                  onChange={(e) => {
                    const newDate = e.target.value;
                    const currentTime = formData.date.split("T")[2] || "09:00";
                    handleChange({
                      target: {
                        name: "date",
                        value: `${newDate}T${currentTime}`,
                      },
                    });
                    handleDateChange(newDate);
                    fetchAvailableSlots(newDate);
                  }}
                  className="w-full px-4 py-3 rounded-lg border-2 border-[var(--custom-orange-200)] focus:border-[var(--custom-orange-400)] focus:ring-2 focus:ring-[var(--custom-orange-200)] transition-all duration-200 outline-none bg-white"
                  required
                >
                  <option value="">Select Date</option>
                  {[...Array(14)].map((_, index) => {
                    const date = new Date();
                    date.setDate(date.getDate() + index);
                    const formattedDate = format(date, "yyyy-MM-dd");
                    const displayDate = format(date, "d MMM");
                    return (
                      <option key={formattedDate} value={formattedDate}>
                        {displayDate}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Time Selection */}
              <div>
                <select
                  name="time"
                  value={time}
                  onChange={(e) => {
                    const currentDate = formData.date.split("T")[0];
                    handleChange({
                      target: {
                        name: "date",
                        value: `${currentDate}T${e.target.value.split("T")[1]}`,
                      },
                    });
                    handleTimeChange(e);
                  }}
                  className="w-full px-4 py-3 rounded-lg border-2 border-[var(--custom-orange-200)] focus:border-[var(--custom-orange-400)] focus:ring-2 focus:ring-[var(--custom-orange-200)] transition-all duration-200 outline-none bg-white"
                >
                  <option value="">Select Time</option>
                  {Array.isArray(slots) &&
                    slots.map((slot) => (
                      <option key={slot.id} value={slot.starting_time}>
                        {slot.starting_time.split("T")[1].slice(0, 5)}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="group">
          <label className="flex items-center gap-2 text-[var(--custom-orange-800)] font-medium mb-2">
            <FileText className="w-4 h-4" />
            Brief Note about Your Problem
          </label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-[var(--custom-orange-200)] focus:border-[var(--custom-orange-400)] focus:ring-2 focus:ring-[var(--custom-orange-200)] transition-all duration-200 outline-none min-h-[150px] resize-y"
            placeholder="Please describe your symptoms or concerns..."
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-[var(--custom-orange-200)]">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white border-2 border-[var(--custom-orange-400)] text-[var(--custom-orange-600)] font-semibold hover:bg-[var(--custom-orange-50)] transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Doctors
          </button>

          <button
            onClick={() => {
              sendNotif();
            }}
            type="submit"
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-[var(--custom-orange-500)] text-white font-semibold hover:bg-[var(--custom-orange-600)] transform hover:scale-[1.02] transition-all duration-200"
          >
            <Check className="w-4 h-4" />
            Confirm Booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingFormStep;
