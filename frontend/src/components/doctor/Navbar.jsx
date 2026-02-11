import React, { useState, useEffect, useRef } from "react";
import { Bell, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import DoctorNotificationPanel from "./NotificationPanel";
import CustomModal from "../common/CustomModal";

const DoctorNavbar = () => {
  const location = useLocation().pathname;
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const links = [
    { name: "Home", link: "/doctor/dashboard" },
    { name: "Appointments", link: "/doctor/appointments" },
    { name: "Chat", link: "/doctor/peer" },
    { name: "Profile", link: "/doctor/profile" },
    { name: "History", link: "/doctor/history" },
    { name: "Events", link: "/doctor/event_list"},
    { name: "Data", link: "/doctor/content_manager"},
    { name: "Emergency", link: "/doctor/emergency"}
  ];
  const navigate = useNavigate();
  const [showCustomModal, setShowCustomModal] = useState(false);

  const userType = localStorage.getItem("user_type");
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("user_email");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleLogout = () => {
    localStorage.clear();
    setShowCustomModal(false);
    navigate("/doctor/login");
  };

  const handleCancel = () => {
    setShowCustomModal(false);
  };

  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowNotifications(false);
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
          <div className="lg:hidden transition-all flex items-center z-2">
            <button
              onClick={() => {
                toggleMenu();
                setShowDetails(false);
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
                        onClick={() => navigate(item.link)}
                        className={` transition-colors ${
                          location == item.link
                            ? "underline underline-offset-4 text-[var(--custom-blue-500)] decoration-2"
                            : "hover:text-[var(--custom-blue-500)] focus:text-[var(--custom-blue-500)]"
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
              src="/assets/logo.svg"
              alt="logo"
              width={25}
              height={25}
              className="rounded-md mr-2"
            />
            <div className="text-xl font-bold">Calm Connect</div>
          </div>
          <div className="hidden lg:flex space-x-6 items-center">
            {links.map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.link)}
                className={`transition-colors ${
                  location == item.link
                    ? "underline underline-offset-4 text-[var(--custom-blue-500)] decoration-2"
                    : "hover:text-[var(--custom-blue-500)] focus:text-[var(--custom-blue-500)]"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
          <div ref={wrapperRef} className="flex items-center space-x-4">
            <button
              id="bell-icon"
              className="cursor-pointer"
              onClick={() => {
                setShowDetails(false);
                setIsOpen(false);
                handleBellClick();
              }}
            >
              <Bell className="w-5 h-5" />
            </button>
            {showNotifications && <DoctorNotificationPanel />}

            {userType ? (
              <>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowNotifications(false);
                    setShowDetails(!showDetails);
                  }}
                  className="cursor-pointer relative"
                >
                  <User className="w-5 h-5" />
                </button>

                <div
                  className={`user-details drop-shadow-xs absolute border-2 border-[var(--custom-blue-700)] rounded-lg top-12 right-5 list-none z-1 ${
                    showDetails ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
                >
                  <div className="w-64 bg-[var(--custom-blue-100)] rounded-lg shadow-lg p-6">
                    <div className="space-y-4">
                      <div className="text-center space-y-1">
                        <h3 className="text-lg font-semibold text-[var(--custom-blue-900)]">
                          {username}
                        </h3>
                        <p className="text-sm text-[var(--custom-blue-700)]">
                          {email}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowCustomModal(true)}
                          className="flex-1 bg-[var(--custom-blue-200)] hover:bg-[var(--custom-blue-300)] text-[var(--custom-blue-900)] rounded px-4 py-2 text-sm font-medium transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={() => navigate("/doctor/login")}
                className="px-4 py-2 bg-[var(--custom-blue-200)] hover:bg-[var(--custom-blue-300)] text-[var(--custom-blue-900)] rounded font-medium"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
      {showCustomModal && (
        <CustomModal
          handleLogout={handleLogout}
          handleCancel={handleCancel}
          theme="blue"
        />
      )}
    </nav>
  );
};

export default DoctorNavbar;
