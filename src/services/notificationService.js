import api from "../configs/axios";

// 🧪 Dữ liệu mẫu nếu API fail hoặc thiếu
const mockNotifications = [
  {
    notificationId: -1,
    content: "Welcome to the quit smoking program!",
    notificationType: "WELCOME",
    sendDate: "2025-07-19T10:00:00Z",
    status: "SENT",
    userId: 1
  },
  {
    notificationId: -2,
    content: "Remember to check your quit plan today!",
    notificationType: "REMINDER",
    sendDate: "2025-07-22T09:00:00Z",
    status: "SENT",
    userId: 1
  }
];

/**
 * 📥 Lấy danh sách thông báo người dùng
 */
export const fetchUserNotifications = async () => {
  try {
    const response = await api.get("/notifications/me");
    const realData = response.data || [];

    // Lấy danh sách mock đã bị xóa dựa theo content
    const deletedMockContents = JSON.parse(localStorage.getItem("deletedMockContents") || "[]");

    const missingMock = mockNotifications.filter(
      (mock) =>
        !realData.some((real) => real.content === mock.content) &&
        !deletedMockContents.includes(mock.content)
    );

    return [...realData, ...missingMock];
  } catch (error) {
    console.error("API failed. Using mock notifications", error);
    return mockNotifications;
  }
};

/**
 * ✅ Đánh dấu đã đọc
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    await api.put(`/notifications/${notificationId}/read`);
    return true;
  } catch (error) {
    console.error("Error marking notification as read", error);
    return false;
  }
};

/**
 * 🗑️ Xóa thông báo
 */
export const deleteNotification = async (notificationId, notificationContent) => {
  try {
    if (notificationId < 0) {
      // Xử lý mock: lưu content bị xóa
      const deleted = JSON.parse(localStorage.getItem("deletedMockContents") || "[]");
      const updated = [...new Set([...deleted, notificationContent])];
      localStorage.setItem("deletedMockContents", JSON.stringify(updated));
      return true;
    }

    await api.delete(`/notifications/${notificationId}`);
    return true;
  } catch (error) {
    console.error("Error deleting notification", error);
    return false;
  }
};

/**
 * ➕ Tạo một thông báo mới
 */
export const createNewNotification = async (notificationData) => {
  try {
    const response = await api.post("notifications", {
      ...notificationData,
      status: "SENT"  // Đồng bộ với enum mới
    });
    return response.data;
  } catch (error) {
    console.error("Error creating notification", error);
    return null;
  }
};
