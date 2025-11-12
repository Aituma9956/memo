import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Search,
  Loader,
  CheckCircle,
  AlertCircle,
  FileText,
  DollarSign,
  Clock,
  Minimize2,
  Maximize2,
  RotateCcw,
  Zap
} from 'lucide-react';
import leoImage from '../leo.jpg';
import './AIChatbot.css';

const AIChatbot = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatPanelRef = useRef(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = {
        id: 1,
        type: 'bot',
        content: `Hello ${user?.name || 'there'}! 👋 I'm Leo. I can help you with account lookups, status checks, and answer questions about memo balance processing. How can I assist you today?`,
        timestamp: new Date(),
        suggestions: [
          'Check account status',
          'Lookup account balance',
          'Find pending approvals',
          'Show SLA compliance'
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && chatPanelRef.current && !chatPanelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 300);
    }
  }, [isOpen, isMinimized]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Predefined responses for common queries
  const getAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('account') && (message.includes('status') || message.includes('check'))) {
      return {
        type: 'account_status',
        content: 'Let me check the account status for you...',
        delay: 1500,
        finalContent: 'Account MBP-2024-001234 is currently under verification. Status: In Progress ✅\n\n📋 Details:\n• Amount: ₦2,500,000\n• Assigned to: John Adebayo\n• SLA: 18 hours remaining\n• Risk Score: Low',
        actions: ['View Details', 'Download Report']
      };
    }
    
    if (message.includes('balance') || message.includes('amount')) {
      return {
        type: 'balance_lookup',
        content: 'Fetching account balance information...',
        delay: 2000,
        finalContent: 'Balance computation completed! 💰\n\n📊 Summary:\n• Current Balance: ₦5,750,000\n• Pending Debits: ₦350,000\n• Available Balance: ₦5,400,000\n• Last Updated: 2 minutes ago',
        actions: ['View Computation', 'Export Data']
      };
    }
    
    if (message.includes('pending') || message.includes('approval')) {
      return {
        type: 'pending_items',
        content: 'Searching for pending approvals...',
        delay: 1200,
        finalContent: 'Found 3 items pending your approval: 📋\n\n1. MBP-2024-001256 - ₦5,500,000\n2. MBP-2024-001267 - ₦15,000,000 (VIP)\n3. MBP-2024-001278 - ₦1,200,000\n\nTotal value: ₦21,700,000',
        actions: ['Review All', 'Approve Batch']
      };
    }
    
    if (message.includes('sla') || message.includes('compliance')) {
      return {
        type: 'sla_status',
        content: 'Calculating SLA compliance metrics...',
        delay: 1800,
        finalContent: 'SLA Compliance Report 📈\n\n✅ Overall Compliance: 96.2%\n⚡ Average Processing Time: 18.5 hours\n🔴 Breached Items: 2 accounts\n🟡 At Risk: 5 accounts\n\nPerformance: Above Target! 🎯',
        actions: ['View Report', 'Download PDF']
      };
    }
    
    if (message.includes('help') || message.includes('what') || message.includes('how')) {
      return {
        type: 'help',
        content: 'Here are some things I can help you with: 🤖\n\n• 🔍 Account status lookups\n• 💰 Balance computations\n• ⏰ SLA compliance tracking\n• 📋 Pending approvals\n• 📊 Report generation\n• ⚠️ Alert management\n\nJust ask me anything about memo balance processing!',
        delay: 800,
        suggestions: ['Check account MBP-2024-001234', 'Show my pending tasks', 'Generate compliance report']
      };
    }
    
    if (message.includes('who') || message.includes('what are you')) {
      return {
        type: 'intro',
        content: 'I\'m Leo! 🤖✨\n\nI\'m powered by advanced AI to help you with:\n\n• Smart account analysis\n• Real-time data lookup\n• Process automation\n• Compliance monitoring\n• Quick report generation\n\nI\'m available 24/7 to make your memo balance processing faster and more efficient! 🚀',
        delay: 1000,
        suggestions: ['What can you do?', 'Check account status', 'Show pending items']
      };
    }
    
    // Default response for unrecognized queries
    return {
      type: 'default',
      content: 'I understand you\'re asking about memo balance processing. Let me search our knowledge base...',
      delay: 1500,
      finalContent: 'I can help you with account lookups, balance computations, SLA tracking, and more! 🤖\n\nTry asking me:\n• "Check account [number]"\n• "Show pending approvals"\n• "What\'s my SLA compliance?"\n• "Calculate balance for account [number]"',
      suggestions: ['Account lookup', 'Pending approvals', 'SLA status', 'Help']
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    // Get AI response
    const aiResponseData = getAIResponse(inputValue);
    
    // Add initial "thinking" message
    const initialBotMessage = {
      id: Date.now() + 1,
      type: 'bot',
      content: aiResponseData.content,
      timestamp: new Date(),
      isLoading: true
    };

    setTimeout(() => {
      setMessages(prev => [...prev, initialBotMessage]);
      setIsLoading(false);
    }, 300);

    // Update with final response after delay
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === initialBotMessage.id 
            ? {
                ...msg,
                content: aiResponseData.finalContent || aiResponseData.content,
                isLoading: false,
                actions: aiResponseData.actions,
                suggestions: aiResponseData.suggestions,
                type: `bot-${aiResponseData.type}`
              }
            : msg
        )
      );
    }, aiResponseData.delay);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleActionClick = (action) => {
    alert(`Action: ${action}\nThis would navigate to the relevant section in a real implementation.`);
  };

  const clearChat = () => {
    setMessages([{
      id: 1,
      type: 'bot',
      content: `Chat cleared! How can I help you today, ${user?.name || 'there'}? 🤖`,
      timestamp: new Date(),
      suggestions: [
        'Check account status',
        'Lookup account balance', 
        'Find pending approvals',
        'Show SLA compliance'
      ]
    }]);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = (e) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="ai-chatbot-widget">
      {/* Floating Button */}
      <div 
        className={`chat-float-button ${isOpen ? 'active' : ''}`}
        onClick={toggleChat}
      >
        {isOpen ? <X size={24} /> : <img src={leoImage} alt="Leo AI" className="leo-avatar" />}
        {!isOpen && (
          <>
            <div className="pulse-ring"></div>
           
          </>
        )}
      </div>

      {/* Chat Panel */}
      {isOpen && (
        <div 
          ref={chatPanelRef}
          className={`chat-panel ${isMinimized ? 'minimized' : ''}`}
        >
          {/* Chat Header */}
          <div className="chat-header">
            <div className="chat-title">
              <div className="ai-avatar">
                <Bot size={20} />
              </div>
              <div className="title-info">
                <h4>MBP AI Assistant</h4>
                <span className="status">
                  <div className="status-indicator online"></div>
                  Online
                </span>
              </div>
            </div>
            <div className="header-actions">
              <button 
                className="header-btn"
                onClick={clearChat}
                title="Clear Chat"
              >
                <RotateCcw size={16} />
              </button>
              <button 
                className="header-btn"
                onClick={toggleMinimize}
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button 
                className="header-btn close-btn"
                onClick={() => setIsOpen(false)}
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          {!isMinimized && (
            <>
              <div className="chat-messages">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`message ${message.type.startsWith('bot') ? 'bot-message' : 'user-message'}`}
                  >
                    <div className="message-avatar">
                      {message.type.startsWith('bot') ? (
                        <div className="bot-avatar">
                          <Bot size={16} />
                        </div>
                      ) : (
                        <div className="user-avatar">
                          <User size={16} />
                        </div>
                      )}
                    </div>
                    
                    <div className="message-content">
                      <div className="message-bubble">
                        {message.isLoading ? (
                          <div className="typing-indicator">
                            <Loader size={16} className="spinning" />
                            <span>AI is thinking...</span>
                          </div>
                        ) : (
                          <div className="message-text">
                            {message.content.split('\n').map((line, index) => (
                              <div key={index}>{line}</div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {message.actions && (
                        <div className="message-actions">
                          {message.actions.map((action, index) => (
                            <button
                              key={index}
                              className="action-button"
                              onClick={() => handleActionClick(action)}
                            >
                              <Zap size={12} />
                              {action}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {message.suggestions && (
                        <div className="message-suggestions">
                          <span className="suggestions-label">Quick actions:</span>
                          <div className="suggestions-grid">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                className="suggestion-chip"
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="message-time">
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                
                {(isTyping || isLoading) && (
                  <div className="message bot-message">
                    <div className="message-avatar">
                      <div className="bot-avatar">
                        <Bot size={16} />
                      </div>
                    </div>
                    <div className="message-content">
                      <div className="message-bubble">
                        <div className="typing-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="chat-input">
                <div className="input-container">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about memo balance processing..."
                    disabled={isLoading}
                  />
                  <button
                    className="send-button"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                  >
                    <Send size={16} />
                  </button>
                </div>
                <div className="input-footer">
                  <span className="ai-disclaimer">
                    🤖 AI Assistant • Powered by UBA Intelligence
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AIChatbot;