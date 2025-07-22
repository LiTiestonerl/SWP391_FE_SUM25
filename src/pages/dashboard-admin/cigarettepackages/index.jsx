import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSave } from "react-icons/fa";
import api from "../../../configs/axios"; // Điều chỉnh nếu sai

const AdminRecommendationInterface = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newRecommendation, setNewRecommendation] = useState({
    cigaretteId: "",
    cigaretteName: "",
    price: 0,
    sticksPerPack: 0,
  });

  useEffect(() => {
    const fetchAllPackages = async () => {
      try {
        const res = await api.get("cigarette-packages");
        setRecommendations(res.data);
      } catch (err) {
        console.error("Lỗi khi load danh sách gói thuốc:", err);
      }
    };
    fetchAllPackages();
  }, []);

  const fetchCigarettePackageById = async (id) => {
    try {
      const res = await api.get(`cigarette-packages/${id}`);
      return res.data;
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết gói thuốc:", err);
      return null;
    }
  };

  const handleEdit = async (id) => {
    const data = await fetchCigarettePackageById(id);
    if (data) {
      setRecommendations((prev) =>
        prev.map((rec) => (rec.cigaretteId === id ? { ...rec, ...data } : rec))
      );
      setEditingId(id);
    }
  };

  const handleSave = async (id) => {
    const updated = recommendations.find((rec) => rec.cigaretteId === id);
    try {
      await api.put(`cigarette-packages/${id}`, updated);
      setEditingId(null);
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
    }
  };

  const handleDelete = (id) => {
    setRecommendations((prev) => prev.filter((rec) => rec.cigaretteId !== id));
  };

  const handleAddRecommendation = async () => {
    try {
      const payload = {
        ...newRecommendation,
        cigaretteId: Date.now(), // Nếu BE tự sinh ID thì xóa dòng này
      };
      const res = await api.post("cigarette-packages", payload);
      setRecommendations([...recommendations, res.data]);
      setNewRecommendation({
        cigaretteId: "",
        cigaretteName: "",
        price: 0,
        sticksPerPack: 0,
      });
    } catch (err) {
      console.error("Lỗi khi thêm mới gói thuốc:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <h2 className="text-2xl font-bold mb-2">
            Admin Recommendation Dashboard
          </h2>
          <p className="opacity-90">Manage cigarette package recommendations</p>
        </div>

        <div className="p-8">
          {/* Thêm mới */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">
              Add New Recommendation
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <input
                type="text"
                placeholder="Cigarette Name"
                className="p-2 border rounded"
                value={newRecommendation.cigaretteName}
                onChange={(e) =>
                  setNewRecommendation({
                    ...newRecommendation,
                    cigaretteName: e.target.value,
                  })
                }
              />
              <input
                type="number"
                placeholder="Price"
                className="p-2 border rounded"
                value={newRecommendation.price}
                onChange={(e) =>
                  setNewRecommendation({
                    ...newRecommendation,
                    price: parseFloat(e.target.value),
                  })
                }
              />
              <input
                type="number"
                placeholder="Sticks Per Pack"
                className="p-2 border rounded"
                value={newRecommendation.sticksPerPack}
                onChange={(e) =>
                  setNewRecommendation({
                    ...newRecommendation,
                    sticksPerPack: parseInt(e.target.value),
                  })
                }
              />
              <button
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                onClick={handleAddRecommendation}
              >
                Add Recommendation
              </button>
            </div>
          </div>

          {/* Danh sách */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["ID", "Name", "Price", "Sticks", "Actions"].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recommendations.map((rec) => (
                  <tr key={rec.cigaretteId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {rec.cigaretteId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === rec.cigaretteId ? (
                        <input
                          type="text"
                          className="border rounded p-1"
                          value={rec.cigaretteName}
                          onChange={(e) =>
                            setRecommendations((prev) =>
                              prev.map((item) =>
                                item.cigaretteId === rec.cigaretteId
                                  ? { ...item, cigaretteName: e.target.value }
                                  : item
                              )
                            )
                          }
                        />
                      ) : (
                        rec.cigaretteName
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === rec.cigaretteId ? (
                        <input
                          type="number"
                          className="border rounded p-1 w-20"
                          value={rec.price}
                          onChange={(e) =>
                            setRecommendations((prev) =>
                              prev.map((item) =>
                                item.cigaretteId === rec.cigaretteId
                                  ? {
                                      ...item,
                                      price: parseFloat(e.target.value),
                                    }
                                  : item
                              )
                            )
                          }
                        />
                      ) : (
                        `$${rec.price}`
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {rec.sticksPerPack}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingId === rec.cigaretteId ? (
                        <button
                          onClick={() => handleSave(rec.cigaretteId)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          <FaSave className="inline" /> Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(rec.cigaretteId)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FaEdit className="inline" /> Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(rec.cigaretteId)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash className="inline" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const CigarettePackages = () => {
  const [isAdmin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      {isAdmin ? <AdminRecommendationInterface /> : <div>Access Denied</div>}
    </div>
  );
};

export default CigarettePackages;