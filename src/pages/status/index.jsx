import React, { useState, useEffect } from "react";
import {
  FiDollarSign,
  FiEdit2,
  FiInfo,
  FiTrendingDown,
  FiPackage,
  FiCalendar,
} from "react-icons/fi";
import { BsFillCircleFill } from "react-icons/bs";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import api from "../../configs/axios";

const StatusPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState("");
  const [formData, setFormData] = useState({
    cigarettesPerDay: "",
    previousConsumption: "",
    daysWithoutSmoking: "",
    moneySaved: "",
  });
  const [userData, setUserData] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get(`/smoking-status/user/${userId}`);
        setUserData(res.data);
      } catch (error) {
        console.error("API error:", error);
      }
    };
    fetchStatus();
  }, []);

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
        previousConsumption: userData.previousConsumption || "",
        daysWithoutSmoking: userData.daysWithoutSmoking || "",
        moneySaved: userData.moneySaved || "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`smoking-status/${statusId}`, {
        ...userData,
        ...formData,
      });
      const res = await api.get(`smoking-status/${statusId}`);
      setUserData(res.data);
      alert("Progress updated successfully!");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Update failed", err.response?.status, err.response?.data);
      alert("Update failed. Please check your input or try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!userData) {
    return <div className="text-center pt-24">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-800 p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Smoking Cessation Progress
              </h1>
              <button
                onClick={handleEdit}
                className="bg-white text-green-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-50 transition-colors"
              >
                <FiEdit2 /> Update Progress
              </button>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Achievement Highlights
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FiTrendingDown className="text-green-600 w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-500">
                      Days Without Smoking
                    </p>
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
                <div className="flex items-center gap-3">
                  <FiInfo className="text-green-600 w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-500">Reduction Progress</p>
                    <p className="font-medium">
                      From {userData.previousConsumption} to{" "}
                      {userData.cigarettesPerDay} per day
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiCalendar className="text-green-600 w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-500">Quit Date</p>
                    <p className="font-medium">
                      {new Date(userData.quitDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Status Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <BsFillCircleFill className="text-indigo-600 w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-500">Status ID</p>
                    <p className="font-medium">{userData.statusId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiInfo
                    className="text-indigo-600 w-5 h-5 cursor-help"
                    onMouseEnter={() => setShowTooltip("cpd")}
                    onMouseLeave={() => setShowTooltip("")}
                  />
                  <div className="relative">
                    <p className="text-sm text-gray-500">Cigarettes Per Day</p>
                    <p className="font-medium">{userData.cigarettesPerDay}</p>
                    {showTooltip === "cpd" && (
                      <div className="absolute z-10 bg-gray-800 text-white text-sm p-2 rounded mt-1">
                        Average daily consumption
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiPackage className="text-indigo-600 w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-500">Package Details</p>
                    <p className="font-medium">{userData.packageName}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <FiDollarSign className="w-4 h-4" />
                      {userData.pricePerPack}/pack
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
            </div>

            <div className="md:col-span-2 bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Progress Chart
              </h2>
              <div className="h-64">
                <Line
                  data={chartData}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: "Cigarettes per Day",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Update Progress
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </label>
                  <input
                    type="number"
                    name={key}
                    value={value}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
              ))}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save Changes
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
