import React, { useState } from "react";
import {
  FaTrophy, FaMedal, FaStar, FaCheck, FaLock, FaShare,
  FaCrown, FaGem, FaAward
} from "react-icons/fa";
import { format } from "date-fns";
// import { fetchAchievementByName } from "./service";

const achievements = [
  {
    id: 1,
    name: "Rookie Champion",
    description: "Completed first week of sobriety",
    dateEarned: "2024-01-01",
    isUnlocked: true,
    category: "milestone",
    icon: <FaMedal className="text-yellow-400 text-3xl" />,
    xp: 100,
    reward: "Bronze Badge"
  },
  {
    id: 2,
    name: "Warrior's Spirit",
    description: "Maintained sobriety for 30 days",
    dateEarned: "2024-01-24",
    isUnlocked: true,
    category: "milestone",
    icon: <FaTrophy className="text-yellow-600 text-3xl" />,
    xp: 500,
    reward: "Silver Trophy"
  },
  {
    id: 3,
    name: "Recovery Master",
    description: "Quarter year of transformative progress",
    dateEarned: null,
    isUnlocked: false,
    category: "milestone",
    icon: <FaCrown className="text-yellow-500 text-3xl" />,
    xp: 1000,
    reward: "Gold Crown"
  },
  {
    id: 4,
    name: "Daily Warrior",
    description: "Complete 7 consecutive daily check-ins",
    dateEarned: "2024-01-15",
    isUnlocked: true,
    category: "daily",
    icon: <FaGem className="text-blue-500 text-3xl" />,
    xp: 200,
    reward: "Sapphire Gem"
  },
  {
    id: 5,
    name: "Community Hero",
    description: "Help 5 other members in their journey",
    dateEarned: null,
    isUnlocked: false,
    category: "social",
    icon: <FaAward className="text-purple-500 text-3xl" />,
    xp: 300,
    reward: "Community Badge"
  }
];

const AchievementCard = ({ achievement, onCardClick }) => {
  return (
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
        {achievement.isUnlocked && (
          <FaShare className="text-gray-500 hover:text-purple-600 transition-colors duration-200" />
        )}
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
};

const ProgressBar = ({ progress }) => (
  <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
    <div
      className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

const AchievementModal = ({ achievement, isOpen, onClose }) => {
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
          {achievement.isUnlocked && (
            <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 flex items-center">
              <FaShare className="mr-2" /> Share
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Achievement = () => {
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const totalDays = 30;
  const progress = 40;

  const handleCardClick = async (achievement) => {
    try {
      const apiData = await fetchAchievementByName(achievement.name);
      const enrichedAchievement = {
        ...achievement,
        description: apiData.description,
        criteria: apiData.criteria,
        badgeId: apiData.badgeId,
      };
      setSelectedAchievement(enrichedAchievement);
    } catch (error) {
      alert("Không thể lấy thông tin huy hiệu.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Recovery Journey</h1>
          <p className="text-xl text-gray-600">{totalDays} Days of Progress</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Overall Progress</h2>
          <ProgressBar progress={progress} />
          <p className="text-center text-gray-600 italic">
            "Every day is a new opportunity to grow stronger and move forward."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
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
