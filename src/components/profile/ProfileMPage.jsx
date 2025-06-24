import React, { useState, useEffect } from "react";
import {
  FiEdit2,
  FiAward,
  FiHeart,
  FiDollarSign,
  FiCalendar,
  FiBook,
  FiActivity,
  FiTarget,
  FiMessageSquare,
} from "react-icons/fi";

const ProfileMPage = () => {
  const [user] = useState({
    name: "John Doe",
    quitDate: "2024-01-01",
    avatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200",
    initialCigarettesPerDay: 20,
    costPerPack: 10,
    cigarettesPerPack: 20,
  });

  const [healthMetrics] = useState({
    lungCapacity: 85,
    heartRate: 72,
    cancerRiskReduction: 30,
    lifeYearsGained: 5,
  });

  const calculateDaysSmokeFree = () => {
    const quitDate = new Date(user.quitDate);
    const today = new Date();
    return Math.floor((today - quitDate) / (1000 * 60 * 60 * 24));
  };

  const calculateMoneySaved = () => {
    const days = calculateDaysSmokeFree();
    const dailyCost =
      (user.initialCigarettesPerDay / user.cigarettesPerPack) *
      user.costPerPack;
    return (days * dailyCost).toFixed(2);
  };

  const motivationalQuotes = [
    "Every day smoke-free is a victory!",
    "Your lungs are getting stronger each day",
    "You're proving your strength with every moment",
  ];

  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setCurrentQuote(motivationalQuotes[randomIndex]);
    }, 10000);
    return () => clearInterval(interval);
  }, );

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-start justify-center gap-6 mt-20">
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow">
            <div className="relative">
              <div className="h-32 bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-lg"></div>
              <img
                src={user.avatar}
                alt="Profile"
                className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
            </div>
            <div className="pt-16 p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500 mt-1">
                Smoke-free since {user.quitDate}
              </p>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-2/3 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Smoke-Free Progress
                </h3>
                <FiAward className="text-blue-600 text-2xl" />
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-blue-600">
                  {calculateDaysSmokeFree()} Days
                </div>
                <div className="mt-4 h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-2 bg-blue-600 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (calculateDaysSmokeFree() / 365) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Money Saved
                </h3>
                <FiDollarSign className="text-green-600 text-2xl" />
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-green-600">
                  ${calculateMoneySaved()}
                </div>
                <p className="text-gray-500 mt-2">Based on previous habits</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Health Progress
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(healthMetrics).map(([key, value]) => (
                <div key={key} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    {key === "lungCapacity" && (
                      <FiActivity className="text-blue-500" />
                    )}
                    {key === "heartRate" && (
                      <FiHeart className="text-red-500" />
                    )}
                    {key === "cancerRiskReduction" && (
                      <FiTarget className="text-purple-500" />
                    )}
                    {key === "lifeYearsGained" && (
                      <FiCalendar className="text-green-500" />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </span>
                  </div>
                  <div className="mt-2 text-2xl font-bold text-gray-900">
                    {typeof value === "number"
                      ? `${value}${key === "heartRate" ? " BPM" : "%"}`
                      : value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="flex items-start space-x-4">
              <FiBook className="text-blue-600 text-xl mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">
                  Daily Motivation
                </h4>
                <p className="text-gray-700 mt-2 text-lg">"{currentQuote}"</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 pt-4 border-t">
              <FiMessageSquare className="text-gray-500 text-xl mt-1" />
              <div className="w-full">
                <h4 className="font-semibold text-gray-900 mb-1">
                  Your Comment
                </h4>
                <textarea
                  rows={3}
                  placeholder="Share your thoughts or motivation..."
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileMPage;
