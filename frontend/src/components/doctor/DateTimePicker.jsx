import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';


export function DateTimePicker({ selected, onSelect, appointmentId }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('12:00');

  const handleDateSelect = (date) => {
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes);
    onSelect?.(newDate);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
    if (selected) {
      const [hours, minutes] = e.target.value.split(':').map(Number);
      const newDate = new Date(selected);
      newDate.setHours(hours, minutes);
      onSelect?.(newDate);
    }
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const weeks = [];
  let currentWeek = [];

  // Add empty slots for days before the first of the month
  const firstDay = daysInMonth[0].getDay();
  for (let i = 0; i < firstDay; i++) {
    currentWeek.push(new Date(0)); // placeholder for empty days
  }

  // Fill in the days of the month
  daysInMonth.forEach((day) => {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });

  // Add empty slots for days after the last of the month
  while (currentWeek.length < 7) {
    currentWeek.push(new Date(0));
  }
  weeks.push(currentWeek);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[var(--custom-gray-200)] p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-[var(--custom-gray-100)] rounded-full transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-[var(--custom-gray-600)]" />
          </button>
          <h2 className="text-lg font-semibold text-[var(--custom-gray-900)]">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-[var(--custom-gray-100)] rounded-full transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-[var(--custom-gray-600)]" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-[var(--custom-gray-500)] py-2"
            >
              {day}
            </div>
          ))}

          {weeks.map((week, weekIndex) =>
            week.map((day, dayIndex) => {
              const isEmptyDay = day.getTime() === 0;
              const isSelectedDay = selected && isSameDay(day, selected);
              const isTodayDate = isToday(day);

              return (
                <button
                  key={`${weekIndex}-${dayIndex}`}
                  onClick={() => !isEmptyDay && handleDateSelect(day)}
                  disabled={isEmptyDay}
                  className={`
                    h-10 text-sm rounded-lg flex items-center justify-center
                    ${
                      isEmptyDay
                        ? "text-[var(--custom-gray-300)] cursor-default"
                        : "hover:bg-[var(--custom-gray-100)]"
                    }
                    ${
                      isSelectedDay
                        ? "bg-[var(--custom-blue-500)] text-white hover:bg-[var(--custom-blue-600)]"
                        : ""
                    }
                    ${
                      isTodayDate && !isSelectedDay
                        ? "bg-[var(--custom-gray-100)] font-semibold"
                        : ""
                    }
                  `}
                >
                  {!isEmptyDay && format(day, "d")}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Clock className="h-4 w-4 text-[var(--custom-gray-500)]" />
          </div>
          <input
            type="time"
            value={selectedTime}
            onChange={handleTimeChange}
            className="block w-full rounded-md border border-[var(--custom-gray-200)] pl-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--custom-blue-500)] focus:border-[var(--custom-blue-500)]"
          />
        </div>
      </div>

      {selected && (
        <div className="rounded-md bg-[var(--custom-gray-50)] px-4 py-3">
          <p className="text-sm text-[var(--custom-gray-600)]">
            Selected:{" "}
            <span className="font-medium text-[var(--custom-gray-900)]">
              {format(selected, "PPP p")}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}