import React from "react";
import { Bell, User } from "lucide-react";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation().pathname;
  return (
    <nav className="bg-transperent">
      <div className="px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">CalmNest</div>
          <div className="flex space-x-8 items-center">
            <a
              href="/dashboard"
              className={`hover:text-[var(--custom-primary-orange)] focus:text-[var(--custom-primary-orange)] transition-colors ${
                location === "/dashboard"
                  ? "underline underline-offset-4 text-[var(--landing-bg-orange)] decoration-2"
                  : ""
              }`}
            >
              Home
            </a>
            <a
              href="/mood"
              className={`hover:text-[var(--custom-primary-orange)] focus:text-[var(--custom-primary-orange)] transition-colors ${
                location === "/mood"
                  ? "underline underline-offset-4 text-[var(--landing-bg-orange)] decoration-2"
                  : ""
              }`}
            >
              Mood
            </a>
            <a
              href="/peer"
              className={`hover:text-[var(--custom-primary-orange)] focus:text-[var(--custom-primary-orange)] transition-colors ${
                location === "/peer"
                  ? "underline underline-offset-4 text-[var(--landing-bg-orange)] decoration-2"
                  : ""
              }`}
            >
              Peer
            </a>
            <a
              href="/book"
              className={`hover:text-[var(--custom-primary-orange)] focus:text-[var(--custom-primary-orange)] transition-colors ${
                location === "/book"
                  ? "underline underline-offset-4 text-[var(--landing-bg-orange)] decoration-2"
                  : ""
              }`}
            >
              Book
            </a>
            <a
              href="/stress"
              className={`hover:text-[var(--custom-primary-orange)] focus:text-[var(--custom-primary-orange)] transition-colors ${
                location === "/stress"
                  ? "underline underline-offset-4 text-[var(--landing-bg-orange)] decoration-2"
                  : ""
              }`}
            >
              Stress
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
              className="bg-[var(--custom-primary-orange)] text-[var(--custom-white)] px-4 py-1 rounded cursor-pointer"
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

export default Navbar;
