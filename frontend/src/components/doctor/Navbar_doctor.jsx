import React, { useState, useEffect, useRef } from "react";
import { Bell, User } from "lucide-react";
import { useLocation } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const DoctorNavbar = () => {
  const location = useLocation().pathname;
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const links = [
    { name: "Home", link: "/doctor/landing" },
    { name: "Appointments", link: "/doctor/appointments" },
    { name: "Profile", link: "/doctor/profile" },
  ];
  const navigate = useNavigate();

  const userType = localStorage.getItem("user_type");
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("user_email");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/doctor/login");
  };

  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowDetails(false);
          setIsOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };

  const wrapperRef = useRef(null);
  const hamburgerRef = useRef(null);
  useOutsideAlerter(wrapperRef);
  useOutsideAlerter(hamburgerRef);

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
              className="p-2 rounded-full hover:bg-gray-100"
            >
              {isOpen ? (
                <AiOutlineClose size={24} />
              ) : (
                <AiOutlineMenu size={24} />
              )}
            </button>
            {isOpen && (
              <div
                ref={hamburgerRef}
                className="absolute top-16 min-w-40 w-[40%] bg-white rounded-2xl shadow-md p-4"
              >
                <ul>
                  {links.map((item, i) => (
                    <li
                      className="py-2 border-b text-center border-gray-200"
                      key={i}
                    >
                      <button
                        onClick={() => navigate(item.link)}
                        className={`hover:text-[var(--custom-primary-blue)] focus:text-[var(--custom-primary-blue)] transition-colors ${
                          location == item.link
                            ? "underline underline-offset-4 text-[var(--landing-bg-blue)] decoration-2"
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
              src="/assests/logo.png"
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
                onClick={() => navigate(item.link)}
                className={`hover:text-[var(--custom-primary-blue)] focus:text-[var(--custom-primary-blue)] transition-colors ${
                  location == item.link
                    ? "underline underline-offset-4 text-[var(--landing-bg-blue)] decoration-2"
                    : ""
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
            {userType ? (
              <>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowDetails(!showDetails);
                  }}
                  className="cursor-pointer relative"
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
                          {username}
                        </h3>
                        <p className="text-sm text-blue-700">{email}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleLogout}
                          className="flex-1 bg-blue-200 hover:bg-blue-300 text-blue-900 rounded px-4 py-2 text-sm font-medium transition-colors"
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
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-blue-200)] hover:bg-blue-300)] text-blue-900)] rounded font-medium"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DoctorNavbar;
