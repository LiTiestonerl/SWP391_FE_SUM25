import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import PlanSummaryCard from './PlanSummaryCard';
import StatsSection from './StatsSection';
import StageList from './StageList';
import CreatePlanModal from './CreatePlanModal';
import HistoryDrawer from './HistoryDrawer';
import { EditPlanModal, ConfirmDeleteModal } from './PlanActions';
import AchievementBadges from './AchievementBadges';
import HealthProgressTimeline from './HealthProgressTimeline';
import CoachBox, { coachList } from './CoachBox';
import { CoachFeedbackCard } from './CoachCard';
// import SmokingStatusSection from './SmokingStatusSection';

const useMembershipDuration = () => 30;

const getMockPlan = (d, startDate) => {
  const start = dayjs(startDate || dayjs());
  const end = start.add(d - 1, 'day');

  return {
    id: 'mock‑1',
    name: `Quit in ${d} Days`,
    reason: 'Improve health',
    addictionLevel: 'Mild',
    startDate: start.format('YYYY-MM-DD'),
    endDate: end.format('YYYY-MM-DD'),
    durationInDays: d,
    percent: 35,
    completedDays: 12,
    moneySaved: 320000,
    avoidedCigarettes: 5,
    rating: 4,
    savedComment: 'Great effort!',
    coach: null,
    quitPlanStages: [],
    quitProgresses: [],
    healthStatus: {
      lung: 70,
      heart: 60,
      sense: 75,
      blood: 65,
    },
    stagesDescription: 'Plan to reduce gradually in 2 phases.',
    customNotes: 'Stay hydrated. Walk after meals.',
  };
};

const QuitPlanOverview = () => {
  const navigate = useNavigate();
  const duration = useMembershipDuration();

  const [plan, setPlan] = useState(() =>
    JSON.parse(localStorage.getItem('quitPlan') || 'null')
  );
  const [showCreate, setCreate] = useState(!plan);
  const [showHistory, setHist] = useState(false);
  const [showEdit, setEdit] = useState(false);
  const [showDelete, setDel] = useState(false);

  useEffect(() => {
    if (plan) localStorage.setItem('quitPlan', JSON.stringify(plan));
  }, [plan]);

  const isExpired = plan && dayjs().isAfter(dayjs(plan.endDate));
  const noProgress = plan && (plan.completedDays || 0) === 0;
  const allCompleted = plan && plan.completedDays >= plan.durationInDays;
  const coachObj = coachList.find(c => c.id === plan?.coach);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c3e4dd] via-[#dfeee5] to-[#a1cfc1] py-8 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex items-center justify-between mt-18">
          <h1 className="text-4xl font-extrabold !text-emerald-700 drop-shadow tracking-wide">
            Quit Plan
          </h1>
          {plan ? (
            <div className="flex gap-2 flex-wrap">
              <button
                title="History"
                onClick={() => setHist(true)}
                className="p-2 bg-white rounded-full shadow hover:shadow-md text-gray-600 hover:text-emerald-600"
              >
                ⏲
              </button>
              <button
                onClick={() =>
                  navigate('/quit-plan/detail', {
                    state: {
                      startDate: plan.startDate,
                      durationInDays: plan.durationInDays || duration,
                      selectedPlan: 'CUSTOM',
                    },
                  })
                }
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700"
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

        {plan && (
          <>
            {isExpired && (
              <div className="bg-yellow-100 text-yellow-800 p-3 rounded border border-yellow-300 text-sm">
                ⚠️ This plan has expired. Consider creating a new one.
              </div>
            )}
            {noProgress && !isExpired && (
              <div className="bg-blue-50 text-blue-700 p-3 rounded border border-blue-200 text-sm">
                🚀 You haven’t completed any day yet. Let’s get started!
              </div>
            )}
            {allCompleted && (
              <div className="bg-green-100 text-green-800 p-3 rounded border border-green-300 text-sm">
                🎉 Congratulations! You've completed your Quit Plan.
              </div>
            )}
          </>
        )}

        {!plan && <p className="text-gray-500">You don’t have a quit plan yet.</p>}

        {plan && (
          <>
            <div className="grid lg:grid-cols-2 gap-6">
              <CoachBox
                selectedCoachId={plan.coach}
                onSelect={(coachId) => {
                  const updated = { ...plan, coach: coachId };
                  setPlan(updated);
                  localStorage.setItem('quitPlan', JSON.stringify(updated));
                }}
              />

              <div className="flex flex-col gap-6">
                <PlanSummaryCard
                  plan={plan}
                  onEdit={() => setEdit(true)}
                  onDelete={() => setDel(true)}
                />

                <CoachFeedbackCard
                  coach={coachObj?.name || 'Your Coach'}
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

            <div className="grid lg:grid-cols-2 gap-8">
              <StatsSection plan={plan} onUpdate={setPlan} />
              <StageList
                duration={plan.durationInDays}
                membership={plan.membership || "HEALTH+"}
                startDate={plan.startDate}
                description={plan.stagesDescription}
              />
            </div>

            <AchievementBadges
              completedDays={plan.completedDays}
              completedStages={
                JSON.parse(localStorage.getItem("completedStages") || "[]").length
              }
            />

            <HealthProgressTimeline startDate={plan.startDate} />

            {/* Smoking Status */}
            <SmokingStatusSection />
          </>
        )}

        {/* Modals */}
        <CreatePlanModal
          open={showCreate}
          duration={duration}
          onClose={() => setCreate(false)}
          onCreate={(form) => {
            setPlan({ ...getMockPlan(duration, form.startDate), ...form });
            setCreate(false);
          }}
        />
        <EditPlanModal
          open={showEdit}
          plan={plan}
          onClose={() => setEdit(false)}
          onSave={(newData) => {
            setPlan({ ...plan, ...newData });
            setEdit(false);
          }}
        />
        <ConfirmDeleteModal
          open={showDelete}
          onClose={() => setDel(false)}
          onConfirm={() => {
            localStorage.removeItem('quitPlan');
            setPlan(null);
            setDel(false);
          }}
        />
        <HistoryDrawer open={showHistory} onClose={() => setHist(false)} plan={plan} />
      </div>
    </div>
  );
};

export default QuitPlanOverview;
