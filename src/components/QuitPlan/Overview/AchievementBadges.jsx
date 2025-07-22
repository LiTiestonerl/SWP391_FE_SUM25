import React, { useMemo, useState } from 'react';
import { FaCheckCircle, FaLock, FaShareAlt, FaAward, FaInfoCircle } from 'react-icons/fa';
import { message, Modal } from 'antd';

const BADGES = [
  { id: 1, label: 'First Step', days: 1, description: 'Complete your first day without smoking!' },
  { id: 2, label: 'One Week', days: 7, description: 'Stay smoke-free for 7 days!' },
  { id: 3, label: 'Halfway', days: 15, description: 'You’re halfway through your journey!' },
  { id: 4, label: 'Finish Line', days: 30, description: 'You’ve completed a full 30-day plan!' },
  { id: 5, label: '3 Stages Done', stages: 3, description: 'Completed 3 plan stages.' },
  { id: 6, label: 'All Stages Completed', stages: 5, description: 'You completed all stages of your quit plan!' },
];

const shareBadge = (id, label) => {
  message.success(`🎉 Badge "${label}" shared successfully!`);
};

const AchievementBadges = ({ completedDays = 0, completedStages = 0 }) => {
  const [selectedBadge, setSelectedBadge] = useState(null);

  const badgeStatus = useMemo(() => {
    return BADGES.map((badge) => {
      const unlocked = badge.days
        ? completedDays >= badge.days
        : completedStages >= badge.stages;
      return { ...badge, unlocked };
    });
  }, [completedDays, completedStages]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-lg font-semibold text-emerald-700 mb-4 flex items-center gap-2">
        <FaAward className="text-yellow-500" /> Achievements
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm">
        {badgeStatus.map((badge) => (
          <div
            key={badge.id}
            className={`flex flex-col items-center justify-center border rounded-lg p-3 text-center transition group relative cursor-pointer ${
              badge.unlocked
                ? 'bg-green-50 border-green-300'
                : 'bg-gray-50 border-gray-200 opacity-70'
            }`}
            onClick={() => badge.unlocked && setSelectedBadge(badge)}
          >
            <div className="text-3xl mb-1">
              {badge.unlocked ? (
                <FaCheckCircle className="text-green-600 scale-110" />
              ) : (
                <FaLock className="text-gray-400" />
              )}
            </div>
            <div className="font-semibold text-gray-800">{badge.label}</div>
            <div className="text-xs text-gray-500">
              {badge.days
                ? `${badge.days} day${badge.days > 1 ? 's' : ''}`
                : `${badge.stages} stage${badge.stages > 1 ? 's' : ''}`}
            </div>

            {badge.unlocked && (
              <div className="absolute top-2 right-2 text-gray-400 group-hover:text-emerald-600 transition">
                <FaInfoCircle />
              </div>
            )}

            {badge.unlocked && (
              <button
                className="mt-2 text-xs text-blue-600 flex items-center gap-1 hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  shareBadge(badge.id, badge.label);
                }}
              >
                <FaShareAlt /> Share
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Badge detail modal */}
      <Modal
        open={!!selectedBadge}
        footer={null}
        onCancel={() => setSelectedBadge(null)}
        centered
      >
        {selectedBadge && (
          <div className="p-4">
            <h2 className="text-xl font-bold text-emerald-700 mb-2">
              🏅 {selectedBadge.label}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {selectedBadge.description}
            </p>
            <div className="text-sm text-gray-500">
              Requirement:{" "}
              {selectedBadge.days
                ? `${selectedBadge.days} day(s)`
                : `${selectedBadge.stages} stage(s)`}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AchievementBadges;
