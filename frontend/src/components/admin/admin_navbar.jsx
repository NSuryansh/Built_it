import React, { useState } from "react";
import { Bell, User } from "lucide-react";
import { useLocation } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const location = useLocation().pathname;
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const links = [
    { name: "Dashboard", link: "/admin/dashboard" },
    { name: "Doctors", link: "/admin/doctor_list" },
    { name: "Events", link: "/admin/event_list" },
  ];
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.clear()
    navigate("/admin/login")
  }

  return (
    <nav className="bg-transperent">
      <div className="px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex">
            <img
              src="/assests/logo.png"
              alt="logo"
              width={25}
              height={25}
              className="rounded mr-2"
            />
            <div className="text-xl font-bold">Vitality</div>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            {links.map((item, i) => (
              <a
                key={i}
                href={item.link}
                className={`hover:text-[var(--custom-primary-green)] focus:text-[var(--custom-primary-green)] transition-colors ${
                  location == item.link
                    ? "underline underline-offset-4 text-[var(--landing-bg-green)] decoration-2"
                    : ""
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="md:hidden transition-all flex items-center z-2">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              {isOpen ? (
                <AiOutlineClose size={24} />
              ) : (
                <AiOutlineMenu size={24} />
              )}
            </button>
            {isOpen && (
              <div className="absolute top-16 left-[12%] w-[80%] bg-white rounded-2xl shadow-md p-4">
                <ul>
                  {links.map((item, i) => (
                    <li
                      className="py-2 border-b text-center border-gray-200"
                      key={i}
                    >
                      <a
                        href={item.link}
                        className={`hover:text-[var(--custom-primary-green)] focus:text-[var(--custom-primary-green)] transition-colors ${
                          location == item.link
                            ? "underline underline-offset-4 text-[var(--landing-bg-green)] decoration-2"
                            : ""
                        }`}
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
              className={`user-details drop-shadow-xs absolute border-2 border-green-700 rounded-lg top-12 right-5 list-none z-1 ${
                showDetails ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
            >
              <div className="w-64 bg-green-100 rounded-lg shadow-lg p-6">
                <div className="space-y-4">
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-semibold text-green-900">
                      Admin
                    </h3>
                    <p className="text-sm text-green-700">abc@gmail.com</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleLogout}
                      className="flex-1 bg-green-200 hover:bg-green-300 text-green-900 rounded px-4 py-2 text-sm font-medium transition-colors"
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

export default AdminNavbar;
