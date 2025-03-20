import React, { useEffect, useState } from "react";
import ChatList from "../components/ChatList";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import { useLocation } from "react-router-dom";
import {io} from "socket.io-client";
import { decryptMessage } from "../utils/decryptMessage";
import { generateAESKey } from "../utils/aesKey";
import {encryptMessage} from "../utils/encryptMessage";
import { useRef } from "react";

export default function Peer() {
  const [message, setMessage] = useState("");
  const location = useLocation()
  const user = location.state
  const socketRef = useRef(null);
  const userId = user.id
  const recId = 15
  // const socket = io("http://localhost:3001");
  const [aesKey, setAesKey] = useState();
  console.log(userId)
  useEffect(() => {
    socketRef.current = io("http://localhost:3001");
    socketRef.current.on("connect", () => {
      console.log("Connected to WebSocket server");
      console.log(socketRef.current.id);
      socketRef.current.emit("register", { userId });
      // socketRef.current.emit("register", { userId: recId });
    });
    return () => {
      socketRef.current.disconnect();
    };
  },[]);

  useEffect(() => {
    async function fetchKey() {
        const key = await generateAESKey();
        setAesKey(key);
    }
    fetchKey();
}, []);

  
  useEffect( () => {
    if(!aesKey) return;
    socketRef.current.on("receiveMessage", async ({ senderId, encryptedText, iv, encryptedAESKey, authTag }) => {
      console.log("Message received:", { senderId, encryptedText, iv, encryptedAESKey, authTag });
      const decrypted = await decryptMessage(encryptedText, iv, encryptedAESKey);
      console.log("Decrypted message:", decrypted);
    });
    return () => {
      socketRef.current.off("receiveMessage"); 
  };
  }, [aesKey]);


  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newChats = chats;
      newChats[selectedChat].messages.push({ self: "True", message: message });

      const { encryptedText, iv } = await encryptMessage(message, aesKey);
      socketRef.current.emit("sendMessage", {
        senderId: userId,
        recipientId: recId,
        encryptedText,
        iv,
        encryptedAESKey: aesKey, 
        authTag:""
    });
      setChats(newChats);
      setMessage("");
    }
  };

  const [chats, setChats] = useState([
    {
      name: "Casual Catch-up",
      messages: [
        { self: "True", message: "Hey Sam, long time no see!" },
        {
          self: "False",
          message: "Hey Jake! Yeah, it's been a while. How have you been?",
        },
        { self: "True", message: "Pretty good! Just started a new job." },
      ],
    },
    {
      name: "Project Discussion",
      messages: [
        { self: "True", message: "Did you check the latest code commit?" },
        {
          self: "False",
          message:
            "Yeah, I went through it. Looks solid, but we might need some optimizations.",
        },
        {
          self: "True",
          message: "Agreed! Let's discuss it in today's stand-up meeting.",
        },
      ],
    },
    {
      name: "Weekend Plans",
      messages: [
        { self: "True", message: "Hey Lisa, any plans for the weekend?" },
        {
          self: "False",
          message: "Hey Tom! Not yet. Thinking of going for a hike.",
        },
        { self: "True", message: "That sounds fun! Mind if I join?" },
        { self: "False", message: "Of course! The more, the merrier." },
      ],
    },
    {
      name: "Gaming Squad",
      messages: [
        { self: "True", message: "Guys, who's up for some gaming tonight?" },
        { self: "False", message: "I'm in! What are we playing?" },
        { self: "False", message: "Me too! Let's go with Valorant." },
        { self: "True", message: "Sounds good! 9 PM?" },
      ],
    },
    {
      name: "Tech Talk",
      messages: [
        {
          self: "True",
          message: "Have you heard about the new AI model release?",
        },
        {
          self: "False",
          message: "Yeah, it's insane! The benchmarks are incredible.",
        },
        {
          self: "True",
          message:
            "I know, right? It's going to revolutionize a lot of applications.",
        },
      ],
    },
  ]);

  const [selectedChat, setSelectedChat] = useState(0);

  return (
    <div className="flex h-screen bg-[var(--mp-custom-white)]">
      <ChatList
        names={chats.map((chat) => chat.name)}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
      />
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-[var(--mp-custom-gray-200)] bg-[var(--mp-custom-white)]">
          <h2 className="text-2xl font-bold text-[var(--mp-custom-gray-800)]">
            {chats[selectedChat].name}
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[var(--mp-custom-white)]">
          {chats[selectedChat].messages.map((msg, index) => (
            <ChatMessage
              key={index}
              message={msg.message}
              isSent={msg.self === "True"}
            />
          ))}
        </div>
        <ChatInput
          message={message}
          setMessage={setMessage}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
