import React, { createContext, useContext, useState, useCallback } from 'react';

const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey there! 👋 Welcome to our e-commerce platform. I'm here to help! What can I assist you with today?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const openChat = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const addMessage = useCallback((text, sender = 'user') => {
    const newMessage = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: 1,
        text: "Hey there! 👋 Welcome to our e-commerce platform. I'm here to help! What can I assist you with today?",
        sender: 'bot',
        timestamp: new Date(),
      }
    ]);
  }, []);

  const value = {
    isOpen,
    messages,
    isLoading,
    toggleChat,
    openChat,
    closeChat,
    addMessage,
    clearMessages,
    setIsLoading,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatContextProvider');
  }
  return context;
};
