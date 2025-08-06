import React, { useState, useEffect, useMemo } from "react";
import { Modal, Button } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

// Gợi ý tips mỗi tuần
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

  const allTips = [...stageSpecificTips, ...baseTips];
  const shuffled = allTips.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4 + (stageNum % 2));
};

const generateStagesSmooth = ({
  startDate,
  durationInDays,
  initialCigarettes,
}) => {
  const start = dayjs(startDate);
  const end = start.add(durationInDays - 1, "day");
  const totalDays = end.diff(start, "day") + 1;
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
      durationInDays: stageDays,
    });
  }
  return stages;
};

const StageList = ({
  durationInDays = 28,
  startDate = dayjs().format("YYYY-MM-DD"),
  endDate = dayjs().add(27, 'day').format("YYYY-MM-DD"),
  description = "",
  addictionLevel = "MILD",
  planId,
  averageCigarettes,
  quitPlanStages,
  isViewOnly = false,
}) => {
  const navigate = useNavigate();
  const [selectedStage, setSelectedStage] = useState(null);

  const realStages = useMemo(() => {
    if (Array.isArray(quitPlanStages) && quitPlanStages.length > 0) {
      return quitPlanStages.map((s, index) => {
        const shouldGenerateNewNotes =
          !s.notes || s.notes.match(/^Week\s\d+$/) || s.notes.match(/^Tuần\s\d+$/);

        const notes = shouldGenerateNewNotes
          ? STAGE_NOTES(s.stageId || index + 1, s.targetCigarettesPerDay).join("\n\n")
          : s.notes;

        return {
          ...s,
          stageId: s.stageId || index + 1,
          durationInDays: dayjs(s.stageEndDate).diff(dayjs(s.stageStartDate), 'day') + 1,
          notes: notes,
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
            • {realStages.length} weeks
          </span>
        </p>
      </div>

      <ul className="space-y-2.5 mb-4">
        {realStages
          .sort((a, b) => a.stageId - b.stageId) // Đảm bảo Week 1 → Week N
          .map((stage) => (
            <li
              key={stage.stageId}
              onClick={() => setSelectedStage(stage)}
              className={`border-1 rounded-lg p-3 cursor-pointer transition flex justify-between items-start gap-3 border-gray-800 hover:border-gray-600 hover:bg-gray-50`}
            >
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800">
                  <span>{stage.stageName}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {dayjs(stage.stageStartDate).format("MMM D")} →{" "}
                  {dayjs(stage.stageEndDate).format("MMM D")}
                  <span className="ml-2 text-gray-400">({stage.durationInDays} days)</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                  🎯 {stage.targetCigarettesPerDay} cigs/day
                </div>
              </div>
            </li>
          ))}
      </ul>

      <Modal
        open={!!selectedStage}
        footer={null}
        onCancel={() => setSelectedStage(null)}
        centered
        width={600}
      >
        {selectedStage && (
          <div className="p-4">
            <h2 className="text-xl font-bold text-emerald-700 mb-2">
              {selectedStage.stageName}
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

            <div className="flex justify-end">
              <Button
  onClick={() => {
    navigate("/quit-plan/detail", {
      state: {
        planId,
        startDate,
        endDate,
        isViewOnly,
        quitPlanStages: realStages, // truyền toàn bộ stages thay vì chỉ selectedStage
      },
    });
  }}
  type="primary"
  className="bg-blue-600 hover:bg-blue-700 border-blue-600"
>
  View Details
</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StageList;
