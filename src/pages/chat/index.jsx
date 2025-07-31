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
import { useSelector } from "react-redux";
import api from "../../configs/axios";

const ChatPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user); // 👈 lấy từ Redux
  const userId = user?.id;

  const [conversations, setConversations] = useState([]);
  const [activeChatIndex, setActiveChatIndex] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const messageEndRef = useRef(null);

  useEffect(() => {
    const fetchConversations = async () => {
      if (userId && localStorage.getItem("token")) {
        try {
          const res = await api.get("/chat/sessions", {
            params: { userId },
          });
          setConversations(res.data);
        } catch (err) {
          console.error("Lỗi khi lấy danh sách session:", err);
        }
      }
    };

    fetchConversations();
  }, [userId]);

  const handleSelectConversation = async (index) => {
    const selected = conversations[index];
    setActiveChatIndex(index);
    setMessages([]);
    try {
      const res = await api.get(`/chat/sessions/${selected.id}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy tin nhắn:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || activeChatIndex === null) return;
    const sessionId = conversations[activeChatIndex]?.id;
    try {
      await api.post(`/chat/sessions/${sessionId}/messages`, {
        senderId: userId,
        content: message,
      });
      const res = await api.get(`/chat/sessions/${sessionId}/messages`);
      setMessages(res.data);
      setMessage("");
    } catch (err) {
      console.error("Gửi tin nhắn thất bại:", err);
    }
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectedChat = activeChatIndex !== null ? conversations[activeChatIndex] : null;

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-14 bg-[#2c2f3a] text-white flex flex-col items-center py-6 space-y-8">
        <FiHome onClick={() => navigate("/")} className="w-6 h-6 cursor-pointer hover:text-blue-400" title="Go Home" />
        <FiSearch className="w-6 h-6 cursor-pointer hover:text-blue-400" />
        <FiVideo className="w-6 h-6 cursor-pointer hover:text-blue-400" />
        <FiMoreVertical className="w-6 h-6 cursor-pointer hover:text-blue-400" />
      </div>

      {/* Main */}
      <div className="flex flex-1">
        {/* Conversations List */}
        <div className="w-1/4 min-w-[300px] border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
          <div className="p-4 border-b flex items-center space-x-4">
            <img
              src={user?.avatar || "https://placehold.co/100x100"}
              alt="Avatar"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => navigate(`/profile/${user?.id}`)} 
            />
            <div>
              <h2 className="font-semibold dark:text-white">
                {user?.fullName || user?.username || "My Account"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Online</p>
            </div>
          </div>

          <div className="p-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700"
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {conversations.map((conv, index) => (
              <div key={conv.id} onClick={() => handleSelectConversation(index)}
                className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  activeChatIndex === index ? "bg-gray-50 dark:bg-gray-700" : ""
                }`}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={conv.avatar || "https://placehold.co/50x50"}
                    alt={conv.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium dark:text-white">{conv.name || `Session ${conv.id}`}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {conv.lastMessage || "Chưa có tin nhắn"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex">
          {selectedChat ? (
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="p-4 border-b bg-white dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedChat.avatar || "https://placehold.co/50x50"}
                      alt={selectedChat.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h2 className="font-semibold dark:text-white">{selectedChat.name || `Session ${selectedChat.id}`}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Online</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-gray-500">
                    <FiPhone className="w-5 h-5 cursor-pointer" />
                    <FiVideo className="w-5 h-5 cursor-pointer" />
                    <FiMoreVertical
                      onClick={() => setShowInfoPanel(!showInfoPanel)}
                      className="w-5 h-5 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.senderId == userId ? "justify-end" : "justify-start"} mb-4`}>
                    <div
                      className={`max-w-[70%] ${
                        msg.senderId == userId ? "bg-blue-500 text-white" : "bg-white dark:bg-gray-800"
                      } rounded-lg p-3 shadow`}
                    >
                      <p>{msg.content}</p>
                      <p className="text-xs mt-1 opacity-70 text-right">
                        {format(new Date(msg.timestamp), "HH:mm")}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messageEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-white dark:bg-gray-800 border-t">
                <div className="flex items-center space-x-4">
                  <FiPaperclip className="text-gray-500" />
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
                  />
                  <FiSmile className="text-gray-500" />
                  <button onClick={handleSendMessage} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
                    <FiSend className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>Hãy chọn một cuộc trò chuyện để bắt đầu.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
