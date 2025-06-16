import React, { useState, useEffect } from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";
import Dinogame from "../user/dino";

const ErrorBoundaryFallback = ({ userType }) => {
  const [color, setColor] = useState("orange");

  useEffect(() => {
    if (userType === "doc") {
      setColor("blue");
    } else if (userType === "admin") {
      setColor("green");
    }
  }, [userType]);

  const bgClass = `bg-${color}-100`;
  const iconColorClass = `text-${color}-500`;
  const buttonBgClass = `bg-${color}-500 hover:bg-${color}-600`;

  return (
    <div
      className={`min-h-screen ${bgClass} flex items-center justify-center p-4`}
    >
      <div className="bg-[var(--custom-white)] rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          <AlertOctagon
            className={`w-16 h-16 ${iconColorClass} ${
              userType === "admin" ? "text-[var(--custom-green-700)]" : ""
            } mb-4`}
          />
          <h2 className="text-2xl font-bold text-[var(--custom-gray-800)] mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-[var(--custom-gray-600)] mb-6">
            We've encountered an unexpected error. Don't worry, it happens to
            the best of us!
          </p>
          <div className="w-full mb-6 overflow-hidden rounded-lg">
            <Dinogame />
          </div>
          <p className="text-sm text-[var(--custom-gray-500)] mb-6">
            While we fix this, why not try the classic Chrome dinosaur game?
            Press spacebar to jump!
          </p>
          <button
            onClick={() => window.location.reload()}
            className={`inline-flex items-center px-4 py-2 ${buttonBgClass} text-[var(--custom-white)] rounded-lg transition-colors`}
          >
            <div className="flex justify-center items-center">
              <RefreshCw className={`w-4 h-4 mr-2 `} />
              <p
                className={`${
                  userType === "admin" ? "text-[var(--custom-green-700)]" : ""
                }`}
              >
                Try Again
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundaryFallback;
