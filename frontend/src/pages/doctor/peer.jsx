import React, { useEffect, useState, useRef } from "react";
import ChatList from "../../components/common/ChatList";
import ChatMessage from "../../components/common/ChatMessage";
import ChatInput from "../../components/common/ChatInput";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { decryptMessage } from "../../utils/decryptMessage";
import { generateAESKey } from "../../utils/aeskey";
import { encryptMessage } from "../../utils/encryptMessage";
import { checkAuth } from "../../utils/profile";
import HashLoader from "react-spinners/HashLoader";
import { ToastContainer } from "react-toastify";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";
import CustomToast from "../../components/common/CustomToast";
import SessionExpired from "../../components/common/SessionExpired";
import DoctorNavbar from "../../components/doctor/Navbar";
import { MessageSquare, Search, User, UserCircle2, X } from "lucide-react";
import CustomLoader from "../../components/common/CustomLoader";

const DoctorPeer = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [aesKey, setAesKey] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [showMessages, setShowMessages] = useState([]);
  const [editedMessages, setEditedMessages] = useState([]);
  const [recId, setRecid] = useState(0);
  const [showChatList, setShowChatList] = useState(true);
  const [messagesApi, setMessagesApi] = useState(null);
  const [reloader, setReloader] = useState(true);
  const [userList, setUserList] = useState([]);
  const [unread, setUnread] = useState([]);
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const lastMessageRef = useRef("");
  const messagesEndRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const userId = parseInt(localStorage.getItem("userid"));
  const username = localStorage.getItem("username");
  const [searchParams] = useSearchParams();
  const newChatId = searchParams.get("userId");
  const newChatUsername = searchParams.get("username");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (newChatId) {
      setRecid(newChatId);
    }
  }, [newChatId]);

  useEffect(() => {
    if (newChatId && newChatUsername && chats) {
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

  async function fetchContacts(userId) {
    try {
      const response = await fetch(
        `https://built-it.onrender.com/chatContacts?userId=${userId}&userType=doc`,
        { headers: { Authorization: "Bearer " + token } }
      );
      if (!response.ok) throw new Error("Failed to fetch users");
      const contacts = await response.json();
      if (!contacts || !Array.isArray(contacts)) {
        console.warn("No contacts received.");
        return;
      }
      // console.log(contacts, "hallo")
      const updatedChats = contacts.map((contact) => ({
        name: contact.username,
        id: contact.id,
        messages: [],
      }));
      let merged = [];
      setChats((prevChats) => {
        merged = [...updatedChats];
        prevChats.forEach((chat) => {
          if (!merged.find((c) => String(c.id) === String(chat.id))) {
            merged.push(chat);
          }
        });
      });
      // console.log(merged);
      return merged;
    } catch (error) {
      console.error("Error fetching contacts:", error);
      CustomToast("Error while fetching data", "blue");
      return [];
    }
  }
  useEffect(() => {
    const getContacts = async () => {
      if (isAuthenticated && userId) {
        const user = await fetchContacts(userId);
        // console.log(user, "uesr")
        setUserList(user);
      }
    };
    getContacts();
  }, [isAuthenticated, userId]);

  const filteredUsers = userList.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update the recipient id from the selected doctor in userList
  useEffect(() => {
    if (userList.length > 0 && selectedChat !== null) {
      // console.log("Selected doctor:", userList[selectedChat]);
      setRecid(userList[selectedChat].id);
    }
  }, [selectedChat, userList]);

  useEffect(() => {
    // console.log(showMessages, "JSA");
    const filteredMessages = showMessages.filter((msg) => {
      if (msg.senderType === "doctor") {
        return msg.senderId === userId;
      } else {
        return msg.recipientId === userId;
      }
    });
    setEditedMessages(filteredMessages);
    // console.log("Filtered Messages:", filteredMessages);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [showMessages]);

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("doc");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  useEffect(() => {
    if (!userId) return;
    socketRef.current = io("https://built-it.onrender.com/", {
      transports: ["websocket"],
    });
    socketRef.current.on("connect", () => {
      // console.log("Connected to WebSocket server");
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
      senderType,
    }) => {
      const decrypted = await decryptMessage(
        encryptedText,
        iv,
        encryptedAESKey
      );
      if (lastMessageRef.current === decrypted) return;
      // console.log(decrypted, "decrypt");
      lastMessageRef.current = decrypted;

      setShowMessages((prev) => [
        ...prev,
        { decryptedText: decrypted, senderId, senderType },
      ]);
    };

    socketRef.current.on("receiveMessage", handleReceiveMessage);
    return () => {
      socketRef.current.off("receiveMessage", handleReceiveMessage);
    };
  }, [aesKey, isAuthenticated]);

  useEffect(() => {
    if (userId && userList.length > 0 && selectedChat !== null) {
      fetchMessages(userId, userList[selectedChat]?.id);
    }
  }, [selectedChat, userId, reloader, userList]);

  useEffect(() => {
    // console.log(recId, "selectd", userId, " ");
    if (selectedChat !== null && recId !== 0) {
      socketRef.current.emit("markAsRead", {
        userId: recId,
        doctorId: userId,
        senderType: "doc",
      });
    }

    const pendingReads = async () => {
      // console.log("HAL");
      try {
        socketRef.current.emit("countUnseen", {
          userId: userId,
          senderType: "doc",
        });
        socketRef.current.on("unreadCount", (data) => {
          // console.log(data);
          setUnread(data);
        });
      } catch (error) {
        console.error(error);
      }
    };
    pendingReads();
  }, [selectedChat, recId]);

  useEffect(() => {
    if (recId !== 0) {
      const docId = localStorage.getItem("userid");
      const userId = recId;
      socketRef.current.emit("joinRoom", {
        userId: userId,
        doctorId: docId,
      });
    }
  }, [recId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      setShowMessages((prev) => [
        ...prev,
        { decryptedText: message, senderId: userId, senderType: "doc" },
      ]);

      const { encryptedText, iv } = await encryptMessage(message, aesKey);
      socketRef.current.emit("sendMessage", {
        userId: recId,
        doctorId: userId,
        senderType: "doc",
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
      // console.log(recipientId, "Fetching messages for recipient");
      const response = await fetch(
        `https://built-it.onrender.com/messages?userId=${recipientId}&recId=${userId}&userType=doc&recType=user`,
        { headers: { Authorization: "Bearer " + token } }
      );
      const messages = await response.json();
      console.log(messages, "non mes");
      const decrypted_api_messages = await Promise.all(
        messages.map(async (msg) => {
          const isUser = msg["senderType"] === "user";
          return {
            senderId: isUser ? msg["userId"] : msg["doctorId"],
            recipientId: isUser ? msg["doctorId"] : msg["userId"],
            encryptedAESKey: msg["encryptedAESKey"],
            decryptedText: await decryptMessage(
              msg["encryptedText"],
              msg["iv"],
              msg["encryptedAESKey"]
            ),
            senderType: msg["senderType"],
          };
        })
      );

      // console.log(decryptMessage, "decrypt")
      setMessagesApi(decrypted_api_messages);

      const filteredMessages = decrypted_api_messages.filter((msg) => {
        return (
          (msg.senderId === userId && msg.recipientId === recipientId) ||
          (msg.senderId === recipientId && msg.recipientId === userId)
        );
      });
      // console.log(filteredMessages);

      setShowMessages(filteredMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      CustomToast("Error while fetching data", "blue");
      return [];
    }
  }

  // Fetch messages using the selected doctor's id from userList

  const handleClosePopup = () => {
    navigate("/doctor/login");
  };

  if (isAuthenticated === null) {
    return <CustomLoader color="blue" text="Loading your dashboard..." />;
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="blue" />;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[var(--custom-white)] via-[var(--custom-gray-50)] to-[var(--custom-gray-100)] text-[var(--custom-gray-900)]">
      <DoctorNavbar />
      <ToastContainer />
      {/* Desktop Layout */}
      <div className="md:flex h-[calc(100vh-64px)] hidden max-[333px]:overflow-hidden">
        <div className="md:w-4/12 lg:w-3/12 bg-[var(--custom-white)] border-r border-[var(--custom-gray-200)] flex flex-col transition-all duration-300">
          {userList.length > 0 ? (
            <>
              <div className="p-4 border-b border-[var(--custom-gray-200)]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[var(--custom-gray-50)] border border-[var(--custom-gray-300)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--custom-blue-400)] text-[var(--custom-gray-900)] placeholder-[var(--custom-gray-500)] transition-all duration-200"
                  />
                  <Search className="absolute left-3 top-[14px] h-5 w-5 text-[var(--custom-blue-500)]" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ChatList
                  names={filteredUsers.map((doctor) => ({
                    name: doctor.name,
                    senderId: doctor.id,
                  }))}
                  selectedChat={selectedChat}
                  setSelectedChat={setSelectedChat}
                  setShowChatList={setShowChatList}
                  unread={unread.map((mes) => ({
                    count: mes._count._all,
                    senderId: mes.senderId,
                  }))}
                  isDoc={true}
                />
              </div>
            </>
          ) : (
            <div className="text-center p-6 flex flex-col items-center justify-center h-full">
              <UserCircle2 className="w-16 h-16 text-[var(--custom-blue-500)] mb-4 animate-pulse" />
              <h3 className="text-xl font-bold text-[var(--custom-gray-900)] drop-shadow-sm">
                No Conversations Yet
              </h3>
              <p className="text-[var(--custom-gray-600)] mt-2">
                Start chatting with a user.
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col h-full flex-1 bg-gradient-to-b from-[var(--custom-gray-50)] to-[var(--custom-white)]">
          {selectedChat !== null ? (
            <>
              <div className="p-4 flex items-center justify-between border-b border-[var(--custom-gray-200)] bg-[var(--custom-white)] shadow-sm">
                <div className="flex items-center space-x-3">
                  <User className="w-8 h-8 text-[var(--custom-blue-500)]" />
                  <div>
                    <h2 className="text-xl font-bold text-[var(--custom-gray-900)] drop-shadow-sm">
                      {userList[selectedChat]?.name}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedChat(null)} // Closes chat on desktop
                  className="p-2 hover:bg-[var(--custom-gray-100)] rounded-full transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-[var(--custom-gray-500)]" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {showMessages.map((msg, index) => (
                  <ChatMessage
                    key={index}
                    message={msg.decryptedText}
                    isSent={msg.senderType !== "user"}
                    isDoc={true}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="border-t border-[var(--custom-gray-200)] p-4 bg-[var(--custom-white)] shadow-sm">
                <ChatInput
                  message={message}
                  setMessage={setMessage}
                  handleSubmit={handleSubmit}
                  isDoc={true}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-6">
                <MessageSquare className="w-16 h-16 text-[var(--custom-blue-500)] mx-auto mb-4 animate-bounce" />
                <h3 className="text-xl font-bold text-[var(--custom-gray-900)] drop-shadow-sm">
                  Select a Conversation
                </h3>
                <p className="text-[var(--custom-gray-600)] mt-2">
                  Choose a user to start chatting.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Mobile Layout */}
      <div className="md:hidden h-[calc(100vh-64px)]">
        {showChatList ? (
          userList.length > 0 ? (
            <div className="h-full">
              <ChatList
                names={filteredUsers.map((doctor) => ({
                  name: doctor.name,
                  senderId: doctor.id,
                }))}
                selectedChat={selectedChat}
                setSelectedChat={setSelectedChat}
                setShowChatList={setShowChatList}
                unread={unread.map((mes) => ({
                  count: mes._count._all,
                  senderId: mes.senderId,
                }))}
                isDoc={true}
              />
            </div>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              You have no chats
            </div>
          )
        ) : (
          <div className="flex flex-col h-full">
            <div className="p-4 flex w-full justify-between border-b border-[var(--custom-gray-200)] bg-[var(--custom-white)]">
              <h2 className="text-2xl font-bold text-[var(--custom-gray-800)]">
                {userList[selectedChat]?.name || "Select a chat"}
              </h2>
              <button onClick={() => setShowChatList(true)}>
                <AiOutlineCloseCircle />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[var(--custom-white)]">
              {showMessages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg.decryptedText}
                  isSent={msg.senderType !== "user"}
                  isDoc={true}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex-none border-t border-[var(--custom-gray-200)]">
              <ChatInput
                message={message}
                setMessage={setMessage}
                handleSubmit={handleSubmit}
                isDoc={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPeer;
