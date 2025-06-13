import React, { useState } from "react";
import { FaMedal, FaRegClock, FaMoneyBillWave, FaFire, FaShare } from "react-icons/fa";
import { FiAward } from "react-icons/fi";

const RankPage = () => {
  const [personalStats] = useState({
    rank: 5,
    daysSmokeFree: 45,
    caloriesSaved: 9000,
    moneySaved: 450,
    nextMilestone: 60,
    progress: 75
  });

  const [leaderboard] = useState([
    { id: 1, username: "Health_Champion", days: 365, achievements: 5 },
    { id: 2, username: "NewLife2024", days: 280, achievements: 4 },
    { id: 3, username: "FreshStart", days: 245, achievements: 4 },
    { id: 4, username: "HealthyChoice", days: 180, achievements: 3 },
    { id: 5, username: "SmokeFree_Joy", days: 150, achievements: 3 },
    { id: 6, username: "BetterMe", days: 120, achievements: 2 },
    { id: 7, username: "Determined2024", days: 90, achievements: 2 },
    { id: 8, username: "WellnessWarrior", days: 60, achievements: 1 },
    { id: 9, username: "HealthFirst", days: 45, achievements: 1 },
    { id: 10, username: "VictoryPath", days: 30, achievements: 1 }
  ]);

  const [motivationalQuotes] = useState([
    "Every breath of fresh air is a victory",
    "Your health is your wealth",
    "Small steps lead to big changes",
    "You're stronger than any craving"
  ]);

  const badges = [
    { name: "1 Week", days: 7, icon: <FiAward className="text-yellow-400" /> },
    { name: "1 Month", days: 30, icon: <FiAward className="text-blue-400" /> },
    { name: "3 Months", days: 90, icon: <FiAward className="text-purple-400" /> },
    { name: "6 Months", days: 180, icon: <FiAward className="text-red-400" /> },
    { name: "1 Year", days: 365, icon: <FiAward className="text-green-400" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-black-900 mb-4">No Smoking Champions</h1>
        <p className="text-xl text-black-600">Every day smoke-free is a victory for your health</p>
      </div>

      {/* Personal Stats Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mb-8 transform transition hover:scale-[1.02]">
        <div className="p-8">
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <FaMedal className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">#{personalStats.rank}</p>
              <p className="text-gray-600">Your Rank</p>
            </div>
            <div className="text-center">
              <FaRegClock className="w-12 h-12 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{personalStats.daysSmokeFree}</p>
              <p className="text-gray-600">Days Smoke-Free</p>
            </div>
            <div className="text-center">
              <FaFire className="w-12 h-12 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{personalStats.caloriesSaved}</p>
              <p className="text-gray-600">Calories Saved</p>
            </div>
            <div className="text-center">
              <FaMoneyBillWave className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">${personalStats.moneySaved}</p>
              <p className="text-gray-600">Money Saved</p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Progress to next milestone</span>
              <span className="text-gray-700">{personalStats.progress}%</span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full">
              <div
                className="h-4 bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${personalStats.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievement Badges</h2>
        <div className="grid grid-cols-5 gap-4">
          {badges.map((badge, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg text-center ${
                personalStats.daysSmokeFree >= badge.days ? 'bg-white shadow-lg' : 'bg-gray-100'
              } transition hover:shadow-xl`}
            >
              <div className="text-3xl mb-2">{badge.icon}</div>
              <p className="font-semibold">{badge.name}</p>
              <p className="text-sm text-gray-600">{badge.days} Days</p>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Community Leaderboard</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            <FaShare /> Share Achievement
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Smoke-Free</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Achievements</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaderboard.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.id <= 3 && (
                        <FaMedal
                          className={`mr-2 ${
                            user.id === 1
                              ? 'text-yellow-400'
                              : user.id === 2
                              ? 'text-gray-400'
                              : 'text-orange-400'
                          }`}
                        />
                      )}
                      {user.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.days} days</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-1">
                      {[...Array(user.achievements)].map((_, i) => (
                        <FiAward key={i} className="text-blue-500" />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Motivational Quote */}
        <div className="mt-8 text-center">
          <p className="text-xl italic text-gray-600">
            "{motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default RankPage;
