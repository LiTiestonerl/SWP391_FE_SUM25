import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler } from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import {
  HiCalendar,
  HiTrendingUp,
  HiCurrencyDollar,
  HiThumbUp,
  HiX,
  HiOutlineChartBar
} from 'react-icons/hi';
import {
  FaSmokingBan,
  FaMoneyBillWave,
  FaRegCalendarAlt,
  FaHeartbeat
} from 'react-icons/fa';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);
const StatsSection = ({ plan, onUpdate }) => {
  const [inputData, setInputData] = useState({
    date: '',
    cigarettesToday: '',
    moneySpent: '',
    moneySpentNumeric: 0,
    healthStatus: {
      lung: 60,
      heart: 55,
      sense: 70,
      blood: 50
    }
  });

  const [showSmokingStats, setShowSmokingStats] = useState(false);
  const chartRef = useRef(null);

  // Format money to VND
  const formatMoney = (amount) => {
    if (!amount && amount !== 0) return '0 ₫';
    const num = Number(String(amount).replace(/[.,]/g, ''));
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(num);
  };

  // Parse money input (accepts multiple formats)
  const parseMoneyInput = (value) => {
    return Number(String(value).replace(/[^0-9]/g, ''));
  };

  // Get current tracking date
  const getTrackingDate = () => {
    if (!plan?.startDate) return dayjs().format('YYYY-MM-DD');
    const currentDay = calculateCurrentDay();
    return dayjs(plan.startDate).add(currentDay - 1, 'day').format('YYYY-MM-DD');
  };

  // Calculate current day in plan
  const calculateCurrentDay = () => {
    if (!plan?.startDate) return 0;
    const startDate = dayjs(plan.startDate);
    const today = dayjs();

    if (today.isBefore(startDate, 'day')) return 0;
    
    const daysPassed = today.diff(startDate, 'day') + 1;
    
    return Math.max(1, Math.min(daysPassed, plan.durationInDays));
  };

  // Check if date already has progress
  const dateHasProgress = (date) => {
    return plan?.quitProgresses?.some(p => p.date === date);
  };

  // Update data when plan changes
  useEffect(() => {
    const trackingDate = getTrackingDate();
    const existingProgress = plan?.quitProgresses?.find(p => p.date === trackingDate);
    
    setInputData({
      date: trackingDate,
      cigarettesToday: existingProgress?.cigarettesSmoked?.toString() || '',
      moneySpent: existingProgress?.moneySpent?.toString() || '',
      moneySpentNumeric: existingProgress?.moneySpent || 0,
      healthStatus: existingProgress?.healthStatus || {
        lung: 60,
        heart: 55,
        sense: 70,
        blood: 50
      }
    });
  }, [plan]);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!plan?.durationInDays) return { labels: [], datasets: [] };
    
    const labels = Array.from({ length: plan.durationInDays }, (_, i) => `Day ${i + 1}`);
    const data = Array(plan.durationInDays).fill(null).map((_, i) => {
      const progressDate = dayjs(plan.startDate).add(i, 'day').format('YYYY-MM-DD');
      const progress = plan.quitProgresses?.find(p => p.date === progressDate);
      return progress?.cigarettesSmoked || null;
    });

    return {
      labels,
      datasets: [{
        label: 'Cigarettes',
        data,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: (ctx) => {
          const index = ctx.dataIndex;
          const progressDate = dayjs(plan.startDate).add(index, 'day').format('YYYY-MM-DD');
          return progressDate === inputData.date ? '#10B981' : '#3B82F6';
        },
        pointRadius: (ctx) => {
          const index = ctx.dataIndex;
          const progressDate = dayjs(plan.startDate).add(index, 'day').format('YYYY-MM-DD');
          return progressDate === inputData.date ? 6 : 3;
        }
      }]
    };
  }, [plan, inputData.date]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputData.cigarettesToday) return;

    const newEntry = {
      date: inputData.date,
      dayNumber: calculateCurrentDay(),
      cigarettesSmoked: Number(inputData.cigarettesToday),
      moneySpent: inputData.moneySpentNumeric,
      healthStatus: inputData.healthStatus
    };

    const updatedProgresses = plan.quitProgresses 
      ? plan.quitProgresses.filter(p => p.date !== inputData.date)
      : [];
    
    onUpdate({
      ...plan,
      quitProgresses: [...updatedProgresses, newEntry]
    });
  };

  // Calculate statistics
  const calculateStats = () => {
    const progresses = plan?.quitProgresses || [];
    const daysPassed = calculateCurrentDay();
    const totalDays = plan?.durationInDays || 1;
    const totalCigarettes = progresses.reduce((sum, p) => sum + (p.cigarettesSmoked || 0), 0);
    const totalMoneySpent = progresses.reduce((sum, p) => sum + (p.moneySpent || 0), 0);
    const totalDaysTracked = progresses.length;
    
    let moneySaved = 0;
    if (plan?.averageSpending) {
      moneySaved = (plan.averageSpending * daysPassed) - totalMoneySpent;
    } else if (plan?.pricePerCigarette && plan?.averageCigarettes) {
      moneySaved = (plan.averageCigarettes * plan.pricePerCigarette * daysPassed) - totalMoneySpent;
    }
    
    return { 
      daysPassed,
      totalDaysTracked,
      avgCigarettes: totalDaysTracked > 0 ? (totalCigarettes / totalDaysTracked).toFixed(1) : 0,
      moneySaved: Math.max(0, moneySaved),
      progressPercent: Math.min(100, Math.round((daysPassed / totalDays) * 100)),
      totalCigarettes,
      totalMoneySpent
    };
  };

  const stats = calculateStats();

  // Smoking Stats Modal Component
  // Smoking Stats Modal Component - ĐÃ ĐƯỢC THIẾT KẾ LẠI
  const SmokingStatsModal = () => (
    <AnimatePresence>
      {showSmokingStats && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowSmokingStats(false)}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            initial={{ y: 20, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <FaSmokingBan className="text-3xl" />
                    <span>Smoking Analytics Dashboard</span>
                  </h3>
                  <p className="text-emerald-100 mt-1">
                    Detailed overview of your smoking habits and progress
                  </p>
                </div>
                <button 
                  onClick={() => setShowSmokingStats(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition"
                >
                  <HiX className="text-2xl" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-auto p-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition min-w-[200px]">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-red-50 text-red-500">
                        <FaSmokingBan className="text-2xl" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Cigarettes</p>
                        <p className="text-2xl font-bold">{stats.totalCigarettes}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Since {dayjs(plan?.startDate).format('DD/MM/YYYY')}
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition min-w-[200px]">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-blue-50 text-blue-500">
                        <HiTrendingUp className="text-2xl" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Average/Day</p>
                        <p className="text-2xl font-bold">{stats.avgCigarettes}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Based on {stats.totalDaysTracked} tracked days
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition min-w-[200px]">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-green-50 text-green-500">
                        <FaMoneyBillWave className="text-2xl" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Spent</p>
                        <p className="text-2xl font-bold">{formatMoney(stats.totalMoneySpent)}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      ≈ {formatMoney(stats.totalMoneySpent / (stats.totalDaysTracked || 1))}/day
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition min-w-[200px]">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-purple-50 text-purple-500">
                        <FaHeartbeat className="text-2xl" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Avg Health</p>
                        <p className="text-2xl font-bold">
                          {plan?.quitProgresses?.length ? 
                            Math.round(plan.quitProgresses.reduce((sum, p) => sum + (
                              (p.healthStatus?.lung + 
                               p.healthStatus?.heart + 
                               p.healthStatus?.sense + 
                               p.healthStatus?.blood) / 4
                            ), 0) / plan.quitProgresses.length) : '--'}%
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Overall health score
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center gap-2">
                            <FaRegCalendarAlt />
                            Date
                          </div>
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Cigarettes
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Money Spent
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Health Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[...(plan?.quitProgresses || [])]
                        .sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix())
                        .map((progress, i) => (
                          <tr key={i} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {dayjs(progress.date).format('ddd, DD MMM YYYY')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold">
                              {progress.cigarettesSmoked}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              {formatMoney(progress.moneySpent)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <div className="inline-flex items-center gap-2">
                                <div 
                                  className={`h-2 w-2 rounded-full ${
                                    progress.healthStatus?.lung > 70 ? 'bg-green-500' :
                                    progress.healthStatus?.lung > 50 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                />
                                {Math.round(
                                  (progress.healthStatus?.lung + 
                                   progress.healthStatus?.heart + 
                                   progress.healthStatus?.sense + 
                                   progress.healthStatus?.blood) / 4
                                )}%
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Last updated: {dayjs().format('HH:mm, DD/MM/YYYY')}
              </div>
              <button
                onClick={() => setShowSmokingStats(false)}
                className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition shadow-sm"
              >
                Close Dashboard
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-emerald-600 p-4 text-white">
        <h2 className="text-xl font-bold">Progress Tracker</h2>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center gap-3">
            <HiCalendar className="text-emerald-600 text-2xl" />
            <div>
              <div className="text-xs text-gray-500">Days Passed/Total</div>
              <div className="font-bold text-lg">{stats.daysPassed}/{plan?.durationInDays || '--'}</div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center gap-3">
            <HiTrendingUp className="text-emerald-600 text-2xl" />
            <div className="flex-1">
              <div className="text-xs text-gray-500">Average/Day</div>
              <div className="font-bold text-lg flex items-center gap-2">
                {stats.avgCigarettes}
                <button 
                  onClick={() => setShowSmokingStats(true)}
                  className="text-gray-400 hover:text-emerald-600 transition"
                  title="View detailed stats"
                >
                  <HiOutlineChartBar className="text-lg" />
                </button>
              </div>
              {stats.totalDaysTracked > 0 && (
                <div className="text-xs text-gray-500">
                  ({stats.totalDaysTracked} days tracked)
                </div>
              )}
            </div>
          </div>
        
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center gap-3">
            <HiCurrencyDollar className="text-emerald-600 text-2xl" />
            <div>
              <div className="text-xs text-gray-500">Money Saved</div>
              <div className="font-bold text-lg">{formatMoney(stats.moneySaved)}</div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center gap-3">
            <HiThumbUp className="text-emerald-600 text-2xl" />
            <div>
              <div className="text-xs text-gray-500">Progress</div>
              <div className="font-bold text-lg">{stats.progressPercent}%</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <Line 
            ref={chartRef}
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const label = context.dataset.label || '';
                      const value = context.raw !== null ? context.raw : 'No data';
                      return `${label}: ${value}`;
                    }
                  }
                }
              },
              scales: {
                y: { 
                  beginAtZero: true,
                  title: { display: true, text: 'Cigarettes' }
                },
                x: {
                  title: { display: true, text: 'Day in plan' }
                }
              }
            }}
            id="stats-chart"
          />
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-emerald-700">Daily Update</h3>
            <div className="text-sm text-gray-500">
              {inputData.date && dayjs(inputData.date).format('dddd, DD/MM/YYYY')}
              {stats.daysPassed > 0 && ` (Day ${stats.daysPassed}/${plan?.durationInDays})`}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="mt-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cigarettes smoked today
              </label>
              <input
                type="number"
                value={inputData.cigarettesToday}
                onChange={(e) => setInputData({
                  ...inputData,
                  cigarettesToday: e.target.value
                })}
                className="w-full border px-3 py-2 rounded-md h-[42px]"
                min="0"
                max="100"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Money spent (VND)
              </label>
              <input
                type="text"
                value={inputData.moneySpent}
                onChange={(e) => {
                  const rawValue = e.target.value;
                  const numericValue = parseMoneyInput(rawValue);
                  
                  setInputData({
                    ...inputData,
                    moneySpent: rawValue,
                    moneySpentNumeric: numericValue
                  });
                }}
                className="w-full border px-3 py-2 rounded-md h-[42px]"
                placeholder="20.000"
              />
              <div className="text-xs text-gray-500 mt-1">
                Example: 20000, 20,000 or 20.000
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={dateHasProgress(inputData.date)}
              className={`w-full py-2 rounded transition ${
                dateHasProgress(inputData.date)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {dateHasProgress(inputData.date) 
                ? "Today's progress already saved"
                : "Save today's progress"}
            </button>
          </div>
        </form>
      </div>

      <SmokingStatsModal />
    </div>
  );
};

export default StatsSection;