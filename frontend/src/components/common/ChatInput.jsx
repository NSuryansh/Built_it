import React from "react";
import { Send } from "lucide-react";

const ChatInput = ({ message, setMessage, handleSubmit, isDoc = false }) => {
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="border-t border-[var(--custom-gray-200)] p-4 bg-[var(--custom-white)]"
      >
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            placeholder="Type a message..."
            className={`flex-1 w-[95%] rounded-full border border-[var(--custom-gray-200)] px-4 py-2 focus:outline-none focus:border-${
              isDoc ? "[var(--custom-blue-500)]" : "[var(--custom-orange-500)]"
            }`}
          />
          <button
            type="submit"
            className={`p-2 cursor-pointer text-[var(--custom-white)] bg-gradient-to-r ${
              isDoc
                ? "from-[var(--custom-blue-500)] to-cyan-500"
                : "from-[var(--custom-orange-500)] to-pink-500"
            } rounded-full hover:opacity-90 transition-opacity`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </>
  );
};

export default ChatInput;
