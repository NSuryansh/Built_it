import React, { useState, useEffect, useRef } from "react";
import { Bell, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import NotificationPanel from "./NotifficationPanel";
import { checkAuth } from "../utils/profile";
import { ToastContainer } from "react-toastify";
import CustomToast from "./CustomToast";
import LogoutModal from "./LogoutModal";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const [showDetails, setShowDetails] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const ref = useRef(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const links = [
    { name: "Home", link: "/dashboard" },
    { name: "Mood", link: "/mood" },
    { name: "Peer", link: "/peer" },
    { name: "Book", link: "/book" },
    { name: "Stress", link: "/stress" },
    { name: "Events", link: "/events" },
    { name: "Entertainment", link: "/entertainment" },
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
    setShowLogoutModal(false);
    navigate("/login");
  };

  const handleCancel = () => {
    setShowLogoutModal(false);
  };

  const handleBellClick = () => {
    if (!isAuthenticated) {
      CustomToast("Please login first!");
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
    <nav
      ref={ref}
      className={`${
        location === "/peer" ||
        location === "/mood" ||
        location === "/book" ||
        location === "/modify_profile" ||
        location === "/movies" ||
        location === "/entertainment" ||
        location === "/dashboard" ||
        location === "/appointments" ||
        location === "/events"
          ? "bg-transparent"
          : "bg-[var(--custom-orange-100)]"
      } z-20`}
    >
      <ToastContainer />
      <div className="px-4 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="lg:hidden transition-all flex items-center z-2">
            <button
              onClick={() => {
                setShowDetails(false);
                setShowNotifications(false);
                toggleMenu();
              }}
              className="p-2 rounded-full hover:bg-orange-300"
            >
              {isOpen ? (
                <AiOutlineClose size={24} />
              ) : (
                <AiOutlineMenu size={24} />
              )}
            </button>
            {isOpen && (
              <div className="absolute top-16 min-w-40 w-[40%] bg-white rounded-2xl shadow-md p-4">
                <ul>
                  {links.map((item, i) => (
                    <li
                      className="py-2 border-b text-center border-gray-200"
                      key={i}
                    >
                      <button
                        onClick={() => navigate(item.link)}
                        className={`hover:text-[var(--custom-primary-orange)] focus:text-[var(--custom-primary-orange)] transition-colors ${
                          location === item.link
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
              src="/assests/logo.svg"
              alt="logo"
              width={25}
              height={25}
              className="rounded-md mr-2"
            />
            <div className="text-xl font-bold">Vitality</div>
          </div>
          <div className="hidden lg:flex space-x-8 items-center">
            {links.map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.link)}
                className={`hover:text-[var(--custom-primary-orange)] focus:text-[var(--custom-primary-orange)] transition-colors ${
                  location === item.link
                    ? "underline underline-offset-4 text-[var(--landing-bg-orange)] decoration-2"
                    : ""
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
            {showNotifications && isAuthenticated && <NotificationPanel />}

            {location != "/" ? (
              <>
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    setIsOpen(false);
                    setShowDetails(!showDetails);
                  }}
                  className="cursor-pointer relative"
                >
                  <User className="w-5 h-5" />
                </button>
                <div
                  className={`absolute right-2 top-10 z-1 mt-3 transform transition-all duration-200 ease-in-out ${
                    showDetails
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="w-80 bg-white rounded-2xl shadow-lg overflow-hidden border-[#FFE4CC] border-2">
                    <div className="bg-[#FFF5EB] px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-[#FFE4CC] rounded-full flex items-center justify-center">
                          <span className="text-lg font-semibold text-[#FF6B35]">
                            {username.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {username}
                          </h3>
                          <p className="text-sm text-gray-600">{email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="px-6 py-4 space-y-4">
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500">
                            Phone Number
                          </label>
                          <p className="text-sm font-medium text-gray-800">
                            {phoneNumber}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500">
                            Emergency Contact
                          </label>
                          <p className="text-sm font-medium text-gray-800">
                            {altPhoneNumber}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            navigate("/appointments");
                          }}
                          className="w-full px-4 py-2 text-sm font-medium text-white bg-[#fe855a] rounded-lg hover:bg-[#FF6B35] transition-colors duration-200"
                        >
                          Appointments
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => navigate("/modify_profile")}
                            className="px-4 py-2 text-sm font-medium text-[#FF6B35] bg-[#FFF5EB] rounded-lg hover:bg-[#FFE4CC] transition-colors duration-200"
                          >
                            Modify Profile
                          </button>
                          <button
                            onClick={() => setShowLogoutModal(true)}
                            className="px-4 py-2 text-sm font-medium text-[#FF6B35] bg-[#FFF5EB] rounded-lg hover:bg-[#FFE4CC] transition-colors duration-200"
                          >
                            Logout
                          </button>
                        </div>
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
      {showLogoutModal && (
        <LogoutModal handleLogout={handleLogout} handleCancel={handleCancel} />
      )}
    </nav>
  );
};

export default Navbar;
