import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../configs/axios";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";
import { Modal, Input, Button, message } from "antd";

import {
  FiHome,
  FiTrendingUp,
  FiUsers,
  FiBookOpen,
  FiMessageSquare,
  FiShare2,
  FiAward,
} from "react-icons/fi";
import "./Social.css";

const Social = () => {
  const user = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleComments, setVisibleComments] = useState({});
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const dispatch = useDispatch();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState(null);

  const healthStats = {
    daysSmokeFree: 30,
    moneySaved: 500,
    healthScore: 85,
  };

  const getDisplayName = (user) =>
    user?.fullName || user?.name || user?.login || user?.email || "Anonymous";

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get("posts");
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const res = await api.post("posts", {
        title: `Post by ${getDisplayName(user)}`,
        content: newPost,
        status: "published",
        userId: user.userId,
        userName: getDisplayName(user),
        userAvatar: user.avatar || "",
      });

      setPosts((prev) => [res.data, ...prev]);
      setNewPost("");
    } catch (err) {
      console.error("Failed to create post:", err);
    }
  };

  const toggleComments = async (postId) => {
    // Nếu chưa đăng nhập thì không cho xem bình luận
    if (!user || !user.token) {
      setShowLoginPopup(true);
      return;
    }

    setVisibleComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));

    if (!comments[postId]) {
      try {
        const res = await api.get(`/posts/${postId}/comments`);
        setComments((prev) => ({ ...prev, [postId]: res.data }));
      } catch (err) {
        console.error("Error loading comments:", err);
      }
    }
  };

  const handleCommentSubmit = async (postId) => {
    const content = newComments[postId]?.trim();
    if (!user || !user.token) {
      setShowLoginPopup(true);
      return;
    }

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
      console.error("Failed to post comment:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[104px]">
      <div className="max-w-7xl mx-auto px-4 pb-8 flex flex-col md:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="w-full md:w-1/4">
          <nav className="bg-white rounded-lg shadow-sm p-4">
            <ul className="space-y-2">
              <li className="flex items-center space-x-3 p-2 hover:bg-blue-50 rounded cursor-pointer">
                <FiHome className="text-blue-500" />
                <span>Profile</span>
              </li>
              <li className="flex items-center space-x-3 p-2 hover:bg-blue-50 rounded cursor-pointer">
                <FiTrendingUp className="text-green-500" />
                <span>Progress</span>
              </li>
              <li className="flex items-center space-x-3 p-2 hover:bg-blue-50 rounded cursor-pointer">
                <FiUsers className="text-purple-500" />
                <span>Support Groups</span>
              </li>
              <li className="flex items-center space-x-3 p-2 hover:bg-blue-50 rounded cursor-pointer">
                <FiBookOpen className="text-yellow-500" />
                <span>Resources</span>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <main className="w-full md:w-2/4 max-h-[calc(100vh-120px)] overflow-y-auto pr-1 no-scrollbar">
          {user && user.token && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={
                    user.avatar ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
                  }
                  alt="User avatar"
                  className="h-10 w-10 rounded-full"
                />
                <div
                  onClick={() => setIsModalOpen(true)}
                  className="flex-1 bg-gray-100 px-4 py-2 rounded-full text-gray-500 cursor-pointer hover:bg-gray-200"
                >
                  {`What's on your mind, ${getDisplayName(user)}?`}
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <p className="text-center text-gray-500">Loading posts...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post.postId || post.id}
                  className="bg-white rounded-lg shadow-sm p-6"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <img
                      src={post.userAvatar || "https://placehold.co/40x40"}
                      alt={post.userName}
                      className="h-10 w-10 rounded-full"
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

                  <div className="flex items-center space-x-6 text-gray-500 mb-2">
                    <button
                      className="flex items-center space-x-2 hover:text-blue-600"
                      onClick={() => toggleComments(post.id || post.postId)}
                    >
                      <FiMessageSquare className="h-5 w-5" />
                      <span>Comments</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-blue-600">
                      <FiShare2 className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Hiển thị khối bình luận nếu visible */}
                  {visibleComments[post.id || post.postId] && (
                    <div className="mt-4">
                      {/* Danh sách bình luận */}
                      <div className="space-y-2 mb-2">
                        {(comments[post.id || post.postId] || []).map(
                          (comment, index) => (
                            <div
                              key={index}
                              className="border p-2 rounded-md bg-gray-50"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <img
                                  src={
                                    comment.userAvatar ||
                                    "https://placehold.co/32x32"
                                  }
                                  alt="avatar"
                                  className="w-6 h-6 rounded-full"
                                />
                                <span className="font-semibold text-sm">
                                  {comment.userName || "Anonymous"}
                                </span>
                              </div>
                              <p className="text-sm text-gray-800">
                                {comment.content}
                              </p>
                            </div>
                          )
                        )}
                      </div>

                      {/* Form nhập bình luận */}
                      {user && user.token && (
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="text"
                            className="flex-1 border rounded-md px-2 py-1 text-sm"
                            placeholder="Write a comment..."
                            value={newComments[post.id || post.postId] || ""}
                            onChange={(e) =>
                              setNewComments((prev) => ({
                                ...prev,
                                [post.id || post.postId]: e.target.value,
                              }))
                            }
                          />
                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
                            onClick={() =>
                              handleCommentSubmit(post.id || post.postId)
                            }
                          >
                            Send
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Right Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h2 className="font-semibold mb-4">Your Progress</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Smoke-free days</span>
                <span className="font-semibold text-green-600">
                  {healthStats.daysSmokeFree}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Money saved</span>
                <span className="font-semibold text-green-600">
                  ${healthStats.moneySaved}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Health score</span>
                <span className="font-semibold text-blue-600">
                  {healthStats.healthScore}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="font-semibold mb-4">Achievements</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center">
                <FiAward className="h-8 w-8 text-yellow-500" />
                <span className="text-xs mt-1">1 Week</span>
              </div>
              <div className="flex flex-col items-center">
                <FiAward className="h-8 w-8 text-gray-400" />
                <span className="text-xs mt-1">1 Month</span>
              </div>
              <div className="flex flex-col items-center">
                <FiAward className="h-8 w-8 text-gray-400" />
                <span className="text-xs mt-1">3 Months</span>
              </div>
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
              placeholder={`What's on your mind, ${getDisplayName(user)}?`}
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              onClick={(e) => {
                handlePostSubmit(e);
                setIsModalOpen(false);
              }}
            >
              Post
            </button>
          </div>
        </div>
      )}
      <Modal
        open={showLoginPopup}
        onCancel={() => setShowLoginPopup(false)}
        footer={null}
        title="Login"
      >
        <div className="text-center mb-4">
          <img
            src="/images/logo.jpg"
            alt="logo"
            className="mx-auto w-16 h-16"
          />
          <h2 className="text-lg font-semibold mt-2">No Smoking</h2>
        </div>

        <Input
          placeholder="Email hoặc số điện thoại"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          className="mb-2"
        />
        <Input.Password
          placeholder="Mật khẩu"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          className="mb-2"
        />

        {loginError && (
          <p className="text-red-600 text-sm font-medium mb-2">{loginError}</p>
        )}

        <Button
          type="primary"
          block
          onClick={async () => {
            try {
              const res = await api.post("/auth/login", {
                login: loginEmail,
                password: loginPassword,
              });

              const token = res.data;
              dispatch(
                login({
                  token,
                  email: loginEmail,
                  avatar: "",
                  userId: "",
                })
              );

              setShowLoginPopup(false);
              setLoginError(null);
              message.success("Đăng nhập thành công!");
            } catch (err) {
              setLoginError("Tài khoản hoặc mật khẩu không đúng!");
            }
          }}
        >
          Login
        </Button>

        <p className="text-sm text-blue-600 hover:underline text-center mt-3 cursor-pointer">
          Forget password?
        </p>

        <hr className="my-3" />

        <Button
          type="default"
          block
          onClick={() => {
            setShowLoginPopup(false);
            window.location.href = "/register";
          }}
        >
          Register
        </Button>
      </Modal>
    </div>
  );
};

export default Social;