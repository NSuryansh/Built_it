import React, { useEffect, useState, useRef } from "react";
import ChatList from "../../components/ChatList";
import ChatMessage from "../../components/ChatMessage";
import ChatInput from "../../components/ChatInput";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { decryptMessage } from "../../utils/decryptMessage";
import { generateAESKey } from "../../utils/aeskey";
import { encryptMessage } from "../../utils/encryptMessage";
import { checkAuth } from "../../utils/profile";
import PacmanLoader from "react-spinners/PacmanLoader";
import { ToastContainer } from "react-toastify";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";
import CustomToast from "../../components/CustomToast";
import SessionExpired from "../../components/SessionExpired";
import DoctorNavbar from "../../components/doctor/Navbar_doctor";
import { MessageSquare, Search, User, UserCircle2, X } from "lucide-react";

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
      // console.log(existingIndex, "existing chat index");
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
        `http://localhost:3000/chatContacts?userId=${userId}`
      );
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

  const filteredUsers = userList.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const getContacts = async () => {
      if (isAuthenticated && userId) {
        const user = await fetchContacts(userId);
        setUserList(user);
      }
    };
    getContacts();
  }, [isAuthenticated, userId]);

  // Update the recipient id from the selected doctor in userList
  useEffect(() => {
    if (userList.length > 0 && selectedChat !== null) {
      console.log("Selected doctor:", userList[selectedChat]);
      setRecid(userList[selectedChat].id);
    }
  }, [selectedChat, userList]);

  useEffect(() => {
    console.log(showMessages, "JSA");
    const filteredMessages = showMessages.filter((msg) => {
      if (msg.senderType === "user") {
        return msg.recipientIdId === userId;
      } else if (msg.senderType === "doc") {
        return msg.senderId === userId;
      }
      return false;
    });
    setEditedMessages(filteredMessages);
    console.log("Filtered Messages:", filteredMessages);
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
    socketRef.current = io("http://localhost:3000/", {
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
    console.log(showMessages, "SHOWINNGGNGNNGN");
  }, [showMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [showMessages]);

  useEffect(() => {
    if (userId && userList.length > 0 && selectedChat !== null) {
      // console.log("Fetching messages for selected doctor");
      // console.log(userList, "HALLLLLLLLLLLLLLO")
      fetchMessages(userId, userList[selectedChat]?.id);
    }
  }, [selectedChat, userId, reloader, userList]);

  useEffect(() => {
    console.log(recId, "selectd", userId, " ");
    if (selectedChat !== null && recId !== 0) {
      socketRef.current.emit("markAsRead", {
        userId: recId,
        doctorId: userId,
        senderType: "doc",
      });
    }

    const pendingReads = async () => {
      console.log("HAL");
      try {
        // const res = await fetch(`http://localhost:3000/countUnseen?userId=${userId}&senderType=${localStorage.getItem('user_type')}`)
        // const data = await res.json();
        socketRef.current.emit("countUnseen", {
          userId: userId,
          senderType: "doc",
        });
        socketRef.current.on("unreadCount", (data) => {
          console.log(data);
          setUnread(data);
        });
        // setUnread(data);
        // console.log(data)
      } catch (error) {
        console.log(error);
      }
      // console.log(data, "HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
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
        {
          decryptedText: message,
          senderId: userId,
          senderType: localStorage.getItem("user_type"),
        },
      ]);

      const { encryptedText, iv } = await encryptMessage(message, aesKey);
      // console.log(recId, userId)
      socketRef.current.emit("sendMessage", {
        userId: recId,
        doctorId: userId,
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
      // console.log(recipientId, "Fetching messages for recipient");
      const response = await fetch(
        `http://localhost:3000/messages?userId=${userId}&recId=${recipientId}`
      );
      const messages = await response.json();
      // console.log(messages, "HALLLLLLO");
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
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <PacmanLoader color="#004ba8" radius={6} height={20} width={5} />
        <p className="mt-4 text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="blue" />;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900">
      <DoctorNavbar />
      <ToastContainer />
      {/* Desktop Layout */}
      <div className="md:flex h-[calc(100vh-64px)] hidden max-[333px]:overflow-hidden">
        <div className="md:w-4/12 lg:w-3/12 bg-white border-r border-gray-200 flex flex-col transition-all duration-300">
          {userList.length > 0 ? (
            <>
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-500 transition-all duration-200"
                  />
                  <Search className="absolute left-3 top-[14px] h-5 w-5 text-blue-500" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ChatList
                  names={filteredUsers.map((doctor) => doctor.name)}
                  selectedChat={selectedChat}
                  setSelectedChat={setSelectedChat}
                  setShowChatList={setShowChatList}
                  unread={unread.map((mes) => mes._count._all)}
                  isDoc={true}
                />
              </div>
            </>
          ) : (
            <div className="text-center p-6 flex flex-col items-center justify-center h-full">
              <UserCircle2 className="w-16 h-16 text-blue-500 mb-4 animate-pulse" />
              <h3 className="text-xl font-bold text-gray-900 drop-shadow-sm">
                No Conversations Yet
              </h3>
              <p className="text-gray-600 mt-2">Start chatting with a user.</p>
            </div>
          )}
        </div>
        <div className="flex flex-col h-full flex-1 bg-gradient-to-b from-gray-50 to-white">
          {selectedChat !== null ? (
            <>
              <div className="p-4 flex items-center justify-between border-b border-gray-200 bg-white shadow-sm">
                <div className="flex items-center space-x-3">
                  <User className="w-8 h-8 text-blue-500" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 drop-shadow-sm">
                      {userList[selectedChat]?.name}
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
                    isSent={msg.senderType !== "user"}
                    isDoc={true}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="border-t border-gray-200 p-4 bg-white shadow-sm">
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
                <MessageSquare className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-bounce" />
                <h3 className="text-xl font-bold text-gray-900 drop-shadow-sm">
                  Select a Conversation
                </h3>
                <p className="text-gray-600 mt-2">
                  Choose a user to start chatting.
                </p>
              </div>
            </div>
          )}
        </div>
        {/* <div className="flex flex-col h-full flex-1">
            <div className="p-4 flex justify-between border-b border-[var(--mp-custom-gray-200)] bg-[var(--mp-custom-white)]">
              <h2 className="text-2xl font-bold text-[var(--mp-custom-gray-800)]">
                {userList[selectedChat]?.name || "Select a chat"}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[var(--mp-custom-white)]">
              {showMessages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg.decryptedText}
                  isSent={msg.senderType === "doc"}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex-none border-t border-[var(--mp-custom-gray-200)]">
              <ChatInput
                message={message}
                setMessage={setMessage}
                handleSubmit={handleSubmit}
                isDoc={true}
              />
            </div>
          </div> */}
      </div>
      {/* Mobile Layout */}
      <div className="md:hidden h-[calc(100vh-64px)]">
        {showChatList ? (
          userList.length > 0 ? (
            <div className="h-full">
              <ChatList
                names={filteredUsers.map((doctor) => doctor.name)}
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
        ) : (
          <div className="flex flex-col h-full">
            <div className="p-4 flex w-full justify-between border-b border-[var(--mp-custom-gray-200)] bg-[var(--mp-custom-white)]">
              <h2 className="text-2xl font-bold text-[var(--mp-custom-gray-800)]">
                {userList[selectedChat]?.name || "Select a chat"}
              </h2>
              <button onClick={() => setShowChatList(true)}>
                <AiOutlineCloseCircle />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[var(--mp-custom-white)]">
              {editedMessages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg.decryptedText}
                  isSent={msg.senderType === "doc"}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex-none border-t border-[var(--mp-custom-gray-200)]">
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

export default DoctorPeer;
