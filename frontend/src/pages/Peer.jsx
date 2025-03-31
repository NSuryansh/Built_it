import React, { useEffect, useState, useRef } from "react";
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
import { ToastContainer, toast } from "react-toastify";
import { AiFillCloseCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";

const Peer = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [aesKey, setAesKey] = useState();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [showMessages, setShowMessages] = useState([]);
  const [recId, setRecid] = useState(0);
  const [showChatList, setShowChatList] = useState(true);
  const [messagesApi, setMessagesApi] = useState();
  const [reloader, setReloader] = useState(true);
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const lastMessageRef = useRef("");
  const messagesEndRef = useRef(null); // Ref for scrolling to bottom

  const userId = parseInt(localStorage.getItem("userid"), 10);
  const username = localStorage.getItem("username");

  // Get search params once, without state updates in the render body.
  const [searchParams] = useSearchParams();
  const newChatId = searchParams.get("userId");
  const newChatUsername = searchParams.get("username");
  useEffect(() => {
    if (newChatId) {
      setRecid(newChatId);
    }
  }, [newChatId]);
  // Process new chat if provided in URL params.
  useEffect(() => {
    // console.log("New chat params:", newChatId, newChatUsername);
    if (newChatId && newChatUsername) {
      const existingIndex = chats.findIndex(
        (chat) => String(chat.id) === String(newChatId)
      );
      console.log(existingIndex, "existing chat index");
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

  // Filter out the current user from contacts
  const filteredChats = chats.filter(
    (chat) => String(chat.id) !== String(userId)
  );

  async function fetchContacts(userId) {
    try {
      const response = await fetch(
        `https://built-it-xjiq.onrender.com/chatContacts?userId=${userId}`
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

      // Merge new chat if not already included
      setChats((prevChats) => {
        // Convert both IDs to string for a consistent comparison
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
      toast("Error while fetching data", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "custom-toast",
      });
      return [];
    }
  }

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchContacts(userId);
    }
  }, [isAuthenticated, userId]);

  useEffect(() => {
    if (filteredChats.length > 0) {
      console.log(filteredChats);
      setRecid(filteredChats[selectedChat].id);
    }
  }, [selectedChat]);

  // Authentication check
  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("user");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!userId) return;
    socketRef.current = io("http://44.229.200.200:3001",{
      transports: ["websocket"]
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
    if (!isAuthenticated) return;

    const handleReceiveMessage = async ({
      senderId,
      encryptedText,
      iv,
      encryptedAESKey,
    }) => {
      console.log("Message received:", {
        senderId,
        encryptedText,
        iv,
        encryptedAESKey,
      });
      const decrypted = await decryptMessage(
        encryptedText,
        iv,
        encryptedAESKey
      );
      console.log("Decrypted message:", decrypted);

      // Avoid duplicate messages
      if (lastMessageRef.current === decrypted) return;
      lastMessageRef.current = decrypted;

      // Append the received message to showMessages
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

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effect to scroll to the bottom whenever showMessages change:
  useEffect(() => {
    scrollToBottom();
  }, [showMessages]);

  // Submit message and update showMessages
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Update local state for sent message
      setShowMessages((prev) => [
        ...prev,
        { decryptedText: message, senderId: userId },
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
    // Removed reloader toggle to prevent overriding sent message
    // setReloader((prev) => !prev);
  };

  // Fetch messages from API and initialize showMessages
  async function fetchMessages(userId, recipientId) {
    try {
      console.log(recipientId, "AAAAALLLLLEE");
      const response = await fetch(
        `https://built-it-xjiq.onrender.com/messages?userId=${userId}&recId=${recipientId}`
      );
      const messages = await response.json();
      console.log(messages);
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
      // console.log(decrypted_api_messages);

      setMessagesApi(decrypted_api_messages);

      // Set both messagesApi and showMessages to display the full conversation
      const filteredMessages = decrypted_api_messages.filter((msg) => {
        return (
          (msg.senderId === userId && msg.recipientId === recipientId) ||
          (msg.senderId === recipientId && msg.recipientId === userId)
        );
      });
      console.log(filteredMessages);

      setShowMessages(filteredMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast("Error while fetching data", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "custom-toast",
      });
      return [];
    }
  }

  useEffect(() => {
    console.log("Current showMessages", showMessages);
  }, [showMessages]);

  // Re-fetch messages when chat selection changes
  useEffect(() => {
    if (userId && filteredChats.length > 0) {
      console.log("hello")
      fetchMessages(userId, filteredChats[selectedChat]?.id);
    }
  }, [selectedChat, userId, reloader]);

  // Handle session timeout
  const handleClosePopup = () => {
    navigate("/login");
  };

  // Render based on authentication status
  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <PacmanLoader color="#ff4800" radius={6} height={20} width={5} />
        <p>Loading...</p>
      </div>
    );
  }
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold text-red-600">
            Session Timeout
          </h2>
          <p className="mt-2">Your session has expired. Please log in again.</p>
          <button
            onClick={handleClosePopup}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[var(--mp-custom-white)]">
      <Navbar />
      <ToastContainer />
      <div className="md:flex h-full hidden">
        {filteredChats.length > 0 ? (
          <div className="md:w-4/12 lg:w-3/12">
            <ChatList
              names={filteredChats.map((chat) => chat.name)}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              setShowChatList={setShowChatList}
            />
          </div>
        ) : (
          <div className="md:w-4/12 lg:w-3/12 h-full flex justify-center items-center">
            You have no chats
          </div>
        )}
        <div className="flex-1 h-full justify-between flex flex-col">
          <div className="p-4 flex justify-between border-b border-[var(--mp-custom-gray-200)] bg-[var(--mp-custom-white)]">
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
            <div ref={messagesEndRef} />
          </div>
          <ChatInput
            message={message}
            setMessage={setMessage}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
      <div className="md:hidden h-full">
        {showChatList === true ? (
          filteredChats.length > 0 ? (
            <div>
              <ChatList
                names={filteredChats.map((chat) => chat.name)}
                selectedChat={selectedChat}
                setSelectedChat={setSelectedChat}
                setShowChatList={setShowChatList}
              />
            </div>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              You have no chats
            </div>
          )
        ) : null}
        {showChatList === false ? (
          <div className="flex-1 h-full justify-between flex flex-col">
            <div className="p-4 flex w-full justify-between border-b border-[var(--mp-custom-gray-200)] bg-[var(--mp-custom-white)]">
              <h2 className="text-2xl font-bold text-[var(--mp-custom-gray-800)]">
                {filteredChats[selectedChat]?.name || "Select a chat"}
              </h2>
              <button
                onClick={() => {
                  setShowChatList(true);
                }}
              >
                <AiOutlineCloseCircle />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[var(--mp-custom-white)]">
              {showMessages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg.decryptedText}
                  isSent={msg.senderId === userId}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
            <ChatInput
              message={message}
              setMessage={setMessage}
              handleSubmit={handleSubmit}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Peer;
