import React from 'react';
import dayjs from 'dayjs';

const MILESTONES = [
  { label: '20 minutes', benefit: 'Heart rate returns to normal', minutes: 20 },
  { label: '8 hours', benefit: 'Oxygen levels normalize', minutes: 480 },
  { label: '24 hours', benefit: 'Carbon monoxide eliminated', minutes: 1440 },
  { label: '72 hours', benefit: 'Lung function improves', minutes: 4320 },
  { label: '1 week', benefit: 'Sense of taste and smell improves', minutes: 10080 },
  { label: '1 month', benefit: 'Lung health increases', minutes: 43200 },
  { label: '3 months', benefit: 'Better circulation', minutes: 129600 },
  { label: '1 year', benefit: 'Heart disease risk drops 50%', minutes: 525600 },
];

const HealthProgressTimeline = ({ startDate }) => {
  const now = dayjs();
  const started = dayjs(startDate);
  const diffMinutes = now.diff(started, 'minute');

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-lg font-semibold text-emerald-700 mb-4">🩺 Health Progress</h3>
      <ol className="relative border-l border-gray-300 space-y-6 ml-2">
        {MILESTONES.map((item, i) => {
          const achieved = diffMinutes >= item.minutes;
          return (
            <li key={i} className="ml-4">
              <div
                className={`absolute w-3 h-3 rounded-full -left-1.5 top-1 ${
                  achieved ? 'bg-green-500' : 'bg-gray-400'
                }`}
              />
              <div className="text-sm font-medium text-gray-800">{item.label}</div>
              <div className={`text-xs ${achieved ? 'text-green-700' : 'text-gray-500'}`}>
                {item.benefit}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default HealthProgressTimeline;
