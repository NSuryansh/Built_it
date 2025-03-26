import React, { useState, useEffect } from "react";
import ProgressPage from "../components/ProgressPage";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../utils/profile";
import PacmanLoader from "react-spinners/PacmanLoader";
import Navbar from "../components/Navbar";
import SessionExpired from "../components/SessionExpired";
import { ToastContainer, toast } from "react-toastify";

export default function Mood() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([
    {
      self: "False",
      message:
        "Hello! I'm here to help you track and improve your well-being. How are you feeling today?",
    },
  ]);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("user");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  const handleClosePopup = () => {
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newChats = [...chats, { self: "True", message }];
    setChats(newChats);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("https://built-it-xjiq.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: "default_user", message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle both structured and unstructured responses
      const botMessage =
        data.response?.text ||
        (typeof data.response === "string"
          ? data.response
          : "I'm sorry, I couldn't process your message.");

      setChats([...newChats, { self: "False", message: botMessage }]);
    } catch (error) {
      console.error("Request failed:", error);
      toast("Error while processing your message", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "custom-toast",
      });
      setChats([
        ...newChats,
        {
          self: "False",
          message: "Sorry, there was an error processing your message.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <PacmanLoader color="#ff4800" radius={6} height={20} width={5} />
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} />;
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <ToastContainer />
      <div className="flex-1 h-full flex overflow-hidden">
        <div className="flex-1 hidden sm:block overflow-y-auto border-r border-[var(--mp-custom-gray-200)]">
          <ProgressPage />
        </div>
        <div className="sm:w-3/5 w-full flex flex-col">
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
            {isLoading && (
              <div className="flex justify-center items-center my-2">
                <PacmanLoader
                  color="#ff4800"
                  radius={6}
                  height={20}
                  width={5}
                />
              </div>
            )}
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
