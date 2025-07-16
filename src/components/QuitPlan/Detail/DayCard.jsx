import React, { useState, useEffect } from "react";
import {
  MessageOutlined,
  CheckSquareOutlined,
  CalendarOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import Modal from "./Modal";

const DayCard = ({ day, weekNumber, planStartDate }) => {
  const [open, setOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Lấy trạng thái completed từ localStorage (ưu tiên hơn tasks)
    const saved = localStorage.getItem(`day-${day.id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setIsCompleted(!!parsed.completed);
    } else {
      // fallback: nếu không có localStorage, kiểm tra task
      const completedCount = day.tasks?.filter((t) => t.done).length || 0;
      setIsCompleted(completedCount === day.tasks?.length);
    }
  }, [day]);

  if (deleted) return null;

  const completed = day.tasks.filter((t) => t.done).length;
  const total = day.tasks.length;

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
            {isCompleted && (
              <div
                className="flex items-center justify-center"
                style={{
                  width: "16px",
                  height: "16px",
                  backgroundColor: "#22A06B",
                  borderRadius: "50%",
                  lineHeight: 1,
                }}
              >
                <CheckOutlined style={{ color: "#fff", fontSize: "10px" }} />
              </div>
            )}
            <span>Day {day.dayNumber}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          <div className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-[#baf3db] text-[#216e4e] font-medium">
            <CalendarOutlined />
            {day.date}
          </div>
          <div className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-[#baf3db] text-[#216e4e] font-medium">
            <CheckSquareOutlined />
            {completed}/{total}
          </div>
        </div>

        <div className="flex justify-end items-center text-xs px-1 text-[#216e4e] font-medium">
          <MessageOutlined className="mr-1" />
          {day.comments?.length || 0}
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          // Cập nhật lại trạng thái completed sau khi modal đóng
          const saved = localStorage.getItem(`day-${day.id}`);
          if (saved) {
            const parsed = JSON.parse(saved);
            setIsCompleted(!!parsed.completed);
          }
        }}
        day={day}
        weekNumber={weekNumber}
        planStartDate={planStartDate}
        onDelete={() => setDeleted(true)}
      />
    </>
  );
};

export default DayCard;
