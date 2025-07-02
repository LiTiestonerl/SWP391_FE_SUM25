import { FaMedal, FaRegClock, FaMoneyBillWave, FaFire } from "react-icons/fa";
import { motion } from "framer-motion";

const RankStats = ({ user, personalStats, onEmergencyClick }) => {
  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
          Your Achievements
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            icon={<FaMedal className="w-12 h-12 text-yellow-400 mx-auto mb-2" />}
            value={`#${personalStats.rank}`}
            label="Your Rank"
          />
          <StatCard
            icon={<FaRegClock className="w-12 h-12 text-blue-500 mx-auto mb-2" />}
            value={personalStats.daysSmokeFree}
            label="Days Smoke-Free"
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
      </div>
    </motion.div>
  );
};

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

export default RankStats;