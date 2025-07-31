import React, { useState, useEffect, useMemo } from "react";
import { Modal, Button, message } from "antd";
import dayjs from "dayjs";
import { FaCheckCircle, FaLock } from "react-icons/fa";
import UpgradePlanModal from "../Detail/UpgradePlanModal";
import { useNavigate } from "react-router-dom";

// Gợi ý ghi chú mỗi stage
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
  const shuffled = templates.sort(() => 0.5 - Math.random()).slice(0, 3);
  return shuffled;
};

/**
 * Tạo lịch stage “mượt” theo toàn bộ duration:
 * - Số stage = số tuần = ceil(duration/7)
 * - Tuần cuối: 0 điếu (Quit Week)
 * - Các tuần trước: giảm theo đường cong (1 - p)^beta * initial, với:
 *    Mild → beta=0.8  (giảm nhanh sớm, nhẹ về cuối)
 *    Moderate → beta=1.0 (gần tuyến tính)
 *    Severe → beta=1.3 (giảm chậm sớm, mạnh về cuối)
 * - Đảm bảo tuần kế cuối ≥ 1 điếu nếu initial ≥ 1
 */
const generateStagesSmooth = ({
  startDate,
  durationInDays,
  membershipType,
  addictionLevel,
  initialCigarettes, // averageCigarettes
}) => {
  const start = dayjs(startDate);
  const isFree = (membershipType || "").toUpperCase() === "FREE";

  // Số tuần
  const totalStages = Math.max(1, Math.ceil((Number(durationInDays) || 0) / 7));

  // Ánh xạ mức nghiện -> beta (độ “cong”)
  const level = (addictionLevel || "").toUpperCase();
  const beta =
    level === "SEVERE" ? 1.3 :
    level === "MODERATE" ? 1.0 : 0.8;

  const init = Math.max(1, Number(initialCigarettes) || 8); // fallback 8 nếu chưa có

  const stages = [];
  for (let i = 1; i <= totalStages; i++) {
    const stageStart = start.add((i - 1) * 7, "day");
    // Số ngày còn lại đến hết plan (để tính stageDays cuối)
    const daysRemaining = (Number(durationInDays) || 0) - (i - 1) * 7;
    const stageDays = i === totalStages ? Math.max(1, daysRemaining) : Math.min(7, daysRemaining);

    // Tiến độ từ 0→1 trên các stage (trừ tuần cuối)
    const p = totalStages === 1 ? 1 : (i - 1) / (totalStages - 1);

    // Tuần cuối = 0 điếu (Quit Week)
    let target = (i === totalStages) ? 0 : Math.ceil(init * Math.pow(1 - p, beta));

    // Đảm bảo giảm không tăng ngược, và tuần kế cuối ≥ 1 điếu nếu có nhiều tuần
    if (i === totalStages - 1) {
      target = Math.max(1, target);
    }
    // Chặn “nhảy 0” quá sớm do làm tròn
    if (i < totalStages - 1) {
      target = Math.max(1, target);
    }

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
      isLocked: isFree ? i > 1 : false, // FREE: chỉ mở tuần 1, còn lại khóa
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
  // ✅ NEW: truyền averageCigarettes từ plan vào
  averageCigarettes,
  quitPlanStages, // nếu backend trả sẵn lộ trình thì dùng nó
}) => {
  const navigate = useNavigate();
  const [selectedStage, setSelectedStage] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [completedStages, setCompletedStages] = useState([]);

  // Load completed từ localStorage (nếu có planId)
  useEffect(() => {
    if (!planId) return;
    const saved = JSON.parse(localStorage.getItem(`completedStages_${planId}`)) || [];
    setCompletedStages(saved);
  }, [planId]);

  // ✅ Derive stages (không dùng setState để tránh vòng lặp)
  const stages = useMemo(() => {
    // 1) Có dữ liệu stage từ backend → dùng luôn
    if (Array.isArray(quitPlanStages) && quitPlanStages.length > 0) {
      return quitPlanStages;
    }
    // 2) Tự sinh stage theo đường cong, trải đều toàn bộ duration
    return generateStagesSmooth({
      startDate,
      durationInDays,
      membershipType: membership,
      addictionLevel,
      initialCigarettes: averageCigarettes, // ← mốc ban đầu chính xác từ plan
    });
  }, [
    startDate,
    durationInDays,
    membership,
    addictionLevel,
    averageCigarettes,
    quitPlanStages?.length,
  ]);

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
              className={`border rounded p-3 cursor-pointer transition flex justify-between items-center ${
                stage.isLocked ? "bg-gray-100 opacity-70 hover:bg-gray-200" : "hover:bg-emerald-50"
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
                disabled={completedStages.includes(selectedStage.stageId)}
                type="primary"
                className="!bg-green-600 hover:!bg-green-700"
              >
                {completedStages.includes(selectedStage.stageId) ? "Completed" : "Mark Complete"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Upgrade */}
      <UpgradePlanModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => {
          setShowUpgradeModal(false);
          navigate("/membership");
        }}
        currentPackage={membership}
      />
    </div>
  );
};

export default StageList;
