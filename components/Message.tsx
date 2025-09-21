
import React from 'react';
import type { Message as MessageType } from '../types';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  const messageClasses = `
    max-w-xs md:max-w-md lg:max-w-lg
    py-2 px-4 rounded-2xl
    ${isUser ? 'bg-blue-500 text-white rounded-br-none self-end' : 'bg-white text-gray-800 rounded-bl-none self-start shadow-sm'}
  `;

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-4`}>
      <div className={messageClasses}>
        <p className="text-sm break-words">{message.text}</p>
      </div>
      <span className="text-xs text-gray-500 mt-1 px-1">{message.timestamp}</span>
    </div>
  );
};

export default Message;
