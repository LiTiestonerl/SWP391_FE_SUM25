import { useState } from "react";
import { FiEdit2, FiSettings, FiKey } from "react-icons/fi";
import { format } from "date-fns";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3");
  const [userData, setUserData] = useState({
    fullName: "John Doe",
    username: "johndoe123",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    joiningDate: "2023-01-15",
    role: "Senior Developer",
    department: "Engineering",
    experience: "5 years",
    dob: "1990-05-20",
    gender: "Male",
    location: "New York, USA"
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="relative w-48 h-48 mx-auto mb-6">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3";
                  }}
                />
                <label className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                  <FiEdit2 className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">{userData.fullName}</h1>
                <p className="text-gray-600 mb-4">@{userData.username}</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <FiEdit2 /> Edit Profile
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                    <FiKey /> Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <FiSettings /> Professional Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Role
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.role}
                      onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-900">{userData.role}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.department}
                      onChange={(e) => setUserData({ ...userData, department: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-900">{userData.department}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.experience}
                      onChange={(e) => setUserData({ ...userData, experience: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-900">{userData.experience}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-6">Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <p className="text-gray-900">{userData.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={userData.phone}
                      onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-900">{userData.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <p className="text-gray-900">
                    {format(new Date(userData.dob), "MMMM dd, yyyy")}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.location}
                      onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-900">{userData.location}</p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end gap-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;