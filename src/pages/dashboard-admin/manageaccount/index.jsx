import React, { useState, useMemo } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

// ==== Dữ liệu Coach ====
const mockCoachData = [
  {
    id: 1,
    name: "Michael Brown",
    coachId: "C001",
    certification: "Level 3 Inspector",
    assignedAreas: ["Building A", "Building B"],
    status: "compliant",
    starRating: 5,
  },
  {
    id: 2,
    name: "Sarah Wilson",
    coachId: "C002",
    certification: "Level 2 Inspector",
    assignedAreas: ["Building C"],
    status: "non-compliant",
    starRating: 3,
  },
];

// ==== Dữ liệu User ====
const mockUserData = [
  { id: 1, name: "Alice", top: "top1", package: "health" },
  { id: 2, name: "Bob", top: "top2", package: "health+" },
  { id: 3, name: "Charlie", top: "top10", package: "other" },
];

const renderStars = (count) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={i <= count ? "text-yellow-400" : "text-gray-300"}
      >
        ★
      </span>
    );
  }
  return stars;
};

const ManageAccount = () => {
  const [coaches, setCoaches] = useState(mockCoachData);
  const [users, setUsers] = useState(mockUserData);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [showCoachModal, setShowCoachModal] = useState(false);

  const accountChartData = {
    labels: ["Coaches", "Users"],
    datasets: [
      {
        label: "Account Distribution",
        data: [coaches.length, users.length],
        backgroundColor: ["#3b82f6", "#f59e0b"],
        hoverOffset: 4,
      },
    ],
  };

  const userPackageChartData = {
    labels: ["Health", "Health+", "Other"],
    datasets: [
      {
        data: [
          users.filter((u) => u.package === "health").length,
          users.filter((u) => u.package === "health+").length,
          users.filter((u) => u.package === "other").length,
        ],
        backgroundColor: ["#10b981", "#3b82f6", "#f59e0b"],
      },
    ],
  };

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const getTopValue = (top) => parseInt(top.replace("top", ""));
      return getTopValue(a.top) - getTopValue(b.top);
    });
  }, [users]);

  const handleCoachEdit = (coach) => {
    setSelectedCoach({ ...coach });
    setShowCoachModal(true);
  };

  const handleDelete = (id) => {
    setCoaches((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSave = () => {
    setCoaches((prev) =>
      prev.map((c) => (c.id === selectedCoach.id ? selectedCoach : c))
    );
    setShowCoachModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          No Smoking Account Management
        </h1>

        {/* Hai biểu đồ kế bên nhau */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-center">
              Account Distribution
            </h2>
            <Pie data={accountChartData} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-center">
              User Subscription Packages
            </h2>
            <Pie data={userPackageChartData} />
          </div>
        </div>

        {/* Danh sách Coach */}
        <div className="bg-white rounded-lg shadow mb-10 overflow-hidden">
          <h2 className="text-xl font-bold px-6 py-4 bg-gray-100">
            Coach List
          </h2>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Coach ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Certification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Assigned Areas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coaches.map((coach) => (
                <tr key={coach.id}>
                  <td className="px-6 py-4">{coach.coachId}</td>
                  <td className="px-6 py-4">{coach.name}</td>
                  <td className="px-6 py-4">{coach.certification}</td>
                  <td className="px-6 py-4">
                    {coach.assignedAreas.join(", ")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex">{renderStars(coach.starRating)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        coach.status === "compliant"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {coach.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleCoachEdit(coach)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(coach.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Danh sách User */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h2 className="text-xl font-bold px-6 py-4 bg-gray-100">User List</h2>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Top
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Package
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4">{user.id}</td>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4 font-medium">{user.top}</td>
                  <td className="px-6 py-4 capitalize">{user.package}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal chỉnh sửa Coach */}
      {showCoachModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Edit Coach Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={selectedCoach?.name || ""}
                  onChange={(e) =>
                    setSelectedCoach((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Star Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() =>
                        setSelectedCoach((prev) => ({
                          ...prev,
                          starRating: star,
                        }))
                      }
                      className={`text-2xl cursor-pointer ${
                        star <= (selectedCoach?.starRating || 0)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowCoachModal(false)}
                className="bg-gray-200 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAccount;
