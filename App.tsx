import React, { useState, useEffect } from 'react';
// FIX: Import GoogleGenAI and Chat for interacting with the Gemini API.
import { GoogleGenAI, Chat } from '@google/genai';
import type { Message as MessageType } from './types';
import Header from './components/Header';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';

const App: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);

  useEffect(() => {
    // Set an initial welcome message from the bot.
    setMessages([
      {
        id: 'initial-bot-message',
        text: "Hello! I'm UpNext Bot. How can I help you today?",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);

    try {
      // FIX: Correctly initialize GoogleGenAI with a named apiKey object.
      // The API key is expected to be available in process.env.API_KEY.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      
      // FIX: Use the recommended 'gemini-2.5-flash' model for chat.
      const newChat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: 'You are a helpful and friendly assistant named UpNext Bot.',
        },
      });
      setChat(newChat);
    } catch (error) {
        console.error("Failed to initialize the AI model:", error);
        setMessages((prev) => [...prev, {
          id: 'error-initialization',
          text: "Sorry, I couldn't start. Please check the API key and configuration.",
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
    }
  }, []);

  const handleSend = async (text: string) => {
    if (!chat || isLoading) return;

    const userMessage: MessageType = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    const botMessageId = `bot-${Date.now()}`;
    // Add a placeholder for the bot's message.
    setMessages((prevMessages) => [
        ...prevMessages,
        {
            id: botMessageId,
            text: '',
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
    ]);

    try {
      // FIX: Use sendMessageStream for a better user experience with streaming responses.
      const stream = await chat.sendMessageStream({ message: text });

      let fullResponse = '';
      for await (const chunk of stream) {
        // FIX: Access the streamed text directly from chunk.text.
        fullResponse += chunk.text;
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === botMessageId ? { ...msg, text: fullResponse } : msg
          )
        );
      }
      
      // Update timestamp after the message is fully received for accuracy
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === botMessageId ? { ...msg, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : msg
        )
      );

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessageText = 'Sorry, something went wrong. Please try again.';
      setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === botMessageId ? { ...msg, text: errorMessageText } : msg
          )
        );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <Header />
      <main className="flex-1 flex flex-col">
        <MessageList messages={messages} isLoading={isLoading} />
      </main>
      <MessageInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
};

export default App;
