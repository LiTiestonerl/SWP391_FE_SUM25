import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import WeekColumn from "./WeekColumn";

const samplePlans = [
  "Avoid smoking area after lunch",
  "Chew gum instead of smoking",
  "Take a 10-minute walk",
  "Drink a glass of water",
  "Watch motivational videos",
  "Review your quit reason",
  "Meditate for 5 minutes",
  "Write journal entry",
  "Call your coach",
  "Deep breathing practice"
];

const getMembershipWeeks = (type) => {
  switch (type) {
    case "HEALTH+": return 4;
    case "OTHERS": return 8;
    default: return 1;
  }
};

const generateQuitPlan = (startDate, durationInDays) => {
  const weeks = [];
  let dayCounter = 1;
  let taskIndex = 0;

  const totalWeeks = Math.ceil(durationInDays / 7);

  for (let w = 0; w < totalWeeks; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      if (dayCounter > durationInDays) break;

      const tasks = Array.from({ length: 2 + Math.floor(Math.random() * 2) }).map(() => {
        const title = samplePlans[taskIndex % samplePlans.length];
        taskIndex++;
        return {
          title,
          done: Math.random() < 0.5
        };
      });

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

const QuitPlan = () => {
  const location = useLocation();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    let startDate;
    let durationInDays;
    let type = "HEALTH+";

    if (location.state?.startDate && location.state?.durationInDays) {
      startDate = dayjs(location.state.startDate);
      durationInDays = location.state.durationInDays;
      type = location.state.selectedPlan || "HEALTH+";
    } else {
      startDate = dayjs();
      type = "HEALTH+";
      durationInDays = getMembershipWeeks(type) * 7;
    }

    const generated = generateQuitPlan(startDate, durationInDays);
    setPlan(generated);
  }, [location.state]);

  if (!plan?.weeks?.length) return <p className="text-center text-gray-500">No plan found.</p>;

  return (
    <div className="min-h-screen bg-[hsla(105,_55.35%,_35.59%,_0.9)] pt-48 px-6 overflow-x-auto">
      <div className="flex gap-6 items-start">
        {plan.weeks.map((week, idx) => (
          <WeekColumn
            key={idx}
            weekNumber={idx + 1}
            days={week}
            planStartDate={plan.startDate}
            membership={location.state?.selectedPlan || "HEALTH+"} // truyền membership chính xác
          />
        ))}
      </div>
    </div>
  );
};

export default QuitPlan;
