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
import { format, differenceInDays } from "date-fns";
import api from "../../../configs/axios";

const { Option } = Select;

const statusColors = {
  "health+": "green",
  health: "gold",
  others: "default",
};

const ManageAccount = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [tempRoleId, setTempRoleId] = useState(1073741824);
  const [tempStatus, setTempStatus] = useState("others");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (u) =>
        (filterStatus === "all" || u.complianceStatus === filterStatus) &&
        (u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [users, search, filterStatus]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("admin/users");
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
    try {
      await api.put(`/admin/users/${selectedUser.userId}/update-role-status`, {
        newRoleId: tempRoleId,
        newStatus: tempStatus,
      });
      message.success("Cập nhật thành công!");
      fetchUsers();
      setModalVisible(false);
    } catch (err) {
      message.error("Cập nhật thất bại.");
    }
  };

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Trạng thái",
      dataIndex: "complianceStatus",
      key: "status",
      render: (status) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
    {
      title: "Xác minh lần cuối",
      dataIndex: "lastVerified",
      key: "lastVerified",
      render: (date) => (date ? format(new Date(date), "dd/MM/yyyy") : "N/A"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            className="mr-2"
            onClick={() => {
              setSelectedUser({ ...record, userId: record.userId });
              setTempRoleId(record.roleId || 1073741824);
              setTempStatus(record.complianceStatus || "others");
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
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Tìm kiếm người dùng"
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={filterStatus}
          onChange={(value) => setFilterStatus(value)}
          style={{ width: 150 }}
        >
          <Option value="all">Tất cả</Option>
          <Option value="health+">Health+</Option>
          <Option value="health">Health</Option>
          <Option value="others">Others</Option>
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
              <Option value={1073741824}>User</Option>
              <Option value={1073741825}>Coach</Option>
            </Select>
          </div>

          <div>
            <label className="block mb-1">Trạng thái tuân thủ</label>
            <Select
              className="w-full"
              value={tempStatus}
              onChange={(value) => setTempStatus(value)}
            >
              <Option value="health+">Health+</Option>
              <Option value="health">Health</Option>
              <Option value="others">Others</Option>
            </Select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageAccount;
