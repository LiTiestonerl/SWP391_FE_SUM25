import React, { useState, useEffect } from "react";
import { Modal, Button, message } from "antd";
import dayjs from "dayjs";
import { FaCheckCircle } from "react-icons/fa";
import UpgradePlanModal from "../Detail/UpgradePlanModal";

const STAGE_NOTES = [
  "Stay hydrated and avoid caffeine.",
  "Go for a morning walk to reduce cravings.",
  "Practice deep breathing exercises daily.",
  "Avoid social triggers like smoking areas.",
  "Reward yourself with a healthy treat.",
  "Write down 3 reasons you want to quit.",
  "Call your support buddy when craving.",
  "Review your progress in the journal.",
  "Celebrate milestones without cigarettes.",
];

const getRandomNote = (index) => STAGE_NOTES[index % STAGE_NOTES.length];

const generateStages = (startDateStr, duration, membership) => {
  const stages = [];
  const start = dayjs(startDateStr);
  const totalStages =
    membership === "HEALTH+" ? 5 :
      membership === "OTHERS" ? 9 :
        4;

  let remainingDays = duration;
  let currentStart = start;

  for (let i = 0; i < totalStages; i++) {
    const isLast = i === totalStages - 1;
    const days = isLast
      ? remainingDays
      : Math.floor(duration / totalStages) + (i % 2 === 0 ? 1 : 0);
    const currentEnd = currentStart.add(days - 1, "day");

    stages.push({
      stageId: `Stage-${i + 1}`,
      stageName: `Stage ${i + 1}`,
      stageStartDate: currentStart.format("YYYY-MM-DD"),
      stageEndDate: currentEnd.format("YYYY-MM-DD"),
      targetCigarettesPerDay: Math.max(0, 10 - i * 1.2),
      notes: getRandomNote(i),
    });

    currentStart = currentEnd.add(1, "day");
    remainingDays -= days;
  }

  return stages;
};

const StageList = ({
  duration = 30,
  membership = "HEALTH+",
  startDate = dayjs().format("YYYY-MM-DD"),
  description = "",
}) => {
  const [selectedStage, setSelectedStage] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [completedStages, setCompletedStages] = useState([]);

  const stages = generateStages(startDate, duration, membership);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("completedStages") || "[]");
    setCompletedStages(saved);
  }, []);

  const handleStageClick = (index) => {
    if (membership === "HEALTH" && index > 0) {
      setShowUpgradeModal(true);
      return;
    }
    setSelectedStage(stages[index]);
  };

  const handleCompleteStage = (id) => {
    if (!completedStages.includes(id)) {
      const updated = [...completedStages, id];
      setCompletedStages(updated);
      localStorage.setItem("completedStages", JSON.stringify(updated));
      message.success(`🎉 You've completed ${id}!`);
    }
    setSelectedStage(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-h-[570px] overflow-y-auto ring-1 ring-emerald-100">
      <h3 className="text-lg font-semibold text-emerald-700 mb-3">🧩 Plan Stages</h3>

      {description && (
        <p className="text-sm text-gray-600 italic mb-4 whitespace-pre-line">{description}</p>
      )}

      <ul className="space-y-3">
        {stages.map((s, i) => {
          const isCompleted = completedStages.includes(s.stageId);
          const isLocked = membership === "HEALTH" && i > 0;
          return (
            <li
              key={s.stageId}
              onClick={() => handleStageClick(i)}
              className={`border rounded p-3 cursor-pointer hover:bg-emerald-50 transition flex justify-between items-center ${isLocked ? "opacity-50 pointer-events-auto" : ""
                }`}
            >
              <div>
                <div className="font-semibold text-gray-800 flex items-center gap-2">
                  {s.stageName}
                  {isCompleted && <FaCheckCircle className="text-green-500 text-lg" />}
                </div>
                <div className="text-xs text-gray-500">
                  {dayjs(s.stageStartDate).format("MMM D")} → {dayjs(s.stageEndDate).format("MMM D")}
                </div>
                {isCompleted && (
                  <div className="text-xs text-green-600 font-medium mt-1">🏅 Stage Badge Unlocked</div>
                )}
              </div>
              <div className="text-xs text-emerald-700 font-semibold">
                🎯 {s.targetCigarettesPerDay.toFixed(1)} cig/day
              </div>
            </li>
          );
        })}
      </ul>

      {/* Stage detail modal */}
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
            </p>
            <p className="text-sm text-gray-700">{selectedStage.notes}</p>
            <div className="text-sm font-medium mt-3">
              🎯 Target: {selectedStage.targetCigarettesPerDay.toFixed(1)} cig/day
            </div>

            <div className="flex gap-3 mt-5">
              <Button
                onClick={() => window.location.href = "/quit-plan/detail"}
                type="primary"
                className="!bg-blue-600 hover:!bg-blue-700 text-white font-semibold"
              >
                View Plan Detail
              </Button>
              <Button
                onClick={() => handleCompleteStage(selectedStage.stageId)}
                disabled={completedStages.includes(selectedStage.stageId)}
                type="primary"
                className="!bg-green-600 hover:!bg-green-700 text-white font-semibold"
              >
                Mark as Complete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Upgrade modal */}
      <UpgradePlanModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => {
          setShowUpgradeModal(false);
          window.location.href = "/membership";
        }}
      />
    </div>
  );
};

export default StageList;
