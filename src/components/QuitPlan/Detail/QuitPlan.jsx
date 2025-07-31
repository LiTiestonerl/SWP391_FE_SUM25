import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import WeekColumn from "./WeekColumn";
import api from "../../../configs/axios";
import { Button, Tooltip } from "antd";
import { ExportOutlined } from "@ant-design/icons";

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

      const tasks = Array.from({ length: 2 + Math.floor(Math.random() * 2) }).map(() => {
        const title = samplePlans[taskIndex % samplePlans.length];
        taskIndex++;
        return { title, done: false };
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
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [freeDays, setFreeDays] = useState(30);

  // NEW: selectedWeek xác định tuần được highlight & phạm vi hiển thị
  const [selectedWeek, setSelectedWeek] = useState(() => {
    const fromNav = Number(location.state?.stageId) || 0;
    if (fromNav > 0) return fromNav;
    const saved = Number(localStorage.getItem("selectedWeek")) || 0;
    return saved; // 0 = show all
  });

  // Nếu có stageId mới từ navigate, ưu tiên cập nhật + lưu localStorage
  useEffect(() => {
    const fromNav = Number(location.state?.stageId) || 0;
    if (fromNav > 0 && fromNav !== selectedWeek) {
      setSelectedWeek(fromNav);
      localStorage.setItem("selectedWeek", String(fromNav));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.stageId]);

  // Lấy FREE gói/ duration fallback
  useEffect(() => {
    if (!location.state?.memberPackageId) return;

    const id = location.state.memberPackageId;
    api.get("/member-packages")
      .then((res) => {
        const matched = res.data?.find((pkg) => pkg.id === id);
        if (matched) {
          setFreeDays(matched.duration || 30);
        }
      })
      .catch(() => setFreeDays(30));
  }, [location.state]);

  // Tạo dữ liệu plan theo state/ freeDays
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
    const durationInDays = state.durationInDays || freeDays;
    const membership = state.selectedPlan || "HEALTH+";

    localStorage.setItem("quitPlanDetailState", JSON.stringify(state));

    const generated = generateQuitPlan(startDate, durationInDays);
    setPlan({ ...generated, membership });
  }, [location.state, freeDays]);

  // Auto scroll đến week đang chọn khi đã render xong
  useEffect(() => {
    if (!plan?.weeks?.length) return;
    if (!selectedWeek || selectedWeek < 1) return;
    const clamped = Math.min(selectedWeek, plan.weeks.length);
    const el = document.getElementById(`week-${clamped}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    }
  }, [plan, selectedWeek]);

  if (!plan?.weeks?.length) {
    return (
      <div className="text-center py-20 text-gray-500">
        No quit plan found. Please start a plan from the Overview page.
      </div>
    );
  }

  // NEW: nếu có selectedWeek > 0 thì chỉ render đến tuần đó
  const totalWeeks = plan.weeks.length;
  const limit = selectedWeek > 0 ? Math.min(selectedWeek, totalWeeks) : totalWeeks;
  const weeksToRender = plan.weeks.slice(0, limit);

  return (
    <div className="min-h-screen bg-[hsla(105,_55.35%,_35.59%,_0.9)] px-6 overflow-x-auto relative pt-32">
      {/* OUT */}
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
        {weeksToRender.map((week, idx) => {
          const weekNumber = idx + 1;
          return (
            <div id={`week-${weekNumber}`} key={weekNumber}>
              <WeekColumn
                weekNumber={weekNumber}
                days={week}
                planStartDate={plan.startDate}
                membership={plan.membership}
                // NEW: highlight mép bên trong khung nếu là tuần được chọn
                isHighlighted={selectedWeek > 0 && selectedWeek === weekNumber}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuitPlan;
