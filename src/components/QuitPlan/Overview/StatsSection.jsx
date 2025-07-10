import React, { useState, useEffect } from 'react';
import { HiCheckCircle, HiCurrencyDollar, HiTrendingUp, HiThumbUp } from 'react-icons/hi';

const StatBox = ({ icon: Icon, label, value, children }) => (
  <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow justify-between">
    <div className="flex items-center gap-3">
      <Icon className="text-emerald-600 text-2xl shrink-0" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-bold text-gray-800">{value}</p>
      </div>
    </div>
    {children}
  </div>
);

const StatsSection = ({ plan, onUpdate }) => {
  const [avoidedCigarettes, setAvoidedCigarettes] = useState(plan.avoidedCigarettes ||5);
  const totalDays = plan.totalDays || 90;

  useEffect(() => {
    const updated = { ...plan, avoidedCigarettes };
    onUpdate && onUpdate(updated);
    localStorage.setItem('quitPlan', JSON.stringify(updated));
  }, [avoidedCigarettes]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-6">
      <h3 className="font-semibold text-emerald-700 text-lg flex items-center gap-2">📊 Progress Summary</h3>
      <div className="grid grid-cols-2 gap-4">
        <StatBox icon={HiCheckCircle} label="Completed Days" value={`${plan.completedDays || 4} / ${totalDays}`} />
        <StatBox icon={HiCurrencyDollar} label="Money Saved" value={`${(plan.moneySaved || 160000).toLocaleString()} VND`} />
        <StatBox
          icon={HiTrendingUp}
          label="Avoided Cigarettes"
          value={`${avoidedCigarettes} sticks`}
        >
          <div className="flex gap-1 items-center">
            <button
              onClick={() => setAvoidedCigarettes((prev) => Math.max(0, prev - 1))}
              className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
            >
              −
            </button>
            <button
              onClick={() => setAvoidedCigarettes((prev) => prev + 1)}
              className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
            >
              +
            </button>
          </div>
        </StatBox>
        <StatBox icon={HiThumbUp} label="Overall Progress" value={`${plan.percent || 35}%`} />
      </div>
    </div>
  );
};

export default StatsSection;
