import React from "react";
import {
  User as UserIcon,
  CalendarClock,
  Stethoscope,
  ArrowRight,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { Link } from "react-router-dom";

const UserCard = ({ userWithAppointments }) => {
  const user = userWithAppointments;
  return (
    <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100/50 group transform hover:-translate-y-1">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr_auto] gap-4 sm:gap-6">
        <div className="space-y-3">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-bold text-lg text-blue-900">
              {user.user.username}
            </h3>
            <p className="text-sm text-gray-600 flex items-center justify-center md:justify-start">
              <UserIcon className="h-3.5 w-3.5 mr-1 text-blue-400" />
              {user.user.email}
            </p>
          </div>
        </div>

        <div className="flex justify-center md:justify-end items-center mt-2 md:mt-0">
          <Link
            to={`/doctor/user?userId=${user.user.id}`}
            className="inline-flex items-center justify-center p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all group-hover:shadow-md"
            aria-label={`View ${user.user.username}'s details`}
          >
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
