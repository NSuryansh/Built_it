import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Calendar = ({ onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [pastEvents, setPastEvents] = useState([]); // List for past event dates
  const [futureEvents, setFutureEvents] = useState([]); // List for future event dates
  const navigate = useNavigate();

  // Fetch past events
  useEffect(() => {
    axios
      .get("http://built-it-xjiq.onrender.com/getPastEvents")
      .then((response) => {
        setPastEvents(
          response.data.map((event) =>
            format(new Date(event.dateTime), "yyyy-MM-dd")
          )
        );
      })
      .catch((error) => console.error("Error fetching past events:", error));
  }, []);

  // Fetch future events
  useEffect(() => {
    axios
      .get("http://built-it-xjiq.onrender.com/events")
      .then((response) => {
        setFutureEvents(
          response.data.map((event) =>
            format(new Date(event.dateTime), "yyyy-MM-dd")
          )
        );
        console.log(futureEvents);
      })
      .catch((error) => console.error("Error fetching future events:", error));
  }, []);

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
    <div className="p-4 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
          className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h2 className="text-xl font-semibold text-gray-900">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button
          onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
          className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayLabel) => (
          <div key={dayLabel} className="font-semibold text-gray-700">
            {dayLabel}
          </div>
        ))}
        {days.map((dayItem, index) => {
          const dayString = format(dayItem, "yyyy-MM-dd");
          const isToday = dayString === todayString;
          const isPastEvent = pastEvents.includes(dayString);
          const isFutureEvent = futureEvents.includes(dayString);

          return (
            <button
              key={index}
              className={`relative p-2 rounded-lg w-10 h-10 transition-all
                ${
                  isSameMonth(dayItem, currentMonth)
                    ? "text-gray-900"
                    : "text-gray-400"
                }
                ${
                  isPastEvent
                    ? "bg-red-500 text-white"
                    : isFutureEvent
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }
                ${isSameDay(dayItem, selectedDate) ? "ring-2 ring-black" : ""}
              `}
              onClick={() => {
                setSelectedDate(dayItem);
                if (isPastEvent || isFutureEvent) {
                  navigate("/events");
                }
                onDateSelect && onDateSelect(dayItem);
              }}
            >
              {isToday && (
                <span className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rounded-full" />
              )}
              {format(dayItem, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
