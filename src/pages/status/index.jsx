import React, { useState, useEffect } from "react";
import {
  FiDollarSign,
  FiEdit2,
  FiTrendingDown,
  FiPackage,
  FiCalendar,
} from "react-icons/fi";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import api from "../../configs/axios";

const StatusPage = () => {
  const persistedRoot = JSON.parse(localStorage.getItem("persist:root"));
  const user = JSON.parse(persistedRoot.user);
  const userId = user.id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    cigarettesPerDay: "",
    pricePerPack: "",
    packageId: "",
    frequency: "daily",
    preferredFlavor: "",
    preferredNicotineLevel: "",
    recordDate: new Date().toISOString().split("T")[0],
  });
  const [userData, setUserData] = useState(null);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("smokingStatus");
    if (saved) {
      setUserData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.get("/cigarette-packages");
        if (Array.isArray(res.data)) setPackages(res.data);
      } catch (err) {
        console.error("Package API error:", err);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchStatus = async () => {
      try {
        const listRes = await api.get("/smoking-status");
        const matched = listRes.data.find((s) => s.userId === userId);
        if (matched) {
          const detail = await api.get(`/smoking-status/${matched.statusId}`);
          setUserData(detail.data);
          localStorage.setItem("smokingStatus", JSON.stringify(detail.data));
        }
      } catch (err) {
        console.error("Status API error:", err);
      }
    };
    fetchStatus();
  }, [userId]);

  const chartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Cigarettes per Day",
        data: [20, 15, 10, 5],
        borderColor: "#4F46E5",
        tension: 0.4,
      },
    ],
  };

  const handleEdit = () => {
    if (userData) {
      setFormData({
        cigarettesPerDay: userData.cigarettesPerDay || "",
        pricePerPack: userData.pricePerPack || "",
        packageId: userData.packageId || "",
        frequency: userData.frequency || "daily",
        preferredFlavor: userData.preferredFlavor || "",
        preferredNicotineLevel: userData.preferredNicotineLevel || "",
        recordDate:
          userData.recordDate || new Date().toISOString().split("T")[0],
      });
    }
    setIsModalOpen(true);
  };

  const handleCreate = async () => {
    try {
      const cigarettesPerDay = Number(formData.cigarettesPerDay);
      const pricePerPack = Number(formData.pricePerPack);
      const packageId = Number(formData.packageId);
      const {
        frequency,
        preferredFlavor,
        preferredNicotineLevel,
        recordDate,
      } = formData;

      if (!cigarettesPerDay || cigarettesPerDay < 1 || cigarettesPerDay > 200) {
        alert("Cigarettes per day must be between 1 and 200");
        return;
      }

      if (!pricePerPack || pricePerPack < 1000) {
        alert("Price per pack must be greater than 1000");
        return;
      }

      if (!packageId) {
        alert("Please select a valid cigarette package");
        return;
      }

      const data = {
        userId,
        cigarettesPerDay,
        pricePerPack,
        packageId,
        frequency,
        preferredFlavor,
        preferredNicotineLevel,
        recordDate,
      };

      const res = await api.post("/smoking-status", data);
      alert("Status created successfully!");
      setUserData(res.data);
      localStorage.setItem("smokingStatus", JSON.stringify(res.data));
      setIsModalOpen(false);
    } catch (err) {
      console.error("Creation failed", err.response?.status, err.response?.data);
      alert(`Create failed: ${err.response?.data?.message || "Unknown error"}`);
    }
  };

  const handleUpdate = async () => {
    try {
      const updated = {
        ...userData,
        ...formData,
      };
      await api.put(`/smoking-status/${userData.statusId}`, updated);
      const res = await api.get(`/smoking-status/${userData.statusId}`);
      setUserData(res.data);
      localStorage.setItem("smokingStatus", JSON.stringify(res.data));
      alert("Progress updated!");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert("Update failed. Please try again.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this progress?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/smoking-status/${userData.statusId}`);
      alert("Progress deleted successfully!");
      setUserData(null);
      localStorage.removeItem("smokingStatus");
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
      alert("Delete failed. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userData?.statusId) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "packageId") {
      const selected = packages.find(pkg => pkg.cigarettePackageId === Number(value));
      setFormData((prev) => ({
        ...prev,
        packageId: value,
        preferredFlavor: selected?.flavor || "",
        preferredNicotineLevel: selected?.nicotineLevel || "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Smoking Cessation Progress
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={handleEdit}
                className="bg-white text-green-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-50 transition-colors"
              >
                <FiEdit2 />
                {userData?.statusId ? "Update Progress" : "Create Progress"}
              </button>

              {userData?.statusId && (
                <button
                  onClick={handleDelete}
                  className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                >
                  🗑️ Delete Progress
                </button>
              )}
            </div>
          </div>

          {userData && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Achievement Highlights
                </h2>
                <div className="flex items-center gap-3">
                  <FiTrendingDown className="text-green-600 w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-500">Days Without Smoking</p>
                    <p className="font-medium text-xl text-green-600">
                      {userData.daysWithoutSmoking} days
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiDollarSign className="text-green-600 w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-500">Money Saved</p>
                    <p className="font-medium text-xl text-green-600">
                      ${userData.moneySaved}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Status Details
                </h2>
                <div className="flex items-center gap-3">
                  <FiPackage className="text-indigo-600 w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-500">Package</p>
                    <p className="font-medium">
                      {
                        packages.find(p => p.cigarettePackageId === userData.packageId)
                          ?.cigarettePackageName || "Unknown"
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiCalendar className="text-indigo-600 w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-500">Record Date</p>
                    <p className="font-medium">
                      {new Date(userData.recordDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Progress Chart
                </h2>
                <div className="h-64">
                  <Line data={chartData} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {userData?.statusId ? "Update Progress" : "Create Progress"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Cigarettes Per Day
                </label>
                <input
                  type="number"
                  name="cigarettesPerDay"
                  value={formData.cigarettesPerDay}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  min={1}
                  max={200}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Price Per Pack
                </label>
                <input
                  type="number"
                  name="pricePerPack"
                  value={formData.pricePerPack}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  min={1000}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Cigarette Package
                </label>
                <select
                  name="packageId"
                  value={formData.packageId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                >
                  <option value="">-- Select a package --</option>
                  {packages.map((pkg) => (
                    <option key={pkg.cigarettePackageId} value={String(pkg.cigarettePackageId)}>
                      {pkg.cigarettePackageName} ({pkg.pricePerPack}₫ - {pkg.sticksPerPack} sticks)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Frequency</label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="OCCASIONALLY">Occasionally</option>
                  <option value="STRESS">Stress</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Preferred Flavor</label>
                <input
                  type="text"
                  name="preferredFlavor"
                  value={formData.preferredFlavor}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Preferred Nicotine Level</label>
                <select
                  name="preferredNicotineLevel"
                  value={formData.preferredNicotineLevel}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">-- Select Nicotine Level --</option>
                  <option value="ZERO">Zero</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Record Date</label>
                <input
                  type="date"
                  name="recordDate"
                  value={formData.recordDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {userData?.statusId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusPage;
