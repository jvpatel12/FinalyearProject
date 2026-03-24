import React from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useChat } from './ChatContext';
import ChatInterface from './ChatInterface';

/**
 * Chat Widget Component
 * Floating chat bubble that opens the chat interface
 */
function ChatWidget() {
  const { isOpen, toggleChat, messages } = useChat();
  
  // Count unread messages (messages from bot after last user message)
  const unreadCount = messages.filter(msg => msg.sender === 'bot').length;

  return (
    <>
      {/* Floating Chat Bubble */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg transition-all duration-300 z-40 flex items-center justify-center hover:scale-110 ${
          isOpen
            ? 'bg-red-600 text-white'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
        title={isOpen ? 'Close chat' : 'Open chat with assistant'}
        aria-label="Chat with assistant"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <div className="relative">
            <MessageCircle size={24} />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
        )}
      </button>

      {/* Chat Interface Modal */}
      {isOpen && <ChatInterface />}
    </>
  );
}

export default ChatWidget;
