import React, { useState, useEffect, useRef } from "react";
import ProgressPage from "../../components/user/ProgressPage";
import ChatMessage from "../../components/common/ChatMessage";
import ChatInput from "../../components/common/ChatInput";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../../utils/profile";
import Navbar from "../../components/user/Navbar";
import SessionExpired from "../../components/common/SessionExpired";
import { ToastContainer } from "react-toastify";
import CustomToast from "../../components/common/CustomToast";
import { InfoIcon, Mic, MicOff } from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import CustomLoader from "../../components/common/CustomLoader";
import { HashLoader } from "react-spinners";

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
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isSpeechToTextSupported, setIsSpeechToTextSupported] = useState(null);

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Set speech recognition support on mount
  useEffect(() => {
    if (browserSupportsSpeechRecognition) {
      setIsSpeechToTextSupported(true);
    } else {
      console.log("Your browser does not support speech recognition.");
      setIsSpeechToTextSupported(false);
    }
  }, [browserSupportsSpeechRecognition]);

  // Sync transcript with input message
  useEffect(() => {
    setMessage(transcript);
  }, [transcript]);

  // Scroll chat window to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  // Verify user authentication on mount
  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("user");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  const handleClosePopup = () => {
    navigate("/user/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Update chat with user's message
    const newChats = [...chats, { self: "True", message }];
    setChats(newChats);
    setMessage("");
    resetTranscript();
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://built-it-python-895c.onrender.com/chatWithBot",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: localStorage.getItem("userid"),
            message,
          }),
        }
      );

      const data = await response.json();
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

  // Play the recorded audio when available and clean up URL
  useEffect(() => {
    if (audioBlob) {
      const audioURL = URL.createObjectURL(audioBlob);
      console.log("Audio blob available:", audioBlob);

      const audio = new Audio(audioURL);
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
      console.log("Audio URL:", audioURL);
      return () => {
        URL.revokeObjectURL(audioURL);
      };
    }
  }, [audioBlob]);

  // Send recorded audio to the server for emotion analysis
  const sendAudioToServer = async (blob) => {
    const formData = new FormData();
    formData.append("audio", blob, "audio.wav");

    try {
      const response = await fetch(
        "https://built-it-python-895c.onrender.com/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();
      console.log("Audio sent successfully:", result);
      console.log("Emotion result:", result);
      // CustomToast(`Detected Emotion: ${result.emotion}`);
    } catch (error) {
      console.error("Error sending audio:", error);
      // CustomToast("Failed to analyze emotion");
    }
  };

  const startRecording = async () => {
    try {
      SpeechRecognition.startListening({ continuous: true });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      let chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        setAudioBlob(blob);
        sendAudioToServer(blob);
        chunks = [];
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      CustomToast("Error starting audio recording");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
    SpeechRecognition.stopListening();
  };

  if (isAuthenticated === null) {
    return <CustomLoader text="Loading your wellness journey..." />;
  }

  if (!isAuthenticated) {
    return (
      <SessionExpired handleClosePopup={handleClosePopup} theme="orange" />
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <ToastContainer />
      <div className="flex-1 h-full flex overflow-hidden">
        <div className="flex-1 hidden sm:block overflow-y-auto border-r border-[var(--custom-gray-200)]">
          <ProgressPage />
        </div>
        <div className="sm:w-3/5 w-full flex flex-col">
          <div className="p-4 border-b border-[var(--custom-gray-200)] bg-[var(--custom-white)]">
            <h2 className="text-2xl font-bold text-[var(--custom-gray-800)]">
              Calm Bot
            </h2>
          </div>
          <div className="w-full px-3 flex justify-center items-center text-[var(--custom-gray-400)] text-xs font-light mt-3">
            <InfoIcon size={12} className="mr-1 !w-4 !h-4" />
            This chatbot is for informational purposes only and does not provide
            medical advice, diagnosis, or treatment.
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col p-4 bg-[var(--custom-white)]">
            {chats.map((msg, index) => (
              <ChatMessage
                message={msg.message}
                key={index}
                isSent={msg.self === "True"}
              />
            ))}
            {isLoading && (
              <div className="flex justify-center items-center my-2">
                <HashLoader color="#ff4800" radius={6} height={20} width={5} />
              </div>
            )}
            <div className="h-1" ref={messagesEndRef} />
          </div>
          <div className="flex items-center gap-2 p-4">
            <div className="flex-1">
              <ChatInput
                message={message}
                setMessage={setMessage}
                handleSubmit={handleSubmit}
              />
            </div>
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-2 rounded-full transition-colors bg-gradient-to-r ${
                isRecording
                  ? "to-[var(--custom-orange-500)] from-[var(--custom-purple-500)] text-[var(--custom-white)]"
                  : "from-[var(--custom-orange-500)] to-[var(--custom-purple-500)] text-[var(--custom-white)]"
              }`}
              title={isRecording ? "Stop Recording" : "Start Recording"}
            >
              {isRecording ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
