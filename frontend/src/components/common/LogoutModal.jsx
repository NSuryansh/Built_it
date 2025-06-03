import { LogOut } from "lucide-react";

const LogoutModal = ({ handleLogout, handleCancel, theme = "orange" }) => {
  const themes = {
    orange: {
      iconColor: "text-custom-orange-500",
      titleColor: "text-custom-orange-800",
      messageColor: "text-custom-orange-600",
      primaryButtonBg:
        "bg-gradient-to-r from-custom-orange-500 to-custom-orange-600",
      primaryButtonHover:
        "hover:from-custom-orange-600 hover:to-custom-orange-700",
      secondaryButtonBg: "bg-custom-white",
      secondaryButtonText: "text-custom-orange-600",
      secondaryButtonHover: "hover:bg-custom-orange-50",
      secondaryButtonBorder: "border-custom-orange-200",
      borderColor: "border-custom-orange-200/50",
      bgGradient: "bg-gradient-to-br from-custom-orange-50 to-custom-white",
      backdropGradient: "bg-opacity-30",
    },
    blue: {
      iconColor: "text-custom-blue-500",
      titleColor: "text-custom-blue-800",
      messageColor: "text-custom-blue-600",
      primaryButtonBg:
        "bg-gradient-to-r from-custom-blue-500 to-custom-blue-600",
      primaryButtonHover: "hover:from-custom-blue-600 hover:to-custom-blue-700",
      secondaryButtonBg: "bg-custom-white",
      secondaryButtonText: "text-custom-blue-600",
      secondaryButtonHover: "hover:bg-custom-blue-50",
      secondaryButtonBorder: "border-custom-blue-200",
      borderColor: "border-custom-blue-200/50",
      bgGradient: "bg-gradient-to-br from-custom-blue-50 to-custom-white",
      backdropGradient: "bg-opacity-30",
    },
    green: {
      iconColor: "text-custom-green-700",
      titleColor: "text-custom-green-700",
      messageColor: "text-custom-green-700",
      primaryButtonBg:
        "bg-gradient-to-r from-custom-green-700 to-custom-green-600",
      primaryButtonHover:
        "hover:from-custom-green-700 hover:to-custom-green-700",
      secondaryButtonBg: "bg-custom-white",
      secondaryButtonText: "text-custom-green-600",
      secondaryButtonHover: "hover:bg-custom-green-50",
      secondaryButtonBorder: "border-custom-green-200",
      borderColor: "border-custom-green-200/50",
      bgGradient: "bg-gradient-to-br from-custom-green-50 to-amber-50",
      backdropGradient: "bg-opacity-30",
    },
  };

  const currentTheme = themes[theme] || themes.orange;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${currentTheme.backdropGradient} backdrop-blur-sm z-50 animate-fadeIn`}
    >
      <div
        className={`relative ${currentTheme.bgGradient} p-8 rounded-2xl shadow-xl max-w-md w-full text-center border ${currentTheme.borderColor} transform transition-all duration-300 scale-100 hover:scale-[1.02]`}
      >
        <div
          className={`absolute -top-3 left-1/2 transform -translate-x-1/2 w-16 h-1.5 rounded-full ${currentTheme.primaryButtonBg}`}
        />

        <div className="mx-auto w-16 h-16 mb-6 relative">
          <div
            className={`absolute inset-0 rounded-full ${currentTheme.iconColor} opacity-10 animate-pulse`}
          ></div>
          <LogOut
            className={`w-10 h-10 ${currentTheme.iconColor} absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
          />
        </div>

        <h2
          className={`text-2xl font-extrabold ${currentTheme.titleColor} mb-3 bg-clip-text bg-gradient-to-r ${currentTheme.primaryButtonBg} text-transparent`}
        >
          Confirm Logout
        </h2>

        <p
          className={`text-base ${currentTheme.messageColor} mb-8 leading-relaxed font-medium`}
        >
          Are you sure you want to log out of your account? You'll need to log
          in again to access your data.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleCancel}
            className={`${currentTheme.secondaryButtonBg} border ${currentTheme.secondaryButtonBorder} ${currentTheme.secondaryButtonText} ${currentTheme.secondaryButtonHover} px-8 py-3 rounded-full font-semibold text-sm uppercase tracking-wide shadow-sm transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 active:scale-95 flex-1`}
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className={`${currentTheme.primaryButtonBg} ${currentTheme.primaryButtonHover} px-8 py-3 rounded-full text-custom-white font-semibold text-sm uppercase tracking-wide shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95 flex-1`}
          >
            Logout
          </button>
        </div>

        <p className="text-xs text-custom-gray-500 mt-6">
          You'll be securely logged out.
        </p>
      </div>
    </div>
  );
};

export default LogoutModal;
