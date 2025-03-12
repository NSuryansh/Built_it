import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ChatList from '../components/ChatList';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';

function Peer() {
  const chats = [
    {
      name: "Casual Catch-up",
      messages: [
        { self: "True", message: "Hey Sam, long time no see!" },
        { self: "False", message: "Hey Jake! Yeah, it's been a while. How have you been?" },
        { self: "True", message: "Pretty good! Just started a new job." }
      ]
    },
    {
      name: "Project Discussion",
      messages: [
        { self: "True", message: "Did you check the latest code commit?" },
        { self: "False", message: "Yeah, I went through it. Looks solid, but we might need some optimizations." },
        { self: "True", message: "Agreed! Let's discuss it in today's stand-up meeting." }
      ]
    },
    {
      name: "Weekend Plans",
      messages: [
        { self: "True", message: "Hey Lisa, any plans for the weekend?" },
        { self: "False", message: "Hey Tom! Not yet. Thinking of going for a hike." },
        { self: "True", message: "That sounds fun! Mind if I join?" },
        { self: "False", message: "Of course! The more, the merrier." }
      ]
    },
    {
      name: "Gaming Squad",
      messages: [
        { self: "True", message: "Guys, who's up for some gaming tonight?" },
        { self: "False", message: "I'm in! What are we playing?" },
        { self: "False", message: "Me too! Let's go with Valorant." },
        { self: "True", message: "Sounds good! 9 PM?" }
      ]
    },
    {
      name: "Tech Talk",
      messages: [
        { self: "True", message: "Have you heard about the new AI model release?" },
        { self: "False", message: "Yeah, it's insane! The benchmarks are incredible." },
        { self: "True", message: "I know, right? It's going to revolutionize a lot of applications." }
      ]
    }
  ];

  const [selectedChat, setSelectedChat] = useState(0);

  return (
    <div className="flex-1 flex overflow-hidden">
      <ChatList names={chats.map(chat => chat.name)} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b bg-[#FFDDC0]">
          <h2 className="text-2xl font-semibold text-gray-800">{chats[selectedChat].name}</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          {chats[selectedChat].messages.map((msg, index) => (
            <ChatMessage key={index} message={msg.message} isReceived={msg.self === "False"} />
          ))}
        </div>
        <ChatInput />
      </div>
    </div>
  );
}

export default Peer;
