import React from "react";
import { Bell, User } from "lucide-react";
import { useLocation } from "react-router-dom";

const AdminNavbar = () => {
  const location = useLocation().pathname;
  return (
    <nav className="bg-transperent">
      <div className="px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">CalmNest</div>
          <div className="flex space-x-8 items-center">
            <a
              href="/admin/dashboard"
              className={`hover:text-[var(--custom-primary-green)] focus:text-[var(--custom-primary-green)] transition-colors ${
                location === "/admin/dashboard"
                  ? "underline underline-offset-4 text-[var(--landing-bg-green)] decoration-2"
                  : ""
              }`}
            >
              Dashboard
            </a>
            <a
              href="/admin/doctor_list"
              className={`hover:text-[var(--custom-primary-green)] focus:text-[var(--custom-primary-green)] transition-colors ${
                location === "/admin/doctor_list"
                  ? "underline underline-offset-4 text-[var(--landing-bg-green)] decoration-2"
                  : ""
              }`}
            >
              Doctors
            </a>
            <a
              href="/admin/event_list"
              className={`hover:text-[var(--custom-primary-green)] focus:text-[var(--custom-primary-green)] transition-colors ${
                location === "/admin/event_list"
                  ? "underline underline-offset-4 text-[var(--landing-bg-green)] decoration-2"
                  : ""
              }`}
            >
              Events
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <button className="cursor-pointer">
              <Bell className="w-5 h-5" />
            </button>
            <button className="cursor-pointer">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;