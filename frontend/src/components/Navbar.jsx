import React from "react";
import { Bell, User } from "lucide-react";
const Navbar = () => {
  const location = window.location.pathname;
  return (
    <nav className="bg-transperent">
      <div className="px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">CalmNest</div>
          <div className="flex space-x-8 items-center">
            <a
              href="/"
              className={`hover:text-[#FF7700] transition-colors ${
                location === "/"
                  ? "underline underline-offset-4 text-[#FF7700] decoration-2"
                  : ""
              }`}
            >
              Home
            </a>
            <a
              href="/Mood"
              className={`hover:text-[#FF7700] transition-colors ${
                location === "/Mood"
                  ? "underline underline-offset-4 text-[#FF7700] decoration-2"
                  : ""
              }`}
            >
              Mood
            </a>
            <a
              href="/Peer"
              className={`hover:text-[#FF7700] transition-colors ${
                location === "/Peer"
                  ? "underline underline-offset-4 text-[#FF7700] decoration-2"
                  : ""
              }`}
            >
              Peer
            </a>
            <a
              href="/"
              className={`hover:text-[#FF7700] transition-colors ${
                location === "/"
                  ? "underline underline-offset-4 text-[#FF7700] decoration-2"
                  : ""
              }`}
            >
              Book
            </a>
            <a
              href="/"
              className={`hover:text-[#FF7700] transition-colors ${
                location === "/"
                  ? "underline underline-offset-4 text-[#FF7700] decoration-2"
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
            <button className="bg-[#FF7700] text-white px-4 py-1 rounded cursor-pointer">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
