import React from "react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-transparent">
      {/* Left Section: Brand Name */}
      <div className="text-2xl font-bold text-gray-800">
        CalmNest
      </div>

      {/* Center Section: Nav Links */}
      <ul className="flex space-x-6">
        <li>
          {/* "Home" with orange underline to show it's active */}
          <a
            href="#"
            className="pb-1 border-b-2 border-orange-500 text-gray-800 hover:text-gray-600"
          >
            Home
          </a>
        </li>
        <li>
          <a href="#" className="text-gray-800 hover:text-gray-600">
            Mood
          </a>
        </li>
        <li>
          <a href="#" className="text-gray-800 hover:text-gray-600">
            Peer
          </a>
        </li>
        <li>
          <a href="#" className="text-gray-800 hover:text-gray-600">
            Book
          </a>
        </li>
        <li>
          <a href="#" className="text-gray-800 hover:text-gray-600">
            Stats
          </a>
        </li>
      </ul>

      {/* Right Section: Icons + Login Button */}
      <div className="flex items-center space-x-4">
        {/* Bell icon (example) */}
        <button className="text-gray-800 hover:text-gray-600 focus:outline-none">
          {/* Heroicons bell outline */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14v-3a6 6 0 00-5-5.917V5a2 2 0 10-4 0v.083A6 6 0 004 11v3c0 .512-.195 1.023-.595 1.405L2 17h5m8 0v1a3 3 0 11-6 0v-1"
            />
          </svg>
        </button>

        {/* User icon (example) */}
        <button className="text-gray-800 hover:text-gray-600 focus:outline-none">
          {/* Heroicons user outline */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.121 17.804A4 4 0 0110 16h4a4 4 0 014.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>

        <button className="px-4 py-2 border border-orange-500 text-orange-500 rounded hover:bg-orange-500 hover:text-white transition">
          Login
        </button>
      </div>
    </nav>
  );
}
