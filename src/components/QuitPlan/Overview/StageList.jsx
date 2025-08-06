import React, { useState, useEffect, useMemo } from "react";
import { Modal, Button, message } from "antd";
import dayjs from "dayjs";
import { FaCheckCircle, FaLock } from "react-icons/fa";
import UpgradePlanModal from "../Detail/UpgradePlanModal";
import { useNavigate } from "react-router-dom";

// Cải tiến hàm STAGE_NOTES để tạo nội dung phong phú hơn
const STAGE_NOTES = (stageNum, targetCigs) => {
  const baseTips = [
    `Practice urge-surfing: ride out cravings for 3–5 minutes without giving in.`,
    `Identify and avoid personal triggers (coffee, stress, after meals).`,
    `Stay hydrated: drink water whenever you feel an urge to smoke.`,
    `Deep-breathe exercises: 5 breaths in, hold, then 5 breaths out.`,
    `Reward yourself: small treat for completing a smoke-free day.`,
    `Reflect in your quit journal: note cravings and coping success.`,
    `Connect with a friend/support group when tempted.`,
    `Take a short walk or stretch when cravings hit.`,
    `Use a stress ball or fidget toy instead of a cigarette.`,
    `Delay tactic: wait 10 minutes before considering smoking.`,
    `Brush your teeth when cravings strike.`,
    `Visualize your health improvements and savings.`,
    `Avoid alcohol if it triggers your smoking.`,
    `Change your routine to break smoking habits.`,
    `Use nicotine replacement if recommended.`,
  ];

  const stageSpecificTips = [
    `Stage ${stageNum}: Aim for ${targetCigs} cigarettes/day max.`,
    `Track every cigarette to increase awareness.`,
    `Gradually increase time between cigarettes.`,
  ];

  // Kết hợp tips chung và tips riêng cho stage
  const allTips = [...stageSpecificTips, ...baseTips];

  // Trộn ngẫu nhiên và chọn 4-5 tips
  const shuffled = allTips.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4 + (stageNum % 2)); // Alternates between 4 and 5 tips
};

const generateStagesSmooth = ({
  startDate,
  durationInDays,
  initialCigarettes,
}) => {
  const start = dayjs(startDate);
  const end = start.add(durationInDays - 1, 'day');
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
      notes: STAGE_NOTES(i, target).join("\n\n"),
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
  endDate = dayjs().add(27, 'day').format("YYYY-MM-DD"), // Added endDate prop
  description = "",
  addictionLevel = "MILD",
  planId,
  averageCigarettes,
  quitPlanStages,
  isViewOnly = false,
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
      return quitPlanStages.map((s, index) => {
        // Kiểm tra nếu notes từ API chỉ là "Week X" thì tạo notes mới
        const shouldGenerateNewNotes =
          !s.notes ||
          s.notes.match(/^Week\s\d+$/) ||
          s.notes.match(/^Tuần\s\d+$/);

        const notes = shouldGenerateNewNotes
          ? STAGE_NOTES(s.stageId || index + 1, s.targetCigarettesPerDay).join("\n\n")
          : s.notes;

        return {
          ...s,
          isLocked: false,
          stageId: s.stageId || index + 1,
          durationInDays: dayjs(s.stageEndDate).diff(dayjs(s.stageStartDate), 'day') + 1,
          notes: notes
        };
      });
    }

    return generateStagesSmooth({
      startDate,
      durationInDays,
      addictionLevel,
      initialCigarettes: averageCigarettes,
    });
  }, [startDate, durationInDays, addictionLevel, averageCigarettes, quitPlanStages]);

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
    // Sắp xếp lại theo stageId
    return [...realStages, ...extraStages].sort((a, b) => a.stageId - b.stageId);
  }, [isFree, realStages]);

  const unlockedCount = useMemo(
    () => visibleStages.filter((s) => !s.isLocked).length,
    [visibleStages]
  );

  const handleStageClick = (stage) => {
    if (isViewOnly) return;
    
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

      <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-800">Plan Timeline</h4>
        <p className="text-xs text-gray-600 mt-1">
          {dayjs(startDate).format("MMM D, YYYY")} →{" "}
          {dayjs(endDate).format("MMM D, YYYY")}
          <span className="ml-2 text-emerald-600 font-medium">
            • {unlockedCount} of {visibleStages.length} weeks unlocked
          </span>
        </p>
      </div>

             <ul className="space-y-2.5 mb-4">
         {visibleStages
           .sort((a, b) => a.stageId - b.stageId)
           .map((stage) => {
             const isCompleted = completedStages.includes(stage.stageId);
             return (
               <li
                 key={stage.stageId}
                 onClick={() => handleStageClick(stage)}
                 className={`border-1 rounded-lg p-3 cursor-pointer transition flex justify-between items-start gap-3 ${
                   stage.isLocked
                     ? "bg-gray-50 border-gray-300 hover:bg-gray-100"
                     : "border-gray-800 hover:border-gray-600 hover:bg-gray-50"
                 } ${
                   isCompleted && !stage.isLocked ? "bg-green-50 border-green-600" : ""
                 }`}
               >
                 <div className="flex-1 min-w-0">
                   <div className="font-semibold text-gray-800 flex items-center gap-2">
                     <span className="truncate">{stage.stageName}</span>
                     {isCompleted && !stage.isLocked && (
                       <FaCheckCircle className="text-green-500 text-lg flex-shrink-0" />
                     )}
                     {stage.isLocked && <FaLock className="text-yellow-600 flex-shrink-0" />}
                   </div>
                   <div className="text-xs text-gray-500 mt-1">
                     {dayjs(stage.stageStartDate).format("MMM D")} →{" "}
                     {dayjs(stage.stageEndDate).format("MMM D")}
                     <span className="ml-2 text-gray-400">({stage.durationInDays} days)</span>
                   </div>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full flex items-center">
                     <span className="mr-1">🎯</span>
                     {stage.targetCigarettesPerDay} cigs/day
                   </div>
                 </div>
               </li>
             );
           })}
       </ul>

      {/* Modal xem chi tiết stage - ĐÃ ĐIỀU CHỈNH */}
      <Modal
        open={!!selectedStage}
        footer={null}
        onCancel={() => setSelectedStage(null)}
        centered
        width={600}
      >
        {selectedStage && (
          <div className="p-4">
            <h2 className="text-xl font-bold text-emerald-700 mb-2 flex items-center gap-2">
              {selectedStage.stageName}
              {selectedStage.isLocked && <FaLock className="text-yellow-600" />}
            </h2>

            <div className="flex items-center text-sm text-gray-500 mb-4">
              <span>
                {dayjs(selectedStage.stageStartDate).format("MMM D")} -{" "}
                {dayjs(selectedStage.stageEndDate).format("MMM D, YYYY")}
              </span>
              <span className="mx-2">•</span>
              <span>{selectedStage.durationInDays} days</span>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
              <h3 className="font-medium text-gray-700 mb-2">Daily Tips & Strategies</h3>
              <div className="text-sm text-gray-700 space-y-2">
                {selectedStage.notes.split("\n\n").map((note, i) => (
                  <div key={i} className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Phần Target đã được chuyển xuống dưới */}
            <div className="bg-blue-50 p-3 rounded-lg mb-6 border border-blue-100 flex items-center justify-between">
              <div className="flex items-center">
                <span className="bg-blue-100 p-2 rounded-full mr-3">
                  <span className="text-blue-600 text-lg">🎯</span>
                </span>
                <div>
                  <h4 className="font-medium text-gray-700">Daily Target</h4>
                  <p className="text-sm text-gray-600">
                    Aim for maximum {selectedStage.targetCigarettesPerDay} cigarettes per day
                  </p>
                </div>
              </div>
              {selectedStage.targetCigarettesPerDay === 0 && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Smoke-free goal
                </span>
              )}
            </div>

            {/* Phần buttons */}
            <div className="flex gap-3 justify-end">
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
                      isViewOnly // Truyền tiếp isViewOnly
                    },
                  });
                }}
                type="primary"
                className="bg-blue-600 hover:bg-blue-700 border-blue-600"
              >
                View Details
              </Button>

              {!isViewOnly && ( // Chỉ hiện nút Mark Complete khi không phải chế độ xem
                <Button
                  onClick={() => handleCompleteStage(selectedStage.stageId)}
                  disabled={selectedStage.isLocked || completedStages.includes(selectedStage.stageId)}
                  type="default"
                  style={{
                    backgroundColor: selectedStage.isLocked
                      ? "#9ca3af" // gray-400
                      : completedStages.includes(selectedStage.stageId)
                        ? "#16a34a" // green-600
                        : "#16a34a", // mặc định
                    borderColor: selectedStage.isLocked
                      ? "#9ca3af"
                      : "#16a34a",
                    color: "white",
                    transition: "all 0.3s ease", // 👈 hiệu ứng chuyển mượt
                  }}
                  onMouseEnter={(e) => {
                    if (!selectedStage.isLocked && !completedStages.includes(selectedStage.stageId)) {
                      e.currentTarget.style.backgroundColor = "#15803d"; // green-700
                      e.currentTarget.style.borderColor = "#15803d";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedStage.isLocked && !completedStages.includes(selectedStage.stageId)) {
                      e.currentTarget.style.backgroundColor = "#16a34a"; // green-600
                      e.currentTarget.style.borderColor = "#16a34a";
                    }
                  }}
                >
                  {selectedStage.isLocked
                    ? "Locked"
                    : completedStages.includes(selectedStage.stageId)
                      ? "Completed"
                      : "Mark Complete"}
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

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