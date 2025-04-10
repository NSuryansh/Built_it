import React, { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";

export default function ChatList({
  names,
  selectedChat,
  setSelectedChat,
  setShowChatList,
  unread,
  isDoc = false,
}) {
  return (
    <div className="bg-[var(--mp-custom-white)] border-r border-[var(--mp-custom-gray-200)] overflow-y-auto">
      <div
        className={`${isDoc ? "bg-blue-200" : "bg-[var(--mp-custom-peach)]"}`}
      >
        <div className="p-4 border-b border-[var(--mp-custom-gray-200)]">
          <h1
            className={`text-2xl font-bold ${
              isDoc ? "text-blue-600" : "text-[var(--mp-heading-text)]"
            }`}
          >
            Messages
          </h1>
        </div>
      </div>
      <div className="space-y-1">
        {names ? (
          names.map((name, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedChat(index);
                setShowChatList(false);
              }}
              className={`w-full p-4 text-left transition-colors duration-150 ease-in-out flex cursor-pointer items-center gap-3 ${
                selectedChat === index
                  ? isDoc
                    ? "bg-blue-50 border-l-4 border-blue-500 hover:bg-blue-100"
                    : "bg-[var(--peer-custom-orange-50)] border-l-4 border-[var(--peer-custom-orange-500)] hover:bg-[var(--peer-custom-orange-100)]"
                  : "hover:bg-[var(--mp-custom-gray-200)]"
              }`}
            >
              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                    isDoc
                      ? "from-blue-500 to-cyan-500"
                      : "from-[var(--peer-custom-orange-500)] to-[var(--peer-custom-pink-500)]"
                  } flex items-center justify-center`}
                >
                  <MessageSquare className="w-5 h-5 text-[var(--mp-custom-white)]" />
                </div>
                {unread > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unread}
                  </div>
                )}
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
          ))
        ) : (
          <div>No Chats Available</div>
        )}
      </div>
    </div>
  );
}
