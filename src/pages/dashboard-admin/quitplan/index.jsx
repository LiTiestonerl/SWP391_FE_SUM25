import React, { useEffect, useState } from "react";
import {
    Table,
    Input,
    Button,
    Tag,
    Modal,
    Popconfirm,
    message,
    Select,
    Spin,
    Divider
} from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import api from "../../../configs/axios";
import dayjs from "dayjs";

const { Option } = Select;

const QuitPlanAdmin = () => {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [plans, setPlans] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingPlans, setLoadingPlans] = useState(false);

    // Fetch danh sách user
    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const res = await api.get("/admin/users");
            setUsers(res.data || []);
        } catch (err) {
            message.error("Lỗi khi tải danh sách người dùng.");
        } finally {
            setLoadingUsers(false);
        }
    };

    // Fetch kế hoạch của user được chọn
    const fetchPlans = async (userId) => {
        setLoadingPlans(true);
        try {
            const res = await api.get(`/quit-plan/user/${userId}`);
            setPlans(res.data || []);
        } catch (err) {
            message.error("Không thể tải kế hoạch cho người dùng này.");
        } finally {
            setLoadingPlans(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSelectUser = (userId) => {
        setSelectedUserId(userId);
        fetchPlans(userId);
    };

    const handleDelete = async (planId, userId) => {
        try {
            await api.delete(`/quit-plan/${planId}/user/${userId}`);
            message.success("Xoá kế hoạch thành công!");
            fetchPlans(userId);
        } catch (err) {
            message.error("Xoá kế hoạch thất bại.");
        }
    };

    const handleUpdateStatus = async (planId, type) => {
        try {
            const endpoint =
                type === "complete"
                    ? `/quit-plan/${planId}/complete`
                    : `/quit-plan/${planId}/cancel?reason=Admin cancelled`;
            await api.put(endpoint);
            message.success(
                type === "complete" ? "Đã đánh dấu hoàn thành." : "Đã huỷ kế hoạch."
            );
            fetchPlans(selectedUserId);
        } catch (err) {
            message.error("Không thể cập nhật trạng thái.");
        }
    };

    const filteredPlans = plans.filter((p) =>
        p.title?.toLowerCase().includes(search.toLowerCase())
    );

    const columns = [
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Bắt đầu",
            dataIndex: "startDate",
            key: "startDate",
            render: (date) => dayjs(date).format("YYYY-MM-DD"),
        },
        {
            title: "Kết thúc",
            dataIndex: "expectedEndDate",
            key: "expectedEndDate",
            render: (date) => dayjs(date).format("YYYY-MM-DD"),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                const colorMap = {
                    IN_PROGRESS: "blue",
                    COMPLETED: "green",
                    CANCELED: "volcano",
                };
                return (
                    <Tag color={colorMap[status]} className="rounded-full px-2 py-1 text-sm">
                        {status}
                    </Tag>
                );
            },
        },
        {
            title: "Thao tác",
            key: "actions",
            render: (_, record) => {
                const allowUpdate = record.status === "IN_PROGRESS";
                return (
                    <>
                        <Button
                            icon={<EyeOutlined />}
                            onClick={() => {
                                setSelectedPlan(record);
                                setDetailModalVisible(true);
                            }}
                            className="mr-2"
                        >
                            Xem
                        </Button>
                        {allowUpdate && (
                            <Select
                                defaultValue=""
                                style={{ width: 120 }}
                                onChange={(value) =>
                                    handleUpdateStatus(record.planId, value)
                                }
                            >
                                <Option value="" disabled>
                                    Đổi trạng thái
                                </Option>
                                <Option value="complete">Hoàn thành</Option>
                                <Option value="cancel">Huỷ</Option>
                            </Select>
                        )}
                        <Popconfirm
                            title="Bạn có chắc chắn muốn xoá kế hoạch này?"
                            onConfirm={() => handleDelete(record.planId, record.userId)}
                            okText="Xoá"
                            cancelText="Hủy"
                        >
                            <Button danger style={{ marginLeft: 10 }}>
                                Xoá
                            </Button>
                        </Popconfirm>
                    </>
                );
            },
        },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Quản lý Kế hoạch Cai thuốc</h1>

            {loadingUsers ? (
                <Spin />
            ) : (
                <Select
                    showSearch
                    placeholder="Chọn người dùng"
                    style={{ width: 300, marginBottom: 16 }}
                    optionFilterProp="children"
                    onChange={handleSelectUser}
                    filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                    }
                    options={users.map((u) => ({
                        value: u.userId,
                        label: `${u.fullName} (${u.email})`,
                    }))}
                />
            )}

            {selectedUserId && (
                <>
                    <Input
                        placeholder="Tìm kế hoạch theo tiêu đề"
                        prefix={<SearchOutlined />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: 300, marginBottom: 16 }}
                        allowClear
                    />

                    <Table
                        dataSource={filteredPlans}
                        columns={columns}
                        rowKey="planId"
                        loading={loadingPlans}
                    />
                </>
            )}

            <Modal
                title="Chi tiết kế hoạch"
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={null}
                width={700}
            >
                {selectedPlan && (
                    <div className="space-y-2">
                        <p><strong>Tiêu đề:</strong> {selectedPlan.title}</p>
                        <p><strong>Bắt đầu:</strong> {dayjs(selectedPlan.startDate).format("YYYY-MM-DD")}</p>
                        <p><strong>Kết thúc:</strong> {dayjs(selectedPlan.expectedEndDate).format("YYYY-MM-DD")}</p>
                        <p><strong>Trạng thái:</strong> <Tag color="blue">{selectedPlan.status}</Tag></p>
                        <p><strong>Lý do:</strong> {selectedPlan.reason}</p>
                        <p><strong>Ghi chú:</strong> {selectedPlan.customNotes}</p>
                        <p><strong>Mô tả giai đoạn:</strong> {selectedPlan.stagesDescription}</p>

                        {/* Gợi ý gói thuốc */}
                        <Divider />
                        <h3 style={{ fontWeight: "bold" }}>🚬 Gợi ý thay thế thuốc lá</h3>

                        {selectedPlan.fromPackageId && selectedPlan.toPackageId && (
                            <p>
                                🔁 Gợi ý thay đổi từ{" "}
                                <Tag color="red">{selectedPlan.fromPackageId}</Tag>{" "}
                                → <Tag color="green">{selectedPlan.toPackageId}</Tag>
                            </p>
                        )}

                        {selectedPlan.recommendationNotes && (
                            <p>
                                📌 <i>{selectedPlan.recommendationNotes}</i>
                            </p>
                        )}

                        {selectedPlan.nicotineSuggestions?.length > 0 ? (
                            selectedPlan.nicotineSuggestions.map((sug, idx) => (
                                <div key={idx} style={{ border: "1px solid #eee", padding: 10, borderRadius: 8, marginBottom: 10 }}>
                                    <p><b>{sug.cigaretteName}</b> – {sug.brand}</p>
                                    <p>Vị: {sug.flavor} | Nicotine: {sug.nicoteneStrength} ({sug.nicotineMg}mg)</p>
                                    <p>{sug.sticksPerPack} điếu/gói – Giá: {sug.price.toLocaleString()}₫</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Không có gợi ý gói thuốc nào.</p>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default QuitPlanAdmin;
