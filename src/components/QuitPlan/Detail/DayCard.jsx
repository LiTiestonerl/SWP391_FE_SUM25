import React, { useState } from "react";
import { CalendarOutlined } from "@ant-design/icons";
import DayModal from "./DayModal";

const DayCard = ({ day, weekNumber, weekTitle, planStartDate }) => {
  const [open, setOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);

  if (deleted) return null;

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="rounded-lg transition-all duration-150 cursor-pointer bg-white px-3 py-2 hover:ring-2 hover:ring-blue-500"
        style={{
          border: `1px solid #000`,
          borderRadius: "10px",
          marginBottom: "10px",
        }}
      >
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center gap-2 text-base font-semibold text-gray-800">
            <span>{day.title || `Day ${day.dayNumber}`}</span>
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
        onClose={() => setOpen(false)}
        day={day}
        weekNumber={weekNumber}
        weekTitle={weekTitle}
        planStartDate={planStartDate}
        onDelete={() => setDeleted(true)}
      />
    </>
  );
};

export default DayCard;
