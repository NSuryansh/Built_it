import React, { useState, useEffect, useRef } from "react";
import ProgressPage from "../components/ProgressPage";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../utils/profile";
import PacmanLoader from "react-spinners/PacmanLoader";
import Navbar from "../components/Navbar";
import SessionExpired from "../components/SessionExpired";
import { ToastContainer } from "react-toastify";
import CustomToast from "../components/CustomToast";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
}

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
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

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
      const response = await fetch("http://localhost:3000/node-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: localStorage.getItem("userid"),
          message,
        }),
      });

      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }

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
      CustomToast("Error while processing your message");
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

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  useEffect(() => {
    if (recognition) {
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
      };
      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        CustomToast("Error capturing audio input");
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <PacmanLoader color="#ff4800" radius={6} height={20} width={5} />
        <p className="mt-4 text-gray-600">Loading your wellness journey...</p>
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
          <div className="flex-1 overflow-y-auto flex flex-col p-4 bg-[var(--mp-custom-white)]">
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
            <div className="h-1" ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-[var(--mp-custom-gray-200)] bg-[var(--mp-custom-white)] flex items-center">
          <ChatInput
            message={message}
            setMessage={setMessage}
            handleSubmit={handleSubmit}
          />
          <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className="ml-2 p-2 bg-blue-500 text-white rounded"
            >
              {isListening ? "Stop Listening" : "Start Listening"}
            </button>
            </div>
        </div>
      </div>
    </div>
  );
}
