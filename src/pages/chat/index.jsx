import React, { useEffect, useState, useRef } from "react";
import api from "../../configs/axios";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { message as antMessage } from "antd";
import { format } from "date-fns";

const SessionList = ({ sessions, activeSessionId, onSelectSession }) => (
  <div className="w-1/3 border-r bg-gray-50 h-full overflow-y-auto">
    <h3 className="p-3 font-bold text-lg border-b">Các cuộc trò chuyện</h3>
    <ul>
      {sessions.length > 0 ? (
        sessions.map((session) => (
          <li
            key={session.sessionId}
            onClick={() => onSelectSession(session.sessionId)}
            className={`p-3 cursor-pointer border-b hover:bg-gray-100 ${
              session.sessionId === activeSessionId ? "bg-blue-100" : ""
            }`}
          >
            <p className="font-semibold">{session.userName || `User ID: ${session.userId}`}</p>
          </li>
        ))
      ) : (
        <p className="p-3 text-gray-500">Không có cuộc trò chuyện nào.</p>
      )}
    </ul>
  </div>
);


const ChatWindow = ({ messages, user, handleSend, newMsg, setNewMsg, isSending, inputRef, messageEndRef }) => (
    <div className="flex-1 flex flex-col p-4 h-full">
     <h2 className="text-xl font-bold mb-2 text-center flex-shrink-0">
      Trò chuyện
    </h2>

    <div className="flex-1 overflow-y-auto border rounded p-2 mb-2 bg-white shadow">
      {messages.length === 0 ? (
        <p className="text-center text-gray-500">Chưa có tin nhắn. Bắt đầu cuộc trò chuyện!</p>
      ) : (
        messages.map((msg, idx) => {
          const isOwn = msg.senderId === user.id;
          return (
            <div
              key={idx}
              className={`mb-2 flex ${
                isOwn ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg px-3 py-2 max-w-[70%] shadow text-sm ${
                  isOwn
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <div className="font-semibold text-xs text-left">
                  {msg.senderName || (isOwn ? "Bạn" : "Đối phương")}
                </div>
                <div className="text-left">{msg.message}</div>
                {msg.createdAt && (
                  <div className="text-[10px] mt-1 opacity-70 text-right">
                    {format(new Date(msg.createdAt), "HH:mm dd/MM")}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
      <div ref={messageEndRef} />
    </div>

     <div className="flex flex-shrink-0">
      <input
        type="text"
        value={newMsg}
        ref={inputRef}
        onChange={(e) => setNewMsg(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !isSending && handleSend()}
        className="flex-1 border px-3 py-2 rounded-l focus:outline-none"
        placeholder="Nhập tin nhắn..."
        disabled={isSending}
      />
      <button
        onClick={handleSend}
        disabled={isSending || !newMsg.trim()}
        className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700 disabled:opacity-50"
      >
        {isSending ? "Đang gửi..." : "Gửi"}
      </button>
    </div>
  </div>
);
const ChatPage = () => {
  const user = useSelector((state) => state.user);
  const location = useLocation();

  // State được thiết kế lại để quản lý nhiều session
  const [allSessions, setAllSessions] = useState([]);      
  const [activeSessionId, setActiveSessionId] = useState(null); 
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const messageEndRef = useRef(null);
  const inputRef = useRef(null);

  // Effect 1: Logic khởi tạo được viết lại hoàn toàn
  useEffect(() => {
    if (!user?.id) return;
    
    const isCoach = user.role === "COACH";

    const initialize = async () => {
        setIsLoading(true);
        setError(null);

        // ---- PHÂN LUỒNG LOGIC TẠI ĐÂY ----
        if (isCoach) {
            // LOGIC CHO COACH
              try {
        // 1. Lấy tất cả session của Coach (chỉ chứa các ID)
        const sessionRes = await api.get('/chat-session/coach/session');
        const sessionsFromApi = sessionRes.data;

        // 2. Lấy tên cho từng user trong mỗi session
        const sessionsWithNames = await Promise.all(
            sessionsFromApi.map(async (session) => {
                // ID của người dùng trong cuộc trò chuyện này
                const partnerId = session.userId; 

                try {
                    // !!! QUAN TRỌNG: Thay thế bằng API endpoint ĐÚNG của bạn để lấy thông tin user
                    // Ví dụ: '/users/public-info/', '/api/accounts/', etc.
                    const userRes = await api.get(`/api/users/${partnerId}`); 
                    
                    // Giả sử API trả về đối tượng có thuộc tính 'name'
                    const userName = userRes.data.name; 

                    return {
                        ...session,
                        userName: userName || `User ID: ${partnerId}` // Nếu tên rỗng thì vẫn hiển thị ID
                    };
                } catch (err) {
                     // Nếu API lấy thông tin user thất bại, hiển thị ID như yêu cầu
                     console.error(`Không thể lấy thông tin cho user ID: ${partnerId}`, err);
                     return { 
                         ...session, 
                         userName: `User ID: ${partnerId}` // Fallback hiển thị ID
                    };
                }
            })
        );
        
        setAllSessions(sessionsWithNames);

    } catch (err) {
        console.error("Lỗi khi tải danh sách cuộc trò chuyện của Coach:", err);
        setError("Không thể tải danh sách cuộc trò chuyện.");
    }
        } else {
            // LOGIC CŨ CHO USER
            const coachIdFromUrl = new URLSearchParams(location.search).get("coachId");
            if (!coachIdFromUrl) {
                setError("URL không hợp lệ, thiếu thông tin Coach.");
                return;
            }
            
            const params = { userId: user.id, coachId: coachIdFromUrl };
            try {
                const check = await api.get("/chat-session/session", { params });
                if (check.data && check.data.length > 0) {
                    setActiveSessionId(check.data[0].sessionId);
                } else {
                     const res = await api.post("/chat-session/session", {}, { params });
                     setActiveSessionId(res.data.id);
                }
            } catch (err) {
                setError("Không thể khởi tạo phiên trò chuyện.");
            }
        }
        setIsLoading(false);
    };

    initialize();
  }, [user, location.search]);

  // Effect 2: Lấy tin nhắn dựa trên `activeSessionId`
  useEffect(() => {
    if (!activeSessionId) {
      setMessages([]);
      return;
    }
    const fetchMessages = async () => {
      try {
        const res = await api.get(
          `/chat-session/session/${activeSessionId}/message?userId=${user.id}`
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Lỗi khi tải tin nhắn:", err);
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [activeSessionId, user.id]);

  // Các effect khác không đổi
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeSessionId]);

  // Handler MỚI để chọn session
  const handleSelectSession = (sessionId) => {
    setActiveSessionId(sessionId);
  };

  // Handler gửi tin nhắn được cập nhật để dùng `activeSessionId`
  const handleSend = async () => {
     if (!newMsg.trim() || !activeSessionId) return;
    
    setIsSending(true);
    const messagePayload = {
      senderId: user.id,
      message: newMsg.trim(),
      createdAt: new Date().toISOString(), 
    };
    try {
      setMessages((prev) => [...prev, messagePayload]);
      setNewMsg("");
      await api.post(`/chat-session/session/${activeSessionId}/message`, {
        message: messagePayload.message,
      });
    } catch (err) {
      antMessage.error("Gửi tin nhắn thất bại.");
      setMessages((prev) => prev.filter(msg => msg.createdAt !== messagePayload.createdAt));
    } finally {
      setIsSending(false);
    }
  };

  // ---- PHẦN RENDER (return) ĐƯỢC VIẾT LẠI HOÀN TOÀN ----
  if (isLoading) {
    return <div className="p-4 text-center pt-24">Đang tải dữ liệu...</div>;
  }
  if (error) {
    return <div className="p-4 text-center pt-24 text-red-600">{error}</div>;
  }
  
  const isCoach = user.role === "COACH";

  return (
    <div className="pt-16 h-screen flex flex-col">
      {isCoach ? (
        // Giao diện cho Coach (dùng SessionList và ChatWindow)
        <div className="flex flex-1 w-full h-full overflow-hidden">
          <SessionList 
            sessions={allSessions}
            activeSessionId={activeSessionId}
            onSelectSession={handleSelectSession}
          />
          <div className="flex-1 flex flex-col h-full">
            {activeSessionId ? (
               <ChatWindow
                  messages={messages}
                  user={user}
                  handleSend={handleSend}
                  newMsg={newMsg}
                  setNewMsg={setNewMsg}
                  isSending={isSending}
                  inputRef={inputRef}
                  messageEndRef={messageEndRef}
                />
            ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                    <p>Vui lòng chọn một cuộc trò chuyện để bắt đầu.</p>
                </div>
            )}
          </div>
        </div>
      ) : (
        // Giao diện cho User (chỉ dùng ChatWindow)
        <div className="max-w-xl mx-auto w-full flex-1 flex flex-col">
          <ChatWindow
            messages={messages}
            user={user}
            handleSend={handleSend}
            newMsg={newMsg}
            setNewMsg={setNewMsg}
            isSending={isSending}
            inputRef={inputRef}
            messageEndRef={messageEndRef}
          />
        </div>
      )}
    </div>
  );
};

export default ChatPage;