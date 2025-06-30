import React, { useState, useEffect } from "react";
import { FaSearch, FaCircle, FaSmoking, FaEdit, FaBan, FaStar } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const ManageRank = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      rank: 1,
      username: "JohnDoe",
      profilePic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
      points: 2500,
      status: "Active",
      achievements: ["Gold", "Expert", "Champion"]
    },
    {
      id: 2,
      rank: 2,
      username: "AliceSmith",
      profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      points: 2200,
      status: "Active",
      achievements: ["Silver", "Master"]
    },
    {
      id: 3,
      rank: 3,
      username: "BobJohnson",
      profilePic: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
      points: 1800,
      status: "Inactive",
      achievements: ["Bronze"]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSort = () => {
    const sortedUsers = [...users].sort((a, b) => {
      return sortOrder === "desc" ? b.points - a.points : a.points - b.points;
    });
    setUsers(sortedUsers);
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return "bg-yellow-400";
      case 2: return "bg-gray-400";
      case 3: return "bg-amber-600";
      default: return "bg-blue-500";
    }
  };

  const UserModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">User Profile</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <IoMdClose size={24} />
            </button>
          </div>
          <div className="text-center">
            <img
              src={user.profilePic}
              alt={user.username}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold mb-2">{user.username}</h3>
            <div className="flex justify-center gap-2 mb-4">
              {user.achievements.map((achievement, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {achievement}
                </span>
              ))}
            </div>
            <div className="mb-4">
              <p className="text-gray-600">Total Points: {user.points}</p>
              <p className="text-gray-600">Rank: #{user.rank}</p>
              <p className="text-gray-600">Status: {user.status}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleEdit = (e, userId) => {
    e.stopPropagation();
    console.log("Edit user:", userId);
  };

  const handleSuspend = (e, userId) => {
    e.stopPropagation();
    console.log("Suspend user:", userId);
  };

  const handlePromote = (e, userId) => {
    e.stopPropagation();
    console.log("Promote user:", userId);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl font-bold mb-4 sm:mb-0">User Rankings</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left">Rank</th>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left cursor-pointer" onClick={handleSort}>
                    Points {sortOrder === "desc" ? "↓" : "↑"}
                  </th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsModalOpen(true);
                    }}
                  >
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${getRankColor(user.rank)} text-white font-bold`}>
                        {user.rank}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <img
                          src={user.profilePic}
                          alt={user.username}
                          className="w-10 h-10 rounded-full mr-3 object-cover"
                        />
                        <span className="font-medium">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{user.points}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        <FaCircle className="w-2 h-2 mr-2" />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button 
                          className="p-1 hover:text-blue-600" 
                          title="Edit"
                          onClick={(e) => handleEdit(e, user.id)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="p-1 hover:text-red-600" 
                          title="Suspend"
                          onClick={(e) => handleSuspend(e, user.id)}
                        >
                          <FaBan />
                        </button>
                        <button 
                          className="p-1 hover:text-yellow-600" 
                          title="Promote"
                          onClick={(e) => handlePromote(e, user.id)}
                        >
                          <FaStar />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* No Smoking Chat Button */}
        <button className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 flex items-center space-x-2">
          <FaSmoking className="transform rotate-45" />
          <span>No Smoking Chat</span>
        </button>

        {/* User Profile Modal */}
        {isModalOpen && (
          <UserModal
            user={selectedUser}
            onClose={() => {
              setSelectedUser(null);
              setIsModalOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ManageRank;