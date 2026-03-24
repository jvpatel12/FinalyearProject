import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Loader } from 'lucide-react';
import { useChat } from './ChatContext';
import { generateAIResponse } from './helpService';
import { useAuth } from '../auth/useAuth';

/**
 * Chat Interface Component
 * Modal dialog with chat messages and input
 */
function ChatInterface() {
  const { messages, addMessage, isLoading, setIsLoading, clearMessages } = useChat();
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    addMessage(inputValue, 'user');
    setInputValue('');
    setIsLoading(true);

    try {
      // Get AI response
      const response = await generateAIResponse(inputValue);
      
      // Add bot response
      setTimeout(() => {
        addMessage(response, 'bot');
        setIsLoading(false);
      }, 300);
    } catch (error) {
      console.error('Error generating response:', error);
      addMessage('Sorry, I encountered an error. Please try again.', 'bot');
      setIsLoading(false);
    }
  };

  const userRole = user?.role || 'customer';
  const roleEmoji = {
    admin: '👨‍💼',
    seller: '🏪',
    customer: '🛍️'
  }[userRole.toLowerCase()] || '👤';

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-40 border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg">Help Assistant</h3>
            <p className="text-blue-100 text-sm">{roleEmoji} {userRole.charAt(0).toUpperCase() + userRole.slice(1)}</p>
          </div>
          <button
            onClick={clearMessages}
            className="p-2 hover:bg-blue-600 rounded-lg transition-colors"
            title="Clear chat"
            aria-label="Clear messages"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              <span className={`text-xs mt-1 block ${
                message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 border border-gray-200 rounded-lg rounded-bl-none px-4 py-2 flex items-center gap-2">
              <Loader size={16} className="animate-spin" />
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100"
            aria-label="Chat message input"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </form>

      {/* Footer Info */}
      <div className="border-t border-gray-200 px-4 py-2 text-xs text-gray-500 text-center bg-gray-50 rounded-b-lg">
        💡 Tip: Ask about orders, products, payments, or your account!
      </div>
    </div>
  );
}

export default ChatInterface;
