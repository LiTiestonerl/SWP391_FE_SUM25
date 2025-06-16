import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiPaperclip, FiPhone, FiCalendar, FiMoreVertical } from "react-icons/fi";
import { BsCircleFill } from "react-icons/bs";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "coach",
      text: "Hello! How can I help you today?",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true
    },
    {
      id: 2,
      sender: "member",
      text: "Hi, I'd like to discuss my progress.",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      read: true
    }
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  

  const messageEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const coachData = {
    name: "Dr. Sarah Johnson",
    status: "online",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=128&q=80",
    specialty: "Wellness Coach"
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      setIsTyping(true);
      const newMsg = {
        id: messages.length + 1,
        sender: "member",
        text: newMessage,
        timestamp: new Date().toISOString(),
        read: false
      };

      setMessages([...messages, newMsg]);
      setNewMessage("");

      // Simulate coach response
      setTimeout(() => {
        const coachResponse = {
          id: messages.length + 2,
          sender: "coach",
          text: "Thank you for sharing. Let me help you with that.",
          timestamp: new Date().toISOString(),
          read: false
        };
        setMessages(prev => [...prev, coachResponse]);
        setIsTyping(false);
      }, 2000);

    } catch (err) {
      setError("Failed to send message. Please try again.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={coachData.avatar}
              alt="Coach"
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=128&q=80";
              }}
            />
            <BsCircleFill
              className={`absolute bottom-0 right-0 text-${coachData.status === "online" ? "green" : "gray"}-500 h-3 w-3`}
            />
          </div>
          <div>
            <h2 className="font-semibold text-lg">{coachData.name}</h2>
            <p className="text-sm text-gray-500">{coachData.specialty}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FiPhone className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FiCalendar className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FiMoreVertical className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "member" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === "member"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800 shadow"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === "member" ? "text-blue-100" : "text-gray-400"
                }`}
              >
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="animate-bounce">•</div>
            <div className="animate-bounce delay-100">•</div>
            <div className="animate-bounce delay-200">•</div>
          </div>
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        {error && (
          <div className="mb-2 text-red-500 text-sm">{error}</div>
        )}
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FiPaperclip className="h-5 w-5 text-gray-600" />
          </button>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="1"
            maxLength="500"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className={`p-2 rounded-full ${
              newMessage.trim()
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400"
            }`}
          >
            <FiSend className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;