import React from 'react';
import { MessageSquare } from 'lucide-react';


export default function ChatList({ names, selectedChat, setSelectedChat }) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <div className='bg-orange-100'>
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-[#FF7700]">Messages</h1>
      </div>
      </div>
      <div className="space-y-1">
        {names.map((name, index) => (
          <button
            key={index}
            onClick={() => setSelectedChat(index)}
            className={`w-full p-4 text-left transition-colors duration-150 ease-in-out flex items-center gap-3
              ${selectedChat === index ? 'bg-orange-50 border-l-4 border-orange-500 hover:bg-orange-100' : 'hover:bg-gray-100'}`}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{name}</p>
              <p className="text-sm text-gray-500">Click to view conversation</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}