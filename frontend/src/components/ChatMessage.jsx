import React from 'react';
import { User } from 'lucide-react';

const ChatMessage = ({ message, isReceived }) => {
  return (
    <div className={`flex items-start gap-3 mb-4 ${isReceived ? 'flex-row-reverse' : ''}`}>
      <div className="flex-shrink-0">
        <User className="w-8 h-8 text-gray-600" />
      </div>
      <div className={`flex flex-col ${isReceived ? 'items-end' : ''}`}>
        <p className={`px-4 py-2 rounded-lg ${
          isReceived ? 'bg-orange-50 text-gray-700' : 'bg-gray-100 text-gray-700 shadow-sm'
        }`}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
