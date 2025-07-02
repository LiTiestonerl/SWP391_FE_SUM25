import React, { useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiPaperclip,
  FiSmile,
  FiSend,
  FiMoreVertical,
  FiPhone,
  FiVideo,
  FiHome,
} from "react-icons/fi";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const navigate = useNavigate(); // ✅ Đặt đúng trong component
  const [activeChat, setActiveChat] = useState(0);
  const [message, setMessage] = useState("");
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const messageEndRef = useRef(null);

  const conversations = [
    {
      id: 0,
      name: "Sarah Wilson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      lastMessage: "Hey, how are you doing?",
      unread: 2,
      online: true,
      messages: [
        { id: 1, text: "Hi there!", sent: false, timestamp: "2024-01-20T09:00:00" },
        { id: 2, text: "Hello! How are you?", sent: true, timestamp: "2024-01-20T09:01:00" },
      ],
    },
    {
      id: 1,
      name: "John Davis",
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
      lastMessage: "Let's meet tomorrow",
      unread: 0,
      online: false,
      messages: [
        { id: 1, text: "Are you free tomorrow?", sent: false, timestamp: "2024-01-20T10:00:00" },
      ],
    },
  ];

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const newMessage = {
      id: Date.now(),
      text: message,
      sent: true,
      timestamp: new Date().toISOString(),
    };
    conversations[activeChat].messages.push(newMessage);
    setMessage("");
    scrollToBottom();
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Vertical Left Sidebar */}
      <div className="w-14 bg-[#2c2f3a] text-white flex flex-col items-center py-6 space-y-8">
        <FiHome
          onClick={() => navigate("/")}
          className="w-6 h-6 cursor-pointer hover:text-blue-400"
          title="Go Home"
        />
        <FiSearch className="w-6 h-6 cursor-pointer hover:text-blue-400" />
        <FiVideo className="w-6 h-6 cursor-pointer hover:text-blue-400" />
        <FiMoreVertical className="w-6 h-6 cursor-pointer hover:text-blue-400" />
      </div>

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Sidebar: List conversations */}
        <div className="w-1/4 min-w-[300px] border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <h2 className="font-semibold dark:text-white">My Account</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Online</p>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-y-auto h-[calc(100vh-200px)]">
            {conversations.map((conv, index) => (
              <div
                key={conv.id}
                onClick={() => {
                  setActiveChat(index);
                  setShowInfoPanel(false);
                }}
                className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  activeChat === index ? "bg-gray-50 dark:bg-gray-700" : ""
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={conv.avatar}
                      alt={conv.name}
                      className="w-12 h-12 rounded-full"
                    />
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium dark:text-white">{conv.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread > 0 && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">{conv.unread}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat & Info Panel */}
        <div className="flex-1 flex">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={conversations[activeChat].avatar}
                    alt={conversations[activeChat].name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h2 className="font-semibold dark:text-white">
                      {conversations[activeChat].name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {conversations[activeChat].online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
                  <FiPhone className="w-5 h-5 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300" />
                  <FiVideo className="w-5 h-5 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300" />
                  <FiMoreVertical
                    onClick={() => setShowInfoPanel(!showInfoPanel)}
                    className="w-5 h-5 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
              {conversations[activeChat].messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sent ? "justify-end" : "justify-start"} mb-4`}
                >
                  <div
                    className={`max-w-[70%] ${
                      msg.sent
                        ? "bg-blue-500 text-white"
                        : "bg-white dark:bg-gray-800 dark:text-white"
                    } rounded-lg p-3 shadow`}
                  >
                    <p>{msg.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {format(new Date(msg.timestamp), "HH:mm")}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  <FiPaperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none"
                />
                <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  <FiSmile className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <FiSend className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          {showInfoPanel && (
            <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-[#1e1e2f] text-white p-4 flex flex-col justify-between">
              <div>
                <div className="flex flex-col items-center text-center">
                  <img
                    src={conversations[activeChat].avatar}
                    alt={conversations[activeChat].name}
                    className="w-24 h-24 rounded-full object-cover mb-3"
                  />
                  <h3 className="text-xl font-semibold">
                    {conversations[activeChat].name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    @{conversations[activeChat].name.toLowerCase().replace(" ", "")}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Hoạt động 1 giờ trước</p>
                </div>

                <div className="flex justify-around mt-6 mb-4">
                  {[
                    { label: "Trang cá nhân", icon: "M3 12l2-2m0 0l7-7 7 7m-9 2v6m0 0H5m4 0h6" },
                    { label: "Tắt thông báo", icon: "M15 17h5l-1.4-1.4C18.2 15.2 18 14.7 18 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
                    { label: "Tìm kiếm", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="p-2 bg-gray-800 rounded-full">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d={item.icon} />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-300">{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 divide-y divide-gray-600">
                  {[
                    "Thông tin về đoạn chat",
                    "Tuỳ chỉnh đoạn chat",
                    "File phương tiện & file",
                    "Quyền riêng tư và hỗ trợ",
                  ].map((text, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center py-4 px-2 hover:bg-gray-700 cursor-pointer rounded"
                    >
                      <span>{text}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
