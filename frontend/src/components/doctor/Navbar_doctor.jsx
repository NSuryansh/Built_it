import React, { useState } from "react";
import { Bell, User } from "lucide-react";
import { useLocation } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

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
            <button
              onClick={() => {
                setShowDetails(!showDetails);
              }}
              className="cursor-pointer"
            >
              <User className="w-5 h-5" />
            </button>

            <div
              className={`user-details drop-shadow-xs absolute border-2 border-blue-700 rounded-lg top-12 right-5 list-none z-1 ${
                showDetails ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
            >
              <div className="w-64 bg-blue-100 rounded-lg shadow-lg p-6">
                <div className="space-y-4">
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-semibold text-blue-900">
                      Doctor
                    </h3>
                    <p className="text-sm text-blue-700">abc@gmail.com</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      // onClick={onLogout}
                      className="flex-1 bg-blue-200 hover:bg-blue-300 text-blue-900 rounded px-4 py-2 text-sm font-medium transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DoctorNavbar;
