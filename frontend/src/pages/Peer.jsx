import React, { useEffect, useState, useRef } from "react";
import { MessageSquare, Search, Send, Menu, X, UserCircle2 } from 'lucide-react';
import ChatList from "../components/ChatList";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { decryptMessage } from "../utils/decryptMessage";
import { generateAESKey } from "../utils/aeskey";
import { encryptMessage } from "../utils/encryptMessage";
import { checkAuth } from "../utils/profile";
import PacmanLoader from "react-spinners/PacmanLoader";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import CustomToast from "../components/CustomToast";

const Peer = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [aesKey, setAesKey] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [showMessages, setShowMessages] = useState([]);
  const [recId, setRecid] = useState(0);
  const [showChatList, setShowChatList] = useState(true);
  const [messagesApi, setMessagesApi] = useState(null);
  const [reloader, setReloader] = useState(true);
  const [docList, setDocList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const lastMessageRef = useRef("");
  const messagesEndRef = useRef(null);

  const userId = parseInt(localStorage.getItem("userid"), 10);
  const username = localStorage.getItem("username");

  const [searchParams] = useSearchParams();
  const newChatId = searchParams.get("userId");
  const newChatUsername = searchParams.get("username");

  // Filter doctors based on search query
  const filteredDoctors = docList.filter(doctor => 
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (newChatId) {
      setRecid(newChatId);
    }
  }, [newChatId]);

  useEffect(() => {
    if (newChatId && newChatUsername) {
      const existingIndex = chats.findIndex(
        (chat) => String(chat.id) === String(newChatId)
      );
      if (existingIndex !== -1) {
        setSelectedChat(existingIndex);
        setRecid(chats[existingIndex].id);
      } else {
        const newContact = {
          name: newChatUsername,
          id: newChatId,
          messages: [],
        };
        setChats((prevChats) => {
          const updatedChats = [...prevChats, newContact];
          setSelectedChat(updatedChats.length - 1);
          setRecid(newContact.id);
          return updatedChats;
        });
      }
    }
  }, [newChatId, newChatUsername, chats]);

  useEffect(() => {
    const fetchDocotors = async () => {
      try {
        const response = await fetch("http://localhost:3000/getdoctors");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setDocList(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchDocotors();
  }, []);

  async function fetchContacts(userId) {
    try {
      const response = await fetch(
        `http://localhost:3000/chatContacts?userId=${userId}`
      );
      const contacts = await response.json();

      if (!contacts || !Array.isArray(contacts)) {
        console.warn("No contacts received.");
        return;
      }

      const updatedChats = contacts.map((contact) => ({
        name: contact.username,
        id: contact.id,
        messages: [],
      }));

      setChats((prevChats) => {
        const merged = [...updatedChats];
        prevChats.forEach((chat) => {
          if (!merged.find((c) => String(c.id) === String(chat.id))) {
            merged.push(chat);
          }
        });
        return merged;
      });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      CustomToast("Error while fetching data");
      return [];
    }
  }

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchContacts(userId);
    }
  }, [isAuthenticated, userId]);

  useEffect(() => {
    if (docList.length > 0 && selectedChat !== null) {
      setRecid(docList[selectedChat].id);
    }
  }, [selectedChat, docList]);

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("user");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  useEffect(() => {
    if (!userId) return;
    socketRef.current = io("http://localhost:3000/", {
      transports: ["websocket"],
    });
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

  useEffect(() => {
    async function fetchKey() {
      const key = generateAESKey();
      setAesKey(key);
    }
    fetchKey();
  }, []);

  useEffect(() => {
    if (!aesKey) return;
    if (!isAuthenticated) return;

    const handleReceiveMessage = async ({
      senderId,
      encryptedText,
      iv,
      encryptedAESKey,
    }) => {
      const decrypted = await decryptMessage(
        encryptedText,
        iv,
        encryptedAESKey
      );

      if (lastMessageRef.current === decrypted) return;
      lastMessageRef.current = decrypted;

      setShowMessages((prev) => [
        ...prev,
        { decryptedText: decrypted, senderId },
      ]);
    };

    socketRef.current.on("receiveMessage", handleReceiveMessage);
    return () => {
      socketRef.current.off("receiveMessage", handleReceiveMessage);
    };
  }, [aesKey, isAuthenticated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [showMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      setShowMessages((prev) => [
        ...prev,
        { decryptedText: message, senderId: userId },
      ]);

      const { encryptedText, iv } = await encryptMessage(message, aesKey);
      socketRef.current.emit("sendMessage", {
        userId: userId,
        doctorId: recId,
        senderType: localStorage.getItem("user_type"),
        encryptedText,
        iv,
        encryptedAESKey: aesKey,
        authTag: "",
      });
      setMessage("");
    }
  };

  async function fetchMessages(userId, recipientId) {
    try {
      const response = await fetch(
        `http://localhost:3000/messages?userId=${userId}&recId=${recipientId}`
      );
      const messages = await response.json();
      const decrypted_api_messages = await Promise.all(
        messages.map(async (msg) => ({
          senderId: msg["senderId"],
          recipientId: msg["recipientId"],
          encryptedAESKey: msg["encryptedAESKey"],
          decryptedText: await decryptMessage(
            msg["encryptedText"],
            msg["iv"],
            msg["encryptedAESKey"]
          ),
        }))
      );

      setMessagesApi(decrypted_api_messages);

      const filteredMessages = decrypted_api_messages.filter((msg) => {
        return (
          (msg.senderId === userId && msg.recipientId === recipientId) ||
          (msg.senderId === recipientId && msg.recipientId === userId)
        );
      });

      setShowMessages(filteredMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      CustomToast("Error while fetching data");
      return [];
    }
  }

  useEffect(() => {
    if (userId && docList.length > 0 && selectedChat !== null) {
      fetchMessages(userId, docList[selectedChat]?.id);
    }
  }, [selectedChat, userId, reloader, docList]);

  const handleClosePopup = () => {
    navigate("/login");
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <PacmanLoader color="#4F46E5" radius={6} height={20} width={5} />
        <p className="mt-4 text-gray-600 font-medium">Loading your conversations...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md w-full mx-4">
          <div className="mb-6">
            <MessageSquare className="w-12 h-12 text-indigo-600 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Session Expired
          </h2>
          <p className="text-gray-600 mb-6">
            Your session has timed out for security reasons. Please log in again to continue.
          </p>
          <button
            onClick={handleClosePopup}
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <ToastContainer />
      
      {/* Desktop Layout */}
      <div className="md:flex h-[calc(100vh-64px)] hidden">
        <div className={`md:w-4/12 lg:w-3/12 bg-white border-r border-gray-200 flex flex-col ${docList.length === 0 ? 'items-center justify-center' : ''}`}>
          {docList.length > 0 ? (
            <>
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search doctors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ChatList
                  names={filteredDoctors.map((doctor) => doctor.name)}
                  selectedChat={selectedChat}
                  setSelectedChat={setSelectedChat}
                  setShowChatList={setShowChatList}
                />
              </div>
            </>
          ) : (
            <div className="text-center p-6">
              <UserCircle2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Conversations Yet</h3>
              <p className="text-gray-500">Start chatting with a doctor to begin your consultation.</p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col h-full flex-1 bg-white">
          {selectedChat !== null ? (
            <>
              <div className="p-4 flex items-center justify-between border-b border-gray-200 bg-white">
                <div className="flex items-center space-x-3">
                  <UserCircle2 className="w-10 h-10 text-gray-400" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {docList[selectedChat]?.name}
                    </h2>
                    <p className="text-sm text-gray-500"></p>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {showMessages.map((msg, index) => (
                  <ChatMessage
                    key={index}
                    message={msg.decryptedText}
                    isSent={msg.senderId === userId}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="border-t border-gray-200 p-4 bg-white">
                <ChatInput
                  message={message}
                  setMessage={setMessage}
                  handleSubmit={handleSubmit}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Conversation</h3>
                <p className="text-gray-500">Choose a doctor from the list to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden h-[calc(100vh-64px)]">
        {showChatList ? (
          <div className="h-full bg-white">
            {docList.length > 0 ? (
              <>
                <div className="p-4 border-b border-gray-200">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search doctors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <ChatList
                  names={filteredDoctors.map((doctor) => doctor.name)}
                  selectedChat={selectedChat}
                  setSelectedChat={setSelectedChat}
                  setShowChatList={setShowChatList}
                />
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-6">
                  <UserCircle2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Conversations Yet</h3>
                  <p className="text-gray-500">Start chatting with a doctor to begin your consultation.</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col h-full bg-white">
            <div className="p-4 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <UserCircle2 className="w-10 h-10 text-gray-400" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {docList[selectedChat]?.name}
                  </h2>
                  <p className="text-sm text-gray-500"></p>
                </div>
              </div>
              <button
                onClick={() => setShowChatList(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {showMessages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg.decryptedText}
                  isSent={msg.senderId === userId}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-gray-200 p-4 bg-white">
              <ChatInput
                message={message}
                setMessage={setMessage}
                handleSubmit={handleSubmit}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Peer;