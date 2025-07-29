import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Modal,
  Select,
  Tag,
  Popconfirm,
  message,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios";

const { Option } = Select;

const statusColors = {
  active: "green",
  inactive: "volcano",
  HEALTH: "gold",
  "HEALTH+": "green",
  OTHER: "default",
};

const ManageAccount = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [tempRoleId, setTempRoleId] = useState("");
  const [tempStatus, setTempStatus] = useState("inactive");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (u) =>
        (filterStatus === "all" || u.status === filterStatus) &&
        (u.userName?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [users, search, filterStatus]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      message.error("Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter((u) => u.userId !== userId));
      message.success("Đã xóa người dùng.");
    } catch (err) {
      message.error("Lỗi khi xóa người dùng.");
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || !selectedUser.userId) {
      message.error("Không tìm thấy người dùng cần cập nhật.");
      return;
    }

    if (!tempRoleId || !tempStatus) {
      message.error("Vui lòng chọn đầy đủ vai trò và trạng thái.");
      return;
    }

    try {
      const res = await api.put(
        `/admin/users/${selectedUser.userId}/update-role-status`,
        {
          newRoleId: tempRoleId,
          newStatus: tempStatus,
        }
      );

      if (res.status === 200) {
        message.success("Cập nhật vai trò và trạng thái thành công!");
        fetchUsers();
        setModalVisible(false);
      } else {
        message.error("Cập nhật thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      const backendError = err.response?.data;
      console.error("Lỗi chi tiết từ backend:", err);
      message.error(
        backendError?.message ||
          backendError?.error ||
          "Cập nhật thất bại do lỗi không xác định."
      );
    }
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
    {
      title: "Vai trò",
      dataIndex: "roleName",
      key: "roleName",
      render: (role) => role || "Không rõ",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => {
        if (record.roleName === "ADMIN") return null;
        return (
          <>
            <Button
              icon={<EditOutlined />}
              className="mr-2"
              onClick={() => {
                setSelectedUser({ ...record });
                setTempRoleId(record.roleId);
                setTempStatus(record.status || "inactive");
                setModalVisible(true);
              }}
            />
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa người dùng này?"
              onConfirm={() => handleDelete(record.userId)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </>
        );
      },
    },
  ];

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Tìm kiếm theo Username hoặc Email"
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          className="w-60"
          value={filterStatus}
          onChange={(value) => setFilterStatus(value)}
        >
          <Option value="all">Tất cả</Option>
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="userId"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Cập nhật người dùng"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleUpdateRole}
        okText="Lưu thay đổi"
      >
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Vai trò</label>
            <Select
              className="w-full"
              value={tempRoleId}
              onChange={(value) => setTempRoleId(value)}
            >
              <Option value={1}>User</Option>
              <Option value={2}>Coach</Option>
            </Select>
          </div>

          <div>
            <label className="block mb-1">Trạng thái tài khoản</label>
            <Select
              className="w-full"
              value={tempStatus}
              onChange={(value) => setTempStatus(value)}
            >
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageAccount;