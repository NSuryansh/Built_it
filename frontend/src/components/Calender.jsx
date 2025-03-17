import React, { useState } from "react";
import {format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay,} from "date-fns";

const Calendar = ({ onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const startDate = startOfWeek(startOfMonth(currentMonth));
  const endDate = endOfWeek(endOfMonth(currentMonth));
  const days = [];
  let day = startDate;

  const planned = [
    { date: "2022-10-10", title: "Interactive Session" },
]

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const todayString = format(new Date(), "yyyy-MM-dd");

  const handlePrevMonth = () => setCurrentMonth(addDays(currentMonth, -30));
  const handleNextMonth = () => setCurrentMonth(addDays(currentMonth, 30));

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="px-4 py-2 bg-gray-200 rounded">
          &#9665;
        </button>
        <h2 className="text-xl font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
        <button onClick={handleNextMonth} className="px-4 py-2 bg-gray-200 rounded">
          &#9655;
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

          return (
            <button
              key={index}
              className={`
                relative px-4 py-2 rounded 
                ${isSameMonth(dayItem, currentMonth) ? "text-black" : "text-gray-400"}
                ${
                  isSameDay(dayItem, selectedDate)
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }
              `}
              onClick={() => {
                setSelectedDate(dayItem);
                onDateSelect && onDateSelect(dayItem);
              }}
            >
              {isToday && (
                <span
                  className="
                    absolute top-1 left-1/2 
                    transform -translate-x-1/2 
                    w-2 h-2 bg-black rounded-full
                  "
                />
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
