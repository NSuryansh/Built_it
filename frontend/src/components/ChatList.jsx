import React from 'react';
import { User } from 'lucide-react';

const ChatItem = ({ message, isActive, index, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(index)}
      className={`w-full p-4 flex items-center gap-3 cursor-pointer transition ${
        isActive ? 'bg-gray-200 text-black' : 'hover:bg-gray-100'
      }`}
    >
      <User className={`w-8 h-8 ${isActive ? 'text-black' : 'text-gray-600'}`} />
      <p className={`text-sm flex-1 truncate ${isActive ? 'text-black' : 'text-gray-600'}`}>{message}</p>
    </button>
  );
};

const ChatList = ({ names, selectedChat, setSelectedChat }) => {
  return (
    <div className="w-80 bg-gray-50 border-r">
      <div className="p-4 bg-orange-50">
        <h2 className="text-2xl font-bold text-orange-100">Messages</h2>
      </div>
      <div className="overflow-y-auto w-80">
        {names.map((name, index) => (
          <ChatItem
            key={index}
            message={name}
            isActive={index === selectedChat}
            index={index}
            onSelect={setSelectedChat}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;