import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  FiEdit2,
  FiSettings,
  FiLock,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiCalendar,
  FiUser,
} from "react-icons/fi";

const UserProfile = () => {
  const user = useSelector((state) => state.user); // Lấy user từ Redux

  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [smokingStatus, setSmokingStatus] = useState({
    cigarettesPerDay: "",
    frequency: "",
    packageName: "",
    pricePerPack: "",
    recordDate: "",
  });
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    bio: "",
    age: "",
    gender: "",
    dateOfBirth: "",
    currentJob: "",
    company: "",
    experience: "",
    profileImage: "/images/123.jpg",
  });

  // Cập nhật profileData mỗi khi user từ Redux thay đổi
  useEffect(() => {
    if (user && !isEditing) {
      setProfileData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        title: user.title || "",
        bio: user.bio || "",
        age: user.age || "",
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth || "",
        currentJob: user.currentJob || "",
        company: user.company || "",
        experience: user.experience || "",
        profileImage: user.profileImage || "/images/123.jpg",
      });
    }
  }, [user, isEditing]);
  useEffect(() => {
    const fetchSmokingStatus = async () => {
      try {
        const res = await fetch("/api/smoking-status/${statusId}");
        const data = await res.json();
        if (data.length > 0) {
          setSmokingStatus(data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch smoking status:", err);
      }
    };

    fetchSmokingStatus();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowModal(true);
  };

  const EditModal = () => (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
        showModal ? "" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
        <form className="space-y-6">
          {/* Personal Details */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={profileData.fullName}
                onChange={(e) =>
                  setProfileData({ ...profileData, fullName: e.target.value })
                }
                className="border rounded p-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                className="border rounded p-2"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={profileData.phone}
                onChange={(e) =>
                  setProfileData({ ...profileData, phone: e.target.value })
                }
                className="border rounded p-2"
              />
              <input
                type="text"
                placeholder="Location"
                value={profileData.location}
                onChange={(e) =>
                  setProfileData({ ...profileData, location: e.target.value })
                }
                className="border rounded p-2"
              />
              <input
                type="text"
                placeholder="Title"
                value={profileData.title}
                onChange={(e) =>
                  setProfileData({ ...profileData, title: e.target.value })
                }
                className="border rounded p-2"
              />
              <input
                type="number"
                placeholder="Age"
                value={profileData.age}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    age: parseInt(e.target.value),
                  })
                }
                className="border rounded p-2"
              />
              <select
                value={profileData.gender}
                onChange={(e) =>
                  setProfileData({ ...profileData, gender: e.target.value })
                }
                className="border rounded p-2"
              >
                <option value="">Select Gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="date"
                placeholder="Date of Birth"
                value={profileData.dateOfBirth}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    dateOfBirth: e.target.value,
                  })
                }
                className="border rounded p-2"
              />
            </div>
          </div>

          {/* Professional Details */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Professional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Current Job"
                value={profileData.currentJob}
                onChange={(e) =>
                  setProfileData({ ...profileData, currentJob: e.target.value })
                }
                className="border rounded p-2"
              />
              <input
                type="text"
                placeholder="Company"
                value={profileData.company}
                onChange={(e) =>
                  setProfileData({ ...profileData, company: e.target.value })
                }
                className="border rounded p-2"
              />
              <input
                type="number"
                placeholder="Experience (years)"
                value={profileData.experience}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    experience: parseInt(e.target.value),
                  })
                }
                className="border rounded p-2"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={profileData.bio}
              onChange={(e) =>
                setProfileData({ ...profileData, bio: e.target.value })
              }
              className="border rounded p-2 w-full h-24"
              placeholder="Short bio..."
            />
          </div>
          {/* Smoking Status */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Smoking Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Cigarettes per Day"
                value={smokingStatus.cigarettesPerDay}
                onChange={(e) =>
                  setSmokingStatus({
                    ...smokingStatus,
                    cigarettesPerDay: parseInt(e.target.value),
                  })
                }
                className="border rounded p-2"
              />
              <input
                type="text"
                placeholder="Frequency"
                value={smokingStatus.frequency}
                onChange={(e) =>
                  setSmokingStatus({
                    ...smokingStatus,
                    frequency: e.target.value,
                  })
                }
                className="border rounded p-2"
              />
              <input
                type="number"
                placeholder="Package ID"
                value={smokingStatus.packageId}
                onChange={(e) =>
                  setSmokingStatus({
                    ...smokingStatus,
                    packageId: parseInt(e.target.value),
                  })
                }
                className="border rounded p-2"
              />
              <input
                type="number"
                placeholder="Price per Pack"
                value={smokingStatus.pricePerPack}
                onChange={(e) =>
                  setSmokingStatus({
                    ...smokingStatus,
                    pricePerPack: parseFloat(e.target.value),
                  })
                }
                className="border rounded p-2"
              />
              <input
                type="date"
                placeholder="Record Date"
                value={smokingStatus.recordDate}
                onChange={(e) =>
                  setSmokingStatus({
                    ...smokingStatus,
                    recordDate: e.target.value,
                  })
                }
                className="border rounded p-2"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setIsEditing(false);
              }}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={async (e) => {
                e.preventDefault();
                setShowModal(false);
                setIsEditing(false);

                try {
                  const response = await fetch("/api/smoking-status", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(smokingStatus),
                  });

                  if (!response.ok) {
                    throw new Error("Failed to update smoking status");
                  }

                  console.log("Smoking status updated successfully.");
                } catch (err) {
                  console.error(err.message);
                }
              }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative group">
                <img
                  src={profileData.profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                  <FiEdit2 className="text-white text-2xl" />
                </label>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pt-20 px-6 pb-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {profileData.fullName}
              </h1>
              <p className="text-gray-600 mt-1">{profileData.title}</p>
              <p className="text-gray-500 mt-2">{profileData.bio}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <FiMail className="text-blue-500" />
                <span>{profileData.email}</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <FiPhone className="text-blue-500" />
                <span>{profileData.phone}</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <FiMapPin className="text-blue-500" />
                <span>{profileData.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <FiUser className="text-blue-500" />
                    <span className="text-gray-600">
                      Age: {profileData.age}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiUser className="text-blue-500" />
                    <span className="text-gray-600">
                      Gender: {profileData.gender}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiCalendar className="text-blue-500" />
                    <span className="text-gray-600">
                      DOB: {profileData.dateOfBirth}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Professional Details
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <FiBriefcase className="text-blue-500" />
                    <span className="text-gray-600">
                      Current Job: {profileData.currentJob}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiBriefcase className="text-blue-500" />
                    <span className="text-gray-600">
                      Company: {profileData.company}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiBriefcase className="text-blue-500" />
                    <span className="text-gray-600">
                      Experience: {profileData.experience} years
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={handleEdit}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiEdit2 />
                <span>Edit Profile</span>
              </button>
              <button className="flex items-center space-x-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <FiLock />
                <span>Change Password</span>
              </button>
              <button className="flex items-center space-x-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <FiSettings />
                <span>Privacy Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <EditModal />
    </div>
  );
};

export default UserProfile;
