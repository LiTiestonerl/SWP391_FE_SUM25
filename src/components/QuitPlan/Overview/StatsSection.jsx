import React, { useState, useEffect } from 'react';
import {
  HiCheckCircle,
  HiCurrencyDollar,
  HiTrendingUp,
  HiThumbUp,
} from 'react-icons/hi';

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
  const [avoidedCigarettes, setAvoidedCigarettes] = useState(plan.avoidedCigarettes || 5);
  const [cigarettesToday, setCigarettesToday] = useState('');
  const totalDays = plan.totalDays || plan.durationInDays || 30;
  const progresses = plan.quitProgresses || [];

  useEffect(() => {
    const updated = { ...plan, avoidedCigarettes };
    onUpdate && onUpdate(updated);
    localStorage.setItem('quitPlan', JSON.stringify(updated));
  }, [avoidedCigarettes]);

  const handleSubmit = () => {
    if (!cigarettesToday || isNaN(cigarettesToday)) return;

    const updatedProgress = [
      ...progresses,
      {
        cigarettesPerDay: Number(cigarettesToday),
        moneySaved: 15000,
        healthStatus: {
          lung: 60,
          heart: 55,
          sense: 70,
          blood: 50,
        },
      },
    ];

    const updated = {
      ...plan,
      quitProgresses: updatedProgress,
    };
    onUpdate(updated);
    setCigarettesToday('');
  };

  const avgHealth = ['lung', 'heart', 'sense', 'blood'].reduce((acc, key) => {
    const total = progresses.reduce((sum, p) => sum + (p.healthStatus?.[key] || 0), 0);
    acc[key] = progresses.length ? Math.round(total / progresses.length) : 0;
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-6">
      <h3 className="font-semibold text-emerald-700 text-lg flex items-center gap-2">
        📊 Progress Summary
      </h3>

      {/* Box số liệu chính */}
      <div className="grid grid-cols-2 gap-4">
        <StatBox
          icon={HiCheckCircle}
          label="Completed Days"
          value={`${plan.completedDays || 4} / ${totalDays}`}
        />
        <StatBox
          icon={HiCurrencyDollar}
          label="Money Saved"
          value={`${(plan.moneySaved || 160000).toLocaleString()} VND`}
        />
        <StatBox icon={HiTrendingUp} label="Avoided Cigarettes" value={`${avoidedCigarettes} sticks`}>
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
        <StatBox
          icon={HiThumbUp}
          label="Overall Progress"
          value={`${plan.percent || 35}%`}
        />
      </div>

      {/* Nhập số điếu hút */}
      <div className="bg-gray-50 p-4 rounded shadow flex flex-col gap-3">
        <label className="text-sm font-medium text-gray-700">
          🚬 Enter today’s smoked cigarettes:
        </label>
        <div className="flex gap-3">
          <input
            type="number"
            value={cigarettesToday}
            onChange={(e) => setCigarettesToday(e.target.value)}
            placeholder="e.g. 3"
            className="border px-3 py-2 rounded w-32"
          />
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            Save
          </button>
        </div>
      </div>

      {/* Chỉ số sức khỏe */}
      <div className="bg-emerald-50 p-4 rounded">
        <h4 className="font-medium text-sm text-emerald-700 mb-1">💓 Average Health Recovery</h4>
        <ul className="text-sm text-gray-700 list-disc ml-6">
          <li>Lung: {avgHealth.lung}%</li>
          <li>Heart: {avgHealth.heart}%</li>
          <li>Taste/Smell: {avgHealth.sense}%</li>
          <li>Blood: {avgHealth.blood}%</li>
        </ul>
      </div>
    </div>
  );
};

export default StatsSection;
