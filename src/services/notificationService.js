import api from "../configs/axios";

// 🧪 Dữ liệu mẫu chỉ dùng cho dev/test
const mockNotifications = [
  {
    notificationId: 1,
    content: "Welcome to the quit smoking program!",
    notificationType: "WELCOME",
    sendDate: "2025-07-19T10:00:00Z",
    status: "UNREAD",
    userId: 1
  }
];

/**
 * 📥 Lấy danh sách thông báo của user
 */
export const fetchUserNotifications = async (userId) => {
  try {
    const response = await api.get("/notifications/me");
    return response.data;
  } catch (error) {
    console.error("API failed. Using mock notifications", error);
    return mockNotifications.filter(noti => noti.userId === userId);
  }
};

/**
 * ✅ Đánh dấu 1 thông báo đã đọc
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
 * ➕ Tạo một thông báo mới
 */
export const createNewNotification = async (notificationData) => {
  try {
    const response = await api.post("/notifications", {
      ...notificationData,
      sendDate: new Date().toISOString(),
      status: "UNREAD"
    });
    return response.data;
  } catch (error) {
    console.error("Error creating notification", error);
    return null;
  }
};
