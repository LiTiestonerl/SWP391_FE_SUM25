import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import api from "../../../configs/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageAachiement = () => {
  const [badges, setBadges] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBadge, setCurrentBadge] = useState({
    badgeId: "",
    badgeName: "",
    description: "",
    criteria: "",
    badgeType: ""
  });

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const res = await api.get("/achievement-badge");
      setBadges(res.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách huy hiệu:", error);
      toast.error("Không thể tải danh sách huy hiệu.");
    }
  };

  const handleEdit = async (badge) => {
    try {
      const res = await api.get(`/achievement-badge/${badge.badgeId}`);
      setCurrentBadge(res.data);
      setIsEditing(true);
    } catch (error) {
      console.error("Lỗi khi lấy huy hiệu:", error);
      toast.error("Không thể lấy dữ liệu huy hiệu.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa huy hiệu này không?")) return;
    try {
      await api.delete(`/achievement-badge/${id}`);
      toast.success("Xóa huy hiệu thành công!");
      fetchBadges();
    } catch (error) {
      console.error("Lỗi khi xóa huy hiệu:", error);
      toast.error("Không thể xóa huy hiệu.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        badgeName: currentBadge.badgeName,
        description: currentBadge.description,
        criteria: currentBadge.criteria,
        badgeType: currentBadge.badgeType
      };

      if (isEditing) {
        await api.put(`/achievement-badge/${currentBadge.badgeId}`, payload);
        toast.success("Cập nhật huy hiệu thành công!");
      } else {
        await api.post("/achievement-badge", payload);
        toast.success("Tạo huy hiệu thành công!");
      }

      setCurrentBadge({
        badgeId: "",
        badgeName: "",
        description: "",
        criteria: "",
        badgeType: ""
      });
      setIsEditing(false);
      fetchBadges();
    } catch (error) {
      console.error("Lỗi khi lưu huy hiệu:", error);
      toast.error("Không thể lưu huy hiệu.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Badge Management</h1>
          <p className="text-xl text-gray-600">Create and manage achievement badges</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Badge Name</label>
              <input
                type="text"
                value={currentBadge.badgeName}
                onChange={(e) =>
                  setCurrentBadge({ ...currentBadge, badgeName: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={currentBadge.description}
                onChange={(e) =>
                  setCurrentBadge({ ...currentBadge, description: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Criteria</label>
              <textarea
                value={currentBadge.criteria}
                onChange={(e) =>
                  setCurrentBadge({ ...currentBadge, criteria: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Badge Type</label>
              <input
                type="text"
                value={currentBadge.badgeType}
                onChange={(e) =>
                  setCurrentBadge({ ...currentBadge, badgeType: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
              >
                {isEditing ? "Update Badge" : "Create Badge"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setCurrentBadge({
                      badgeId: "",
                      badgeName: "",
                      description: "",
                      criteria: "",
                      badgeType: ""
                    });
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge) => (
            <div key={badge.badgeId} className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{badge.badgeName}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(badge)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(badge.badgeId)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-2">{badge.description}</p>
              <p className="text-sm text-gray-500"><strong>Criteria:</strong> {badge.criteria}</p>
              <p className="text-sm text-gray-500"><strong>Type:</strong> {badge.badgeType}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageAachiement;
