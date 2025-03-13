import React from 'react';


export default function ChatMessage({ message, isReceived }) {
  return (
    <div className={`flex ${isReceived ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
          isReceived
            ? 'bg-gray-100 text-gray-800'
            : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
        }`}
      >
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}