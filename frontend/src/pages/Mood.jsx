import React from 'react';
import ProgressPage from '../components/ProgressPage';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';

export default function Mood() {
  return (

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto border-r border-[var(--mp-custom-gray-200)]">
          <ProgressPage />
        </div>
        <div className="w-3/5 flex flex-col">
          <div className="p-4 border-b border-[var(--mp-custom-gray-200)] bg-[var(--mp-custom-white)]">
            <h2 className="text-2xl font-bold text-[var(--mp-custom-gray-800)]">Calm Bot</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-[var(--mp-custom-white)]">
            <ChatMessage message="Hello! I'm here to help you track and improve your well-being. How are you feeling today?" />
            <ChatMessage message="I'm feeling a bit stressed today." isReceived />
            <ChatMessage message="I understand. Let's look at your progress and see where we can make improvements." />
          </div>
          <ChatInput />
        </div>
      </div>
  );
}
