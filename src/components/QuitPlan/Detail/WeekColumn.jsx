import React, { useState } from "react";
import DayCard from "./DayCard";
import UpgradePlanModal from "./UpgradePlanModal";

const WeekColumn = ({ weekNumber, days, planStartDate, membership }) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const completedDays = days.filter((day) => day.tasks.every((t) => t.done)).length;
  const isLocked = membership === "HEALTH" && weekNumber > 1;

  const handleClick = (day) => {
    if (isLocked) {
      setShowUpgradeModal(true);
      return;
    }
    // Cho phép DayCard xử lý click như bình thường
  };

  return (
    <div
      className={`rounded-2xl shadow-lg w-70 min-w-[18rem] border overflow-hidden transition ${
        isLocked ? "bg-gray-100 opacity-40 pointer-events-auto cursor-not-allowed" : "bg-white"
      }`}
    >
      <div className="scroll-area" style={{
        maxHeight: "63vh",
        overflowY: "scroll",
        padding: "16px 12px",
        boxSizing: "border-box"
      }}>
        <h2 className="text-xl font-bold text-black mb-3 border-b border-gray-200 pb-1">
          Week {weekNumber}{" "}
          <span className="text-sm font-medium text-gray-500">
            ({completedDays}/{days.length} days completed)
          </span>
        </h2>

        <div className="space-y-4">
          {days.map((day) => (
            <div key={day.id} onClick={() => handleClick(day)}>
              <DayCard
                day={day}
                weekNumber={weekNumber}
                planStartDate={planStartDate}
              />
            </div>
          ))}
        </div>
      </div>

      <UpgradePlanModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => {
          setShowUpgradeModal(false);
          window.location.href = "/membership";
        }}
      />

      <style>
        {`
          .scroll-area::-webkit-scrollbar {
            width: 8px;
          }
          .scroll-area::-webkit-scrollbar-track {
            background: transparent;
          }
          .scroll-area::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.25);
            border-radius: 10px;
            background-clip: content-box;
            border-top: 20px solid transparent;
            border-bottom: 20px solid transparent;
          }
          .scroll-area {
            scrollbar-width: thin;
            scrollbar-color: rgba(0, 0, 0, 0.25) transparent;
          }
        `}
      </style>
    </div>
  );
};

export default WeekColumn;
