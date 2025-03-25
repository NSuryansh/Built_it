import React from "react";
import { Bell, User } from "lucide-react";
import { useLocation } from "react-router-dom";

const DoctorNavbar = () => {
  const location = useLocation().pathname;
  return (
    <nav className="bg-transperent">
      <div className="px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex">
            <img
              src="/assests/logo.jpg"
              alt="logo"
              width={25}
              className="rounded mr-2"
            />
            <div className="text-xl font-bold">Vitality</div>
          </div>
          <div className="flex space-x-8 items-center">
            <a
              href="/doctor/landing"
              className={`hover:text-[var(--custom-primary-blue)] focus:text-[var(--custom-primary-blue)] transition-colors ${
                location === "/doctor/landing"
                  ? "underline underline-offset-4 text-[var(--landing-bg-blue)] decoration-2"
                  : ""
              }`}
            >
              Home
            </a>
            <a
              href="/doctor/appointments"
              className={`hover:text-[var(--custom-primary-blue)] focus:text-[var(--custom-primary-blue)] transition-colors ${
                location === "/doctor/appointments"
                  ? "underline underline-offset-4 text-[var(--landing-bg-blue)] decoration-2"
                  : ""
              }`}
            >
              Appointments
            </a>
            <a
              href="/doctor/profile"
              className={`hover:text-[var(--custom-primary-blue)] focus:text-[var(--custom-primary-blue)] transition-colors ${
                location === "/doctor/profile"
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
