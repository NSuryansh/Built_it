import React, { useState } from "react";
import { Send, Paperclip, Smile } from "lucide-react";
import axios from "axios";

const ChatInput = ({ message, setMessage, handleSubmit }) => {
  const [file, setFile] = useState(null);

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const onFileUpload = () => {
    const formData = new FormData();

    formData.append("myFile", file, file.name);
    console.log(file);
    axios.post("api/uploadfile", formData);
  };

  const fileData = () => {
    if (file) {
      return (
        <div>
          <p className="mb-2">File Name: {file.name}</p>
        </div>
      );
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="border-t border-[var(--mp-custom-gray-200)] p-4 bg-[var(--mp-custom-white)]"
      >
        {file && fileData()}
        <div className="flex items-center gap-3">
          <input
            type="file"
            id="file-upload"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: "none" }}
          />
          <label
            htmlFor="file-upload"
            className="p-2 cursor-pointer text-[var(--mp-custom-gray-500)] hover:text-[var(--mp-custom-gray-600)] transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-[var(--mp-custom-gray-200)] px-4 py-2 focus:outline-none focus:border-[var(--peer-custom-orange-500)]"
          />
          <button
            type="submit"
            className="p-2 cursor-pointer text-[var(--mp-custom-white)] bg-gradient-to-r from-[var(--peer-custom-orange-500)] to-[var(--peer-custom-pink-500)] rounded-full hover:opacity-90 transition-opacity"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </>
  );
};

export default ChatInput;
