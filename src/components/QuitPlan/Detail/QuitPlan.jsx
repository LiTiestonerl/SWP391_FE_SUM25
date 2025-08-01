import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import WeekColumn from "./WeekColumn";
import { Button, Tooltip } from "antd";
import { ExportOutlined, PlusOutlined } from "@ant-design/icons";

const QuitPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);

  useEffect(() => {
    let state = location.state;
    if (!state) {
      const saved = localStorage.getItem("quitPlanDetailState");
      if (saved) state = JSON.parse(saved);
    }
    if (!state) return;

    localStorage.setItem("quitPlanDetailState", JSON.stringify(state));
    const { startDate, selectedPlan, weeks } = state;

    setPlan({
      startDate,
      membership: selectedPlan || "CUSTOM",
      weeks: Array.isArray(weeks) ? weeks : [[]],
    });
  }, [location.state]);

  const handleAddWeek = () => {
    setPlan((prev) => ({
      ...prev,
      weeks: [...prev.weeks, []], // thêm tuần mới rỗng
    }));
  };

  if (!plan?.weeks?.length) {
    return (
      <div className="text-center py-20 text-gray-500">
        No quit plan found. Please start a plan from the Overview page.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsla(105,_55.35%,_35.59%,_0.9)] px-6 overflow-x-auto relative pt-32">
      <Tooltip title="Back to Quit Plan List">
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<ExportOutlined />}
          className="!absolute left-6 top-28 shadow-lg"
          onClick={() => navigate("/quit-plan")}
        />
      </Tooltip>

      <div className="flex gap-6 items-start mt-14">
        {plan.weeks.map((week, idx) => (
          <div id={`week-${idx + 1}`} key={idx}>
            <WeekColumn
              weekNumber={idx + 1}
              days={week}
              planStartDate={plan.startDate}
            />
          </div>
        ))}

        {/* 👉 Nút Add another list */}
        <Button
          onClick={handleAddWeek}
          type="dashed"
          className="h-[200px] min-w-[200px] flex items-center justify-center text-lg font-semibold"
        >
          <PlusOutlined />
          Add another list
        </Button>
      </div>
    </div>
  );
};

export default QuitPlan;
