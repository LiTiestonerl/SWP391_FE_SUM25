import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSave } from "react-icons/fa";
import api from "../../../configs/axios";

const nicoteneOptions = ["ZERO", "LOW", "MEDIUM", "HIGH"];
const flavorOptions = [
  "MENTHOL",
  "VANILLA",
  "CHERRY",
  "CHOCOLATE",
  "ORIGINAL",
  "MINT",
];

const AdminRecommendationInterface = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newRecommendation, setNewRecommendation] = useState({
    cigarettePackageName: "",
    cigaretteBrand: "",
    pricePerPack: 0,
    flavor: "",
    nicotineLevel: "ZERO",
    sticksPerPack: 20,
  });

  useEffect(() => {
    const fetchAllPackages = async () => {
      try {
        const res = await api.get("/cigarette-packages");
        setRecommendations(res.data);
      } catch (err) {
        console.error("Lỗi khi load danh sách gói thuốc:", err);
      }
    };
    fetchAllPackages();
  }, []);

  const handleAddRecommendation = async () => {
    try {
      const res = await api.post("/cigarette-packages", newRecommendation);
      setRecommendations([...recommendations, res.data]);
      setNewRecommendation({
        cigarettePackageName: "",
        cigaretteBrand: "",
        pricePerPack: 0,
        flavor: "",
        nicotineLevel: "ZERO",
        sticksPerPack: 20,
      });
    } catch (err) {
      console.error("Lỗi khi thêm mới gói thuốc:", err);
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = async (id) => {
    const updated = recommendations.find((r) => r.cigarettePackageId === id);
    try {
      await api.put(`/cigarette-packages/${id}`, updated);
      setEditingId(null);
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/cigarette-packages/${id}`);
      setRecommendations((prev) =>
        prev.filter((r) => r.cigarettePackageId !== id)
      );
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
    }
  };

  const handleFieldChange = (id, field, value) => {
    setRecommendations((prev) =>
      prev.map((item) =>
        item.cigarettePackageId === id ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <h2 className="text-2xl font-bold mb-2">Cigarette Package</h2>
          <p className="opacity-90">Manage cigarette package recommendations</p>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Add New Package</h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <input
                type="text"
                placeholder="Cigarette Name"
                className="p-2 border rounded"
                value={newRecommendation.cigarettePackageName}
                onChange={(e) =>
                  setNewRecommendation({
                    ...newRecommendation,
                    cigarettePackageName: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Brand"
                className="p-2 border rounded"
                value={newRecommendation.cigaretteBrand}
                onChange={(e) =>
                  setNewRecommendation({
                    ...newRecommendation,
                    cigaretteBrand: e.target.value,
                  })
                }
              />
              <input
                type="number"
                placeholder="Price"
                className="p-2 border rounded"
                value={
                  newRecommendation.pricePerPack === 0
                    ? ""
                    : newRecommendation.pricePerPack
                }
                onChange={(e) =>
                  setNewRecommendation({
                    ...newRecommendation,
                    pricePerPack: parseFloat(e.target.value) || 0,
                  })
                }
              />

              <input
                type="number"
                placeholder="Sticks"
                className="p-2 border rounded"
                value={
                  newRecommendation.sticksPerPack === 0
                    ? ""
                    : newRecommendation.sticksPerPack
                }
                onChange={(e) =>
                  setNewRecommendation({
                    ...newRecommendation,
                    sticksPerPack: parseInt(e.target.value) || 0,
                  })
                }
              />

              <select
                className="p-2 border rounded"
                value={newRecommendation.flavor}
                onChange={(e) =>
                  setNewRecommendation({
                    ...newRecommendation,
                    flavor: e.target.value,
                  })
                }
              >
                <option value="">Select Flavor</option>
                {flavorOptions.map((flavor) => (
                  <option key={flavor} value={flavor}>
                    {flavor}
                  </option>
                ))}
              </select>
              <select
                className="p-2 border rounded"
                value={newRecommendation.nicotineLevel}
                onChange={(e) =>
                  setNewRecommendation({
                    ...newRecommendation,
                    nicotineLevel: e.target.value,
                  })
                }
              >
                {nicoteneOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <button
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600 col-span-2"
                onClick={handleAddRecommendation}
              >
                Add
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "ID",
                    "Name",
                    "Brand",
                    "Price",
                    "Sticks",
                    "Flavor",
                    "Nicotine",
                    "Actions",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recommendations.map((rec) => (
                  <tr key={rec.cigarettePackageId}>
                    <td className="px-6 py-4">{rec.cigarettePackageId}</td>
                    <td className="px-6 py-4">
                      {editingId === rec.cigarettePackageId ? (
                        <input
                          type="text"
                          value={rec.cigarettePackageName}
                          onChange={(e) =>
                            handleFieldChange(
                              rec.cigarettePackageId,
                              "cigarettePackageName",
                              e.target.value
                            )
                          }
                          className="border p-1 rounded w-full"
                        />
                      ) : (
                        rec.cigarettePackageName
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === rec.cigarettePackageId ? (
                        <input
                          type="text"
                          value={rec.cigaretteBrand}
                          onChange={(e) =>
                            handleFieldChange(
                              rec.cigarettePackageId,
                              "cigaretteBrand",
                              e.target.value
                            )
                          }
                          className="border p-1 rounded w-full"
                        />
                      ) : (
                        rec.cigaretteBrand
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === rec.cigarettePackageId ? (
                        <input
                          type="number"
                          value={rec.pricePerPack}
                          onChange={(e) =>
                            handleFieldChange(
                              rec.cigarettePackageId,
                              "pricePerPack",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="border p-1 rounded w-full"
                        />
                      ) : (
                        `$${rec.pricePerPack}`
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === rec.cigarettePackageId ? (
                        <input
                          type="number"
                          value={rec.sticksPerPack}
                          onChange={(e) =>
                            handleFieldChange(
                              rec.cigarettePackageId,
                              "sticksPerPack",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="border p-1 rounded w-full"
                        />
                      ) : (
                        rec.sticksPerPack
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === rec.cigarettePackageId ? (
                        <select
                          value={rec.flavor}
                          onChange={(e) =>
                            handleFieldChange(
                              rec.cigarettePackageId,
                              "flavor",
                              e.target.value
                            )
                          }
                          className="border p-1 rounded w-full"
                        >
                          {flavorOptions.map((f) => (
                            <option key={f} value={f}>
                              {f}
                            </option>
                          ))}
                        </select>
                      ) : (
                        rec.flavor
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === rec.cigarettePackageId ? (
                        <select
                          value={rec.nicotineLevel}
                          onChange={(e) =>
                            handleFieldChange(
                              rec.cigarettePackageId,
                              "nicotineLevel",
                              e.target.value
                            )
                          }
                          className="border p-1 rounded w-full"
                        >
                          {nicoteneOptions.map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      ) : (
                        rec.nicotineLevel
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {editingId === rec.cigarettePackageId ? (
                        <button
                          onClick={() => handleSave(rec.cigarettePackageId)}
                          className="text-green-600 hover:text-green-800 mr-4 inline-flex items-center"
                        >
                          <FaSave className="mr-1" /> Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(rec.cigarettePackageId)}
                          className="text-blue-600 hover:text-blue-800 mr-4 inline-flex items-center"
                        >
                          <FaEdit className="mr-1" /> Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(rec.cigarettePackageId)}
                        className="text-red-600 hover:text-red-800 inline-flex items-center"
                      >
                        <FaTrash className="mr-1" /> Delete
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