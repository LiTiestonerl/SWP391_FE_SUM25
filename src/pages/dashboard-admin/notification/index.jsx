import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Typography,
} from "antd";
import api from "../../../configs/axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const { TextArea } = Input;
const { Title } = Typography;
const { Option } = Select;

const CreateNotification = () => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notificationHistory, setNotificationHistory] = useState([]);

  // Lấy danh sách user có role USER
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users"); 
        const filtered = (res.data || []).filter((user) => user.roleName === "USER");
        setUsers(filtered);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách user:", err);
      }
    };
    fetchUsers();
  }, []);

  // Lấy thông báo của current user (chỉ USER gọi được, Admin sẽ 403)
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications/me");
        const arr = Array.isArray(res.data) ? res.data : [];

        // 🧾 Log lịch sử đúng format API (JSON thuần)
        console.groupCollapsed(`🔔 Notification history (API)`);
        console.log(JSON.stringify(arr, null, 2));
        console.groupEnd();

        setNotificationHistory(arr.reverse());
      } catch (err) {
        if (err?.response?.status === 403) {
          console.warn("Admin không có quyền gọi GET /notifications/me");
        } else {
          console.error("Lỗi khi lấy lịch sử thông báo:", err);
        }
      }
    };
    fetchNotifications();
  }, []);

  // map userId -> name
  const userMap = users.reduce((acc, user) => {
    acc[user.userId] = user.fullName || user.userName;
    return acc;
  }, {});

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const payload = {
        userId: values.userId,
        content: (values.content || "").trim(),
        notificationType: String(values.notificationType || "").toUpperCase(),
        // FE chọn giờ local -> chuyển sang ISO UTC để BE lưu chuẩn
        sendDate: values?.sendDate?.toDate
          ? values.sendDate.toDate().toISOString()
          : new Date(values.sendDate).toISOString(),
        status: "SENT",
      };

      const res = await api.post("/notifications", payload);

      if (res.data?.notificationId) {
        message.success("Tạo thông báo thành công!");

        // 🧾 Log item vừa tạo đúng format API
        console.groupCollapsed("✅ Created notification (API)");
        console.log(JSON.stringify(res.data, null, 2));
        console.groupEnd();

        form.resetFields();
        setNotificationHistory((prev) => [res.data, ...prev]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error details:", err?.response?.data || err?.message || err);
      message.error(`Lỗi: ${err?.response?.data?.message || "Không thể tạo thông báo"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <Title level={3} className="text-center mb-6">
        Tạo thông báo mới
      </Title>

      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{ sendDate: dayjs() }}
      >
        <Form.Item
          name="userId"
          label="Người nhận"
          rules={[{ required: true }]}
        >
          <Select placeholder="Chọn người nhận">
            {users.map((user) => (
              <Option key={user.userId} value={user.userId}>
                {user.fullName || user.userName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Loại thông báo"
          name="notificationType"
          rules={[{ required: true, message: "Vui lòng chọn loại thông báo" }]}
        >
          <Select placeholder="Chọn loại">
            <Option value="BADGE">Huy hiệu</Option>
            <Option value="COACH_REPLY">Tin nhắn từ Coach</Option>
            <Option value="COMMUNITY">Cộng đồng</Option>
            <Option value="SYSTEM">Hệ thống</Option>
            <Option value="MOTIVATION">Động lực</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Nội dung thông báo"
          name="content"
          rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
        >
          <TextArea rows={4} placeholder="Nhập nội dung thông báo..." />
        </Form.Item>

        <Form.Item
          label="Ngày gửi"
          name="sendDate"
          rules={[{ required: true, message: "Vui lòng chọn ngày gửi" }]}
        >
          <DatePicker format={"YYYY-MM-DD"} className="w-full" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Gửi thông báo
          </Button>
        </Form.Item>
      </Form>

      <div className="mt-10">
        <Title level={4}>📜 Lịch sử thông báo</Title>
        {notificationHistory.length === 0 ? (
          <p>Chưa có thông báo nào.</p>
        ) : (
          <ul className="space-y-3 max-h-[300px] overflow-y-auto">
            {notificationHistory.map((noti) => (
              <li key={noti.notificationId} className="border rounded p-3">
                <p className="font-semibold">{noti.content}</p>
                <p className="text-sm text-gray-500">
                  {/* Hiển thị giờ VN từ timestamp UTC của BE */}
                  Gửi lúc: {dayjs.utc(noti.sendDate).tz("Asia/Ho_Chi_Minh").format("HH:mm DD/MM/YYYY")}
                </p>
                <p className="text-sm text-gray-500">
                  Người nhận: {userMap[noti.userId] || "Không rõ"} | Loại: {(noti.notificationType || "").replace(/_/g, " ")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CreateNotification;