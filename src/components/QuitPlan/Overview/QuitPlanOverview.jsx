import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import PlanSummaryCard from './PlanSummaryCard';
import StatsSection from './StatsSection';
import StageList from './StageList';
import CreatePlanModal from './CreatePlanModal';
import {
  EditPlanModal,
  ConfirmDeleteModal,
  ConfirmCompleteModal
} from './PlanActions';
import AchievementBadges from './AchievementBadges';
import HealthProgressTimeline from './HealthProgressTimeline';
import CoachBox, { coachList } from './CoachBox';
import { CoachFeedbackCard, CoachSuggestionCard } from './CoachCard';
import api from '../../../configs/axios';

const getMockPlan = (d, startDate, addictionLevel = 'Mild', packageName = 'HEALTH+') => {
  const start = dayjs(startDate || dayjs());
  const end = start.add(d - 1, 'day');

  const getStagesDescription = (level) => {
    switch (level) {
      case 'Severe':
        return 'Intensive 5-stage reduction plan (25 → 13 → 9 → 5 → 1 cigs/day)';
      case 'Moderate':
        return 'Balanced 5-stage reduction plan (15 → 10 → 7 → 4 → 1 cigs/day)';
      case 'Mild':
      default:
        return 'Gradual 4-stage reduction plan (8 → 5 → 3 → 1 cigs/day)';
    }
  };

  return {
    id: 'mock-1',
    name: `Quit in ${d} Days - ${packageName || 'HEALTH+'}`,
    reason: 'Improve health',
    addictionLevel: addictionLevel,
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
    stagesDescription: getStagesDescription(addictionLevel),
    customNotes: 'Stay hydrated. Walk after meals.',
    averageCigarettes:
      addictionLevel === 'Severe' ? 25 :
        addictionLevel === 'Moderate' ? 15 : 8,
    pricePerCigarette: 1000,
    averageSpending:
      addictionLevel === 'Severe' ? 25000 :
        addictionLevel === 'Moderate' ? 15000 : 8000,
    membership: packageName,
  };
};

// ... import như cũ

const QuitPlanOverview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const memberPackageId = location?.state?.memberPackageId;

  const [plan, setPlan] = useState(() =>
    JSON.parse(localStorage.getItem("quitPlan") || "null")
  );
  const [duration, setDuration] = useState(30);
  const [membership, setMembership] = useState("HEALTH+");
  const [loading, setLoading] = useState(true);

  const [showCreate, setCreate] = useState(!plan)
  const [showEdit, setEdit] = useState(false);
  const [showDelete, setDel] = useState(false);
  const [showComplete, setComplete] = useState(false);

  useEffect(() => {
    if (plan) {
      setLoading(false);
      return;
    }

    if (!memberPackageId) {
      setLoading(false);
      return;
    }

    api
      .get("/member-packages")
      .then((res) => {
        const packages = res.data || [];
        const selected = packages.find((p) => p.memberPackageId === memberPackageId);
        if (selected) {
          setDuration(selected.duration || 30);
          setMembership(selected.packageName || "HEALTH+");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch membership packages", err);
        setDuration(7);
        setMembership("FREE"); // gói FREE thì chỉ 7 ngày
      })
      .finally(() => {
        setLoading(false);
      });
  }, [memberPackageId, plan]);

  useEffect(() => {
    if (plan) localStorage.setItem("quitPlan", JSON.stringify(plan));
  }, [plan]);

  if (loading) {
    return <div className="p-10 text-center text-gray-600">Loading...</div>;
  }

  const isExpired = plan && dayjs().isAfter(dayjs(plan.endDate));
  const noProgress = plan && (plan.completedDays || 0) === 0;
  const completedDays = dayjs().diff(dayjs(plan?.startDate), "day") + 1;
  const allCompleted = plan && completedDays >= plan.durationInDays;
  const coachObj = coachList.find((c) => c.id === plan?.coach);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c3e4dd] via-[#dfeee5] to-[#a1cfc1] py-8 px-2 sm:px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex items-center justify-between mt-18">
          <h1 className="text-4xl font-extrabold !text-emerald-700 drop-shadow tracking-wide">
            Quit Plan
          </h1>
          {plan ? (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() =>
                  navigate("/quit-plan/detail", {
                    state: {
                      startDate: plan.startDate,
                      durationInDays: plan.durationInDays || duration,
                      selectedPlan: "CUSTOM",
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

        {!plan && <p className="text-gray-500">You don't have a quit plan yet.</p>}

        {plan && (
          <>
            {/* Alerts */}
            {isExpired && (
              <div className="bg-yellow-100 text-yellow-800 p-3 rounded border border-yellow-300 text-sm">
                ⚠️ This plan has expired. Consider creating a new one.
              </div>
            )}
            {noProgress && !isExpired && (
              <div className="bg-blue-50 text-blue-700 p-3 rounded border border-blue-200 text-sm">
                🚀 You haven't completed any day yet. Let's get started!
              </div>
            )}
            {allCompleted && (
              <div className="bg-green-100 text-green-800 p-5 rounded-lg border border-green-300 text-xl font-semibold shadow-md">
                🎉 Congratulations! You've completed your Quit Plan.
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <CoachBox
                  selectedCoachId={plan.coach}
                  onSelect={(coachId) => {
                    const updated = { ...plan, coach: coachId };
                    setPlan(updated);
                    localStorage.setItem("quitPlan", JSON.stringify(updated));
                  }}
                />

                <CoachFeedbackCard
                  coachId={plan.coach}
                  coachName={coachObj?.name || "Your Coach"}
                  planId={plan.id}
                  memberId={1}
                />
              </div>

              <div className="flex flex-col gap-6">
                <PlanSummaryCard
                  plan={plan}
                  onEdit={() => setEdit(true)}
                  onDelete={() => setDel(true)}
                  onComplete={() => setComplete(true)}
                />
                <CoachSuggestionCard planId={plan.id} level={plan.addictionLevel} />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <StatsSection plan={plan} onUpdate={setPlan} />
              <StageList
                durationInDays={plan.durationInDays || duration}
                membership={plan.membership}
                startDate={plan.startDate}
                addictionLevel={plan.addictionLevel}
                planId={plan.id}
              />
            </div>

            <AchievementBadges
              completedDays={plan.completedDays}
              completedStages={
                JSON.parse(localStorage.getItem("completedStages_" + plan.id) || "[]").length
              }
            />

            <HealthProgressTimeline startDate={plan.startDate} />
          </>
        )}

        <CreatePlanModal
          open={showCreate}
          duration={duration}
          membership={membership}
          onClose={() => setCreate(false)}
          onCreate={(form) => {
            const planMembership = membership || "FREE";
            const mockPlan = getMockPlan(duration, form.startDate, form.addictionLevel, planMembership);
            setPlan({
              ...mockPlan,
              ...form,
              membership: planMembership,
            });
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
            localStorage.removeItem("quitPlan");
            setPlan(null);
            setDel(false);
          }}
        />

        <ConfirmCompleteModal
          open={showComplete}
          onClose={() => setComplete(false)}
          onConfirm={() => {
            const updated = { ...plan, status: "COMPLETED" };
            setPlan(updated);
            localStorage.setItem("quitPlan", JSON.stringify(updated));
            setComplete(false);
          }}
        />
      </div>
    </div>
  );
};

export default QuitPlanOverview;
