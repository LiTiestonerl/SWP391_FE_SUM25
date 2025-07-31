import React, { useState, useMemo } from "react";
import { FiEdit2, FiTrash2, FiFlag, FiSearch, FiFilter } from "react-icons/fi";
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
    location: "Building A - Floor 1",
    complianceScore: 85,
    date: "2024-01-15",
    status: "compliant",
    notes: "Regular inspection completed",
    rater: "John Doe",
  },
  {
    id: 2,
    location: "Building B - Floor 2",
    complianceScore: 45,
    date: "2024-01-14",
    status: "non-compliant",
    notes: "Multiple violations found",
    rater: "Jane Smith",
  },
  // Add more mock data as needed
];

const ManageRating = () => {
  const [ratings, setRatings] = useState(mockData);
  const [selectedRating, setSelectedRating] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

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
    return ratings.filter((rating) => {
      const matchesSearch = rating.location
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterStatus === "all" || rating.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [ratings, searchTerm, filterStatus]);

  const handleEdit = (rating) => {
    setSelectedRating(rating);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this rating?")) {
      setRatings(ratings.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          No Smoking Rating Management Dashboard
        </h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total Ratings</h3>
            <p className="text-3xl font-bold text-green-500">
              {ratings.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Average Score</h3>
            <p className="text-3xl font-bold text-blue-500">
              {(
                ratings.reduce((acc, curr) => acc + curr.complianceScore, 0) /
                ratings.length
              ).toFixed(1)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Compliance Rate</h3>
            <p className="text-3xl font-bold text-purple-500">
              {(
                (ratings.filter((r) => r.status === "compliant").length /
                  ratings.length) *
                100
              ).toFixed(1)}
              %
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">
              Compliance Distribution
            </h3>
            <div className="h-64">
              <Pie
                data={pieChartData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Compliance Trend</h3>
            <div className="h-64">
              <Bar
                data={barChartData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search locations..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-400" />
              <select
                className="border rounded-lg px-4 py-2"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="compliant">Compliant</option>
                <option value="non-compliant">Non-Compliant</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ratings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rater
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRatings.map((rating) => (
                <tr key={rating.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{rating.date}</td>
                  <td className="px-6 py-4">{rating.location}</td>
                  <td className="px-6 py-4">{rating.complianceScore}%</td>
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
                  <td className="px-6 py-4">{rating.rater}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(rating)}
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
                      <button className="text-yellow-600 hover:text-yellow-900">
                        <FiFlag />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Edit Rating</h2>
            {/* Add form fields here */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
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

export default ManageRating;
