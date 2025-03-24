import React, { useEffect, useState, useRef } from "react";
import ChatList from "../components/ChatList";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { decryptMessage } from "../utils/decryptMessage";
import { generateAESKey } from "../utils/aesKey";
import { encryptMessage } from "../utils/encryptMessage";
import { checkAuth } from "../utils/profile";

export default function Peer() {
  // Define hooks at the top
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [aesKey, setAesKey] = useState();
  const [chats, setChats] = useState([
    { name: "Casual Catch-up", messages: [] },
    { name: "Project Discussion", messages: [] },
    { name: "Weekend Plans", messages: [] },
    { name: "Gaming Squad", messages: [] },
    { name: "Tech Talk", messages: [] },
  ]);
  const [selectedChat, setSelectedChat] = useState(0);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const socketRef = useRef(null);
  const lastMessageRef = useRef("");

  // Retrieve user data from localStorage
  const userId = localStorage.getItem("userid");
  const username = localStorage.getItem("username"); // Currently unused
  const recId = 15; // Hardcoded recipient id

  // Authentication check
  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth();
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!userId) return;
    socketRef.current = io("http://localhost:3001");
    socketRef.current.on("connect", () => {
      console.log("Connected to WebSocket server");
      socketRef.current.emit("register", { userId });
    });
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId]);

  // Generate AES key
  useEffect(() => {
    async function fetchKey() {
      const key = await generateAESKey();
      setAesKey(key);
    }
    fetchKey();
  }, []);

  // Handle receiving messages
  useEffect(() => {
    if (!aesKey) return;

    const handleReceiveMessage = async ({ senderId, encryptedText, iv, encryptedAESKey }) => {
      console.log("Message received:", { senderId, encryptedText, iv, encryptedAESKey });
      const decrypted = await decryptMessage(encryptedText, iv, encryptedAESKey);
      console.log("Decrypted message:", decrypted);

      if (lastMessageRef.current === decrypted) return;
      lastMessageRef.current = decrypted;

      setChats((prevChats) =>
        prevChats.map((chat, index) =>
          index === selectedChat
            ? { ...chat, messages: [...chat.messages, { self: "False", message: decrypted }] }
            : chat
        )
      );
    };

    socketRef.current.on("receiveMessage", handleReceiveMessage);
    return () => {
      socketRef.current.off("receiveMessage", handleReceiveMessage);
    };
  }, [aesKey, selectedChat]);

  // Submit message
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

  // Convert base64 to hex
  function base64ToHex(base64) {
    const raw = atob(base64);
    return [...raw]
      .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("");
  }

  // Fetch messages
  async function fetchMessages(userId, recipientId) {
    try {
      const response = await fetch(`http://localhost:3000/messages?userId=${userId}&recId=${recipientId}`);
      const messages = await response.json();

      // Use Promise.all to await each decryption if decryptMessage is async
      const decrypted = await Promise.all(
        messages.map(async (msg) => ({
          senderId: msg["senderId"],
          recipientId: msg["recipientId"],
          encryptedAESKey: msg["encryptedAESKey"],
          decryptedText: await decryptMessage(msg["encryptedText"], msg["iv"], msg["encryptedAESKey"]),
        }))
      );
      console.log(decrypted);
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  }

  // Fetch messages when userId is available
  useEffect(() => {
    if (userId) {
      fetchMessages(userId, recId);
    }
  }, [userId]);

  // Handle session timeout
  const handleClosePopup = () => {
    navigate("/login");
  };

  // Render based on authentication status
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold text-red-600">Session Timeout</h2>
          <p className="mt-2">Your session has expired. Please log in again.</p>
          <button onClick={handleClosePopup} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

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
