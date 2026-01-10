import React from "react";
import { User, Calendar, FileText, Tag, Clock, Phone } from "lucide-react";
import { format } from "date-fns";

const UserCard = ({ userWithAppointments }) => {
  const { user, note, category, createdAt } = userWithAppointments;

  return (
    <div className="bg-[var(--custom-white)] p-6 rounded-xl shadow-sm border border-[var(--custom-blue-100)] hover:shadow-md transition-all duration-300">
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
        {/* User Details */}
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-[var(--custom-blue-100)] flex items-center justify-center shrink-0">
            <User className="h-6 w-6 text-[var(--custom-blue-600)]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--custom-gray-800)]">
              {user?.username || "Unknown User"}
            </h3>
            <div className="flex flex-col gap-1 mt-1 text-sm text-[var(--custom-gray-500)]">
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {user?.mobile || "N/A"}
              </span>
              <span className="flex items-center gap-2">
                <span className="font-medium">Email:</span>
                {user?.email || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Date and Time */}
        <div className="flex flex-col md:items-end text-sm text-[var(--custom-gray-500)]">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-[var(--custom-blue-500)]" />
            <span>{format(new Date(createdAt), "dd MMM yyyy")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[var(--custom-blue-500)]" />
            <span>{format(new Date(createdAt), "hh:mm a")}</span>
          </div>
        </div>
      </div>

      {/* Notes and Category Section */}
      <div className="mt-6 bg-[var(--custom-gray-50)]/50 p-4 rounded-lg border border-[var(--custom-gray-100)]">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-5 w-5 text-[var(--custom-blue-500)]" />
          <span className="font-medium text-[var(--custom-gray-700)]">
            Therapist's Note
          </span>
        </div>
        
        <p className="text-[var(--custom-gray-600)] text-sm leading-relaxed mb-4">
          {note || "No notes added for this appointment."}
        </p>

        {/* Display Category */}
        {category && (
          <div className="flex items-center gap-2 mt-2 pt-3 border-t border-[var(--custom-gray-200)]">
            <Tag className="h-4 w-4 text-[var(--custom-blue-500)]" />
            <span className="text-sm text-[var(--custom-gray-500)]">Category:</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--custom-blue-50)] text-[var(--custom-blue-700)] border border-[var(--custom-blue-200)]">
              {category}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;