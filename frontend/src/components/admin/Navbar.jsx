"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, User } from "lucide-react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import CustomModal from "../common/CustomModal";
import { usePathname, useRouter } from "next/navigation";

const AdminNavbar = () => {
  const location = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const links = [
    { name: "Dashboard", link: "/admin/dashboard" },
    { name: "Doctors", link: "/admin/doctor_list" },
    { name: "Events", link: "/admin/event_list" },
    { name: "Appointments", link: "/admin/appointments" },
    { name: "User", link: "/admin/user" },
  ];
  const router = useRouter();
  const [showCustomModal, setShowCustomModal] = useState(false);
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("user_email");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    setShowCustomModal(false);
    router.replace("/admin/login");
  };

  const handleCancel = () => {
    setShowCustomModal(false);
  };

  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowDetails(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  return (
    <nav className="bg-transperent">
      <div className="px-4 md:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="md:hidden transition-all flex items-center z-2">
            <button
              onClick={() => {
                setShowDetails(false);
                toggleMenu();
              }}
              className="p-2 rounded-full hover:bg-[var(--custom-gray-100)]"
            >
              {isOpen ? (
                <AiOutlineClose size={24} />
              ) : (
                <AiOutlineMenu size={24} />
              )}
            </button>
            {isOpen && (
              <div className="absolute top-16 min-w-40 w-[40%] bg-[var(--custom-white)] rounded-2xl shadow-md p-4">
                <ul>
                  {links.map((item, i) => (
                    <li
                      className="py-2 border-b text-center border-[var(--custom-gray-200)]"
                      key={i}
                    >
                      <button
                        onClick={() => router.push(item.link)}
                        className={`hover:text-[var(--custom-green-500)] focus:text-[var(--custom-green-500)] transition-colors ${
                          location == item.link
                            ? "underline underline-offset-4 text-[var(--custom-admin-text-green)] decoration-2"
                            : ""
                        }`}
                      >
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex">
            <img
              src="/logo.svg"
              alt="logo"
              width={25}
              height={25}
              className="rounded-md mr-2"
            />
            <div className="text-xl font-bold">Vitality</div>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            {links.map((item, i) => (
              <button
                key={i}
                onClick={() => router.push(item.link)}
                className={`transition-colors ${
                  location == item.link
                    ? "underline underline-offset-4 text-[var(--custom-admin-text-green)] decoration-2"
                    : "hover:text-[var(--custom-green-500)] focus:text-[var(--custom-green-500)]"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
          <div ref={wrapperRef} className="flex items-center space-x-4">
            <button className="cursor-pointer">
              <Bell className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                setShowDetails(!showDetails);
              }}
              className="cursor-pointer"
            >
              <User className="w-5 h-5" />
            </button>

            <div
              className={`user-details drop-shadow-xs absolute border-2 border-[var(--custom-green-700)] rounded-lg top-12 right-5 list-none z-1 ${
                showDetails ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
            >
              <div className="w-64 bg-[var(--custom-green-100)] rounded-lg shadow-lg p-6">
                <div className="space-y-4">
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-semibold text-[var(--custom-green-900)]">
                      {username}
                    </h3>
                    <p className="text-sm text-[var(--custom-green-700)]">
                      {email}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowCustomModal(true)}
                      className="flex-1 bg-[var(--custom-green-200)] hover:bg-[var(--custom-green-300)] text-[var(--custom-green-900)] rounded px-4 py-2 text-sm font-medium transition-colors"
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
      {showCustomModal && (
        <CustomModal
          handleLogout={handleLogout}
          handleCancel={handleCancel}
          theme="green"
        />
      )}
    </nav>
  );
};

export default AdminNavbar;
