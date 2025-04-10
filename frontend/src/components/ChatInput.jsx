import React from "react";
import { Send } from "lucide-react";

const ChatInput = ({ message, setMessage, handleSubmit, isDoc }) => {
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="border-t border-[var(--mp-custom-gray-200)] p-4 bg-[var(--mp-custom-white)]"
      >
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            placeholder="Type a message..."
            className={`flex-1 w-[95%] rounded-full border border-[var(--mp-custom-gray-200)] px-4 py-2 focus:outline-none focus:border-${isDoc ? 'blue-500' : '[var(--peer-custom-orange-500)]'}`}
          />
          <button
            type="submit"
            className={`p-2 cursor-pointer text-[var(--mp-custom-white)] bg-gradient-to-r from-[var(--peer-custom-orange-500)] to-[var(--peer-custom-pink-500)] rounded-full hover:opacity-90 transition-opacity`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </>
  );
};

export default ChatInput;
