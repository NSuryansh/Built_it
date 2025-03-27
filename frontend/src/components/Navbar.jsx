import React, { useState, useEffect } from "react";
import { Bell, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import NotificationPanel from "./NotifficationPanel";
import { checkAuth } from "../utils/profile";
import { ToastContainer, toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const [showDetails, setShowDetails] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const links = [
    { name: "Home", link: "/dashboard" },
    { name: "Mood", link: "/mood" },
    { name: "Peer", link: "/peer" },
    { name: "Book", link: "/book" },
    { name: "Stress", link: "/stress" },
    { name: "Events", link: "/events" },
  ];

  // Retrieve usertype from localStorage
  const userType = localStorage.getItem("user_type");
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("user_email");
  const phoneNumber = localStorage.getItem("user_mobile");
  const altPhoneNumber = localStorage.getItem("user_alt_mobile");

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("user");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    if (userType === "user") {
      navigate("/login");
    } else if (userType === "doc") {
      navigate("/doctor/login");
    } else {
      navigate("admin/login");
    }
  };

  const handleBellClick = () => {
    if (!isAuthenticated) {
      toast("Please login first!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "custom-toast",
      });
      return;
    }
    setShowNotifications(!showNotifications);
  };

  const handleNotification = () => {
    if (isAuthenticated) {
      return;
    } else {
      navigate("/login");
    }
  };

  return (
    <nav
      className={`${location === "/" || location === "/peer" || location === "/mood"
          ? "bg-transparent"
          : "bg-[var(--custom-orange-100)]"
        }`}
    >
      <ToastContainer/>
      <div className="px-8 py-3">
        <div className="flex items-center justify-between">
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
              <div className="absolute top-16 left-[2%] w-[40%] bg-white rounded-2xl shadow-md p-4">
                <ul>
                  {links.map((item, i) => (
                    <li
                      className="py-2 border-b text-center border-gray-200"
                      key={i}
                    >
                      <button
                        onClick={() => navigate(item.link)}
                        className={`hover:text-[var(--custom-primary-orange)] focus:text-[var(--custom-primary-orange)] transition-colors ${location === item.link
                            ? "underline underline-offset-4 text-[var(--landing-bg-orange)] decoration-2"
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
                className={`hover:text-[var(--custom-primary-orange)] focus:text-[var(--custom-primary-orange)] transition-colors ${location === item.link
                    ? "underline underline-offset-4 text-[var(--landing-bg-orange)] decoration-2"
                    : ""
                  }`}
              >
                {item.name}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <button id="bell-icon" className="cursor-pointer" onClick={() => handleBellClick()} >
              <Bell className="w-5 h-5" />
            </button>
            {showNotifications && isAuthenticated && <NotificationPanel />}

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    setShowDetails(!showDetails);
                  }}
                  className="cursor-pointer relative"
                >
                  <User className="w-5 h-5" />
                </button>

                <div
                  className={`user-details drop-shadow-xs absolute border-2 border-[var(--custom-orange-700)] rounded-lg top-12 right-5 list-none z-1 ${showDetails ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                >
                  <div className="w-64 bg-[var(--custom-orange-100)] rounded-lg shadow-lg p-6">
                    <div className="space-y-4">
                      <div className="text-center space-y-1">
                        <h3 className="text-lg font-semibold text-[var(--custom-orange-900)]">
                          {username}
                        </h3>
                        <p className="text-sm text-[var(--custom-orange-700)]">
                          {email}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm text-[var(--custom-orange-800)]">
                          <p>Phone Number</p>
                          <p className="font-medium">{phoneNumber}</p>
                        </div>

                        <div className="text-sm text-[var(--custom-orange-800)]">
                          <p>Alt Phone Number</p>
                          <p className="font-medium">{altPhoneNumber}</p>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            navigate("/appointments");
                          }}
                          className="text-sm px-4 py-2 rounded bg-[var(--custom-orange-200)] hover:bg-[var(--custom-orange-300)] text-[var(--custom-orange-900)] w-full font-medium"
                        >
                          Appointments
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate("/modify_profile")}
                          className="flex-1 bg-[var(--custom-orange-200)] hover:bg-[var(--custom-orange-300)] text-[var(--custom-orange-900)] rounded px-4 py-2 text-sm font-medium transition-colors"
                        >
                          Modify
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex-1 bg-[var(--custom-orange-200)] hover:bg-[var(--custom-orange-300)] text-[var(--custom-orange-900)] rounded px-4 py-2 text-sm font-medium transition-colors"
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
                className="px-4 py-2 bg-[var(--custom-orange-200)] hover:bg-[var(--custom-orange-300)] text-[var(--custom-orange-900)] rounded font-medium"
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

export default Navbar;
