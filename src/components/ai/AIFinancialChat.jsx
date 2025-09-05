import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, Loader } from 'lucide-react';
import { getFinancialChatResponse, moderateFinancialContent } from '../../services/openaiService';

const AIFinancialChat = ({ financialContext = {}, className = "" }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your AI financial advisor. I can help you with budgeting, investment advice, expense analysis, and answer any financial questions you have. How can I assist you today?',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMessage?.trim() || isLoading) return;

    const userMessage = {
      id: Date.now()?.toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Moderate the user's message
      const moderation = await moderateFinancialContent(inputMessage);
      if (moderation?.flagged) {
        const errorMessage = {
          id: (Date.now() + 1)?.toString(),
          type: 'bot',
          content: 'I notice your message contains content that I cannot provide advice on. Please rephrase your question in a more appropriate way, and I\'ll be happy to help with your financial questions.',
          timestamp: new Date(),
          isError: true,
        };
        setMessages(prev => [...prev, errorMessage]);
        return;
      }

      // Get AI response
      const response = await getFinancialChatResponse(inputMessage, financialContext);
      
      const botMessage = {
        id: (Date.now() + 2)?.toString(),
        type: 'bot',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: (Date.now() + 3)?.toString(),
        type: 'bot',
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.',
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const suggestedQuestions = [
    "How can I improve my spending habits?",
    "What\'s a good investment strategy for beginners?",
    "Help me create a monthly budget",
    "How much should I save for emergencies?",
    "What are some ways to reduce my expenses?"
  ];

  const handleSuggestionClick = (question) => {
    setInputMessage(question);
    inputRef?.current?.focus();
  };

  if (!isExpanded) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-96 h-[600px] bg-white border rounded-lg shadow-xl z-50 flex flex-col ${className}`}>
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <span className="font-medium">AI Financial Advisor</span>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-blue-200 hover:text-white text-xl"
        >
          ×
        </button>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((message) => (
          <div
            key={message?.id}
            className={`flex ${message?.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message?.type === 'user' ?'bg-blue-600 text-white'
                  : message?.isError
                  ? 'bg-red-50 text-red-700 border border-red-200' :'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message?.type === 'bot' && (
                  <Bot className={`h-4 w-4 mt-0.5 flex-shrink-0 ${message?.isError ? 'text-red-500' : 'text-blue-600'}`} />
                )}
                {message?.type === 'user' && (
                  <User className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-200" />
                )}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-line">{message?.content}</p>
                  <span className={`text-xs mt-1 block ${
                    message?.type === 'user' ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    {formatTimestamp(message?.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4 text-blue-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
      {/* Suggested Questions */}
      {messages?.length <= 1 && (
        <div className="p-4 border-t bg-gray-50">
          <p className="text-xs text-gray-600 mb-2">Try asking:</p>
          <div className="space-y-1">
            {suggestedQuestions?.slice(0, 3)?.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(question)}
                className="text-xs text-blue-600 hover:text-blue-800 block w-full text-left p-1 rounded hover:bg-blue-50"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e?.target?.value)}
            placeholder="Ask me anything about your finances..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputMessage?.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIFinancialChat;