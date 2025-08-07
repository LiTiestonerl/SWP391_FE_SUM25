import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Modal, Input, Button, message, Rate } from "antd";
import {
  FiArrowUpCircle,
  FiHome,
  FiTrendingUp,
  FiUsers,
  FiBookOpen,
  FiMessageSquare,
  FiAward,
} from "react-icons/fi";
import api from "../../configs/axios";
import { login, updateMembership } from "../../redux/features/userSlice";
import "./Social.css";

const Social = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States cho modal và comments
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleComments, setVisibleComments] = useState({});
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});

  // States cho popup đăng nhập
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState(null);

  // State cho ratings
  const [ratings, setRatings] = useState({});

  // THÊM MỚI: State để quản lý modal yêu cầu nâng cấp
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const healthStats = {
    daysSmokeFree: 30,
    moneySaved: 500,
    healthScore: 85,
  };

  const getDisplayName = (user) =>
    user?.fullName || user?.name || user?.login || user?.email || "Anonymous";

  const fetchAverageRating = async (postId) => {
    try {
      const res = await api.get(`/rating/post/${postId}`);
      const allRatings = res.data;

      if (allRatings && allRatings.length > 0) {
        const totalScore = allRatings.reduce(
          (sum, rating) => sum + rating.ratingValue,
          0
        );
        const averageScore = totalScore / allRatings.length;
        setRatings((prev) => ({ ...prev, [postId]: averageScore }));
      } else {
        setRatings((prev) => ({ ...prev, [postId]: 0 }));
      }
    } catch (err) {
      setRatings((prev) => ({ ...prev, [postId]: 0 }));
    }
  };

  // CHỈNH SỬA: useEffect sẽ luôn tải bài viết, không chặn dựa trên gói thành viên
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.token) {
        message.error("Vui lòng đăng nhập để tiếp tục.");
        navigate("/login");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Luôn lấy thông tin membership và cập nhật vào Redux
        const membershipRes = await api.get("/user-membership/me");
        dispatch(updateMembership(membershipRes.data));

        // Luôn tải bài viết
        const postsRes = await api.get("posts");
        const data = Array.isArray(postsRes.data)
          ? postsRes.data
          : postsRes.data.data || [];
        setPosts(data);

        if (data.length > 0) {
          data.forEach((post) => {
            fetchAverageRating(post.id || post.postId);
          });
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.token, dispatch, navigate]);

  // CHỈNH SỬA: handlePostSubmit kiểm tra gói thành viên trước khi đăng bài
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    // Lấy thông tin gói thành viên từ Redux state (đã được cập nhật trong useEffect)
    const membership = user.membership;

    // Kiểm tra nếu người dùng đang ở gói 2
    if (membership?.memberPackageId === 12) {
      setShowUpgradeModal(true); // Mở modal yêu cầu nâng cấp
      setIsModalOpen(false); // Đóng modal tạo bài viết
      return; // Dừng hàm tại đây
    }

    try {
      const avatar =
        localStorage.getItem(`custom_avatar_${user?.userId || user?.id}`) ||
        user?.avatar ||
        "/images/avatar.jpg";

      const res = await api.post("posts", {
        title: `Post by ${getDisplayName(user)}`,
        content: newPost,
        status: "published",
        userId: user.userId,
        userName: getDisplayName(user),
        userAvatar: avatar,
      });

      setPosts((prev) => [res.data, ...prev]);
      setNewPost("");
      setIsModalOpen(false); // Đóng modal sau khi đăng thành công
      message.success("Đăng bài thành công!");
    } catch (err) {
      console.error("Failed to create post:", err);
      message.error("Tạo bài viết thất bại. Vui lòng thử lại.");
    }
  };

  const toggleComments = async (postId) => {
    if (!user || !user.token) {
      setShowLoginPopup(true);
      return;
    }
    setVisibleComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
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

  const handleRatingSubmit = async (postId, value) => {
    if (!user || !user.token) {
      message.error("Vui lòng đăng nhập để đánh giá.");
      setShowLoginPopup(true);
      return;
    }
    try {
      await api.post("/rating/post", {
        memberId: user.id,
        postId: postId,
        ratingValue: value,
        feedbackText: "",
      });
      message.success("Cảm ơn bạn đã đánh giá!");
      fetchAverageRating(postId);
    } catch (err) {
      console.error("Failed to submit rating:", err);
      message.error("Gửi đánh giá thất bại. Vui lòng thử lại.");
    }
  };

  // Loại bỏ điều kiện hiển thị thông báo toàn trang
  // if (showUpgradeMessage) { ... }

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
                    localStorage.getItem(
                      `custom_avatar_${user?.userId || user?.id}`
                    ) ||
                    user?.avatar ||
                    "/images/avatar.jpg"
                  }
                  alt="User avatar"
                  className="h-10 w-10 rounded-full object-cover"
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
                      src={post.userAvatar || "/images/avatar.jpg"}
                      alt={post.userName || "Anonymous"}
                      className="h-10 w-10 rounded-full object-cover"
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

                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <div className="flex items-center space-x-6">
                      <button
                        className="flex items-center space-x-2 hover:text-blue-600"
                        onClick={() => toggleComments(post.id || post.postId)}
                      >
                        <FiMessageSquare className="h-5 w-5" />
                        <span>Comments</span>
                      </button>
                    </div>

                    <div className="flex items-center">
                      <Rate
                        allowHalf
                        disabled={!user || !user.token}
                        value={ratings[post.id || post.postId] || 0}
                        onChange={(value) =>
                          handleRatingSubmit(post.id || post.postId, value)
                        }
                      />
                      {ratings[post.id || post.postId] > 0 && (
                        <span className="ml-2 text-sm text-gray-600">
                          {ratings[post.id || post.postId]?.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>

                  {visibleComments[post.id || post.postId] && (
                    <div className="mt-4">
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

      {/* Modal tạo bài viết */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        title="Create post"
        centered
      >
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={
              localStorage.getItem(
                `custom_avatar_${user?.userId || user?.id}`
              ) ||
              user?.avatar ||
              "/images/avatar.jpg"
            }
            alt="User avatar"
            className="h-10 w-10 rounded-full object-cover"
          />
          <h3 className="font-semibold">{getDisplayName(user)}</h3>
        </div>
        <textarea
          className="w-full h-32 border border-gray-300 rounded-lg p-2 resize-none"
          placeholder={`What's on your mind?`}
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <Button
          type="primary"
          block
          className="mt-4"
          onClick={handlePostSubmit}
        >
          Post
        </Button>
      </Modal>

      {/* THÊM MỚI: Modal yêu cầu nâng cấp */}
      <Modal
        open={showUpgradeModal}
        onCancel={() => setShowUpgradeModal(false)}
        footer={null}
        centered
      >
        <div className="text-center p-6">
          <FiArrowUpCircle className="mx-auto text-green-500 text-6xl mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Nâng cấp để tạo bài viết
          </h1>
          <p className="text-gray-600 mb-8">
            Gói thành viên hiện tại của bạn không hỗ trợ tính năng này. Vui lòng
            nâng cấp để chia sẻ và kết nối với cộng đồng.
          </p>
          <Button
            type="primary"
            block
            onClick={() => {
              setShowUpgradeModal(false);
              navigate("/membership");
            }}
            className="bg-green-600 hover:bg-green-700 h-11 text-lg"
          >
            Xem các gói nâng cấp
          </Button>
        </div>
      </Modal>

      {/* Modal Đăng nhập */}
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
                login({ token, email: loginEmail, avatar: "", userId: "" })
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
            navigate("/register");
          }}
        >
          Register
        </Button>
      </Modal>
    </div>
  );
};

export default Social;
