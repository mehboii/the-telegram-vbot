
import React, { useState } from 'react';
import SendIcon from './icons/SendIcon';

interface MessageInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSend(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <footer className="bg-white p-3 fixed bottom-0 left-0 right-0 border-t border-gray-200">
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Message"
          className="flex-1 border-none outline-none focus:ring-0 text-lg px-2"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </form>
    </footer>
  );
};

export default MessageInput;
