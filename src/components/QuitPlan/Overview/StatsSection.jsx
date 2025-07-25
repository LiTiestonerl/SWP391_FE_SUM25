import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler } from 'chart.js';
import dayjs from 'dayjs';
import { 
  HiCalendar,
  HiTrendingUp,
  HiCurrencyDollar,
  HiThumbUp
} from 'react-icons/hi';

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

  const chartRef = useRef(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  // Format VND currency
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

  // Calculate current day in plan (fixed logic)
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

  // Calculate statistics with improved savings calculation
  const calculateStats = () => {
  const progresses = plan?.quitProgresses || [];
  const daysPassed = calculateCurrentDay();
  const totalCigarettes = progresses.reduce((sum, p) => sum + (p.cigarettesSmoked || 0), 0);
  const totalMoneySpent = progresses.reduce((sum, p) => sum + (p.moneySpent || 0), 0);
  
  // Chỉ tính tiết kiệm nếu có đủ thông tin chi phí trước đó
  let moneySaved = 0;
  if (plan?.averageSpending) {
    moneySaved = (plan.averageSpending * daysPassed) - totalMoneySpent;
  } else if (plan?.pricePerCigarette && plan?.averageCigarettes) {
    moneySaved = (plan.averageCigarettes * plan.pricePerCigarette * daysPassed) - totalMoneySpent;
  }
  // Nếu không có thông tin chi phí cũ thì moneySaved = 0
  
  return { 
    daysPassed,
    totalDaysTracked: progresses.length,
    avgCigarettes: progresses.length ? Math.round(totalCigarettes / progresses.length) : 0,
    moneySaved: Math.max(0, moneySaved), // Đảm bảo không âm
    progressPercent: plan?.durationInDays 
      ? Math.min(100, Math.round((daysPassed / plan.durationInDays) * 100))
      : 0
  };
};

  const { daysPassed, totalDaysTracked, avgCigarettes, moneySaved, progressPercent } = calculateStats();

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-emerald-600 p-4 text-white">
        <h2 className="text-xl font-bold">Progress Tracker</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center gap-3">
            <HiCalendar className="text-emerald-600 text-2xl" />
            <div>
              <div className="text-xs text-gray-500">Days Passed/Total</div>
              <div className="font-bold text-lg">{daysPassed}/{plan?.durationInDays || '--'}</div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center gap-3">
            <HiTrendingUp className="text-emerald-600 text-2xl" />
            <div>
              <div className="text-xs text-gray-500">Average/Day</div>
              <div className="font-bold text-lg">{avgCigarettes}</div>
            </div>
          </div>
        
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center gap-3">
            <HiCurrencyDollar className="text-emerald-600 text-2xl" />
            <div>
              <div className="text-xs text-gray-500">Money Saved</div>
              <div className="font-bold text-lg">{formatMoney(moneySaved)}</div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center gap-3">
            <HiThumbUp className="text-emerald-600 text-2xl" />
            <div>
              <div className="text-xs text-gray-500">Progress</div>
              <div className="font-bold text-lg">{progressPercent}%</div>
            </div>
          </div>
        </div>

        {/* Progress chart */}
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

        {/* Daily update form */}
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-emerald-700">Daily Update</h3>
            <div className="text-sm text-gray-500">
              {inputData.date && dayjs(inputData.date).format('dddd, DD/MM/YYYY')}
              {daysPassed > 0 && ` (Day ${daysPassed}/${plan?.durationInDays})`}
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
    </div>
  );
};

export default StatsSection;