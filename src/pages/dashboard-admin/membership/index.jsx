import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Table,
  Space,
  Popconfirm,
} from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import api from "../../../configs/axios";

function Membership() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hiddenPackages, setHiddenPackages] = useState([]);

  const fetchData = async () => {
    try {
      const response = await api.get("/member-packages");
      const list = response.data || [];

      const validPlans = await Promise.all(
        list.map(async (pkg) => {
          const created = dayjs(pkg.createdAt);
          const expireDate = created.add(pkg.duration, "day");
          const now = dayjs();

          if (expireDate.isBefore(now)) {
            try {
              await api.delete(`/member-packages/${pkg.memberPackageId}`);
              console.log(` Deleted expired package: ${pkg.packageName}`);
            } catch (err) {
              console.error(" Failed to delete expired package:", err);
            }
            return null;
          }

          return pkg;
        })
      );

      const filtered = validPlans.filter(Boolean);
      setData(filtered);
      toast.dismiss();
      toast.success("Data fetched successfully!");
    } catch (error) {
      toast.dismiss();
      toast.error("Error fetching data");
    }
  };
useEffect(() => {
  fetchData();

  // Load hidden packages from localStorage
  const stored = localStorage.getItem("hiddenPackages");
  if (stored) {
    try {
      setHiddenPackages(JSON.parse(stored));
    } catch {
      localStorage.removeItem("hiddenPackages"); // Nếu lỗi thì reset
    }
  }
}, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`member-packages/${id}`);
      toast.dismiss();
      toast.success("Deleted successfully!");
      await fetchData();
    } catch (error) {
      toast.dismiss();
      toast.error("Delete failed!");
    }
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setEditId(record.memberPackageId);
    setIsOpen(true);
    form.setFieldsValue(record);
  };

  const onFinish = async (values) => {
    if (values.featuresDescription) {
      values.featuresDescription = values.featuresDescription
        .replace(/\. /g, ".\n")
        .replace(/; /g, ";\n");
    }

    try {
      if (isEditing && editId !== null) {
        await api.put(`member-packages/${editId}`, values);
        toast.dismiss();
        toast.success("Membership package updated successfully!");
      } else {
        await api.post("member-packages", values);
        toast.dismiss();
        toast.success("Membership package added successfully!");
      }
      form.resetFields();
      setIsOpen(false);
      setIsEditing(false);
      setEditId(null);
      await fetchData();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.dismiss();
      toast.error("Failed to submit form");
    }
  };

  const columns = [
    {
      title: "Package Name",
      dataIndex: "packageName",
      key: "packageName",
      sorter: (a, b) => a.packageName.localeCompare(b.packageName),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Duration (days)",
      dataIndex: "duration",
      key: "duration",
      sorter: (a, b) => a.duration - b.duration,
    },
    {
      title: "Features Description",
      dataIndex: "featuresDescription",
      key: "featuresDescription",
      render: (text) =>
        text ? (
          <ul
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              maxWidth: 800,
              lineHeight: 1.6,
              padding: "6px 0",
              margin: 0,
            }}
          >
            {text.split(/(?<=[.!?])\s+/).map((line, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>✅</span>
                <span>{line.trim()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <i style={{ color: "gray" }}>No description</i>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="dashed" onClick={() => handleHide(record)}>
            Hide
          </Button>
          <Popconfirm
            title="Are you sure to delete this package?"
            onConfirm={() => handleDelete(record.memberPackageId)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredData = data
    .filter((item) => !hiddenPackages.includes(item.memberPackageId))
    .filter((item) =>
      item.packageName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleHide = (record) => {
  const updated = [...hiddenPackages, record.memberPackageId];
  setHiddenPackages(updated);
  localStorage.setItem("hiddenPackages", JSON.stringify(updated)); // ⬅️ Lưu lại

  toast.info(
    `"${record.packageName}" đã bị ẩn. Gói này sẽ tự hiện lại sau 30 phút.`
  );

  setTimeout(() => {
    Modal.confirm({
      title: `Xóa gói "${record.packageName}"?`,
      content: "Gói đã bị ẩn 30 phút. Bạn có muốn xóa vĩnh viễn không?",
      okText: "Xóa",
      cancelText: "Giữ lại",
      onOk: () => handleDelete(record.memberPackageId),
      onCancel: () => handleUnhide(record.memberPackageId),
    });
  }, 30 * 60 * 1000);
};


  const handleUnhide = (id) => {
  const updated = hiddenPackages.filter((pkgId) => pkgId !== id);
  setHiddenPackages(updated);
  localStorage.setItem("hiddenPackages", JSON.stringify(updated)); // ⬅️ Cập nhật lại storage
  toast.success("Đã hiện lại gói.");
};


  return (
    <div style={{ padding: "20px" }}>
      <h1 className="text-3xl font-bold underline mb-4">
        Membership Management
      </h1>
      <div className="flex justify-between items-center mb-2">
        <Input.Search
          placeholder="Search by package name"
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
        <div className="text-red-500 text-sm font-medium">
          Lưu ý: ẩn 30 phút trước khi xóa
        </div>
        <Button
          type="primary"
          onClick={() => {
            setIsOpen(true);
            setIsEditing(false);
            setEditId(null);
            form.resetFields();
          }}
        >
          Add Membership Package
        </Button>
      </div>

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="memberPackageId"
        scroll={{ x: "max-content" }}
      />
      {hiddenPackages.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3 className="text-lg font-semibold mb-2">Gói đang bị ẩn:</h3>
          <ul>
            {data
              .filter((pkg) => hiddenPackages.includes(pkg.memberPackageId))
              .map((pkg) => (
                <li key={pkg.memberPackageId} style={{ marginBottom: 8 }}>
                  <span className="mr-2">{pkg.packageName}</span>
                  <Button
                    size="small"
                    onClick={() => handleUnhide(pkg.memberPackageId)}
                  >
                    Hiện lại
                  </Button>
                </li>
              ))}
          </ul>
        </div>
      )}

      <Modal
        open={isOpen}
        onCancel={() => {
          setIsOpen(false);
          setIsEditing(false);
          setEditId(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        title={isEditing ? "Edit Package" : "Add New Package"}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            packageName: "",
            price: 0,
            duration: 1073741824,
            featuresDescription: "",
          }}
        >
          <Form.Item
            name="packageName"
            label="Package Name"
            rules={[
              { required: true, message: "Please enter the package name." },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter the price." }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Duration (days)"
            rules={[{ required: true, message: "Please enter the duration." }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            name="featuresDescription"
            label="Features Description"
            rules={[{ required: true, message: "Please enter features." }]}
          >
            <Input.TextArea
              rows={6}
              placeholder="Viết mỗi dòng 1 tính năng, hoặc dùng dấu chấm hoặc chấm phẩy để tự xuống dòng."
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditing ? "Update" : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Membership;
