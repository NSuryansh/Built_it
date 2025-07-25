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
  // console.log(names, "Unread CHht List");
  return (
    <div className="bg-[var(--custom-white)] border-r border-[var(--custom-gray-200)] overflow-y-auto">
      <div className="space-y-1">
        {names && names.length > 0 ? (
          names.map((chat, index) => {
            const unreadEntry = unread.find(
              (u) => u.senderId === chat.senderId
            );
            const unreadCount = unreadEntry?.count || 0;
            // console.log(chat);
            return (
              <button
                key={chat.senderId}
                onClick={() => {
                  setSelectedChat(index);
                  setShowChatList(false);
                }}
                className={`w-full p-4 text-left flex items-center gap-3 transition-colors duration-150 ease-in-out ${
                  selectedChat === index
                    ? isDoc
                      ? "bg-[var(--custom-blue-50)] border-l-4 border-[var(--custom-blue-500)] hover:bg-[var(--custom-blue-100)]"
                      : "bg-[var(--custom-orange-50)] border-l-4 border-[var(--custom-orange-500)] hover:bg-[var(--custom-orange-100)]"
                    : "hover:bg-[var(--custom-gray-200)]"
                }`}
              >
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center ${
                      isDoc
                        ? "from-[var(--custom-blue-500)] to-cyan-500"
                        : "from-[var(--custom-orange-500)] to-pink-500"
                    }`}
                  >
                    {!isDoc && chat.img != "" ? (
                      <img
                        src={chat.img}
                        alt="Profile"
                        className="w-10 h-10 object-cover rounded-full"
                      />
                    ) : (
                      <MessageSquare className="w-5 h-5 text-[var(--custom-white)]" />
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[var(--custom-red-500)] text-[var(--custom-white)] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>

                <div>
                  <p className="font-medium text-[var(--custom-gray-800)]">
                    {chat.name}
                  </p>
                  <p className="text-sm text-[var(--custom-gray-600)]">
                    Click to view conversation
                  </p>
                </div>
              </button>
            );
          })
        ) : (
          <div className="p-4 text-[var(--custom-gray-500)]">
            No Chats Available
          </div>
        )}
      </div>
    </div>
  );
}
