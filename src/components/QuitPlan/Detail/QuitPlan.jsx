import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';
import WeekColumn from "./WeekColumn";
import { LeftOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

dayjs.extend(isBetween);

// Hàm tạo kế hoạch mới
const generateQuitPlan = (startDate, durationInDays) => {
  const weeks = [];
  let dayCounter = 1;
  const totalWeeks = Math.ceil(durationInDays / 7);

  for (let w = 0; w < totalWeeks; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      if (dayCounter > durationInDays) break;

      days.push({
        id: `${dayCounter}-${w}`,
        dayNumber: dayCounter,
        date: startDate.add(dayCounter - 1, "day").format("YYYY-MM-DD"),
        status: "",
        tasks: [],
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

// Hàm tạo kế hoạch từ các giai đoạn (đã sửa để đảm bảo thứ tự)
const generateQuitPlanFromStages = (stages) => {
  // Sắp xếp các stage theo ngày bắt đầu
  const sortedStages = [...stages].sort((a, b) => 
    dayjs(a.stageStartDate).diff(dayjs(b.stageStartDate))
  );

  const weeks = [];
  let globalDayCounter = 1;

  sortedStages.forEach((stage, weekIndex) => {
    const days = [];
    const stageStartDate = dayjs(stage.stageStartDate);
    const stageEndDate = dayjs(stage.stageEndDate);
    
    // Tính số ngày chính xác giữa start và end date (bao gồm cả 2 ngày đầu cuối)
    const stageDays = stageEndDate.diff(stageStartDate, 'day') + 1;

    for (let d = 0; d < stageDays; d++) {
      const currentDate = stageStartDate.add(d, 'day');
      
      days.push({
        id: `${globalDayCounter}-${weekIndex}`,
        dayNumber: globalDayCounter,
        date: currentDate.format("YYYY-MM-DD"),
        status: "",
        tasks: [],
        comments: [],
        stageId: stage.stageId,
        progressId: stage.quitProgresses?.find(p => 
          dayjs(p.date).isSame(currentDate, 'day')
        )?.progressId
      });

      globalDayCounter++;
    }

    weeks.push({
      weekNumber: weekIndex + 1,
      days,
      stageId: stage.stageId,
      stageName: stage.stageName,
      targetCigarettes: stage.targetCigarettesPerDay
    });
  });

  // Sắp xếp lại các tuần theo ngày để đảm bảo thứ tự
  weeks.sort((a, b) => dayjs(a.days[0].date).diff(dayjs(b.days[0].date)));

  return {
    startDate: sortedStages[0].stageStartDate,
    endDate: sortedStages[sortedStages.length - 1].stageEndDate,
    weeks,
  };
};

const QuitPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [quitPlanStages, setQuitPlanStages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let startDate;
    let durationInDays;

    if (location.state?.startDate && location.state?.endDate) {
      startDate = dayjs(location.state.startDate);
      const endDate = dayjs(location.state.endDate);
      durationInDays = endDate.diff(startDate, "day") + 1;

      if (location.state.quitPlanStages) {
        try {
          setQuitPlanStages(location.state.quitPlanStages);
          const generated = generateQuitPlanFromStages(location.state.quitPlanStages);
          setPlan(generated);
        } catch (error) {
          console.error("Error generating plan from stages:", error);
          // Fallback to basic plan if error occurs
          const generated = generateQuitPlan(startDate, durationInDays);
          setPlan(generated);
        }
      } else {
        const generated = generateQuitPlan(startDate, durationInDays);
        setPlan(generated);
      }
    } else {
      // Default plan if no data provided
      startDate = dayjs();
      durationInDays = 7;
      const generated = generateQuitPlan(startDate, durationInDays);
      setPlan(generated);
    }

    setLoading(false);
  }, [location.state]);

  if (loading) {
    return <div className="text-center py-8">Loading plan...</div>;
  }

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
          {plan.weeks.map((weekData, idx) => (
            <WeekColumn
              key={`week-${weekData.stageId || idx}`}
              weekNumber={weekData.weekNumber}
              days={weekData.days}
              planStartDate={plan.startDate}
              quitPlanStages={quitPlanStages}
              currentStage={quitPlanStages.find(s => s.stageId === weekData.stageId)}
              isViewOnly={location.state?.isViewOnly || false}
              planStatus={location.state?.status || "IN_PROGRESS"}
              targetCigarettes={weekData.targetCigarettes}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default QuitPlan;