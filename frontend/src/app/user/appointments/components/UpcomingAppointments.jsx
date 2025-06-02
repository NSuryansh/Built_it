import React from "react";
import { NoAppointmentsMessage } from "./NoAppointmentMsg";
import AppointmentCard from "@/components/user/AppointmentCard";
import { Calendar } from "lucide-react";

const UpcomingAppointments = ({ upcomingAppointments }) => {
  return (
    <div>
      <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-[var(--custom-orange-100)] transition-all duration-300 hover:shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[var(--custom-orange-900)] flex items-center gap-3">
            <Calendar className="w-6 h-6 text-[var(--custom-orange-600)]" />
            Upcoming Appointments
          </h2>
          <span className="px-4 py-1 mt-4 sm:mt-0 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-sm font-semibold shadow-sm">
            {upcomingAppointments.length} Total
          </span>
        </div>

        <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-6">
              {upcomingAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  feedbackSubmitted={appointment.stars !== null}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <NoAppointmentsMessage message="No upcoming appointments scheduled" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingAppointments;
