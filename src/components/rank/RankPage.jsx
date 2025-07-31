import React, { useState, useEffect } from "react";
import { FaMedal, FaRegClock, FaMoneyBillWave, FaFire, FaShare, FaHeart, FaComment, FaUserPlus, FaChartLine } from "react-icons/fa";
import { FiAward } from "react-icons/fi";
import { motion } from "framer-motion";
import Confetti from 'react-confetti';

const RankPage = () => {
  // ============= API INTEGRATION SPACE =============
  /* 
  Sample API integration structure:
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('YOUR_API_ENDPOINT');
        const data = await response.json();
        setUser(data.user);
        setPersonalStats(data.stats);
        setLeaderboard(data.leaderboard);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  */

  const [user] = useState({
    name: "Nguyen Van A", // Can be English or Vietnamese name
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    cigarettesPerDay: 10,
    cigarettePrice: 0.5,
    joinDate: "2024-01-01"
  });

  const [personalStats] = useState({
    rank: 5,
    daysSmokeFree: 45,
    caloriesSaved: 9000,
    moneySaved: 450,
    nextMilestone: 60,
    progress: 75,
    cravingsResisted: 28,
    healthImprovement: 35
  });

  const [leaderboard] = useState([
    { id: 1, username: "Health_Champion", avatar: "https://randomuser.me/api/portraits/women/1.jpg", days: 365, achievements: 5, likes: 124, isFollowing: false },
    { id: 2, username: "NewLife2024", avatar: "https://randomuser.me/api/portraits/men/2.jpg", days: 280, achievements: 4, likes: 98, isFollowing: true },
    { id: 3, username: "FreshStart", avatar: "https://randomuser.me/api/portraits/women/2.jpg", days: 245, achievements: 4, likes: 76, isFollowing: false },
    { id: 4, username: "HealthyChoice", avatar: "https://randomuser.me/api/portraits/men/3.jpg", days: 180, achievements: 3, likes: 65, isFollowing: false },
    { id: 5, username: "SmokeFree_Joy", avatar: "https://randomuser.me/api/portraits/women/3.jpg", days: 150, achievements: 3, likes: 54, isFollowing: false },
    { id: 6, username: "BetterMe", avatar: "https://randomuser.me/api/portraits/men/4.jpg", days: 120, achievements: 2, likes: 43, isFollowing: false },
    { id: 7, username: "Determined2024", avatar: "https://randomuser.me/api/portraits/women/4.jpg", days: 90, achievements: 2, likes: 32, isFollowing: false },
    { id: 8, username: "WellnessWarrior", avatar: "https://randomuser.me/api/portraits/men/5.jpg", days: 60, achievements: 1, likes: 21, isFollowing: false },
    { id: 9, username: "HealthFirst", avatar: "https://randomuser.me/api/portraits/women/5.jpg", days: 45, achievements: 1, likes: 15, isFollowing: false },
    { id: 10, username: "VictoryPath", avatar: "https://randomuser.me/api/portraits/men/6.jpg", days: 30, achievements: 1, likes: 10, isFollowing: false },
  ]);

  const [motivationalQuotes] = useState([
    "Every clean breath is a victory",
    "Your health is your most valuable asset",
    "Small steps lead to big changes",
    "You're stronger than any craving"
  ]);

  const [recentAchievements] = useState([
    { user: "NewLife2024", avatar: "https://randomuser.me/api/portraits/men/2.jpg", achievement: "Reached 9 months smoke-free", time: "2 hours ago" },
    { user: "HealthFirst", avatar: "https://randomuser.me/api/portraits/women/5.jpg", achievement: "Resisted smoking craving", time: "5 hours ago" },
    { user: "FreshStart", avatar: "https://randomuser.me/api/portraits/women/2.jpg", achievement: "Reached 8-month milestone", time: "1 day ago" },
  ]);

  const [showConfetti, setShowConfetti] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);

  const badges = [
    { name: "1 Week", days: 7, icon: "🥳", color: "bg-yellow-100", earned: true },
    { name: "1 Month", days: 30, icon: "🏆", color: "bg-blue-100", earned: true },
    { name: "3 Months", days: 90, icon: "🌟", color: "bg-purple-100", earned: false },
    { name: "6 Months", days: 180, icon: "💎", color: "bg-red-100", earned: false },
    { name: "1 Year", days: 365, icon: "👑", color: "bg-green-100", earned: false },
  ];

  const healthBenefits = [
    { milestone: 1, text: "Blood pressure and heart rate normalize" },
    { milestone: 7, text: "Carbon monoxide levels drop to normal" },
    { milestone: 30, text: "Lung function improves, coughing reduces" },
    { milestone: 90, text: "Blood circulation significantly improves" },
    { milestone: 180, text: "Reduced risk of cardiovascular disease" },
    { milestone: 365, text: "Heart disease risk halved compared to smokers" },
  ];

  useEffect(() => {
    if (personalStats.daysSmokeFree === 45) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [personalStats.daysSmokeFree]);

  const handleLike = (userId) => {
    // API call would go here in real implementation
  };

  const handleFollow = (userId) => {
    // API call would go here in real implementation
  };

  const handleEmergencyClick = () => {
    setEmergencyMode(true);
    setTimeout(() => setEmergencyMode(false), 10000);
  };

  const calculateHealthImprovement = (days) => {
    return Math.min(100, Math.floor((days / 365) * 100));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white font-sans">
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}

      {/* Emergency Help Modal */}
      {emergencyMode && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <h3 className="text-2xl font-bold text-red-600 mb-4">Need Emergency Help?</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Drink a glass of cold water</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Take 10 deep breaths</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Chew sugar-free gum</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Take a 5-minute walk</span>
              </li>
            </ul>
            <button 
              onClick={() => setEmergencyMode(false)}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-medium"
            >
              I'm feeling better
            </button>
          </motion.div>
        </div>
      )}

      {/* Hero Section */}
      <motion.div
        className="relative bg-cover bg-center h-64 md:h-80 flex items-end justify-center pb-12"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative text-center z-10 px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Smoke-Free Champions
          </h1>
          <p className="text-lg md:text-xl text-white max-w-2xl mx-auto">
            Every day without smoking is a victory for your health!
          </p>
        </div>
      </motion.div>

      {/* Personal Stats Section */}
      <motion.div
        className="max-w-6xl mx-auto -mt 0 px-4 sm:px-6 lg:px-8"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
          {/* Welcome Message */}
          <div className="flex flex-col md:flex-row items-center mb-6">
            <div className="flex items-center mb-4 md:mb-0 md:mr-6">
              <img 
                src={user.avatar} 
                alt="User avatar" 
                className="w-16 h-16 rounded-full border-4 border-green-200"
              />
              <div className="ml-4">
                <h2 className="text-xl font-bold text-gray-900">Welcome, {user.name}</h2>
                <p className="text-sm text-gray-600">Member since {new Date(user.joinDate).toLocaleDateString()}</p>
              </div>
            </div>
            <button 
              onClick={handleEmergencyClick}
              className="md:ml-auto px-4 py-2 bg-red-100 text-red-700 rounded-full font-medium flex items-center"
            >
              <span className="mr-2">🆘</span> Emergency Help
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
              icon={<FaMedal className="w-12 h-12 text-yellow-400 mx-auto mb-2" />}
              value={`#${personalStats.rank}`}
              label="Your Rank"
            />
            <StatCard
              icon={<FaRegClock className="w-12 h-12 text-blue-500 mx-auto mb-2" />}
              value={personalStats.daysSmokeFree}
              label="Smoke-Free Days"
            />
            <StatCard
              icon={<FaFire className="w-12 h-12 text-orange-500 mx-auto mb-2" />}
              value={personalStats.caloriesSaved.toLocaleString()}
              label="Calories Saved"
            />
            <StatCard
              icon={<FaMoneyBillWave className="w-12 h-12 text-green-500 mx-auto mb-2" />}
              value={`$${personalStats.moneySaved}`}
              label="Money Saved"
            />
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">
                Progress to Next Milestone ({personalStats.nextMilestone} days)
              </span>
              <span className="text-sm font-semibold text-green-600">
                {personalStats.progress}%
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${personalStats.progress}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Health Benefits */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Health Benefits Achieved:</h3>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600">❤️</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">Lung Health</span>
                    <span className="font-bold text-blue-600">{calculateHealthImprovement(personalStats.daysSmokeFree)}%</span>
                  </div>
                  <div className="h-2 bg-blue-100 rounded-full mt-1">
                    <div 
                      className="h-2 bg-blue-500 rounded-full" 
                      style={{ width: `${calculateHealthImprovement(personalStats.daysSmokeFree)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                {healthBenefits
                  .filter(benefit => personalStats.daysSmokeFree >= benefit.milestone)
                  .map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-sm">{benefit.text}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Badges and Recent Activity Section */}
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Badges Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Achievement Badges
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {badges.map((badge, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-xl text-center transition-all ${badge.color} ${
                  badge.earned ? "shadow-md" : "opacity-50"
                }`}
                whileHover={{ scale: badge.earned ? 1.1 : 1, y: badge.earned ? -5 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <p className="text-sm font-semibold text-gray-800">{badge.name}</p>
                <p className="text-xs text-gray-500">{badge.days} days</p>
                {badge.earned && (
                  <div className="mt-2 text-xs bg-white bg-opacity-30 rounded-full px-2 py-1">
                    Earned
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 lg:col-span-2"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentAchievements.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-start p-3 hover:bg-green-50 rounded-lg transition-colors"
                whileHover={{ x: 5 }}
              >
                <img src={item.avatar} alt="User" className="w-10 h-10 rounded-full mr-3" />
                <div className="flex-1">
                  <p className="font-medium">{item.user}</p>
                  <p className="text-sm text-gray-700">{item.achievement}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-500">{item.time}</span>
                  <button className="text-gray-400 hover:text-red-500">
                    <FaHeart />
                  </button>
                  <button className="text-gray-400 hover:text-blue-500">
                    <FaComment />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Progress Chart */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Progress</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">Last 7 days</span>
                <button className="flex items-center text-sm text-green-600">
                  <FaChartLine className="mr-1" /> View Details
                </button>
              </div>
              <div className="h-40 bg-white rounded-lg p-2">
                <div className="flex items-end h-full space-x-1">
                  {[30, 45, 60, 50, 70, 80, 75].map((value, index) => (
                    <motion.div
                      key={index}
                      className="w-8 bg-green-400 rounded-t-sm"
                      initial={{ height: 0 }}
                      animate={{ height: `${value}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Leaderboard Section */}
      <motion.div
        className="max-w-6xl mx-auto pb-12 px-4 sm:px-6 lg:px-8"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Community Leaderboard
          </h2>
          <div className="flex space-x-3 mt-3 sm:mt-0">
            <motion.button
              className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaShare /> Share
            </motion.button>
            <motion.button
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaComment /> Discuss
            </motion.button>
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-green-50">
              <tr>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Days
                </th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaderboard.map((user) => (
                <motion.tr
                  key={user.id}
                  className={`hover:bg-green-50 transition-colors duration-200 ${
                    user.id === 5 ? "bg-green-100 bg-opacity-50" : ""
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.id <= 3 && (
                        <FaMedal
                          className={`mr-2 text-lg ${
                            user.id === 1
                              ? "text-yellow-400"
                              : user.id === 2
                              ? "text-gray-400"
                              : "text-orange-400"
                          }`}
                        />
                      )}
                      <span className="font-medium">{user.id}</span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full mr-3" />
                      <span className="font-medium text-gray-800">{user.username}</span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {user.days} days
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="flex items-center text-sm text-gray-500 hover:text-red-500"
                        onClick={() => handleLike(user.id)}
                      >
                        <FaHeart className="mr-1" /> {user.likes}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleFollow(user.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.isFollowing
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.isFollowing ? "Following" : "Follow"}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Motivational Quote */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <p className="text-lg md:text-xl italic text-gray-600 font-light">
            "{motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}"
          </p>
          <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full font-medium">
            Get New Motivation
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Reusable StatCard Component
const StatCard = ({ icon, value, label }) => (
  <motion.div
    className="text-center p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors duration-300"
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}
  >
    {icon}
    <p className="text-xl font-bold text-gray-900">{value}</p>
    <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
  </motion.div>
);

export default RankPage;