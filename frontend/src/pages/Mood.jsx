import React, { useState, useEffect } from "react";
import ProgressPage from "../components/ProgressPage";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../utils/profile";
import Navbar from "../components/Navbar";
import SessionExpired from "../components/Session_expired";

export default function Mood() {
  const [message, setMessage] = useState("");

  const [chats, setChats] = useState([
    {
      self: "False",
      message:
        "Hello! I'm here to help you track and improve your well-being. How are you feeling today?",
    },
    {
      self: "True",
      message: "I'm feeling a bit stressed today.",
    },
    {
      self: "False",
      message:
        "I understand. Let's look at your progress and see where we can make improvements.",
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setChats([...chats, { self: "True", message: message }]);
      setMessage("");
    }
  };
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth();
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  const handleClosePopup = () => {
    navigate("/login");
  };

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <SessionExpired />;
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 h-full flex overflow-hidden">
        <div className="flex-1 overflow-y-auto border-r border-[var(--mp-custom-gray-200)]">
          <ProgressPage />
        </div>
        <div className="w-3/5 flex flex-col">
          <div className="p-4 border-b border-[var(--mp-custom-gray-200)] bg-[var(--mp-custom-white)]">
            <h2 className="text-2xl font-bold text-[var(--mp-custom-gray-800)]">
              Calm Bot
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-[var(--mp-custom-white)]">
            {chats.map((msg, index) => (
              <ChatMessage
                message={msg.message}
                key={index}
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
    </div>
  );
}
