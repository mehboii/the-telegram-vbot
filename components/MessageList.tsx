import React, { useRef, useEffect, useState } from 'react';
import type { Message as MessageType } from '../types';
import Message from './Message';

interface MessageListProps {
  messages: MessageType[];
  isLoading: boolean;
}

const TypingIndicator: React.FC = () => (
    <div className="flex items-start mb-4">
        <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none self-start shadow-sm py-2 px-4 flex items-center space-x-1">
            <span className="text-sm">Bot is typing</span>
            <div className="animate-bounce w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
            <div className="animate-bounce delay-150 w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
            <div className="animate-bounce delay-300 w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
        </div>
    </div>
);


const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    let timer: number;

    const lastMessage = messages[messages.length - 1];
    // The bot is considered "replying" if the last message is from the bot and contains text.
    // This allows us to hide the indicator as soon as the streaming response starts.
    const isBotReplying = lastMessage?.sender === 'bot' && lastMessage.text.length > 0;

    if (isLoading && !isBotReplying) {
      // If the app is loading but the bot hasn't started streaming its reply,
      // set a timer to show the typing indicator after a short delay.
      timer = window.setTimeout(() => {
        setShowTypingIndicator(true);
      }, 1000); // 1-second delay feels more natural
    } else {
      // If loading is finished, or the bot has started replying,
      // hide the indicator immediately.
      setShowTypingIndicator(false);
    }

    // Cleanup function: If isLoading changes or the component unmounts before
    // the timer fires, we clear the timer to prevent the indicator from showing.
    return () => {
      clearTimeout(timer);
    };
  }, [isLoading, messages]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 pt-24 pb-24">
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} />
      ))}
      {showTypingIndicator && <TypingIndicator />}
    </div>
  );
};

export default MessageList;