import React from "react";

export default function ChatMessage({ message, isReceived }) {
  return (
    <div
      className={`flex ${isReceived ? "justify-start" : "justify-end"} mb-4`}
    >
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
          isReceived
            ? "bg-[var(--mp-custom-gray-200)] text-[var(--mp-custom-gray-800)]"
            : "bg-gradient-to-r from-[var(--peer-custom-orange-500)] to-[var(--peer-custom-pink-500)] text-[var(--custom-white)]"
        }`}
      >
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}
