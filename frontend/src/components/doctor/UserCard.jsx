import React from "react";
import { User, Calendar, FileText, Tag, Clock, Phone, Mail, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const UserCard = ({ userWithAppointments, showViewProfile = false }) => {
  const { user, note, category, createdAt } = userWithAppointments;
  const navigate = useNavigate();

  // Safety check for date
  const formattedDate = createdAt ? format(new Date(createdAt), "dd MMM yyyy") : "N/A";
  const formattedTime = createdAt ? format(new Date(createdAt), "hh:mm a") : "N/A";

  const handleViewProfile = (e) => {
    e.stopPropagation();
    // Navigate to the User Profile page. 
    // Ensure your route in App.js matches "/doctor/user-profile"
    navigate(`/doctor/user?userId=${user?.id}`);
  };

  return (
    <div className="bg-[var(--custom-white)] p-6 rounded-xl shadow-sm border border-[var(--custom-blue-100)] hover:shadow-md transition-all duration-300 w-full relative">
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
        {/* Left Side: User Details */}
        <div className="flex items-start gap-4 flex-1">
          <div className="h-12 w-12 rounded-full bg-[var(--custom-blue-100)] flex items-center justify-center shrink-0 shadow-sm">
            <User className="h-6 w-6 text-[var(--custom-blue-600)]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--custom-gray-800)] flex items-center gap-2">
              {user?.username || "Unknown User"}
              {/* Mobile View Arrow (optional, usually sufficient on right) */}
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1 text-sm text-[var(--custom-gray-500)]">
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                {user?.mobile || "N/A"}
              </span>
              <span className="hidden sm:block text-[var(--custom-gray-300)]">|</span>
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {user?.email || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Date, Time & Action Arrow */}
        <div className="flex items-start gap-4">
          <div className="flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-1 text-sm text-[var(--custom-gray-600)] bg-[var(--custom-gray-50)] md:bg-transparent p-2 md:p-0 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[var(--custom-blue-500)]" />
              <span className="font-medium">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[var(--custom-blue-500)]" />
              <span>{formattedTime}</span>
            </div>
          </div>

          {/* Navigation Arrow */}
          {showViewProfile && (
            <button
              onClick={handleViewProfile}
              className="hidden md:flex items-center justify-center p-2 rounded-full bg-[var(--custom-blue-50)] text-[var(--custom-blue-600)] hover:bg-[var(--custom-blue-100)] hover:text-[var(--custom-blue-700)] transition-colors transform hover:translate-x-1"
              title="View User Details"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Arrow (Visible only on small screens) */}
      {showViewProfile && (
        <button
          onClick={handleViewProfile}
          className="md:hidden absolute top-6 right-6 p-2 rounded-full bg-[var(--custom-blue-50)] text-[var(--custom-blue-600)]"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* Bottom Section: Notes and Category */}
      <div className="mt-5 pt-4 border-t border-[var(--custom-gray-100)]">
        <div className="bg-[var(--custom-blue-50)]/30 p-4 rounded-lg border border-[var(--custom-blue-100)]/50 relative">
          
          {/* Label for Notes */}
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-[var(--custom-blue-600)]" />
            <span className="text-xs font-bold text-[var(--custom-blue-700)] uppercase tracking-wider">
              Doctor's Note
            </span>
          </div>

          {/* Actual Note Text */}
          <p className="text-[var(--custom-gray-700)] text-sm leading-relaxed whitespace-pre-wrap">
            {note || <span className="italic text-gray-400">No notes recorded for this session.</span>}
          </p>

          {/* Category Badge */}
          {category && (
            <div className="mt-4 flex justify-end">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--custom-blue-100)] text-[var(--custom-blue-700)] border border-[var(--custom-blue-200)] shadow-sm">
                <Tag className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold">
                  Category: {category}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;