import React, { useState, useEffect } from "react";
import {
  CalendarOutlined,
} from "@ant-design/icons";
import DayModal from "./DayModal";

const DayCard = ({ day, weekNumber, planStartDate, quitPlanStages, isViewOnly = false }) => {
  const [open, setOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`day-${day.id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setIsCompleted(!!parsed.completed);
    } else {
      const completedCount = day.tasks?.filter((t) => t.done).length || 0;
      setIsCompleted(completedCount === day.tasks?.length);
    }
  }, [day]);


  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="rounded-lg transition-all duration-150 cursor-pointer bg-white px-3 py-2 hover:ring-2 hover:ring-blue-500"
        style={{
          border: `1px solid ${isCompleted ? "#22A06B" : "#000"}`,
          borderRadius: "10px",
          marginBottom: "10px",
        }}
      >
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center gap-2 text-base font-semibold text-gray-800">
            <span>Day {day.dayNumber}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          <div className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-[#baf3db] text-[#216e4e] font-medium">
            <CalendarOutlined />
            {day.date}
          </div>
        </div>
      </div>

      <DayModal
        open={open}
        onClose={() => {
          setOpen(false);
          const saved = localStorage.getItem(`day-${day.id}`);
          if (saved) {
            const parsed = JSON.parse(saved);
            setIsCompleted(!!parsed.completed);
          }
        }}
        day={day}
        weekNumber={weekNumber}
        planStartDate={planStartDate}
        quitPlanStages={quitPlanStages}
        isViewOnly={isViewOnly} // Add this prop
      />
    </>
  );
};

export default DayCard;
