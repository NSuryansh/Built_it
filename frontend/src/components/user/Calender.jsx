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
import CustomToast from "../common/CustomToast";

const Calendar = ({ onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [pastEvents, setPastEvents] = useState([]); // List for past event dates
  const [futureEvents, setFutureEvents] = useState([]); // List for future event dates
  const rollNo = localStorage.getItem("user_rollNo");
  const token = localStorage.getItem("token");
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
    const PastEvents = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/common/getPastEvents",
          {
            headers: { Authorization: "Bearer " + token },
          }
        );
        const data = await response.json();
        setPastEvents(
          data.map((event) => format(new Date(event.dateTime), "yyyy-MM-dd"))
        );
      } catch (e) {
        CustomToast("Error fetching past events");
        console.error(e);
      }
    };
    PastEvents();
  }, []);

  // Fetch future events
  useEffect(() => {
    const FutureEvents = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/common/events",
          {
            headers: { Authorization: "Bearer " + token },
          }
        );
        const data = await response.json();
        setFutureEvents(
          data.map((event) => format(new Date(event.dateTime), "yyyy-MM-dd"))
        );
      } catch (e) {
        CustomToast("Error fetching future events");
        console.error(e);
      }
    };
    FutureEvents();
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
      <div className="p-4 sm:p-8 md:p-4 lg:p-6 bg-[var(--custom-white)] rounded-xl shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
            className="p-2 rounded-lg bg-[var(--custom-gray-200)] hover:bg-[var(--custom-gray-300)] transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-[var(--custom-gray-700)]" />
          </button>
          <h2 className="text-2xl font-bold text-[var(--custom-gray-900)]">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <button
            onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
            className="p-2 rounded-lg bg-[var(--custom-gray-200)] hover:bg-[var(--custom-gray-300)] transition-all"
          >
            <ChevronRight className="w-5 h-5 text-[var(--custom-gray-700)]" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-4 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayLabel) => (
            <div
              key={dayLabel}
              className="font-medium text-[var(--custom-gray-500)] text-center"
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
                  ${isSameMonth(dayItem, currentMonth)
                    ? "text-[var(--custom-gray-900)]"
                    : "text-[var(--custom-gray-400)]"
                  }
                  ${isPastEvent && !isToday
                    ? "bg-[var(--custom-red-500)] text-[var(--custom-white)] hover:bg-[var(--custom-red-600)]"
                    : isFutureEvent && !isToday
                      ? "bg-[var(--custom-blue-500)] text-[var(--custom-white)] hover:bg-[var(--custom-blue-600)]"
                      : ""
                  }
                  ${isToday && isPastEvent
                    ? "ring-2 ring-black text-[var(--custom-white)] bg-[var(--custom-blue-500)] hover:bg-[var(--custom-blue-600)] ring-offset-2 font-bold"
                    : ""
                  }
                  ${!isToday && !isPastEvent && !isFutureEvent
                    ? "hover:bg-[var(--custom-gray-100)]"
                    : ""
                  }
                  ${isToday && !isPastEvent
                    ? "ring-2 ring-[var(--custom-black)] ring-offset-2 font-bold"
                    : ""
                  }
                  ${isSameDay(dayItem, selectedDate) && !isToday
                    ? "ring-2 ring-[var(--custom-blue-600)]"
                    : ""
                  }
                `}
                onClick={() => {
                  setSelectedDate(dayItem);
                  if (isPastEvent || isFutureEvent) {
                    navigate("/user/events");
                  }
                  onDateSelect && onDateSelect(dayItem);
                }}
              >
                {format(dayItem, "d")}
                {(isPastEvent || isFutureEvent) && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[var(--custom-white)]" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex gap-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--custom-red-500)] rounded-full"></div>
            <span className="text-[var(--custom-gray-600)]">Past Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--custom-blue-500)] rounded-full"></div>
            <span className="text-[var(--custom-gray-600)]">Future Events</span>
          </div>
        </div>

        <a href={linkAcadCalender} target="_blank">
          <div className="flex gap-2 w-[100%] justify-center mx-auto mt-3 items-center">
            <Link size={15} />
            <div className="text-sm text-[var(--custom-gray-600)]">
              Academic Calendar
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Calendar;
