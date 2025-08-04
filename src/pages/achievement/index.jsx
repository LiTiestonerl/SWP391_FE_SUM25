import React, { useState, useEffect } from "react";
import {
  FaTrophy, FaMedal, FaStar, FaCheck, FaLock, FaShare,
  FaCrown, FaGem, FaAward
} from "react-icons/fa";
import { format } from "date-fns";
import api from "../../configs/axios";

const getIcon = (badgeName) => {
  switch (badgeName) {
    case "Rookie Champion":
      return <FaMedal className="text-yellow-400 text-3xl" />;
    case "Warrior's Spirit":
      return <FaTrophy className="text-yellow-600 text-3xl" />;
    case "Recovery Master":
      return <FaCrown className="text-yellow-500 text-3xl" />;
    case "Daily Warrior":
      return <FaGem className="text-blue-500 text-3xl" />;
    case "Community Hero":
      return <FaAward className="text-purple-500 text-3xl" />;
    default:
      return <FaStar className="text-gray-400 text-3xl" />;
  }
};

const AchievementCard = ({ achievement, onCardClick }) => (
  <div
    onClick={() => onCardClick(achievement)}
    className={`p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer ${achievement.isUnlocked ? "bg-gradient-to-br from-indigo-50 to-purple-100" : "bg-gray-100 opacity-75"}`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        {achievement.isUnlocked ? achievement.icon : <FaLock className="text-gray-400 text-3xl" />}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{achievement.name}</h3>
          <span className="text-xs font-medium text-purple-600">+{achievement.xp} XP</span>
        </div>
      </div>
      {achievement.isUnlocked && <FaShare className="text-gray-500 hover:text-purple-600 transition-colors duration-200" />}
    </div>
    <p className="text-gray-600 mb-3">{achievement.description}</p>
    <div className="flex justify-between items-center">
      <span className="text-xs font-medium text-indigo-600">Reward: {achievement.reward}</span>
      {achievement.isUnlocked ? (
        <p className="text-sm text-green-600">Earned: {format(new Date(achievement.dateEarned), "MMMM dd, yyyy")}</p>
      ) : (
        <p className="text-sm text-gray-500">Locked</p>
      )}
    </div>
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

const AchievementModal = ({ achievement, isOpen, onClose, onUpdate }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full m-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{achievement.name}</h2>
            <span className="text-sm font-medium text-purple-600">+{achievement.xp} XP</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>
        <div className="mb-6 flex items-center space-x-4">
          {achievement.icon}
          <div className="bg-purple-100 rounded-lg px-3 py-1">
            <span className="text-purple-700 font-medium">Reward: {achievement.reward}</span>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{achievement.description}</p>
        {achievement.criteria && (
          <div className="text-sm text-gray-700 mb-4">
            <strong>Criteria:</strong> {achievement.criteria}
          </div>
        )}
        {achievement.isUnlocked ? (
          <div className="mb-4 bg-green-50 rounded-lg p-4">
            <p className="text-green-600 font-semibold">
              Unlocked on {format(new Date(achievement.dateEarned), "MMMM dd, yyyy")}
            </p>
          </div>
        ) : (
          <div className="mb-4 bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600">Complete the required tasks to unlock this achievement!</p>
          </div>
        )}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            Close
          </button>
          <button
            onClick={() => onUpdate(achievement)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Cập nhật thành tựu
          </button>
        </div>
      </div>
    </div>
  );
};

const Achievement = () => {
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [allBadges, setAllBadges] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    fetchAllBadges();
    fetchUserAchievements();
  }, []);

  const fetchAllBadges = async () => {
    try {
      const res = await api.get("/achievement-badge");
      setAllBadges(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách huy hiệu:", error);
    }
  };

  const fetchUserAchievements = async () => {
    try {
      const res = await api.get("/achievement/user");
      setUserAchievements(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy thành tựu người dùng:", error);
    }
  };

  const fetchBadgeByName = async (badgeName) => {
    try {
      const res = await api.get(`/achievement-badge/name/${encodeURIComponent(badgeName)}`);
      const badge = res.data;
      const matched = userAchievements.find((ua) => ua.badgeName === badge.badgeName);
      const achievement = {
        id: badge.badgeId,
        name: badge.badgeName,
        description: badge.description,
        criteria: badge.criteria,
        isUnlocked: !!matched,
        dateEarned: matched?.dateEarned || null,
        category: badge.badgeType,
        xp: 100,
        reward: "TBD",
        icon: getIcon(badge.badgeName)
      };
      setSelectedAchievement(achievement);
    } catch (error) {
      alert("Không tìm thấy huy hiệu!");
    }
  };

  const updateBadge = async (achievement) => {
    try {
      await api.put(`/achievement-badge/${achievement.id}`, {
        badgeId: achievement.id,
        badgeName: achievement.name,
        description: achievement.description,
        criteria: achievement.criteria,
        badgeType: achievement.category
      });
      alert("Đã cập nhật thành tựu.");
      fetchAllBadges();
      setSelectedAchievement(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật huy hiệu:", error);
    }
  };

  const achievements = allBadges.map((badge) => {
    const matched = userAchievements.find((ua) => ua.badgeName === badge.badgeName);
    const isUnlocked = !!matched;
    return {
      id: badge.badgeId,
      name: badge.badgeName,
      description: badge.description,
      criteria: badge.criteria,
      isUnlocked,
      dateEarned: matched?.dateEarned || null,
      category: badge.badgeType,
      xp: 100,
      reward: "TBD",
      icon: getIcon(badge.badgeName)
    };
  });

  const unlocked = achievements.filter(a => a.isUnlocked);
  const locked = achievements.filter(a => !a.isUnlocked);
  const progress = achievements.length === 0 ? 0 : Math.floor((unlocked.length / achievements.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Recovery Journey</h1>
          <p className="text-xl text-gray-600">Overall Achievement Progress</p>
        </div>

        {/* 🔍 Tìm huy hiệu theo tên */}
        <div className="mb-8 flex justify-center items-center space-x-4">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Nhập tên huy hiệu..."
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={() => fetchBadgeByName(searchName)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Tìm kiếm
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Overall Progress</h2>
          <ProgressBar progress={progress} />
          {userAchievements.length === 0 && (
            <p className="text-center text-gray-500 italic">
              Bạn chưa đạt được thành tựu nào.
            </p>
          )}
        </div>

        <div className="mb-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">🎉 Thành tựu đã đạt</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unlocked.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                onCardClick={setSelectedAchievement}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">🔒 Thành tựu chưa đạt</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locked.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                onCardClick={setSelectedAchievement}
              />
            ))}
          </div>
        </div>

        <AchievementModal
          achievement={selectedAchievement}
          isOpen={selectedAchievement !== null}
          onClose={() => setSelectedAchievement(null)}
          onUpdate={updateBadge}
        />
      </div>
    </div>
  );
};

export default Achievement;