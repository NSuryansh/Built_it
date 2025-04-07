import React from "react";

const SessionExpired = ({ handleClosePopup, theme = "orange" }) => {
  const themes = {
    orange: {
      iconColor: "text-orange-600",
      titleColor: "text-orange-900",
      messageColor: "text-orange-600",
      buttonBg: "bg-orange-600",
      buttonHover: "hover:bg-orange-700",
      borderColor: "border-orange-200/40",
    },
    blue: {
      iconColor: "text-blue-600",
      titleColor: "text-blue-900",
      messageColor: "text-blue-600",
      buttonBg: "bg-blue-600",
      buttonHover: "hover:bg-blue-700",
      borderColor: "border-blue-200/40",
    },
    green: {
      iconColor: "text-green-600",
      titleColor: "text-green-900",
      messageColor: "text-green-600",
      buttonBg: "bg-green-600",
      buttonHover: "hover:bg-green-700",
      borderColor: "border-green-200/40",
    },
  };

  const currentTheme = themes[theme] || themes.orange; // Default to orange if theme is invalid

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className={`bg-white p-6 rounded-xl shadow-2xl max-w-md w-full text-center ${currentTheme.borderColor}`}>
        {/* Chat Bubble Icon */}
        <div className="mx-auto w-12 h-12 mb-4">
          <svg
            className={`w-full h-full ${currentTheme.iconColor}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 9h-4v-2h4v2zm4 0h-2v-2h2v2zm-6 4h-4v-2h4v2zm6 0h-6v-2h6v2zm0-4h-2v-2h2v2z" />
          </svg>
        </div>

        {/* Title */}
        <h2 className={`text-2xl font-bold ${currentTheme.titleColor} mb-2`}>
          Session Expired
        </h2>

        {/* Message */}
        <p className={` leading-relaxed ${currentTheme.messageColor} mb-6`}>
          Your session has timed out for security reasons. Please log in again to continue.
        </p>

        {/* Button */}
        <button
          onClick={handleClosePopup}
          className={`px-6 py-2 rounded-lg ${currentTheme.buttonBg} text-white font-medium text-sm transition-colors duration-200 ${currentTheme.buttonHover}`}
        >
          Return to Login
        </button>
      </div>
    </div>
  );
};

export default SessionExpired;