import React, { useState, useMemo } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import "./ManageCoach.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const mockData = [
  {
    id: 1,
    coachName: "Michael Brown",
    coachId: "C001",
    certification: "Level 3 Inspector",
    assignedAreas: ["Building A", "Building B"],
    rank: "Senior",
    status: "compliant",
    starRating: 4,
  },
  {
    id: 2,
    coachName: "Sarah Wilson",
    coachId: "C002",
    certification: "Level 2 Inspector",
    assignedAreas: ["Building C"],
    rank: "Junior",
    status: "non-compliant",
    starRating: 2,
  },
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

const ManageCoach = () => {
  const [ratings, setRatings] = useState(mockData);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [showCoachModal, setShowCoachModal] = useState(false);

  const pieChartData = {
    labels: ["Compliant", "Non-Compliant"],
    datasets: [
      {
        data: [
          ratings.filter((r) => r.status === "compliant").length,
          ratings.filter((r) => r.status === "non-compliant").length,
        ],
        backgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  };

  const barChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        label: "Average Compliance Score",
        data: [75, 82, 88, 90],
        backgroundColor: "#22c55e",
      },
    ],
  };

  const filteredRatings = useMemo(() => {
    return ratings.sort((a, b) => a.rank.localeCompare(b.rank));
  }, [ratings]);

  const handleCoachEdit = (coach) => {
    setSelectedCoach({ ...coach }); // create a copy
    setShowCoachModal(true);
  };

  const handleDelete = (id) => {
    setRatings((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSave = () => {
    setRatings((prev) =>
      prev.map((r) => (r.id === selectedCoach.id ? selectedCoach : r))
    );
    setShowCoachModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          No Smoking Coach Management Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total Coaches</h3>
            <p className="text-3xl font-bold text-green-500">
              {ratings.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Average Star Rating</h3>
            <p className="text-3xl font-bold text-blue-500">
              {(
                ratings.reduce((acc, curr) => acc + curr.starRating, 0) /
                ratings.length
              ).toFixed(1)}{" "}
              ★
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Active Coaches</h3>
            <p className="text-3xl font-bold text-purple-500">
              {ratings.length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Coach ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Coach Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rank
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
              {filteredRatings.map((rating) => (
                <tr key={rating.id}>
                  <td className="px-6 py-4">{rating.coachId}</td>
                  <td className="px-6 py-4">{rating.coachName}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        rating.rank === "Senior"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {rating.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4">{rating.certification}</td>
                  <td className="px-6 py-4">
                    {rating.assignedAreas.join(", ")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex">{renderStars(rating.starRating)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        rating.status === "compliant"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {rating.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleCoachEdit(rating)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(rating.id)}
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
      </div>

      {showCoachModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Edit Coach Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Coach Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={selectedCoach?.coachName || ""}
                  onChange={(e) =>
                    setSelectedCoach((prev) => ({
                      ...prev,
                      coachName: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rank
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={selectedCoach?.rank}
                  onChange={(e) =>
                    setSelectedCoach((prev) => ({
                      ...prev,
                      rank: e.target.value,
                    }))
                  }
                >
                  <option value="Senior">Senior</option>
                  <option value="Junior">Junior</option>
                </select>
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

export default ManageCoach;
