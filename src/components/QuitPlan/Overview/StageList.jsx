import React, { useState, useEffect, useMemo } from "react";
import { Modal, Button, message } from "antd";
import dayjs from "dayjs";
import { FaCheckCircle, FaLock } from "react-icons/fa";
import UpgradePlanModal from "../Detail/UpgradePlanModal";
import { useNavigate } from "react-router-dom";

const STAGE_NOTES = (stageNum, targetCigs) => {
  const templates = [
    `Stage ${stageNum}: Target ${targetCigs} cigarettes/day`,
    `Practice urge-surfing (ride out cravings for 3–5 minutes)`,
    `Avoid triggers (coffee, stress, after meals)`,
    `Drink water and deep-breathe during urges`,
    `Reward yourself for completing the day`,
    `Reflect in your quit journal`,
    `Call a friend when tempted to smoke`,
  ];
  return templates.sort(() => 0.5 - Math.random()).slice(0, 3);
};

const generateStagesSmooth = ({
  startDate,
  durationInDays,
  initialCigarettes,
}) => {
  const start = dayjs(startDate);
  const end = start.add(durationInDays - 1, 'day'); // Calculate end date from duration
  const totalDays = end.diff(start, 'day') + 1;
  const totalStages = Math.max(1, Math.ceil(totalDays / 7));

  const init = Math.max(1, Number(initialCigarettes) || 8);

  const stages = [];
  for (let i = 1; i <= totalStages; i++) {
    const stageStart = start.add((i - 1) * 7, "day");
    const daysRemaining = totalDays - (i - 1) * 7;
    const stageDays = i === totalStages ? Math.max(1, daysRemaining) : Math.min(7, daysRemaining);

    const p = totalStages === 1 ? 1 : (i - 1) / (totalStages - 1);
    let target = i === totalStages ? 0 : Math.ceil(init * Math.pow(1 - p, 1.0));
    target = Math.max(i === totalStages ? 0 : 1, target);

    stages.push({
      stageId: i,
      stageName: i === totalStages ? `Quit Week (Week ${i})` : `Week ${i}`,
      stageStartDate: stageStart.format("YYYY-MM-DD"),
      stageEndDate: stageStart.add(stageDays - 1, "day").format("YYYY-MM-DD"),
      targetCigarettesPerDay: target,
      notes:
        i === totalStages
          ? "This is your Quit Week: aim for 0 cigarettes. Use all coping strategies."
          : STAGE_NOTES(i, target).join("\n"),
      isLocked: false,
      durationInDays: stageDays,
    });
  }
  return stages;
};

const FREE_LOCKED_EXTRA = 2;

const StageList = ({
  durationInDays = 28,
  membership = "FREE",
  startDate = dayjs().format("YYYY-MM-DD"),
  description = "",
  addictionLevel = "MILD",
  planId,
  averageCigarettes,
  quitPlanStages,
}) => {
  const navigate = useNavigate();
  const [selectedStage, setSelectedStage] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [completedStages, setCompletedStages] = useState([]);

  const isFree = (membership || "").toUpperCase() === "FREE";

  useEffect(() => {
    if (!planId) return;
    const saved = JSON.parse(localStorage.getItem(`completedStages_${planId}`)) || [];
    setCompletedStages(saved);
  }, [planId]);

  const realStages = useMemo(() => {
    if (Array.isArray(quitPlanStages) && quitPlanStages.length > 0) {
      return quitPlanStages.map((s) => ({ ...s, isLocked: false }));
    }
    return generateStagesSmooth({
      startDate,
      durationInDays,
      addictionLevel,
      initialCigarettes: averageCigarettes,
    });
  }, [startDate, durationInDays, addictionLevel, averageCigarettes, quitPlanStages?.length]);

  const visibleStages = useMemo(() => {
    if (!isFree) return realStages;
    if (realStages.length === 0) return realStages;

    const last = realStages[realStages.length - 1];
    const extraStages = [];
    for (let i = 1; i <= FREE_LOCKED_EXTRA; i++) {
      const stageId = realStages.length + i;
      const start = dayjs(last.stageEndDate).add((i - 1) * 7 + 1, "day");
      const end = start.add(6, "day");
      extraStages.push({
        stageId,
        stageName: `Week ${stageId} (Locked)`,
        stageStartDate: start.format("YYYY-MM-DD"),
        stageEndDate: end.format("YYYY-MM-DD"),
        targetCigarettesPerDay: 0,
        notes: "Locked content — upgrade to unlock.",
        isLocked: true,
        durationInDays: 7,
      });
    }
    return [...realStages, ...extraStages];
  }, [isFree, realStages]);

  const unlockedCount = useMemo(
    () => visibleStages.filter((s) => !s.isLocked).length,
    [visibleStages]
  );

  const handleStageClick = (stage) => {
    if (stage.isLocked) {
      setShowUpgradeModal(true);
    } else {
      setSelectedStage(stage);
    }
  };

  const handleCompleteStage = (stageId) => {
    if (!completedStages.includes(stageId)) {
      const updated = [...completedStages, stageId];
      setCompletedStages(updated);
      if (planId) {
        localStorage.setItem(`completedStages_${planId}`, JSON.stringify(updated));
      }
      message.success(`🎉 You've completed Week ${stageId}!`);
    }
    setSelectedStage(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-h-[420px] overflow-y-auto ring-1 ring-emerald-100">
      <h3 className="text-lg font-semibold text-emerald-700 mb-3">📅 Weekly Quit Plan</h3>

      {description && (
        <p className="text-sm text-gray-600 italic mb-4 whitespace-pre-line">{description}</p>
      )}

      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
  <h4 className="font-medium text-gray-800">Plan Timeline</h4>
  <p className="text-xs text-gray-600 mt-1">
    {dayjs(startDate).format("MMM D, YYYY")} →{" "}
    {dayjs(startDate).add(durationInDays - 1, "day").format("MMM D, YYYY")}
    {" • "}
    {unlockedCount} of {visibleStages.length} weeks unlocked
  </p>
</div>

      <ul className="space-y-3 mb-4">
        {visibleStages.map((stage) => {
          const isCompleted = completedStages.includes(stage.stageId);
          return (
            <li
              key={stage.stageId}
              onClick={() => handleStageClick(stage)}
              className={`border rounded p-3 cursor-pointer transition flex justify-between items-center ${
                stage.isLocked
                  ? "bg-gray-100 opacity-70 hover:bg-gray-200 grayscale"
                  : "hover:bg-emerald-50"
              }`}
            >
              <div>
                <div className="font-semibold text-gray-800 flex items-center gap-2">
                  {stage.stageName}
                  {isCompleted && !stage.isLocked && (
                    <FaCheckCircle className="text-green-500 text-lg" />
                  )}
                  {stage.isLocked && <FaLock className="text-yellow-600" />}
                </div>
                <div className="text-xs text-gray-500">
                  {dayjs(stage.stageStartDate).format("MMM D")} →{" "}
                  {dayjs(stage.stageEndDate).format("MMM D")}
                  <span className="ml-2">({stage.durationInDays} days)</span>
                </div>
                {isCompleted && !stage.isLocked && (
                  <div className="text-xs text-green-600 font-medium mt-1">Completed!</div>
                )}
                {stage.isLocked && (
                  <div className="text-xs text-yellow-600 font-medium mt-1">Upgrade to unlock</div>
                )}
              </div>
              <div className="text-xs text-emerald-700 font-semibold">
                🎯 {stage.targetCigarettesPerDay} cigs/day
              </div>
            </li>
          );
        })}
      </ul>

      {/* Modal xem chi tiết stage */}
      <Modal open={!!selectedStage} footer={null} onCancel={() => setSelectedStage(null)} centered>
        {selectedStage && (
          <div className="p-4 space-y-3">
            <h2 className="text-lg font-bold text-emerald-700">{selectedStage.stageName}</h2>
            <p className="text-sm text-gray-500">
              {dayjs(selectedStage.stageStartDate).format("MMM D")} →{" "}
              {dayjs(selectedStage.stageEndDate).format("MMM D")}
              <span className="ml-2">({selectedStage.durationInDays} days)</span>
            </p>
            <div className="text-sm whitespace-pre-line text-gray-700">{selectedStage.notes}</div>
            <div className="text-sm font-medium mt-3">
              🎯 Daily Target: {selectedStage.targetCigarettesPerDay} cigarettes
            </div>

            <div className="flex gap-3 mt-5">
              <Button
                onClick={() => {
                  navigate("/quit-plan/detail", {
                    state: {
                      stageId: selectedStage.stageId,
                      selectedStage,
                      planId,
                      startDate,
                      durationInDays,
                      selectedPlan: membership,
                    },
                  });
                }}
                type="primary"
                className="!bg-blue-600 hover:!bg-blue-700"
              >
                View Stage Details
              </Button>
              
              <Button
                onClick={() => handleCompleteStage(selectedStage.stageId)}
                disabled={selectedStage.isLocked || completedStages.includes(selectedStage.stageId)}
                type="primary"
                className="!bg-green-600 hover:!bg-green-700"
              >
                {selectedStage.isLocked
                  ? "Locked"
                  : completedStages.includes(selectedStage.stageId)
                  ? "Completed"
                  : "Mark Complete"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal nâng cấp */}
      <UpgradePlanModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => {
          setShowUpgradeModal(false);
          navigate("/membership");
        }}
        freeDays={Number(durationInDays) || 0}
      />
    </div>
  );
};

export default StageList;
