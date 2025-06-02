"use client";

import { useState } from "react";
import { Phone } from "lucide-react";

const EmergencyCallButton = ({ phoneNumber }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleCall = () => {
    setIsClicked(true);
    window.location.href = `tel:${phoneNumber}`;

    setTimeout(() => {
      setIsClicked(false);
    }, 300);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleCall}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 text-white transform transition-all duration-300 ease-out ${
          isHovered ? "scale-110 shadow-[0_6px_25px_rgba(255,147,51,0.6)]" : ""
        } ${
          isClicked ? "scale-95 shadow-[0_2px_10px_rgba(255,147,51,0.3)]" : ""
        } group`}
        aria-label="Emergency Call"
      >
        <Phone
          size={isHovered ? 26 : 24}
          strokeWidth={2.5}
          className="transition-all duration-300 ease-out"
        />
      </button>

      <div
        className={`absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg
        bg-gray-900/90 text-white text-sm font-medium transform transition-all duration-200
        ${
          isHovered
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        }
      `}
      >
        Emergency Call
      </div>
    </div>
  );
};

export default EmergencyCallButton;
