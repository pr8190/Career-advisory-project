import React, { useState, useRef, useEffect } from 'react';
import './mental.css';
//import { text } from 'express';

const MentalSupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hello! I\'m here to support you. How are you feeling today?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Toggle chat panel
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Handle sending messages
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user',
      text: inputText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response (replace with actual AI API call)
    setTimeout(async () => {
      const botResponse = await generateAIResponse(inputText);
      setMessages(prev => [...prev, {
        type: 'bot',
        text: botResponse,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1500);
  };

  // Simple AI response generator (replace with real AI API)
  const generateAIResponse =  async (userInput) => {
    try {
      const response = await fetch("http://localhost:5001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });
      
      const data = await response.json();
      return data.reply; // 👈 show AI response
    } catch (err) {
      console.error("Error:", err);
      return ;
    }
  };

  // Quick response buttons
  const quickResponses = [
    'I feel stressed',
    'I need motivation',
    'I think I have suicidal tendencies',
    'I feel bored!'
  ];

  const handleQuickResponse = (text) => {
    setInputText(text);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className={`chat-button ${isOpen ? 'open' : ''}`} onClick={toggleChat}>
        {isOpen ? (
          <span className="close-icon">✕</span>
        ) : (
          <>
            <span className="chat-icon">💬</span>
            <span className="chat-label">Mental Support</span>
          </>
        )}
      </div>

      {/* Chat Panel */}
      <div className={`chat-panel ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="chat-header">
          <div className="header-content">
            <div className="bot-avatar">🤖</div>
            <div className="header-text">
              <h3>AI Mental Support</h3>
              <p className="status">
                <span className="status-dot"></span> Always here for you
              </p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              <div className="message-content">
                {message.type === 'bot' && <div className="message-avatar">🤖</div>}
                <div className="message-bubble">
                  <p>{message.text}</p>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                {message.type === 'user' && <div className="message-avatar">👤</div>}
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="message bot">
              <div className="message-content">
                <div className="message-avatar">🤖</div>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Response Buttons */}
        <div className="quick-responses">
          {quickResponses.map((response, index) => (
            <button 
              key={index}
              className="quick-response-btn"
              onClick={() => handleQuickResponse(response)}
            >
              {response}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <form className="chat-input-container" onSubmit={handleSendMessage}>
          <input
            type="text"
            className="chat-input"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className="send-button">
            <span>➤</span>
          </button>
        </form>
      </div>

      {/* Backdrop */}
      {isOpen && <div className="chat-backdrop" onClick={toggleChat}></div>}
    </>
  );
};

export default MentalSupportChat;