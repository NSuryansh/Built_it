import AppointmentCard from "@/components/user/AppointmentCard";
import { History } from "lucide-react";
import React from "react";
import { NoAppointmentsMessage } from "./NoAppointmentMsg";

const PreviousAppointments = ({ previousAppointments }) => {
  return (
    <div>
      <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-[var(--custom-orange-100)] transition-all duration-300 hover:shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[var(--custom-orange-900)] flex items-center gap-3">
            <History className="w-6 h-6 text-[var(--custom-orange-600)]" />
            Previous Appointments
          </h2>
          <span className="px-4 py-1 mt-4 sm:mt-0 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-sm font-semibold shadow-sm">
            {previousAppointments.length} Total
          </span>
        </div>

        <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
          {previousAppointments.length > 0 ? (
            <div className="space-y-6">
              {previousAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  feedbackSubmitted={appointment.stars !== null}
                  upcoming={false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <NoAppointmentsMessage message="No previous appointments found" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviousAppointments;
