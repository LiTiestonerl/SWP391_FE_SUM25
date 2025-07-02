import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Table,
  Switch,
  Space,
  Popconfirm,
} from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../configs/axios";

function Membership() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await api.get("member-packages");
      setData(response.data);
      toast.success("Data fetched successfully!");
    } catch (error) {
      toast.error("Error fetching data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleActive = async (checked, record) => {
    try {
      const updatedData = {
        packageName: record.packageName,
        price: record.price,
        duration: record.duration,
        featuresDescription: record.featuresDescription,
        active: checked,
      };

      await api.put(`member-packages/${record.memberPackageId}`, updatedData);
      toast.success("Status updated successfully!");
      fetchData();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error updating status");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`member-packages/${id}`);
      toast.success("Deleted successfully!");
      await fetchData();
    } catch (error) {
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
    try {
      if (isEditing && editId !== null) {
        await api.put(`member-packages/${editId}`, values);
        toast.success("Membership package updated successfully!");
      } else {
        await api.post("member-packages", values);
        toast.success("Membership package added successfully!");
      }
      form.resetFields();
      setIsOpen(false);
      setIsEditing(false);
      setEditId(null);
      await fetchData();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form");
    }
  };

  const columns = [
    {
      title: "Package Name",
      dataIndex: "packageName",
      key: "packageName",
      filters: [
        { text: "Health", value: "Health" },
        { text: "Health+", value: "Health+" },
        { text: "Others", value: "Others" },
      ],
      onFilter: (value, record) => record.packageName.includes(value),
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
      filters: [
        { text: "Basic tracking", value: "Basic tracking" },
        { text: "Coach support", value: "Coach support" },
      ],
      onFilter: (value, record) =>
        record.featuresDescription.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      render: (_, record) => (
        <Switch
          checked={record.active}
          onChange={(checked) => handleToggleActive(checked, record)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
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

  return (
    <div>
      <h1 className="text-3x1 font-bold underline">Membership Management</h1>
      <Button
        onClick={() => {
          setIsOpen(true);
          setIsEditing(false);
          setEditId(null);
          form.resetFields();
        }}
      >
        Add Membership Package
      </Button>
      <Table dataSource={data} columns={columns} rowKey="memberPackageId" />
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
            label="Duration"
            rules={[{ required: true, message: "Please enter the duration." }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            name="featuresDescription"
            label="Features Description"
            rules={[
              {
                required: true,
                message: "Please enter the features description.",
              },
            ]}
          >
            <Input.TextArea rows={4} />
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
