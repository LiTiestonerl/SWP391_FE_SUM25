import React, { useState } from "react";
import {
  FaUserCircle,
  FaSearch,
  FaCheck,
  FaTimes,
  FaBan,
  FaUserEdit,
  FaNotesMedical,
} from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { differenceInDays, format } from "date-fns";

const mockUsers = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    complianceStatus: "health+",
    lastVerified: "2024-06-10",
    notes: "Regular compliance checks passed",
    history: [
      { date: "2024-06-10", status: "health+", note: "Quarterly check passed" },
    ],
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    complianceStatus: "health",
    lastVerified: "2024-03-15",
    notes: "Failed compliance check",
    history: [
      { date: "2024-03-15", status: "health", note: "Violation reported" },
    ],
  },
  {
    id: 3,
    name: "David Lee",
    email: "david.lee@example.com",
    complianceStatus: "unknown",
    lastVerified: "2024-01-05",
    notes: "Not verified yet",
    history: [{ date: "2024-01-05", status: "others", note: "Unverified" }],
  },
];

const StatusBadge = ({ status }) => {
  let icon, bg, text, label;
  switch (status) {
    case "health":
      icon = <FaNotesMedical className="mr-1" />;
      bg = "bg-yellow-100";
      text = "text-yellow-800";
      label = "Health";
      break;
    case "health+":
      icon = <FaCheck className="mr-1" />;
      bg = "bg-green-100";
      text = "text-green-800";
      label = "Health+";
      break;
    default:
      icon = <FaBan className="mr-1" />;
      bg = "bg-gray-200";
      text = "text-gray-800";
      label = "Others";
      break;
  }
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${bg} ${text}`}
    >
      {icon}
      {label}
    </span>
  );
};

const ManageUser = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [newNote, setNewNote] = useState("");

  const usersPerPage = 10;
  const today = new Date();

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || user.complianceStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const updateUserStatus = (userId, newStatus) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              complianceStatus: newStatus,
              lastVerified: new Date().toISOString().split("T")[0],
              history: [
                {
                  date: new Date().toISOString().split("T")[0],
                  status: newStatus,
                  note: "Status updated",
                },
                ...user.history,
              ],
            }
          : user
      )
    );
  };

  const addUserNote = (userId) => {
    if (!newNote.trim()) return;
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              notes: newNote,
              history: [
                {
                  date: new Date().toISOString().split("T")[0],
                  status: user.complianceStatus,
                  note: newNote,
                },
                ...user.history,
              ],
            }
          : user
      )
    );
    setNewNote("");
  };

  // 📊 Tổng số lượt đăng nhập
  let totalLogins = 0;
  const loginBuckets = { last30: 0, last90: 0, over90: 0 };
  const statusCounts = { health: 0, healthPlus: 0, others: 0 };

  users.forEach((user) => {
    const daysAgo = differenceInDays(today, new Date(user.lastVerified));
    totalLogins += user.history.length;

    if (daysAgo <= 30) loginBuckets.last30++;
    else if (daysAgo <= 90) loginBuckets.last90++;
    else loginBuckets.over90++;

    if (user.complianceStatus === "health+") statusCounts.healthPlus++;
    else if (user.complianceStatus === "health") statusCounts.health++;
    else statusCounts.others++;
  });

  const pieData = [
    { name: "Last 30 days", value: loginBuckets.last30 },
    { name: "31–90 days", value: loginBuckets.last90 },
    { name: "91+ days", value: loginBuckets.over90 },
  ];
  const pieColors = ["#3B82F6", "#06B6D4", "#10B981"];

  const statusChartData = [
    { name: "Health+", value: statusCounts.healthPlus },
    { name: "Health", value: statusCounts.health },
    { name: "Others", value: statusCounts.others },
  ];
  const statusColors = ["#10B981", "#FBBF24", "#9CA3AF"];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-green-800">
            No Smoking Policy Management
          </h1>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          {/* Bộ lọc */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Users</option>
              <option value="health+">Health+</option>
              <option value="health">Health</option>
              <option value="others">Others</option>
            </select>
          </div>

          {/* Tổng quan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded shadow text-center">
              <h3 className="text-xl font-bold text-gray-700">Total Logins</h3>
              <p className="text-3xl text-green-700 font-bold">{totalLogins}</p>
            </div>
            <div className="bg-white p-4 rounded shadow text-center">
              <h3 className="text-xl font-bold text-gray-700">Unique Users</h3>
              <p className="text-3xl text-green-700 font-bold">
                {users.length}
              </p>
            </div>
          </div>

          {/* Hai biểu đồ đặt cạnh nhau */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-12 mb-8">
            <div>
              <h3 className="text-center font-semibold mb-2">
                Login Distribution
              </h3>
              <PieChart width={300} height={300}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>

            <div>
              <h3 className="text-center font-semibold mb-2">
                Compliance Status
              </h3>
              <PieChart width={300} height={300}>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {statusChartData.map((entry, index) => (
                    <Cell
                      key={`cell-status-${index}`}
                      fill={statusColors[index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>

          {/* Bảng người dùng */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Last Verified
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 flex items-center">
                      <FaUserCircle className="text-gray-400 mr-2" size={24} />
                      {user.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={user.complianceStatus} />
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {format(new Date(user.lastVerified), "MMM dd, yyyy")}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                        title="View Details"
                      >
                        <FaUserEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal chi tiết */}
        {isModalOpen && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    User Details
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Compliance Status
                    </h3>
                    <div className="flex space-x-2">
                      {["health+", "health", "others"].map((status) => (
                        <button
                          key={status}
                          onClick={() =>
                            updateUserStatus(selectedUser.id, status)
                          }
                          className={`px-4 py-2 rounded ${
                            selectedUser.complianceStatus === status
                              ? status === "health+"
                                ? "bg-green-600 text-white"
                                : status === "health"
                                ? "bg-yellow-500 text-white"
                                : "bg-gray-600 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Add Note</h3>
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      rows="3"
                      placeholder="Enter compliance note..."
                    ></textarea>
                    <button
                      onClick={() => addUserNote(selectedUser.id)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Add Note
                    </button>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Compliance History
                    </h3>
                    <div className="space-y-2">
                      {selectedUser.history.map((item, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              {format(new Date(item.date), "MMM dd, yyyy")}
                            </span>
                            <StatusBadge status={item.status} />
                          </div>
                          <p className="text-sm mt-1">{item.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUser;
