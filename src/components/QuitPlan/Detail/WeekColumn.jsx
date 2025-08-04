import React from "react";
import DayCard from "./DayCard";

const WeekColumn = ({ weekNumber, days, planStartDate }) => {
  return (
    <div className="rounded-2xl shadow-lg w-70 min-w-[18rem] border overflow-hidden bg-white">
      <div
        className="scroll-area"
        style={{
          maxHeight: "63vh",
          overflowY: "scroll",
          padding: "16px 12px",
          boxSizing: "border-box",
        }}
      >
        <h2 className="text-xl font-bold text-black mb-3 border-b border-gray-200 pb-1">
          Week {weekNumber}
        </h2>

        <div className="space-y-4">
          {days.map((day) => (
            <div key={day.id}>
              <DayCard
                day={day}
                weekNumber={weekNumber}
                planStartDate={planStartDate}
              />
            </div>
          ))}
        </div>
      </div>

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
