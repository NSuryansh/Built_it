import React, { useEffect, useState } from "react";
import { Link } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CustomToast from "../CustomToast";

const DoctorCalendar = ({ onDateSelect }) => {
  const [appointments, setAppointments] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [pastAppointments, setPastAppointments] = useState([]); // List for past event dates
  const [futureAppointments, setFutureAppointments] = useState([]); // List for future event dates
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const docId = localStorage.getItem("userid");
    if (!docId) return;

    const fetchAppointments = async () => {
      try {
        const res = await fetch(
          `https://built-it.onrender.com/pastdocappt?doctorId=${docId}`,
          {
            headers: { Authorization: "Bearer " + token },
          }
        );
        const response = await fetch(
          `https://built-it.onrender.com/currentdocappt?doctorId=${docId}`,
          {
            headers: { Authorization: "Bearer " + token },
          }
        );
        const data = await response.json();
        const data2 = await res.json();

        const formattedAppointments = data.map((appt) => {
          const dateObj = new Date(appt.dateTime);
          return {
            id: appt.id,
            patientName: `User ${appt.user_id}`,
            time: dateObj.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            date: dateObj.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            type: appt.reason,
          };
        });
        setFutureAppointments(
          formattedAppointments.map((appointment) =>
            format(new Date(appointment.date), "yyyy-MM-dd")
          )
        );
        const formattedPrevAppointments = data2.map((appt) => {
          const dateObj = new Date(appt.createdAt);
          return {
            id: appt.id,
            patientName: `User ${appt.user_id}`,
            time: dateObj.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            date: dateObj.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            type: appt.reason,
          };
        });
        setPastAppointments(
          formattedPrevAppointments.map((appointment) =>
            format(new Date(appointment.date), "yyyy-MM-dd")
          )
        );
        setAppointments(formattedAppointments);
      } catch (error) {
        console.error("Error fetching appointments", error);
        CustomToast("Error while fetching data");
      }
    };

    fetchAppointments();
  }, [isAuthenticated]);

  const startDate = startOfWeek(startOfMonth(currentMonth));
  const endDate = endOfWeek(endOfMonth(currentMonth));
  const days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const todayString = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="bg-white mx-auto max-w-md rounded-xl shadow-sm p-6">
      {/* Header with month navigation */}
      <div className="flex items-center justify-center mb-6">
        {/* <div className="flex items-center"> */}
        {/* <h2 className="text-xl font-semibold text-gray-900">Calendar</h2> */}
        {/* </div> */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm font-medium text-gray-900">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <button
            onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="space-y-4">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((dayItem, index) => {
            const dayString = format(dayItem, "yyyy-MM-dd");
            const isToday = dayString === todayString;
            const isPastAppointment = pastAppointments.includes(dayString);
            const isFutureAppointment = futureAppointments.includes(dayString);
            const isSelected = isSameDay(dayItem, selectedDate);

            return (
              <button
                key={index}
                onClick={() => {
                  setSelectedDate(dayItem);
                  if (isPastAppointment || isFutureAppointment) {
                    navigate("/doctor/appointments");
                  }
                }}
                className={`
                  relative aspect-square p-1 flex items-center justify-center
                  text-sm font-medium rounded-md transition-all duration-200
                  ${
                    !isSameMonth(dayItem, currentMonth)
                      ? "text-gray-400"
                      : "text-gray-900"
                  }
                  ${isToday ? "ring-2 ring-black ring-offset-1 font-bold" : ""}
                  ${isSelected && !isToday ? "ring-2 ring-blue-500" : ""}
                  ${
                    isPastAppointment
                      ? "bg-rose-500 text-white hover:bg-rose-600"
                      : ""
                  }
                  ${
                    isFutureAppointment
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : ""
                  }
                  ${
                    !isPastAppointment && !isFutureAppointment
                      ? "hover:bg-gray-100"
                      : ""
                  }
                `}
              >
                {format(dayItem, "d")}
                {(isPastAppointment || isFutureAppointment) && (
                  <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 pt-4 mt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-rose-500 rounded-full"></span>
          <span className="text-xs text-gray-600">Past Appts</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
          <span className="text-xs text-gray-600">Upcoming Appts</span>
        </div>
      </div>
    </div>
  );
};

export default DoctorCalendar;
