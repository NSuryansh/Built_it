const SessionExpired = ({ handleClosePopup, theme = "orange" }) => {
  const themes = {
    orange: {
      iconColor: "text-[var(--custom-orange-500)]",
      titleColor: "text-[var(--custom-orange-800)]",
      messageColor: "text-[var(--custom-orange-600)]",
      buttonBg:
        "bg-gradient-to-r from-[var(--custom-orange-500)] to-[var(--custom-orange-600)]",
      buttonHover:
        "hover:from-[var(--custom-orange-600)] hover:to-[var(--custom-orange-700)]",
      borderColor: "border-[var(--custom-orange-200)]/50",
      bgGradient:
        "bg-gradient-to-br from-[var(--custom-orange-50)] to-[var(--custom-white)]",
      backdropGradient:
        "bg-gradient-to-br from-amber-50 to-[var(--custom-orange-200)]", // Orange backdrop
    },
    blue: {
      iconColor: "text-[var(--custom-blue-500)]",
      titleColor: "text-[var(--custom-blue-800)]",
      messageColor: "text-[var(--custom-blue-600)]",
      buttonBg:
        "bg-gradient-to-r from-[var(--custom-blue-500)] to-[var(--custom-blue-600)]",
      buttonHover:
        "hover:from-[var(--custom-blue-600)] hover:to-[var(--custom-blue-700)]",
      borderColor: "border-custom-blue-200/50",
      bgGradient:
        "bg-gradient-to-br from-[var(--custom-blue-50)] to-[var(--custom-white)]",
      backdropGradient:
        "bg-gradient-to-br from-[var(--custom-blue-50)] to-[var(--custom-blue-200)]", // Blue backdrop
    },
    green: {
      iconColor: "text-[var(--custom-green-700)]",
      titleColor: "text-[var(--custom-green-700)]",
      messageColor: "text-[var(--custom-green-700)]",
      buttonBg:
        "bg-gradient-to-r from-[var(--custom-green-700)] to-[var(--custom-green-600)]",
      buttonHover:
        "hover:from-[var(--custom-green-700)] hover:to-[var(--custom-green-700)]",
      borderColor: "border-[var(--custom-green-200)]/50",
      bgGradient:
        "bg-gradient-to-br from-[var(--custom-green-50)] to-[var(--custom-yellow-50)]",
      backdropGradient:
        "bg-gradient-to-br from-[var(--custom-green-50)] to-[var(--custom-green-200)]", // Green backdrop
    },
  };

  const currentTheme = themes[theme] || themes.orange;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${currentTheme.backdropGradient} bg-opacity-60 backdrop-blur-sm z-50 animate-fadeIn`}
    >
      <div
        className={`relative ${currentTheme.bgGradient} p-8 rounded-2xl shadow-xl max-w-md w-full text-center border ${currentTheme.borderColor} transform transition-all duration-300 scale-100 hover:scale-[1.02]`}
      >
        {/* Decorative Top Accent */}
        <div
          className={`absolute -top-3 left-1/2 transform -translate-x-1/2 w-16 h-1.5 rounded-full ${currentTheme.buttonBg}`}
        />

        {/* Chat Bubble Icon with Animation */}
        <div className="mx-auto w-16 h-16 mb-6 relative">
          <div
            className={`absolute inset-0 rounded-full ${currentTheme.iconColor} opacity-10 animate-pulse`}
          ></div>
          <svg
            className={`w-full h-full ${currentTheme.iconColor} relative z-10`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
          </svg>
        </div>

        {/* Title with Gradient */}
        <h2
          className={`text-3xl font-extrabold ${currentTheme.titleColor} mb-3 bg-clip-text bg-gradient-to-r ${currentTheme.buttonBg} text-transparent`}
        >
          Session Expired
        </h2>

        {/* Message */}
        <p
          className={`text-base ${currentTheme.messageColor} mb-8 leading-relaxed font-medium`}
        >
          Your session has timed out for security reasons. Please log in again
          to continue your journey.
        </p>

        {/* Button with Enhanced Styling */}
        <button
          onClick={handleClosePopup}
          className={`${currentTheme.buttonBg} ${currentTheme.buttonHover} px-8 py-3 rounded-full text-[var(--custom-white)] font-semibold text-sm uppercase tracking-wide shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95`}
        >
          Back to Login
        </button>

        {/* Subtle Footer Note */}
        <p className="text-xs text-[var(--custom-gray-500)] mt-6">
          Need help? Contact support anytime.
        </p>
      </div>
    </div>
  );
};

export default SessionExpired;
