import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import WeekColumn from "./WeekColumn";
import { LeftOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

// Đưa các hàm helper ra ngoài component
const generateQuitPlan = (startDate, durationInDays) => {
  const weeks = [];
  let dayCounter = 1;
  const totalWeeks = Math.ceil(durationInDays / 7);

  for (let w = 0; w < totalWeeks; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      if (dayCounter > durationInDays) break;

      const tasks = [];

      days.push({
        id: `${dayCounter}-${w}`,
        dayNumber: dayCounter,
        date: startDate.add(dayCounter - 1, "day").format("YYYY-MM-DD"),
        status: "",
        tasks,
        comments: [],
      });

      dayCounter++;
    }
    weeks.push(days);
  }

  return {
    startDate: startDate.format("YYYY-MM-DD"),
    endDate: startDate.add(durationInDays - 1, "day").format("YYYY-MM-DD"),
    weeks,
  };
};

const generateQuitPlanFromStages = (stages) => {
  const weeks = [];
  let dayCounter = 1;
  
  stages.forEach((stage, weekIndex) => {
    const days = [];
    const stageDays = stage.durationInDays || 7;
    
    for (let d = 0; d < stageDays; d++) {
      const tasks = [];
      
      days.push({
        id: `${dayCounter}-${weekIndex}`,
        dayNumber: dayCounter,
        date: dayjs(stage.stageStartDate).add(d, "day").format("YYYY-MM-DD"),
        status: "",
        tasks,
        comments: [],
      });
      
      dayCounter++;
    }
    weeks.push(days);
  });

  return {
    startDate: stages[0].stageStartDate,
    endDate: stages[stages.length - 1].stageEndDate,
    weeks,
  };
};

const QuitPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [quitPlanStages, setQuitPlanStages] = useState([]);

  useEffect(() => {
    let startDate;
    let durationInDays;

    if (location.state?.startDate && location.state?.endDate) {
      startDate = dayjs(location.state.startDate);
      const endDate = dayjs(location.state.endDate);
      durationInDays = endDate.diff(startDate, "day") + 1;

      if (location.state.quitPlanStages) {
        setQuitPlanStages(location.state.quitPlanStages);
        const generated = generateQuitPlanFromStages(location.state.quitPlanStages);
        setPlan(generated);
        return;
      }
    } else {
      startDate = dayjs();
      durationInDays = 7;
    }

    const generated = generateQuitPlan(startDate, durationInDays);
    setPlan(generated);
  }, [location.state]);

  if (!plan?.weeks?.length) {
    return <p className="text-center text-gray-500">No plan found.</p>;
  }

  return (
    <motion.div
      className="relative min-h-screen bg-[hsla(105,_55.35%,_35.59%,_0.9)] pt-48 px-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        className="absolute top-30 left-4 w-10 h-10 rounded-full bg-white shadow-md hover:bg-gray-100 flex items-center justify-center z-50"
        whileHover={{ scale: 1.1, boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/quit-plan")}
      >
        <LeftOutlined />
      </motion.button>

      <div className="overflow-x-auto scroll-smooth">
        <div className="flex gap-6 items-start">
          {plan.weeks.map((week, idx) => (
            <WeekColumn
              key={idx}
              weekNumber={idx + 1}
              days={week}
              planStartDate={plan.startDate}
              quitPlanStages={quitPlanStages}
              currentStage={quitPlanStages[idx]}
              isViewOnly={location.state?.isViewOnly || false}
              planStatus={location.state?.status || "IN_PROGRESS"}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default QuitPlan;