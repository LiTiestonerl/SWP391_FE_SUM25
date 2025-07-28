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

  // ❗API này chỉ gọi được khi người đăng nhập là ADMIN
  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users"); // 👈 backend yêu cầu role ADMIN
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách người dùng:", err);
      message.error("Không thể tải danh sách người dùng.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const payload = {
        content: values.content,
        notificationType: values.notificationType,
        sendDate: values.sendDate.toISOString(),
        status: "unread", // default khi tạo
        userId: values.userId,
      };

      const res = await api.post("/notifications", payload); // ✅ Endpoint đúng, role ADMIN mới được gọi
      message.success("Tạo thông báo thành công!");
      form.resetFields();
    } catch (err) {
      console.error("Lỗi khi gửi thông báo:", err);
      message.error("Không thể tạo thông báo. Đảm bảo bạn là admin.");
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
          label="Người nhận"
          name="userId"
          rules={[{ required: true, message: "Vui lòng chọn người nhận" }]}
        >
          <Select placeholder="Chọn user">
            {users.map((user) => (
              <Option key={user.userId} value={user.userId}>
                {user.userName} ({user.email})
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
            <Option value="motivati on">Động lực</Option>
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
            defaultValue={dayjs()}
            className="w-full"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Gửi thông báo
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateNotification;
