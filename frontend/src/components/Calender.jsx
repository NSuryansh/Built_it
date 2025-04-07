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
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Calendar = ({ onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [pastEvents, setPastEvents] = useState([]); // List for past event dates
  const [futureEvents, setFutureEvents] = useState([]); // List for future event dates
  const rollNo = localStorage.getItem("user_rollNo")
  const navigate = useNavigate();
  // console.log("hi");
  // console.log(rollNo);
  const sendLink = (rollNo) => {
    if (rollNo.startsWith("24")) {
      return "https://academic.iiti.ac.in/New_student/2024-25_Academic%20Calendar_2024%20BTech%20batch%20-%20Copy.pdf"; // Acad calender for fy
    } else {
      return "https://academic.iiti.ac.in/Document/2024-25_Academic%20Calendar_Updated%20-%2010-6-2024.pdf"; // Acad calender for others
    }
  };
  
  const linkAcadCalender = sendLink(rollNo);

  // Fetch past events
  useEffect(() => {
    axios
      .get("http://localhost:3000/getPastEvents")
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
      .get("http://localhost:3000/events")
      .then((response) => {
        setFutureEvents(
          response.data.map((event) =>
            format(new Date(event.dateTime), "yyyy-MM-dd")
          )
        );

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
    <div className="flex items-center justify-center">
      <div className="p-4 sm:p-8 md:p-4 lg:p-6 bg-white rounded-xl shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <button
            onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-4 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayLabel) => (
            <div
              key={dayLabel}
              className="font-medium text-gray-500 text-center"
            >
              {dayLabel}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((dayItem, index) => {
            const dayString = format(dayItem, "yyyy-MM-dd");
            const isToday = dayString === todayString;
            const isPastEvent = pastEvents.includes(dayString);
            const isFutureEvent = futureEvents.includes(dayString);

            return (
              <button
                key={index}
                className={`
                  relative p-2 rounded-lg aspect-square flex items-center justify-center
                  transition-all duration-200 text-sm font-medium
                  ${
                    isSameMonth(dayItem, currentMonth)
                      ? "text-gray-900"
                      : "text-gray-400"
                  }
                  ${
                    isPastEvent && !isToday
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : isFutureEvent && !isToday
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : ""
                  }
                  ${
                    isToday && isPastEvent
                      ? "ring-2 ring-black text-white bg-blue-500 hover:bg-blue-600 ring-offset-2 font-bold"
                      : ""
                  }
                  ${
                    !isToday && !isPastEvent && !isFutureEvent
                      ? "hover:bg-gray-100"
                      : ""
                  }
                  ${
                    isToday && !isPastEvent
                      ? "ring-2 ring-black-50 ring-offset-2 font-bold"
                      : ""
                  }
                  ${
                    isSameDay(dayItem, selectedDate) && !isToday
                      ? "ring-2 ring-blue-600"
                      : ""
                  }
                `}
                onClick={() => {
                  setSelectedDate(dayItem);
                  if (isPastEvent || isFutureEvent) {
                    navigate("/events");
                  }
                  onDateSelect && onDateSelect(dayItem);
                }}
              >
                {format(dayItem, "d")}
                {(isPastEvent || isFutureEvent) && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex gap-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Past Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Future Events</span>
          </div>
        </div>

        <a href={linkAcadCalender} target="_blank">
          <div className="flex gap-2 w-[100%] justify-center mx-auto mt-3 items-center">
            <Link size={15} />
            <div className="text-sm text-gray-600">Academic Calendar</div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Calendar;
