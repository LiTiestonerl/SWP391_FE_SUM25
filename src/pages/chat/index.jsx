import React, { useEffect, useState, useRef } from "react";
import api from "../../configs/axios";
import { useSelector } from "react-redux";
import { useLocation,useNavigate } from "react-router-dom";
import { message as antMessage } from "antd";
import { format } from "date-fns";


const Avatar = ({ name }) => {
  const initial = name ? name.charAt(0).toUpperCase() : "U";
  return (
    <div className="w-12 h-12 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center mr-3">
      <span className="text-white font-bold text-xl">{initial}</span>
    </div>
  );
};

const SessionList = ({ sessions, activeSessionId, onSelectSession }) => (
  <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 bg-white h-full flex flex-col">
    <div className="p-4 border-b border-gray-200 flex-shrink-0">
      <h3 className="font-bold text-xl text-gray-800">Trò chuyện</h3>
      {/* Có thể thêm ô tìm kiếm ở đây trong tương lai */}
    </div>
    <div className="overflow-y-auto flex-1">
      {sessions.length > 0 ? (
        <ul>
          {sessions.map((session) => (
            <li
              key={session.sessionId}
              onClick={() => onSelectSession(session.sessionId)}
              className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 transition-colors duration-200 border-l-4 ${
                session.sessionId === activeSessionId
                  ? "bg-blue-50 border-blue-500"
                  : "border-transparent"
              }`}
            >
              <Avatar name={session.userName} />
              <div className="flex-1 overflow-hidden">
                <p className="font-semibold text-gray-900 truncate">
                  {session.userName || `User ID: ${session.userId}`}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  Nhấn để xem tin nhắn...
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-4 text-center text-gray-500 h-full flex items-center justify-center">
          <p>Không có cuộc trò chuyện nào.</p>
        </div>
      )}
    </div>
  </div>
);

const ChatHeader = ({ sessionInfo }) => {
  const navigate = useNavigate(); // thêm dòng này để có thể dùng navigate

  if (!sessionInfo) return null;

  return (
    <div className="flex items-center p-3 border-b border-gray-200 bg-white flex-shrink-0">
      <button
        onClick={() => navigate("/")}
        className="mr-4 text-gray-600 hover:text-blue-600 focus:outline-none"
        title="Quay về trang chủ"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <Avatar name={sessionInfo.userName} />
      <div>
        <p className="font-bold text-lg">
          {sessionInfo.userName || `User ID: ${sessionInfo.userId}`}
        </p>
      </div>
    </div>
  );
};


const ChatWindow = ({
  messages,
  user,
  activeSessionInfo,
  handleSend,
  newMsg,
  setNewMsg,
  isSending,
  inputRef,
  messageEndRef,
}) => (
  <div className="flex-1 flex flex-col bg-gray-50 h-full">
    {/* Header của cửa sổ chat */}
    <ChatHeader sessionInfo={activeSessionInfo} />

    {/* Khu vực hiển thị tin nhắn */}
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      {messages.length === 0 ? (
        <p className="text-center text-gray-500">
          Chưa có tin nhắn. Hãy gửi lời chào!
        </p>
      ) : (
        messages.map((msg, idx) => {
          const isOwn = msg.senderId === user.id;
          return (
            <div
              key={idx}
              className={`mb-4 flex items-end ${
                isOwn ? "justify-end" : "justify-start"
              }`}
            >
              {!isOwn && (
                <div className="w-8 h-8 rounded-full bg-gray-300 mr-3 flex-shrink-0 self-start mt-1"></div>
              )}
              <div
                className={`rounded-2xl px-4 py-2 max-w-[70%] shadow-sm ${
                  isOwn
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                }`}
              >
                {!isOwn && (
                  <div className="font-semibold text-sm text-blue-500 mb-1">
                    {msg.senderName ||
                      activeSessionInfo?.userName ||
                      "Đối phương"}
                  </div>
                )}
                <div className="text-left whitespace-pre-wrap">
                  {msg.message}
                </div>
                {msg.createdAt && (
                  <div className="text-[11px] mt-1 opacity-80 text-right">
                    {format(new Date(msg.createdAt), "HH:mm, dd/MM/yy")}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
      <div ref={messageEndRef} />
    </div>

    {/* Khu vực nhập tin nhắn */}
    <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
      <div className="flex items-center bg-gray-100 rounded-full px-2">
        <input
          type="text"
          value={newMsg}
          ref={inputRef}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !isSending) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 bg-transparent px-3 py-3 rounded-l-full focus:outline-none"
          placeholder="Nhập tin nhắn..."
          disabled={isSending}
        />
        <button
          onClick={handleSend}
          disabled={isSending || !newMsg.trim()}
          className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-transform duration-200 transform hover:scale-110"
        >
          {isSending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          )}
        </button>
      </div>
    </div>
  </div>
);

const ChatPage = () => {
  // --- STATE VÀ HOOKS ---
  const user = useSelector((state) => state.user);
  const location = useLocation();

  const [allSessions, setAllSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const messageEndRef = useRef(null);
  const inputRef = useRef(null);

  const isCoach = user.role === "COACH";

  // Effect 1: Khởi tạo, phân luồng logic cho Coach và User
  useEffect(() => {
    if (!user?.id) return;
    const initialize = async () => {
      setIsLoading(true);
      setError(null);
      if (isCoach) {
        // Logic cho Coach
        try {
          const sessionRes = await api.get("/chat-session/coach/session");
          const sessionsFromApi = sessionRes.data;
          const sessionsWithNames = await Promise.all(
            sessionsFromApi.map(async (session) => {
              const partnerId = session.userId;
              try {
                const userRes = await api.get(`/api/users/${partnerId}`);
                const userName = userRes.data.name;
                return {
                  ...session,
                  userName: userName || `User ID: ${partnerId}`,
                };
              } catch (err) {
                console.error(
                  `Không thể lấy thông tin cho user ID: ${partnerId}`,
                  err
                );
                return { ...session, userName: `User ID: ${partnerId}` };
              }
            })
          );
          setAllSessions(sessionsWithNames);
        } catch (err) {
          console.error(
            "Lỗi khi tải danh sách cuộc trò chuyện của Coach:",
            err
          );
          setError("Không thể tải danh sách cuộc trò chuyện.");
        }
      } else {
        // Logic cho User
        const coachIdFromUrl = new URLSearchParams(location.search).get(
          "coachId"
        );
        if (!coachIdFromUrl) {
          setError("URL không hợp lệ, thiếu thông tin Coach.");
          setIsLoading(false);
          return;
        }

        try {
          const res = await api.post(
            `/chat-session/session?coachId=${coachIdFromUrl}`
          );

          const sessionData = res.data;
          setActiveSessionId(sessionData.sessionId);

          setAllSessions([
            {
              sessionId: sessionData.sessionId,
              userName: "Coach", // Tên tạm thời, có thể sửa API để trả về tên thật
              userId: coachIdFromUrl,
            },
          ]);
        } catch (err) {
          console.error("Lỗi khi khởi tạo phiên trò chuyện:", err);
          setError("Không thể khởi tạo hoặc lấy thông tin phiên trò chuyện.");
        }
      }
      setIsLoading(false);
    };
    initialize();
  }, [user, location.search, isCoach]);

  // Effect 2: Lấy tin nhắn khi `activeSessionId` thay đổi
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
    const interval = setInterval(fetchMessages, 3000); // Lấy tin nhắn mới mỗi 3 giây
    return () => clearInterval(interval);
  }, [activeSessionId, user.id]);

  // Effect 3: Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Effect 4: Tự động focus vào ô nhập liệu
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeSessionId]);

  // --- HANDLERS ---

  // Handler chọn session
  const handleSelectSession = (sessionId) => {
    setActiveSessionId(sessionId);
  };

  // Handler gửi tin nhắn
  const handleSend = async () => {
    if (!newMsg.trim() || !activeSessionId) return;

    setIsSending(true);
    // Tin nhắn tạm thời để hiển thị ngay lập tức
    const messagePayload = {
      senderId: user.id,
      message: newMsg.trim(),
      createdAt: new Date().toISOString(),
      senderName: user.name, // Thêm tên người gửi để hiển thị nếu cần
    };

    try {
      setMessages((prev) => [...prev, messagePayload]);
      setNewMsg("");
      // Gửi request lên server
      await api.post(`/chat-session/session/${activeSessionId}/message`, {
        message: messagePayload.message,
      });
    } catch (err) {
      antMessage.error("Gửi tin nhắn thất bại.");
      // Xóa tin nhắn tạm thời nếu gửi thất bại
      setMessages((prev) =>
        prev.filter((msg) => msg.createdAt !== messagePayload.createdAt)
      );
    } finally {
      setIsSending(false);
      // Focus lại vào ô input sau khi gửi
      inputRef.current?.focus();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 text-red-600 font-semibold p-4 text-center">
        {error}
      </div>
    );
  }

  // Lấy thông tin session đang active để truyền xuống ChatWindow
  const activeSessionInfo = allSessions.find(
    (s) => s.sessionId === activeSessionId
  );

  return (
    <div className="pt-16 h-screen flex flex-col bg-gray-100">
      {/* Container chính cho toàn bộ giao diện chat */}
      <div className="flex-1 w-full h-full max-w-7xl mx-auto flex overflow-hidden shadow-xl rounded-lg">
        {isCoach ? (
          // Giao diện cho Coach: Có danh sách session và cửa sổ chat
          <>
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
                  activeSessionInfo={activeSessionInfo} // Truyền thông tin session để hiển thị header
                  handleSend={handleSend}
                  newMsg={newMsg}
                  setNewMsg={setNewMsg}
                  isSending={isSending}
                  inputRef={inputRef}
                  messageEndRef={messageEndRef}
                />
              ) : (
                // Màn hình chờ khi chưa chọn session nào
                <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-gray-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400 mb-4"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <h3 className="text-xl font-medium">Chào mừng, Coach!</h3>
                  <p>Vui lòng chọn một cuộc trò chuyện để bắt đầu.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          // Giao diện cho User: Chỉ có cửa sổ chat
          <div className="w-full flex-1 flex flex-col">
            <ChatWindow
              messages={messages}
              user={user}
              activeSessionInfo={activeSessionInfo} // Đối với User, thông tin này là của Coach
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
    </div>
  );
};

export default ChatPage;
