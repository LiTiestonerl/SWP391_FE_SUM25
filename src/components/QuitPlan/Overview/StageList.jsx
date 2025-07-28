import React, { useState, useEffect } from "react";
import { Modal, Button, message } from "antd";
import dayjs from "dayjs";
import { FaCheckCircle, FaLock } from "react-icons/fa";
import UpgradePlanModal from "../Detail/UpgradePlanModal";

// Random stage notes
const STAGE_NOTES = (stageNum, targetCigs) => {
  const templates = [
    `Stage ${stageNum}: Reduce to ${targetCigs} cigarettes/day`,
    `Use breathing exercises during cravings`,
    `Avoid smoking triggers (coffee, stress, etc.)`,
    `Drink water when urge hits`,
    `Reward yourself for completing the day`,
    `Reflect in your quit journal`,
    `Call a friend when tempted to smoke`,
  ];
  const shuffled = templates.sort(() => 0.5 - Math.random()).slice(0, 3);
  return shuffled;
};

const generateStages = (startDate, durationInDays, membershipType, addictionLevel) => {
  const stages = [];
  const start = dayjs(startDate);

  // ✅ Xác định số tuần
  const isFree = membershipType?.toUpperCase() === "FREE";
  const totalStages = isFree ? 4 : Math.ceil(durationInDays / 7);
  const unlockedStages = isFree ? 1 : totalStages;

  // Addiction logic
  let initialCigarettes = 8;
  let reductionPerStage = 2;
  switch (addictionLevel?.toUpperCase()) {
    case "SEVERE":
      initialCigarettes = 25;
      reductionPerStage = 5;
      break;
    case "MODERATE":
      initialCigarettes = 15;
      reductionPerStage = 3;
      break;
    case "MILD":
    default:
      initialCigarettes = 8;
      reductionPerStage = 2;
  }

  for (let stageNum = 1; stageNum <= totalStages; stageNum++) {
    const daysCompleted = (stageNum - 1) * 7;
    const stageStart = start.add(daysCompleted, "day");
    const stageDays = 7;
    const stageEnd = stageStart.add(stageDays - 1, "day");

    const targetCigs = Math.max(0, initialCigarettes - reductionPerStage * (stageNum - 1));

    stages.push({
      stageId: stageNum,
      stageName: `Week ${stageNum}`,
      stageStartDate: stageStart.format("YYYY-MM-DD"),
      stageEndDate: stageEnd.format("YYYY-MM-DD"),
      targetCigarettesPerDay: targetCigs,
      notes: STAGE_NOTES(stageNum, targetCigs).join("\n"),
      isLocked: isFree && stageNum > 1,
      durationInDays: stageDays,
    });
  }

  return stages;
};

const StageList = ({
  durationInDays = 28,
  membership = "FREE",
  startDate = dayjs().format("YYYY-MM-DD"),
  description = "",
  addictionLevel = "MILD",
  planId,
  quitPlanStages = [],
}) => {
  const [selectedStage, setSelectedStage] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [completedStages, setCompletedStages] = useState([]);
  const [stages, setStages] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`completedStages_${planId}`)) || [];
    setCompletedStages(saved);

    if (Array.isArray(quitPlanStages) && quitPlanStages.length > 0) {
      setStages(quitPlanStages);
    } else {
      const generated = generateStages(startDate, durationInDays, membership, addictionLevel);
      setStages(generated);
    }
  }, [startDate, durationInDays, membership, addictionLevel, planId, quitPlanStages]);

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
      localStorage.setItem(`completedStages_${planId}`, JSON.stringify(updated));
      message.success(`🎉 You've completed Week ${stageId}!`);
    }
    setSelectedStage(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-h-[680px] overflow-y-auto ring-1 ring-emerald-100">
      <h3 className="text-lg font-semibold text-emerald-700 mb-3">📅 Weekly Quit Plan</h3>

      {description && (
        <p className="text-sm text-gray-600 italic mb-4 whitespace-pre-line">{description}</p>
      )}

      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 capitalize">{addictionLevel} addiction</h4>
        <p className="text-xs text-gray-600 mt-1">
          {stages.filter((s) => !s.isLocked).length} of {stages.length} weeks unlocked •{" "}
          {membership === "FREE" ? "Free Trial (1 week)" : membership + " Package"}
        </p>
      </div>

      <ul className="space-y-3 mb-4">
        {stages.map((stage) => {
          const isCompleted = completedStages.includes(stage.stageId);
          return (
            <li
              key={stage.stageId}
              onClick={() => handleStageClick(stage)}
              className={`border rounded p-3 cursor-pointer transition flex justify-between items-center ${stage.isLocked
                ? "bg-gray-100 opacity-70 hover:bg-gray-200"
                : "hover:bg-emerald-50"
                }`}
            >
              <div>
                <div className="font-semibold text-gray-800 flex items-center gap-2">
                  {stage.stageName}
                  {isCompleted && <FaCheckCircle className="text-green-500 text-lg" />}
                  {stage.isLocked && <FaLock className="text-yellow-600" />}
                </div>
                <div className="text-xs text-gray-500">
                  {dayjs(stage.stageStartDate).format("MMM D")} →{" "}
                  {dayjs(stage.stageEndDate).format("MMM D")}
                  <span className="ml-2">({stage.durationInDays} days)</span>
                </div>
                {isCompleted && (
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

      {/* Modal: View stage */}
      <Modal
        open={!!selectedStage}
        footer={null}
        onCancel={() => setSelectedStage(null)}
        centered
      >
        {selectedStage && (
          <div className="p-4 space-y-3">
            <h2 className="text-lg font-bold text-emerald-700">{selectedStage.stageName}</h2>
            <p className="text-sm text-gray-500">
              {dayjs(selectedStage.stageStartDate).format("MMM D")} →{" "}
              {dayjs(selectedStage.stageEndDate).format("MMM D")}
              <span className="ml-2">({selectedStage.durationInDays} days)</span>
            </p>
            <div className="text-sm whitespace-pre-line text-gray-700">
              {selectedStage.notes}
            </div>
            <div className="text-sm font-medium mt-3">
              🎯 Daily Target: {selectedStage.targetCigarettesPerDay} cigarettes
            </div>

            <div className="flex gap-3 mt-5">
              <Button
                onClick={() =>
                  window.location.href = `/plans/${planId}/stage/${selectedStage.stageId}`
                }
                type="primary"
                className="!bg-blue-600 hover:!bg-blue-700"
              >
                View Stage Details
              </Button>
              <Button
                onClick={() => handleCompleteStage(selectedStage.stageId)}
                disabled={completedStages.includes(selectedStage.stageId)}
                type="primary"
                className="!bg-green-600 hover:!bg-green-700"
              >
                {completedStages.includes(selectedStage.stageId)
                  ? "Completed"
                  : "Mark Complete"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Upgrade package */}
      <UpgradePlanModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => {
          setShowUpgradeModal(false);
          window.location.href = "/membership";
        }}
        currentPackage={membership}
      />
    </div>
  );
};

export default StageList;
