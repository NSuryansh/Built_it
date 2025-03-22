import React, { useEffect, useState, useRef } from "react";
import ChatList from "../components/ChatList";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { decryptMessage } from "../utils/decryptMessage";
import { generateAESKey } from "../utils/aesKey";
import { encryptMessage } from "../utils/encryptMessage";

export default function Peer() {
  const [message, setMessage] = useState("");
  const location = useLocation();
  const user = location.state;
  const socketRef = useRef(null);
  const userId = user.id;
  const recId = 15;
  const [aesKey, setAesKey] = useState();

  // Store chats and selectedChat
  const [chats, setChats] = useState([
    { name: "Casual Catch-up", messages: [] },
    { name: "Project Discussion", messages: [] },
    { name: "Weekend Plans", messages: [] },
    { name: "Gaming Squad", messages: [] },
    { name: "Tech Talk", messages: [] },
  ]);
  const [selectedChat, setSelectedChat] = useState(0);

  // Track last received message to prevent duplicates
  const lastMessageRef = useRef("");

  useEffect(() => {
    socketRef.current = io("http://localhost:3001");
    socketRef.current.on("connect", () => {
      console.log("Connected to WebSocket server");
      socketRef.current.emit("register", { userId });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    async function fetchKey() {
      const key = await generateAESKey();
      setAesKey(key);
    }
    fetchKey();
  }, []);

  useEffect(() => {
    if (!aesKey) return;

    socketRef.current.on("receiveMessage", async ({ senderId, encryptedText, iv, encryptedAESKey }) => {
      console.log("Message received:", { senderId, encryptedText, iv, encryptedAESKey });

      const decrypted = await decryptMessage(encryptedText, iv, encryptedAESKey);
      console.log("Decrypted message:", decrypted);

      // Prevent duplicate messages
      if (lastMessageRef.current === decrypted) return;
      lastMessageRef.current = decrypted;

      setChats((prevChats) =>
        prevChats.map((chat, index) =>
          index === selectedChat
            ? { ...chat, messages: [...chat.messages, { self: "False", message: decrypted }] }
            : chat
        )
      );
    });

    return () => {
      socketRef.current.off("receiveMessage");
    };
  }, [aesKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      setChats((prevChats) =>
        prevChats.map((chat, index) =>
          index === selectedChat
            ? { ...chat, messages: [...chat.messages, { self: "True", message }] }
            : chat
        )
      );

      const { encryptedText, iv } = await encryptMessage(message, aesKey);
      socketRef.current.emit("sendMessage", {
        senderId: userId,
        recipientId: recId,
        encryptedText,
        iv,
        encryptedAESKey: aesKey,
        authTag: "",
      });

      setMessage("");
    }
  };

  function base64ToHex(base64) {
    const raw = atob(base64); // Decode base64 to binary
    return [...raw].map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join('');
}


  async function fetchMessages(userId, recipientId) {
    try {
        const response = await fetch(`http://localhost:3000/messages?userId=${userId}&recId=${recipientId}`);
        const messages = await response.json();

        console.log(messages)
    } catch (error) {
        console.error("Error fetching messages:", error);
        return [];
    }
}

useEffect(() => {
    fetchMessages(userId, recId)
}, [])


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
            <ChatMessage key={index} message={msg.message} isSent={msg.self === "True"} />
          ))}
        </div>
        <ChatInput message={message} setMessage={setMessage} handleSubmit={handleSubmit} />
      </div>
    </div>
  );
}
