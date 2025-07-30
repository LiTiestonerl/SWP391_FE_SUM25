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
        const filtered = res.data.filter((user) => user.roleName === "USER");
        setUsers(filtered);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách user:", err);
      }
    };
    fetchUsers();
  }, []);

  // Lấy lịch sử thông báo của admin
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications/me");
        setNotificationHistory(res.data.reverse());
      } catch (err) {
        console.error("Lỗi khi lấy lịch sử thông báo:", err);
      }
    };
    fetchNotifications();
  }, []);

  // Tạo map userId → tên để hiển thị
  const userMap = users.reduce((acc, user) => {
    acc[user.userId] = user.fullName || user.userName;
    return acc;
  }, {});

  const onFinish = async (values) => {
    const selectedDate = values.sendDate;
    const now = dayjs();

    if (selectedDate.isBefore(now)) {
      message.error("Không thể gửi thông báo trong quá khứ!");
      return;
    }

    if (selectedDate.diff(now, "day") > 30) {
      message.error("Chỉ được chọn ngày trong vòng 30 ngày tới.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...values,
        sendDate: selectedDate.toISOString(),
        status: "unread",
      };

      const res = await api.post("/notifications", payload);

      if (res.data?.notificationId) {
        message.success("Tạo thông báo thành công!");
        form.resetFields();
        setNotificationHistory((prev) => [res.data, ...prev]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error details:", err.response?.data || err.message);
      message.error(
        `Lỗi: ${err.response?.data?.message || "Không thể tạo thông báo"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <Title level={3} className="text-center mb-6">
        Tạo thông báo mới
      </Title>

      <Form layout="vertical" form={form} onFinish={onFinish}>
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
            <Option value="badge">Huy hiệu</Option>
            <Option value="coach_reply">Tư vấn</Option>
            <Option value="community">Cộng đồng</Option>
            <Option value="system">Hệ thống</Option>
            <Option value="motivation">Động lực</Option>
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
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            className="w-full"
            disabledDate={(current) =>
              current && (current < dayjs().startOf("day") || current > dayjs().add(30, "day"))
            }
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Gửi thông báo
          </Button>
        </Form.Item>
      </Form>

      {/* Lịch sử thông báo */}
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
                  Gửi lúc: {dayjs(noti.sendDate).format("HH:mm DD/MM/YYYY")}
                </p>
                <p className="text-sm text-gray-500">
                  Người nhận: {userMap[noti.userId] || "Không rõ"} | Loại:{" "}
                  {noti.notificationType}
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
