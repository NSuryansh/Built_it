import React from "react";
import { MessageSquare } from "lucide-react";

export default function ChatList({ names, selectedChat, setSelectedChat }) {
  return (
    <div className="md:w-4/12 lg:w-3/12 bg-[var(--mp-custom-white)] border-r border-[var(--mp-custom-gray-200)] overflow-y-auto">
      <div className="bg-[var(--mp-custom-peach)]">
        <div className="p-4 border-b border-[var(--mp-custom-gray-200)]">
          <h1 className="text-2xl font-bold text-[var(--mp-heading-text)]">
            Messages
          </h1>
        </div>
      </div>
      <div className="space-y-1">
        {names.map((name, index) => (
          <button
            key={index}
            onClick={() => setSelectedChat(index)}
            className={`w-full p-4 text-left transition-colors duration-150 ease-in-out flex cursor-pointer items-center gap-3
              ${
                selectedChat === index
                  ? "bg-[var(--peer-custom-orange-50)] border-l-4 border-[var(--peer-custom-orange-500)] hover:bg-[var(--peer-custom-orange-100)]"
                  : "hover:bg-[var(--mp-custom-gray-200)]"
              }`}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--peer-custom-orange-500)] to-[var(--peer-custom-pink-500)] flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-[var(--mp-custom-white)]" />
            </div>
            <div>
              <p className="font-medium text-[var(--mp-custom-gray-800)]">
                {name}
              </p>
              <p className="text-sm text-[var(--mp-custom-gray-600)]">
                Click to view conversation
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
