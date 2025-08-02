import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../configs/axios";
import { FiCalendar, FiFilter, FiVideo, FiArrowUpCircle } from "react-icons/fi";
import { message } from "antd";
import { updateMembership } from "../../redux/features/userSlice";

const CoachPage = () => {
  const [coaches, setCoaches] = useState([]);
  const [showUpgradeMessage, setShowUpgradeMessage] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchCoaches = async () => {
    try {
      const response = await api.get("/coach");
      const list = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setCoaches(list);
    } catch (error) {
      console.error("Error fetching coaches:", error);
      setCoaches([]);
    }
  };

  useEffect(() => {
    const checkMembershipAndFetch = async () => {
      if (!user) {
        message.error("Vui lòng đăng nhập để tiếp tục.");
        navigate("/login");
        return;
      }

      try {
        const res = await api.get("/user-membership/me");
        dispatch(updateMembership(res.data));

        const membership = res.data;
        const isFreePlan = membership?.memberPackageId === 10;
        const hasNoPlan = !membership;

        if (isFreePlan || hasNoPlan) {
          setShowUpgradeMessage(true);
        } else {
          setShowUpgradeMessage(false);
          fetchCoaches();
        }
      } catch (err) {
        console.error("Không lấy được thông tin membership:", err);
        setShowUpgradeMessage(true);
      }
    };

    checkMembershipAndFetch();
  }, [user, navigate, dispatch]);

  const handleBookConsultation = (coachId) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/chat?coachId=${coachId}`);
    }
  };

  const handleViewProfile = (id) => {
    navigate(`/coach/${id}`);
  };

  if (showUpgradeMessage) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-lg mx-auto">
          <FiArrowUpCircle className="mx-auto text-green-500 text-6xl mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Nâng cấp để kết nối với Huấn luyện viên
          </h1>
          <p className="text-gray-600 mb-8">
            Gói thành viên hiện tại của bạn không bao gồm tính năng trò chuyện và tư vấn cùng Huấn luyện viên. Hãy nâng cấp để nhận được sự hỗ trợ chuyên nghiệp trên hành trình bỏ thuốc của bạn.
          </p>
          <button
            onClick={() => navigate("/membership")}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Xem các gói nâng cấp
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-50 px-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Meet Our Coaches
      </h1>

      <div className="flex justify-end mb-6">
        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100">
          <FiFilter /> Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coaches.length > 0 ? (
          coaches.map((coach) => (
            <div
              key={coach.userId}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="mb-4">
                <h2 className="text-xl font-bold">{coach.fullName}</h2>
                <p className="text-sm text-gray-500">{coach.email}</p>
                <p className="text-sm text-gray-500">{coach.phone}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewProfile(coach.userId)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
                >
                  <FiVideo /> View Profile
                </button>
                <button
                  onClick={() => handleBookConsultation(coach.userId)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
                >
                  <FiCalendar /> Chat Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            Hiện không có Huấn luyện viên nào.
          </p>
        )}
      </div>
    </div>
  );
};

export default CoachPage;
