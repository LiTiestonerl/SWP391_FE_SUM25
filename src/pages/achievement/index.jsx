import React, { useState, useEffect } from "react";
import {
  FaTrophy,
  FaMedal,
  FaStar,
  FaCheck,
  FaLock,
  FaShare,
  FaCrown,
  FaGem,
  FaAward,
} from "react-icons/fa";
import { format } from "date-fns";
import api from "../../configs/axios";

// Map icon dựa theo loại badge
const getIcon = (type) => {
  switch (type) {
    case "STREAK":
      return <FaMedal className="text-yellow-400 text-3xl" />;
    case "FINANCE":
      return <FaGem className="text-blue-500 text-3xl" />;
    case "ACHIEVEMENT":
      return <FaTrophy className="text-yellow-600 text-3xl" />;
    default:
      return <FaStar className="text-gray-400 text-3xl" />;
  }
};

const defaultAchievements = [
  {
    badgeId: "d1",
    badgeName: "Rookie Champion",
    description: "Completed first week of sobriety",
    criteria: "7 ngày liên tục không hút thuốc",
    badgeType: "STREAK",
    isUnlocked: true,
  },
  {
    badgeId: "d2",
    badgeName: "Money Saver",
    description: "Saved 500,000 VND from not smoking",
    criteria: "Tiết kiệm được 500.000đ",
    badgeType: "FINANCE",
    isUnlocked: true,
  },
  {
    badgeId: "d3",
    badgeName: "Recovery Master",
    description: "Quarter year of progress",
    criteria: "90 ngày liên tục không hút thuốc",
    badgeType: "ACHIEVEMENT",
    isUnlocked: false,
  },
];

const AchievementCard = ({ achievement, onCardClick }) => (
  <div
    onClick={() => onCardClick(achievement)}
    className={`p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer ${
      achievement.isUnlocked
        ? "bg-gradient-to-br from-indigo-50 to-purple-100"
        : "bg-gray-100 opacity-75"
    }`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        {achievement.isUnlocked ? getIcon(achievement.badgeType) : <FaLock className="text-gray-400 text-3xl" />}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{achievement.badgeName}</h3>
          <span className="text-xs font-medium text-purple-600">{achievement.badgeType}</span>
        </div>
      </div>
      {achievement.isUnlocked && (
        <FaShare className="text-gray-500 hover:text-purple-600 transition-colors duration-200" />
      )}
    </div>
    <p className="text-gray-600 mb-2">{achievement.description}</p>
    <p className="text-sm text-gray-500">
      <strong>Criteria:</strong> {achievement.criteria}
    </p>
  </div>
);

const ProgressBar = ({ progress }) => (
  <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
    <div
      className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

const AchievementModal = ({ achievement, isOpen, onClose }) => {
  if (!isOpen || !achievement) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full m-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{achievement.badgeName}</h2>
            <span className="text-sm font-medium text-purple-600">
              {achievement.badgeType}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>

        <div className="mb-6 flex items-center space-x-4">
          {getIcon(achievement.badgeType)}
          <div className="bg-purple-100 rounded-lg px-3 py-1">
            <span className="text-purple-700 font-medium">
              Criteria: {achievement.criteria}
            </span>
          </div>
        </div>

        <p className="text-gray-600 mb-4">{achievement.description}</p>

        <div className="mb-4 bg-green-50 rounded-lg p-4">
          <p className="text-green-600 font-semibold">You can earn this badge by completing the criteria.</p>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 flex items-center">
            <FaShare className="mr-2" /> Share
          </button>
        </div>
      </div>
    </div>
  );
};

const Achievement = () => {
  const [achievements, setAchievements] = useState([]);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const progress = 40;

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await api.get("/achievement-badge");
        const apiAchievements = res.data.map((badge) => ({
          ...badge,
          isUnlocked: true, // Tạm đánh dấu tất cả mở khóa
        }));

        // Gộp với mock dữ liệu có sẵn
        const combined = [...defaultAchievements, ...apiAchievements];
        setAchievements(combined);
      } catch (error) {
        console.error("Lỗi lấy danh sách huy hiệu:", error);
        // Nếu lỗi API, chỉ dùng mock thôi
        setAchievements(defaultAchievements);
      }
    };

    fetchBadges();
  }, []);

  const handleCardClick = (achievement) => {
    setSelectedAchievement(achievement);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Recovery Journey</h1>
          <p className="text-xl text-gray-600">Progress Tracker</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Overall Progress</h2>
          <ProgressBar progress={progress} />
          <p className="text-center text-gray-600 italic">
            "Every step brings you closer to a smoke-free life."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.badgeId || achievement.id}
              achievement={achievement}
              onCardClick={handleCardClick}
            />
          ))}
        </div>

        <AchievementModal
          achievement={selectedAchievement}
          isOpen={selectedAchievement !== null}
          onClose={() => setSelectedAchievement(null)}
        />
      </div>
    </div>
  );
};

export default Achievement;
