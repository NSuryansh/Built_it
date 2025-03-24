import React, { useEffect, useState, useRef } from "react";
import ChatList from "../components/ChatList";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { decryptMessage } from "../utils/decryptMessage";
import { generateAESKey } from "../utils/aesKey";
import { encryptMessage } from "../utils/encryptMessage";
import { checkAuth } from "../utils/profile";

export default function Peer() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [aesKey, setAesKey] = useState();
  const [chats, setChats] = useState([
    { name: "tanvi", messages: [], id: 14 },
    { name: "Suryansh", messages: [], id: 17 },
    { name: "yatharth", messages: [], id: 18 },
    { name: "tanveeiii", messages: [], id: 15 }
  ]);
  const [selectedChat, setSelectedChat] = useState(0);
  const [message, setMessage] = useState("");
  // New state to store messages that will be rendered
  const [showMessages, setShowMessages] = useState([]);
  const [recId, setRecid] = useState(0);
  // Optionally, you can still use messagesApi if needed
  const [messagesApi, setMessagesApi] = useState();

  const navigate = useNavigate();
  const socketRef = useRef(null);
  const lastMessageRef = useRef("");

  const userId = parseInt(localStorage.getItem("userid"), 10);
  const username = localStorage.getItem("username");

  // Filter out chats where chat.id === userId
  const filteredChats = chats.filter(chat => chat.id !== userId);

  useEffect(() => {
    if (filteredChats.length > 0) {
      setRecid(filteredChats[selectedChat].id);
    }
  }, [selectedChat, filteredChats]);

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
      const key = generateAESKey();
      setAesKey(key);
    }
    fetchKey();
  }, []);

  // Handle receiving messages and update showMessages
  useEffect(() => {
    if (!aesKey) return;

    const handleReceiveMessage = async ({ senderId, encryptedText, iv, encryptedAESKey }) => {
      console.log("Message received:", { senderId, encryptedText, iv, encryptedAESKey });
      const decrypted = await decryptMessage(encryptedText, iv, encryptedAESKey);
      console.log("Decrypted message:", decrypted);

      // Avoid duplicate messages
      if (lastMessageRef.current === decrypted) return;
      lastMessageRef.current = decrypted;

      // Append the received message to showMessages
      setShowMessages((prev) => [
        ...prev,
        { decryptedText: decrypted, senderId }
      ]);
    };

    socketRef.current.on("receiveMessage", handleReceiveMessage);
    return () => {
      socketRef.current.off("receiveMessage", handleReceiveMessage);
    };
  }, [aesKey]);

  // Submit message and update showMessages
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Update local state for sent message
      setShowMessages((prev) => [
        ...prev,
        { decryptedText: message, senderId: userId }
      ]);

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

  // Fetch messages from API and initialize showMessages
  async function fetchMessages(userId, recipientId) {
    try {
      const response = await fetch(`http://localhost:3000/messages?userId=${userId}&recId=${recipientId}`);
      const messages = await response.json();

      const decrypted_api_messages = await Promise.all(
        messages.map(async (msg) => ({
          senderId: msg["senderId"],
          recipientId: msg["recipientId"],
          encryptedAESKey: msg["encryptedAESKey"],
          decryptedText: await decryptMessage(msg["encryptedText"], msg["iv"], msg["encryptedAESKey"]),
        }))
      );
      console.log(decrypted_api_messages);

      setMessagesApi(decrypted_api_messages);

      // Set both messagesApi and showMessages to display the full conversation
      const filteredMessages = decrypted_api_messages.filter(msg =>
        (msg.senderId === userId && msg.recipientId === recipientId) ||
        (msg.senderId === recipientId && msg.recipientId === userId)
      );
      setShowMessages(filteredMessages);

    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  }

  useEffect(() => {
    console.log("Current showMessages", showMessages);
  }, [showMessages]);

  // Re-fetch messages when chat selection changes
  useEffect(() => {
    if (userId && filteredChats.length > 0) {
      fetchMessages(userId, filteredChats[selectedChat]?.id);
    }
  }, [selectedChat, userId]);

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
      {filteredChats.length > 0 && (
        <ChatList
          names={filteredChats.map((chat) => chat.name)}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        />
      )}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-[var(--mp-custom-gray-200)] bg-[var(--mp-custom-white)]">
          <h2 className="text-2xl font-bold text-[var(--mp-custom-gray-800)]">
            {filteredChats[selectedChat]?.name || "Select a chat"}
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[var(--mp-custom-white)]">
          {showMessages.map((msg, index) => (
            <ChatMessage
              key={index}
              message={msg.decryptedText}
              isSent={msg.senderId === userId}
            />
          ))}
        </div>
        <ChatInput message={message} setMessage={setMessage} handleSubmit={handleSubmit} />
      </div>
    </div>
  );
}
