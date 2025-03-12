import React from 'react';
import { Send } from 'lucide-react';

const ChatInput = () => {
  return (
    <div className="border-t bg-gray-100 p-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:border-[#FFDDC0]0"
        />
        <button className="p-2 bg-[#FFDDC0]0 text-white rounded-full hover:bg-orange-600">
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;