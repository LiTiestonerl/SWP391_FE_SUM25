import React, { useState, useEffect, useRef } from "react";
import {
  FiMessageSquare,
  FiShare2,
  FiMapPin,
  FiBriefcase,
  FiCalendar,
  FiCamera,
} from "react-icons/fi";
import api from "../../configs/axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./UserProfile.css";
import { useDispatch } from "react-redux";
import { updateAvatar } from "../../redux/features/userSlice";

const UserProfile = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user);
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [comments, setComments] = useState({});
  const [visibleComments, setVisibleComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const user = useSelector((state) => state.user);
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const dispatch = useDispatch();

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const base64 = await toBase64(file);

    setProfileInfo((prev) => ({ ...prev, avatar: base64 }));

    dispatch(updateAvatar(base64));

    localStorage.setItem("custom_avatar", base64);
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const base64 = await toBase64(file);
    setProfileInfo((prev) => ({ ...prev, coverPhoto: base64 }));
    localStorage.setItem("custom_cover", base64);
  };

  const [profileInfo, setProfileInfo] = useState({
    location: currentUser?.location || "",
    occupation: currentUser?.occupation || "",
    smokeFreeDate: currentUser?.smokeFreeDate || "",
    avatar: localStorage.getItem("custom_avatar") || currentUser?.avatar || "",
    coverPhoto:
      localStorage.getItem("custom_cover") || currentUser?.coverPhoto || "",
  });

  const userProfile = {
    name:
      currentUser?.name ||
      currentUser?.fullName ||
      currentUser?.login ||
      currentUser?.email ||
      "Anonymous",
    avatar: currentUser?.avatar || "/images/avatar.jpg",
    coverPhoto:
      currentUser?.coverPhoto ||
      "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144",
    stats: {
      daysSmokeFree: currentUser?.stats?.daysSmokeFree || 0,
      moneySaved: currentUser?.stats?.moneySaved || 0,
      healthScore: currentUser?.stats?.healthScore || 0,
    },
  };

  const handlePostSubmit = async () => {
    if (!currentUser) return alert("Bạn cần đăng nhập để đăng bài");

    const postPayload = {
      title: `Post by ${userProfile.name}`,
      content: newContent,
      status: "published",
    };

    console.log("📤 Sending post payload:", postPayload);

    try {
      const response = await api.post("posts", postPayload);
      console.log("✅ Post created:", response.data);
      setPosts([response.data, ...posts]);
      setNewContent("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("❌ Failed to create post", error);
    }
  };

  const handleViewPost = (postId) => {
    navigate(`/posts/${postId}`);
  };

useEffect(() => {
  const userId = currentUser?.id || currentUser?.userId;
  if (!userId) return;

  const fetchPosts = async () => {
    try {
      const res = await api.get(`posts/user/${userId}`);
      const postsData = Array.isArray(res.data) ? res.data : [];
      setPosts(postsData);
    } catch (error) {
      console.error("❌ Error fetching posts", error);
    }
  };

  fetchPosts();
}, [currentUser?.id, currentUser?.userId]);

  const toggleComments = async (postId) => {
    const isVisible = visibleComments[postId];
    setVisibleComments((prev) => ({ ...prev, [postId]: !isVisible }));

    // Nếu chưa load comment thì fetch
    if (!isVisible && !comments[postId]) {
      try {
        const res = await api.get(`/posts/${postId}/comments`);
        setComments((prev) => ({ ...prev, [postId]: res.data }));
      } catch (err) {
        console.error("❌ Lỗi khi tải comment:", err);
      }
    }
  };
  const handleCommentSubmit = async (postId) => {
    const content = newComments[postId]?.trim();
    if (!content) return;

    try {
      const res = await api.post(`/posts/${postId}/comments`, {
        content,
        status: "published",
      });

      setComments((prev) => ({
        ...prev,
        [postId]: [res.data, ...(prev[postId] || [])],
      }));

      setNewComments((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error("❌ Không thể gửi comment:", err);
    }
    const response = await api.post("/auth/google", { credential: googleCredential });

// Kiểm tra dữ liệu trả về
console.log("✅ Google login response:", response.data);

// Dispatch vào Redux
dispatch(login({
  userId: response.data.userId || response.data.id,
  email: response.data.email,
  fullName: response.data.fullName || response.data.name,
  avatar: response.data.avatar || response.data.picture,
}));

  };
  

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 pt-24">
        {/* Cover */}
        <div className="relative">
          <div className="h-80 rounded-b-lg overflow-hidden">
            <img
              src={profileInfo.coverPhoto || userProfile.coverPhoto}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <button
              className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-md shadow text-sm font-medium"
              onClick={() => coverInputRef.current.click()}
            >
              <FiCamera className="inline mr-2" />
              Edit cover photo
            </button>
            <input
              type="file"
              accept="image/*"
              hidden
              ref={coverInputRef}
              onChange={handleCoverChange}
            />
          </div>
        </div>

        {/* Avatar + Name */}
        <div className="mt-6 px-4 flex justify-between items-center flex-wrap">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={profileInfo.avatar || userProfile.avatar}
                alt={userProfile.name}
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
              <button
                className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full shadow"
                onClick={() => avatarInputRef.current.click()}
              >
                <FiCamera className="w-4 h-4 text-gray-600" />
              </button>
              <input
                type="file"
                accept="image/*"
                hidden
                ref={avatarInputRef}
                onChange={handleAvatarChange}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {currentUser?.fullName ||
                  currentUser?.userName ||
                  currentUser?.email}
              </h1>
              <p className="text-gray-600">0 friends</p>
            </div>
          </div>

          <div className="flex space-x-2 mt-4 sm:mt-0">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700">
              + Add to story
            </button>
            <button className="bg-gray-200 px-4 py-2 rounded-md font-medium text-gray-800 hover:bg-gray-300 flex items-center space-x-1">
              <FiCamera />
              <span>Edit profile</span>
            </button>
            <button className="bg-gray-200 w-10 h-10 rounded-md flex items-center justify-center hover:bg-gray-300">
              ⋮
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-2 border-t border-gray-300 px-4">
          <div className="flex items-center space-x-6 overflow-x-auto text-gray-600 font-medium pt-4">
            {[
              { label: "Posts" },
              { label: "Chat", onClick: () => navigate("/chat") }, // ✅ Thay ở đây
              { label: "Status", onClick: () => navigate("/status") },
              { label: "Photos" },
              { label: "Videos" },
              { label: "Reels" },
              { label: "More ▾" },
            ].map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={`pb-2 ${
                  item.label === "Posts"
                    ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
                    : "hover:text-blue-600 hover:border-b-2 hover:border-blue-400"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="mt-10 grid grid-cols-3 gap-6 px-4">
          {/* Left column */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              {!isEditing ? (
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center space-x-3">
                    <FiMapPin className="h-5 w-5" />
                    <span>Lives in {profileInfo.location || "..."}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FiBriefcase className="h-5 w-5" />
                    <span>{profileInfo.occupation || "..."}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FiCalendar className="h-5 w-5" />
                    <span>
                      Smoke-free since {profileInfo.smokeFreeDate || "..."}
                    </span>
                  </div>
                  <button
                    className="mt-4 w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Details
                  </button>
                </div>
              ) : (
                <div className="space-y-3 mt-4">
                  <input
                    type="text"
                    placeholder="Location"
                    className="w-full border px-3 py-2 rounded"
                    value={profileInfo.location}
                    onChange={(e) =>
                      setProfileInfo({
                        ...profileInfo,
                        location: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Occupation"
                    className="w-full border px-3 py-2 rounded"
                    value={profileInfo.occupation}
                    onChange={(e) =>
                      setProfileInfo({
                        ...profileInfo,
                        occupation: e.target.value,
                      })
                    }
                  />
                  <input
                    type="date"
                    className="w-full border px-3 py-2 rounded"
                    value={profileInfo.smokeFreeDate}
                    onChange={(e) =>
                      setProfileInfo({
                        ...profileInfo,
                        smokeFreeDate: e.target.value,
                      })
                    }
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 border py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Progress Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Smoke-free days</span>
                  <span className="font-semibold text-green-600">
                    {userProfile.stats.daysSmokeFree}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Money saved</span>
                  <span className="font-semibold text-green-600">
                    ${userProfile.stats.moneySaved}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Health score</span>
                  <span className="font-semibold text-blue-600">
                    {userProfile.stats.healthScore}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column (posts) */}
          <div className="col-span-2">
            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
              {currentUser && (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex space-x-4">
                    <img
                      src={
                        localStorage.getItem("custom_avatar") ||
                        user?.avatar ||
                        "/images/avatar.jpg"
                      }
                      alt={user?.fullName}
                      className="h-10 w-10 rounded-full"
                    />
                    <div
                      className="flex-1 text-left px-4 py-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 cursor-pointer"
                      onClick={() => setIsModalOpen(true)}
                    >
                      What's on your mind?
                    </div>
                  </div>
                </div>
              )}

              {posts.map((post) => (
                <div
                  key={post.postId}
                  className="bg-white rounded-lg shadow p-6"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <img
                      onClick={() => handleViewPost(post.postId)}
                      src={
                        localStorage.getItem("custom_avatar") ||
                        user?.avatar ||
                        "/images/avatar.jpg"
                      }
                      alt={user?.fullName}
                      className="h-10 w-10 rounded-full cursor-pointer hover:opacity-80"
                    />
                    <div>
                      <h3 className="font-semibold">
                        {post.userName || "Anonymous"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(post.postDate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-800 mb-4">{post.content}</p>

                  {/* Vùng hiển thị comment nếu được bật */}
                  {visibleComments[post.postId] && (
                    <div className="space-y-2 border-t pt-4 mt-2">
                      {(comments[post.postId] || []).map((cmt) => (
                        <div
                          key={cmt.commentId}
                          className="text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded"
                        >
                          <strong>{cmt.userName || "Ẩn danh"}:</strong>{" "}
                          {cmt.content}
                        </div>
                      ))}

                      {/* Ô nhập comment mới */}
                      <div className="flex items-center mt-2">
                        <input
                          type="text"
                          className="flex-1 border rounded px-2 py-1 text-sm"
                          placeholder="Nhập bình luận..."
                          value={newComments[post.postId] || ""}
                          onChange={(e) =>
                            setNewComments((prev) => ({
                              ...prev,
                              [post.postId]: e.target.value,
                            }))
                          }
                        />
                        <button
                          onClick={() => handleCommentSubmit(post.postId)}
                          className="ml-2 text-blue-600 text-sm font-medium hover:underline"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-6 text-gray-500 mt-4">
                    <button
                      onClick={() => toggleComments(post.postId)}
                      className="flex items-center space-x-2 hover:text-blue-600"
                    >
                      <FiMessageSquare className="h-5 w-5" />
                      <span className="text-sm">Comments</span>
                    </button>

                    <button className="flex items-center space-x-2 hover:text-blue-600">
                      <FiShare2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleViewPost(post.postId)}
                      className="text-sm text-blue-600 hover:underline ml-auto"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create post</h2>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <textarea
              className="w-full h-32 border border-gray-300 rounded-lg p-2 resize-none"
              placeholder="What's on your mind?"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              onClick={handlePostSubmit}
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
