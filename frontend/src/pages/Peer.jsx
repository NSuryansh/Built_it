import React, { useEffect, useState, useRef } from "react";
import { MessageSquare, Search, X, UserCircle2, User } from "lucide-react";
import ChatList from "../components/ChatList";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { decryptMessage } from "../utils/decryptMessage";
import SessionExpired from "../components/SessionExpired";
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
  const [unread, setUnread] = useState([]);
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
  const filteredDoctors = docList.filter((doctor) =>
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
    console.log("HIHIHIHIHIHIH")
    console.log('Socket instance:', socketRef.current);
    const handleReceiveMessage = async ({
      senderId,
      encryptedText,
      iv,
      encryptedAESKey,
      senderType,
    }) => {
      // console.log("HALLO - Raw event data:", data);
      console.log("HALLO")
      const decrypted = await decryptMessage(
        encryptedText,
        iv,
        encryptedAESKey
      );
      console.log(decrypted, "decryptionnn")
      if (lastMessageRef.current === decrypted) return;
      lastMessageRef.current = decrypted;

      setShowMessages((prev) => [
        ...prev,
        { decryptedText: decrypted, senderId, senderType },
        // { decryptedText: decrypted, senderId, senderType },
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

  useEffect(() => {
  }, [showMessages])
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      setShowMessages((prev) => [
        ...prev,
        { decryptedText: message, senderId: userId, senderType: "user" },
      ]);

      const { encryptedText, iv } = await encryptMessage(message, aesKey);
      socketRef.current.emit("sendMessage", {
        userId: userId,
        doctorId: recId,
        senderType: "user",
        encryptedText,
        iv,
        encryptedAESKey: aesKey,
        authTag: "",
      });
      setMessage("");
    }
  };

  useEffect(() => {
    if (selectedChat && recId != 0) {
      console.log("HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA:P");
      socketRef.current.emit("markAsRead", {
        userId: userId,
        doctorId: recId,
        senderType: "user",
      });
    }
    const pendingReads = async () => {
      console.log("HAL")
      try {
        socketRef.current.emit("countUnseen", { userId: userId, senderType: "user" })
        socketRef.current.on("unreadCount", (data) => {
          console.log(data)
          setUnread(data)
        })
      } catch (error) {
        console.log(error);
      }
    };

    pendingReads();
  }, [selectedChat, recId]);

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
          senderType: msg["senderType"],
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

  useEffect(() => {
    console.log(showMessages, "HAHAHAHAHHAHAHAHAH");
  }, [showMessages]);
  const handleClosePopup = () => {
    navigate("/login");
  };

  useEffect(() => {
    if(recId!==0){
    const userId = localStorage.getItem("userid")
    const docId = recId
    socketRef.current.emit("joinRoom", {
      userId: userId, 
      doctorId: docId
    })
  }
  }, [recId])

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <PacmanLoader color="#ff4800" radius={6} height={20} width={5} />
        <p className="mt-4 text-gray-600">Loading your wellness journey...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <SessionExpired handleClosePopup={handleClosePopup} theme="orange" />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900">
      <Navbar /> {/* Assume this is a light, minimal navbar */}
      <ToastContainer />
      {/* Desktop Layout */}
      <div className="md:flex h-[calc(100vh-64px)] hidden max-[333px]:overflow-hidden">
        {/* Sidebar (Doctor List) */}
        <div className="md:w-4/12 lg:w-3/12 bg-white border-r border-gray-200 flex flex-col transition-all duration-300">
          {docList.length > 0 ? (
            <>
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search doctors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900 placeholder-gray-500 transition-all duration-200"
                  />
                  <Search className="absolute left-3 top-3 h-5 w-5 text-orange-500" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ChatList
                  names={filteredDoctors.map((doctor) => doctor.name)}
                  selectedChat={selectedChat}
                  setSelectedChat={setSelectedChat}
                  setShowChatList={setShowChatList}
                  className="space-y-2 p-4"
                />
              </div>
            </>
          ) : (
            <div className="text-center p-6 flex flex-col items-center justify-center h-full">
              <UserCircle2 className="w-16 h-16 text-orange-500 mb-4 animate-pulse" />
              <h3 className="text-xl font-bold text-gray-900 drop-shadow-sm">
                No Conversations Yet
              </h3>
              <p className="text-gray-600 mt-2">
                Start chatting with a doctor to begin your consultation.
              </p>
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex flex-col h-full flex-1 bg-gradient-to-b from-gray-50 to-white">
          {selectedChat !== null ? (
            <>
              <div className="p-4 flex items-center justify-between border-b border-gray-200 bg-white shadow-sm">
                <div className="flex items-center space-x-3">
                  <User className="w-8 h-8 text-orange-500" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 drop-shadow-sm">
                      {docList[selectedChat]?.name}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedChat(null)} // Closes chat on desktop
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {showMessages.map((msg, index) => (
                  <ChatMessage
                    key={index}
                    message={msg.decryptedText}
                    isSent={msg.senderType === "user"}
                    className={`p-4 rounded-2xl max-w-[70%] shadow-md transition-all duration-300 ${msg.senderId === userId
                        ? "bg-gradient-to-r from-orange-400 to-cyan-400 ml-auto text-white"
                        : "bg-gray-100 text-gray-800"
                      }`}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="border-t border-gray-200 p-4 bg-white shadow-sm">
                <ChatInput
                  message={message}
                  setMessage={setMessage}
                  handleSubmit={handleSubmit}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900 placeholder-gray-500 transition-all duration-200"
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-6">
                <MessageSquare className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-bounce" />
                <h3 className="text-xl font-bold text-gray-900 drop-shadow-sm">
                  Select a Conversation
                </h3>
                <p className="text-gray-600 mt-2">
                  Choose a doctor to start chatting.
                </p>
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
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900 placeholder-gray-500 transition-all duration-200"
                    />
                    <Search className="absolute left-3 top-3 h-5 w-5 text-orange-500" />
                  </div>
                </div>
                <ChatList
                  names={filteredDoctors.map((doctor) => doctor.name)}
                  selectedChat={selectedChat}
                  setSelectedChat={setSelectedChat}
                  setShowChatList={setShowChatList}
                  className="space-y-2 p-4"
                />
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-6">
                  <UserCircle2 className="w-16 h-16 text-orange-500 mb-4 animate-pulse" />
                  <h3 className="text-xl font-bold text-gray-900 drop-shadow-sm">
                    No Conversations Yet
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Start chatting with a doctor to begin your consultation.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
            <div className="p-4 flex items-center justify-between border-b border-gray-200 bg-white shadow-sm">
              <div className="flex items-center space-x-3">
                <User className="w-8 h-8 text-orange-500" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900 drop-shadow-sm">
                    {docList[selectedChat]?.name}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setShowChatList(true)} // Closes chat on mobile
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {showMessages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg.decryptedText}
                  isSent={msg.senderType === "user"}
                  className={`p-4 rounded-2xl max-w-[70%] shadow-md transition-all duration-300 ${msg.senderId === userId
                      ? "bg-gradient-to-r from-orange-400 to-cyan-400 ml-auto text-white"
                      : "bg-gray-100 text-gray-800"
                    }`}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-gray-200 p-4 bg-white shadow-sm">
              <ChatInput
                message={message}
                setMessage={setMessage}
                handleSubmit={handleSubmit}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900 placeholder-gray-500 transition-all duration-200"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Peer;
