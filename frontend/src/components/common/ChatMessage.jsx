import React, { useEffect, useRef } from "react";

const ChatMessage = ({ message, isSent, isDoc = false }) => {
  const messageRef = useRef(null);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [message]);

  return (
    <div
      ref={messageRef}
      className={`flex ${isSent ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
          isSent
            ? `bg-gradient-to-r ${
                isDoc
                  ? "from-blue-500 to-cyan-500"
                  : "from-[var(--peer-custom-orange-500)] to-[var(--peer-custom-pink-500)]"
              } text-[var(--custom-white)]`
            : "bg-[var(--mp-custom-gray-200)] text-[var(--mp-custom-gray-800)]"
        }`}
      >
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}

export default ChatMessage;