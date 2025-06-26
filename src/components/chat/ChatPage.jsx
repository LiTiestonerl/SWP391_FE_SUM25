import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiSearch,
  FiPaperclip,
  FiSmile,
  FiSend,
  FiMoreVertical,
  FiPhone,
  FiVideo,
  FiHome,
  FiBell,
} from "react-icons/fi";
import { format } from "date-fns";

const ChatApp = () => {
  const [activeChat, setActiveChat] = useState(0);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showOptions, setShowOptions] = useState(false);
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
        {
          id: 1,
          text: "Hi there!",
          sent: false,
          timestamp: "2024-01-20T09:00:00",
        },
        {
          id: 2,
          text: "Hello! How are you?",
          sent: true,
          timestamp: "2024-01-20T09:01:00",
        },
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
        {
          id: 1,
          text: "Are you free tomorrow?",
          sent: false,
          timestamp: "2024-01-20T10:00:00",
        },
      ],
    },
    {
      id: 2,
      name: "Emma Brown",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      lastMessage: "Can't wait for the trip!",
      unread: 1,
      online: true,
      messages: [
        {
          id: 1,
          text: "See you at 5 PM!",
          sent: false,
          timestamp: "2024-01-20T11:00:00",
        },
      ],
    },
    {
      id: 3,
      name: "Liam Smith",
      avatar: "https://randomuser.me/api/portraits/men/33.jpg",
      lastMessage: "Thanks for your help.",
      unread: 0,
      online: false,
      messages: [
        {
          id: 1,
          text: "Really appreciate it!",
          sent: true,
          timestamp: "2024-01-20T12:00:00",
        },
      ],
    },
    {
      id: 4,
      name: "Olivia Johnson",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      lastMessage: "Let's catch up later.",
      unread: 3,
      online: true,
      messages: [
        {
          id: 1,
          text: "Lunch soon?",
          sent: false,
          timestamp: "2024-01-20T13:00:00",
        },
      ],
    },
    {
      id: 5,
      name: "Noah Taylor",
      avatar: "https://randomuser.me/api/portraits/men/11.jpg",
      lastMessage: "Talk to you later.",
      unread: 0,
      online: false,
      messages: [
        {
          id: 1,
          text: "Gotta go, bye!",
          sent: true,
          timestamp: "2024-01-20T14:00:00",
        },
      ],
    },
    {
      id: 6,
      name: "Ava Martinez",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg",
      lastMessage: "Sure, that works for me.",
      unread: 1,
      online: true,
      messages: [
        {
          id: 1,
          text: "Let's plan tomorrow.",
          sent: false,
          timestamp: "2024-01-20T15:00:00",
        },
      ],
    },
  ];

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar trái Messenger */}
      <div className="w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 space-y-6">
        {[FiHome, FiSearch, FiVideo, FiMoreVertical].map((Icon, i) => (
          <button
            key={i}
            onClick={() => {
              if (Icon === FiHome) {
                navigate("/home");
              }
              // Bạn có thể thêm xử lý cho các icon khác nếu cần
            }}
            className="text-black dark:text-white hover:text-blue-500 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Icon className="h-5 w-5" />
          </button>
        ))}
      </div>

      {/* Nội dung chính */}
      <div className="w-1/4 min-w-[300px] border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold dark:text-white">Đoạn chat</h2>
          <div className="relative mt-2">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm trên Messenger"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-130px)]">
          {filteredConversations.map((conv, index) => (
            <div
              key={conv.id}
              onClick={() =>
                setActiveChat(conversations.findIndex((c) => c.id === conv.id))
              }
              className={`flex items-center space-x-4 p-4 cursor-pointer rounded-lg transition-colors ${
                conversations[activeChat].id === conv.id
                  ? "bg-blue-100 dark:bg-blue-900"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <img
                src={conv.avatar}
                alt={conv.name}
                className="w-12 h-12 rounded-full"
              />
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
          ))}
        </div>
      </div>

      {/* Vùng chat chính */}
      <div className="flex flex-col flex-1">
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
            <div className="relative flex items-center space-x-4 text-gray-500 dark:text-gray-400">
              <FiPhone className="w-5 h-5 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300" />
              <FiVideo className="w-5 h-5 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300" />
              <FiMoreVertical
                className="w-5 h-5 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => setShowOptions(!showOptions)}
              />
              {showOptions && (
                <div className="absolute right-0 top-8 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 p-4">
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={conversations[activeChat].avatar}
                      alt={conversations[activeChat].name}
                      className="w-20 h-20 rounded-full mb-2"
                    />
                    <h3 className="text-lg font-semibold dark:text-white">
                      {conversations[activeChat].name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      @
                      {conversations[activeChat].name
                        .toLowerCase()
                        .replace(" ", "")}
                    </p>
                    <p className="text-sm mt-1 text-gray-400">
                      Hoạt động 1 giờ trước
                    </p>
                    <div className="flex justify-center gap-6 mt-3 mb-3">
                      <button className="flex flex-col items-center">
                        <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full">
                          <FiHome className="w-5 h-5 text-black dark:text-white" />
                        </div>
                        <span className="text-xs mt-1 text-black dark:text-white">
                          Trang cá nhân
                        </span>
                      </button>
                      <button className="flex flex-col items-center">
                        <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full">
                          <FiBell className="w-5 h-5 text-black dark:text-white" />
                        </div>
                        <span className="text-xs mt-1 text-black dark:text-white">
                          Tắt thông báo
                        </span>
                      </button>
                      <button className="flex flex-col items-center">
                        <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full">
                          <FiSearch className="w-5 h-5 text-black dark:text-white" />
                        </div>
                        <span className="text-xs mt-1 text-black dark:text-white">
                          Tìm kiếm
                        </span>
                      </button>
                    </div>
                    <ul className="text-left w-full mt-3 space-y-2">
                      {[
                        "Thông tin về đoạn chat",
                        "Tùy chỉnh đoạn chat",
                        "File phương tiện & file",
                        "Quyền riêng tư và hỗ trợ",
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex justify-between items-center py-2 border-t border-gray-200 dark:border-gray-700 text-black dark:text-white"
                        >
                          {item}
                          <span>›</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
          {conversations[activeChat].messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sent ? "justify-end" : "justify-start"
              } mb-4`}
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
              placeholder="Nhập tin nhắn..."
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
    </div>
  );
};

export default ChatApp;
