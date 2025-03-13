import React, { useState } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';

export default function ChatInput() {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Handle message submission
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-gray-600 transition-colors"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-orange-500"
        />
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-gray-600 transition-colors"
        >
          <Smile className="w-5 h-5" />
        </button>
        <button
          type="submit"
          className="p-2 text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-full hover:opacity-90 transition-opacity"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}