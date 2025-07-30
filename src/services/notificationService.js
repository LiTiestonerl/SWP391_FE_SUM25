import api from "../configs/axios";

// 🧪 Dữ liệu mẫu để ghép nếu thiếu
const mockNotifications = [
  {
    notificationId: -1,
    content: "Welcome to the quit smoking program!",
    notificationType: "WELCOME",
    sendDate: "2025-07-19T10:00:00Z",
    status: "UNREAD",
    userId: 1
  },
  {
    notificationId: -2,
    content: "Remember to check your quit plan today!",
    notificationType: "REMINDER",
    sendDate: "2025-07-22T09:00:00Z",
    status: "UNREAD",
    userId: 1
  }
];

/**
 * 📥 Lấy danh sách thông báo người dùng
 */
export const fetchUserNotifications = async (userId) => {
  try {
    const response = await api.get("/notifications/me");
    const realData = response.data || [];

    const missingMock = mockNotifications.filter(
      mock => !realData.some(real => real.content === mock.content)
    );

    return [...realData, ...missingMock];
  } catch (error) {
    console.error("API failed. Using mock notifications", error);
    return mockNotifications.filter(noti => noti.userId === userId);
  }
};

/**
 * ✅ Đánh dấu đã đọc
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    await api.patch(`/notifications/${notificationId}`, { status: "READ" });
    return true;
  } catch (error) {
    console.error("Error marking notification as read", error);
    return false;
  }
};

/**
 * ➕ Tạo một thông báo mới (tạm disable nếu API đang bị 403)
 */
export const createNewNotification = async (notificationData) => {
  try {
    const response = await api.post("/notifications", {
      ...notificationData,
      sendDate: new Date().toISOString(),
      status: "SEND"
    });
    return response.data;
  } catch (error) {
    console.error("Error creating notification", error);
    return null;
  }
};