import React from "react";
import { Bell, User } from "lucide-react";
import { useLocation } from "react-router-dom";

const DoctorNavbar = () => {
  const location = useLocation().pathname;
  return (
    <nav className="bg-transperent">
      <div className="px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">CalmNest</div>
          <div className="flex space-x-8 items-center">
            <a
              href="/doctor_landing"
              className={`hover:text-[var(--custom-primary-blue)] focus:text-[var(--custom-primary-blue)] transition-colors ${
                location === "/doctor_landing"
                  ? "underline underline-offset-4 text-[var(--landing-bg-blue)] decoration-2"
                  : ""
              }`}
            >
              Home
            </a>
            <a
              href="/doctor_appointments"
              className={`hover:text-[var(--custom-primary-blue)] focus:text-[var(--custom-primary-blue)] transition-colors ${
                location === "/doctor_appointments"
                  ? "underline underline-offset-4 text-[var(--landing-bg-blue)] decoration-2"
                  : ""
              }`}
            >
              Appointments
            </a>
            <a
              href="/doctor_profile"
              className={`hover:text-[var(--custom-primary-blue)] focus:text-[var(--custom-primary-blue)] transition-colors ${
                location === "/doctor_profile"
                  ? "underline underline-offset-4 text-[var(--landing-bg-blue)] decoration-2"
                  : ""
              }`}
            >
              Profile
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <button className="cursor-pointer">
              <Bell className="w-5 h-5" />
            </button>
            <button className="cursor-pointer">
              <User className="w-5 h-5" />
            </button>
            {/* <button
              className="bg-[var(--custom-primary-blue)] text-[var(--custom-white)] px-4 py-1 rounded cursor-pointer"
              onClick={() => (window.location.href = "/login")}
            >
              Login
            </button> */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DoctorNavbar;