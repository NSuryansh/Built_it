import React from "react";

const ProgressBar = ({ label, value }) => {
  const getBarColor = (value) => {
    if (value <= 25) return "#EF4444"; // red
    if (value <= 50) return "#EAB308"; // yellow
    if (value <= 75) return "#3B82F6"; // blue
    return "#22C55E"; // green
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-medium text-[var(--mp-custom-gray-600)]">
          {label}
        </span>
        <span className="text-lg font-medium text-[var(--mp-custom-gray-600)]">
          {value}
        </span>
      </div>
      <div className="relative h-2 bg-[var(--mp-custom-gray-200)] rounded-lg overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-lg"
          style={{
            width: `${value}%`,
            backgroundColor: getBarColor(value),
            boxShadow: `0 0 10px ${getBarColor(value)}`,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                90deg,
                transparent 0%,
                rgba(255, 255, 255, 0.3) 50%,
                transparent 100%
              )`,
              animation: "shimmer 2s infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
