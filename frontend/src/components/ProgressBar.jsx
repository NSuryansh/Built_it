import React from "react";

const ProgressBar = ({ label, value }) => {
  if (value > 10) {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-medium text-[var(--mp-custom-gray-600)]">
            {label}
          </span>
          <span className="text-lg font-medium text-[var(--mp-custom-gray-600)]">
            Insufficient Data
          </span>
        </div>
      </div>
    );
  }

  const getBarColor = (value) => {
 if(label === "Stress"){
    if (value <= 2.5) return "#EF4444";
    if (value <= 5) return "#EAB308";   
    if (value <= 7.5) return "#3B82F6"; 
    return "#22C55E";                
    }else{
      if (value <= 2.5) return "#22C55E";
    if (value <= 5) return "#3B82F6";   
    if (value <= 7.5) return "#EAB308"; 
    return "#EF4444";   
    }       
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-medium text-[var(--mp-custom-gray-600)]">
          {label}
        </span>
        <span className="text-lg font-medium text-[var(--mp-custom-gray-600)]">
          {value} / 10
        </span>
      </div>
      <div className="relative h-2 bg-[var(--mp-custom-gray-200)] rounded-lg overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-lg"
          style={{
            width: `${value * 10}%`,
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
