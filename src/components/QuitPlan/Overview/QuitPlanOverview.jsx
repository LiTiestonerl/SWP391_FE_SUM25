import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import PlanSummaryCard from './PlanSummaryCard';
import StatsSection from './StatsSection';
import StageList from './StageList';
import QuitJournal from './QuitJournal';
import { CoachSuggestionCard, CoachFeedbackCard } from './CoachCard';
import CreatePlanModal from './CreatePlanModal';
import HistoryDrawer from './HistoryDrawer';

// 🔐 Giả lập Membership Duration (90 ngày)
const useMembershipDuration = () => 90;

// 🎯 Mock plan dữ liệu mẫu khi tạo mới
const getMockPlan = (d) => ({
  id: 'mock‑1',
  name: `Quit in ${d} Days`,
  reason: 'Improve health',
  coach: 'Coach John',
  addictionLevel: 'Mild',
  startDate: dayjs().format('YYYY-MM-DD'),
  endDate: dayjs().add(d, 'day').format('YYYY-MM-DD'),

  // 🔢 Dữ liệu thống kê
  percent: 35,
  completedDays: 12,
  moneySaved: 320000,
  avoidedCigarettes: 5,

  // ⭐ Coach feedback mặc định (do coach đánh giá)
  rating: 4,
  savedComment: 'Great effort!',

  // ⭐ User feedback ban đầu là rỗng
  userRating: 0,
  userComment: '',

  stages: [
    {
      name: 'Reduce to 5/day',
      start: 'Day 1',
      end: `Day ${d / 3}`,
      status: 'Ongoing',
    },
    {
      name: 'Avoid coffee',
      start: `Day ${d / 3 + 1}`,
      end: `Day ${(2 * d) / 3}`,
      status: 'Upcoming',
    },
  ],
});

const QuitPlanOverview = () => {
  const navigate = useNavigate();
  const duration = useMembershipDuration();

  const [plan, setPlan] = useState(() =>
    JSON.parse(localStorage.getItem('quitPlan') || 'null')
  );
  const [showCreate, setCreate] = useState(!plan);
  const [showHistory, setHist] = useState(false);

  useEffect(() => {
    if (plan) localStorage.setItem('quitPlan', JSON.stringify(plan));
  }, [plan]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c3e4dd] via-[#dfeee5] to-[#a1cfc1] py-8 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* 🔰 HEADER */}
        <div className="flex items-center justify-between mt-18">
          <h1 className="text-4xl font-extrabold !text-emerald-700 drop-shadow tracking-wide">
            Quit Plan
          </h1>

          {plan ? (
            <div className="flex gap-4">
              <button
                title="History"
                onClick={() => setHist(true)}
                className="p-2 bg-white rounded-full shadow hover:shadow-md text-gray-600 hover:text-emerald-600"
              >
                ⏲
              </button>
              <button
                onClick={() => navigate('/quit-plan/detail')}
                className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700"
              >
                View Detail
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCreate(true)}
              className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700"
            >
              Create Plan
            </button>
          )}
        </div>

        {!plan && <p className="text-gray-500">You don’t have a quit plan yet.</p>}

        {/* 📦 Nội dung chính */}
        {plan && (
          <>
            <PlanSummaryCard plan={plan} />

            <div className="grid lg:grid-cols-2 gap-8">
              <StatsSection plan={plan} />
              <StageList stages={plan.stages} />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <QuitJournal />

              <div className="grid gap-6">
                <CoachSuggestionCard level={plan.addictionLevel} />

                <CoachFeedbackCard
                  coach={plan.coach}
                  coachComment={plan.savedComment}
                  coachRating={plan.rating}
                  savedRating={plan.userRating}
                  savedComment={plan.userComment}
                  onSave={(rating, comment) => {
                    const updated = {
                      ...plan,
                      userRating: rating,
                      userComment: comment,
                    };
                    setPlan(updated);
                    localStorage.setItem('quitPlan', JSON.stringify(updated));
                  }}
                />
              </div>
            </div>
          </>
        )}

        {/* 📦 Modals */}
        <CreatePlanModal
          open={showCreate}
          duration={duration}
          onClose={() => setCreate(false)}
          onCreate={(form) => {
            setPlan({ ...getMockPlan(duration), ...form });
            setCreate(false);
          }}
        />

        <HistoryDrawer open={showHistory} onClose={() => setHist(false)} plan={plan} />
      </div>
    </div>
  );
};

export default QuitPlanOverview;
