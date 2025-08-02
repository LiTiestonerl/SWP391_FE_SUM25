import React from 'react';
import { motion } from 'framer-motion';

const NoSmokingMotivation = ({ 
  smokingFreeDays, 
  healthImprovements, 
  moneySaved, 
  cigarettesAvoided 
}) => {
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200 shadow-lg"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="text-5xl">🚭</div>
        <div>
          <h2 className="text-2xl font-bold text-emerald-700">Your No Smoking Progress</h2>
          <p className="text-emerald-600">Every smoke-free day is a victory!</p>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg p-4 shadow-md border border-emerald-100"
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl">📅</div>
            <div>
              <div className="text-2xl font-bold text-emerald-700">{smokingFreeDays}</div>
              <div className="text-sm text-gray-600">Smoke-Free Days</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg p-4 shadow-md border border-emerald-100"
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl">💰</div>
            <div>
              <div className="text-lg font-bold text-emerald-700">{formatMoney(moneySaved)}</div>
              <div className="text-sm text-gray-600">Money Saved</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg p-4 shadow-md border border-emerald-100"
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl">🚬</div>
            <div>
              <div className="text-2xl font-bold text-emerald-700">{cigarettesAvoided}</div>
              <div className="text-sm text-gray-600">Cigarettes Avoided</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Health Improvements */}
      {healthImprovements.length > 0 && (
        <div className="bg-white rounded-lg p-4 border border-emerald-100">
          <h3 className="text-lg font-semibold text-emerald-700 mb-3 flex items-center gap-2">
            <span className="text-2xl">🌟</span>
            Health Improvements
          </h3>
          <div className="grid md:grid-cols-2 gap-2">
            {healthImprovements.map((improvement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 text-sm text-gray-700 bg-emerald-50 rounded-lg p-2"
              >
                <span className="text-green-500">✓</span>
                {improvement}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Motivational Messages */}
      <div className="mt-6 text-center">
        <div className="bg-emerald-100 rounded-lg p-4 border border-emerald-200">
          <div className="text-4xl mb-2">🎯</div>
          <p className="text-emerald-800 font-medium">
            {smokingFreeDays === 0 
              ? "Today is the perfect day to start your smoke-free journey!"
              : smokingFreeDays === 1
              ? "Amazing! You've completed your first smoke-free day!"
              : smokingFreeDays < 7
              ? `You're doing great! ${smokingFreeDays} days smoke-free and counting!`
              : smokingFreeDays < 30
              ? `Incredible progress! ${smokingFreeDays} days without smoking!`
              : `Outstanding achievement! ${smokingFreeDays} days smoke-free - you're a champion!`
            }
          </p>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="text-lg font-semibold text-blue-700 mb-3 flex items-center gap-2">
          <span className="text-2xl">💡</span>
          Daily Tips for Success
        </h4>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-blue-700">
            <span>🚶‍♂️</span>
            Take a walk when you feel the urge
          </div>
          <div className="flex items-center gap-2 text-blue-700">
            <span>💧</span>
            Stay hydrated with water
          </div>
          <div className="flex items-center gap-2 text-blue-700">
            <span>🧘‍♀️</span>
            Practice deep breathing exercises
          </div>
          <div className="flex items-center gap-2 text-blue-700">
            <span>🍎</span>
            Keep healthy snacks nearby
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NoSmokingMotivation;
