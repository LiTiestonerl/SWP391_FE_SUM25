import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // thêm useNavigate
import dayjs from "dayjs";
import WeekColumn from "./WeekColumn";
import api from "../../../configs/axios";
import { Button, Tooltip } from "antd"; // thêm antd Button + Tooltip
import { ExportOutlined } from "@ant-design/icons"; // icon out

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
  "Deep breathing practice",
];

const generateQuitPlan = (startDate, durationInDays) => {
  const weeks = [];
  let dayCounter = 1;
  let taskIndex = 0;
  const totalWeeks = Math.ceil(durationInDays / 7);

  for (let w = 0; w < totalWeeks; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      if (dayCounter > durationInDays) break;

      const tasks = Array.from({
        length: 2 + Math.floor(Math.random() * 2),
      }).map(() => {
        const title = samplePlans[taskIndex % samplePlans.length];
        taskIndex++;
        return {
          title,
          done: Math.random() < 0.5,
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
  const navigate = useNavigate(); // thêm điều hướng
  const [plan, setPlan] = useState(null);
  const [freeDays, setFreeDays] = useState(30); // fallback mặc định 30 ngày

  useEffect(() => {
    if (!location.state?.memberPackageId) return;

    const id = location.state.memberPackageId;

    api
      .get("/member-packages")
      .then((res) => {
        const matched = res.data?.find((pkg) => pkg.id === id);
        if (matched) {
          setFreeDays(matched.duration || 30); // Ưu tiên lấy duration thật, fallback 30
        }
      })
      .catch(() => setFreeDays(30));
  }, [location.state]);

  useEffect(() => {
    let state = location.state;

    if (!state) {
      const saved = localStorage.getItem("quitPlanDetailState");
      if (saved) {
        state = JSON.parse(saved);
      }
    }

    if (!state) return;

    const startDate = dayjs(state.startDate);
    const durationInDays = state.durationInDays || freeDays; // Ưu tiên state, fallback freeDays
    const membership = state.selectedPlan || "HEALTH+";

    localStorage.setItem("quitPlanDetailState", JSON.stringify(state));

    const generated = generateQuitPlan(startDate, durationInDays);
    setPlan({
      ...generated,
      membership,
    });
  }, [location.state, freeDays]);

  if (!plan?.weeks?.length) {
    return (
      <div className="text-center py-20 text-gray-500">
        No quit plan found. Please start a plan from the Overview page.
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[hsla(105,_55.35%,_35.59%,_0.9)] px-6 overflow-x-auto relative pt-32"
      // giảm pt-48 -> pt-32 (hoặc pt-28)
    >
      {/* Nút OUT giữ nguyên */}
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

      {/* bỏ mt-6 ở đây */}
      <div className="flex gap-6 items-start mt-14">
        {plan.weeks.map((week, idx) => (
          <WeekColumn
            key={idx}
            weekNumber={idx + 1}
            days={week}
            planStartDate={plan.startDate}
            membership={plan.membership}
            freeDays={freeDays}
          />
        ))}
      </div>
    </div>
  );
};

export default QuitPlan;
