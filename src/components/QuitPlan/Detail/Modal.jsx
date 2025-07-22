import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  Modal,
  Input,
  Checkbox,
  Divider,
  Button,
  Tooltip,
} from "antd";
import {
  EditOutlined,
  CalendarOutlined,
  TagsOutlined,
  CheckSquareOutlined,
  SmileOutlined,
  DeleteOutlined,
  CopyOutlined,
  ShareAltOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import CommentSection from "./CommentSection";

const MOOD_EMOJIS = [
  { emoji: "😀", label: "Happy" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😡", label: "Angry" },
  { emoji: "😴", label: "Tired" },
  { emoji: "💪", label: "Motivated" },
  { emoji: "😌", label: "Relaxed" },
];

const DayModal = ({ open, onClose, day, weekNumber, planStartDate }) => {
  const [tasks, setTasks] = useState(day.tasks || []);
  const [mood, setMood] = useState(null);
  const [isDayCompleted, setIsDayCompleted] = useState(day.completed || false);

  const base = dayjs(planStartDate);
  const startOfWeek = base.add((weekNumber - 1) * 7, "day");
  const endOfWeek = startOfWeek.add(6, "day");
  const formattedRange = `${startOfWeek.format("MMM D")} – ${endOfWeek.format("MMM D")}`;

  // Load saved completed status
  useEffect(() => {
    const saved = localStorage.getItem(`day-${day.id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setIsDayCompleted(parsed.completed || false);
    }
  }, [day.id]);

  const toggleTask = (i) => {
    const updated = [...tasks];
    updated[i].done = !updated[i].done;
    setTasks(updated);
  };

  const handleEditTask = (index, value) => {
    const updated = [...tasks];
    updated[index].title = value;
    setTasks(updated);
  };

  const handleAddTask = () => {
    setTasks([...tasks, { title: "New Task", done: false }]);
  };

  const handleRemoveTask = (i) => {
    const updated = tasks.filter((_, idx) => idx !== i);
    setTasks(updated);
  };

  const handleDayCompleteToggle = (checked) => {
    setIsDayCompleted(checked);
    const updatedDay = {
      ...day,
      completed: checked,
    };
    localStorage.setItem(`day-${day.id}`, JSON.stringify(updatedDay));
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
      closable={false}
      centered
      bodyStyle={{
        padding: 0,
        height: "80vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="flex justify-between items-center border-b border-gray-300 px-6 py-3 bg-white">
        <h2 className="text-xl font-bold text-gray-800">Week {weekNumber}</h2>
        <div className="flex items-center gap-3">
          <Tooltip title="Copy this plan">
            <Button icon={<CopyOutlined />} />
          </Tooltip>
          <Tooltip title="Share">
            <Button icon={<ShareAltOutlined />} />
          </Tooltip>
          <Tooltip title="Archive">
            <Button icon={<InboxOutlined />} />
          </Tooltip>
          <button onClick={onClose} className="text-xl text-gray-500 hover:text-black">✕</button>
        </div>
      </div>

      <div className="flex flex-grow max-h-full overflow-hidden">
        {/* LEFT: Tasks & Mood */}
        <div className="w-3/5 px-6 py-4 border-r border-gray-200 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isDayCompleted}
                onChange={(e) => handleDayCompleteToggle(e.target.checked)}
              />
              <h3 className="font-semibold text-lg text-gray-800">
                Day {day.dayNumber} – {day.date}
              </h3>
            </div>
            <div className="text-sm text-blue-600 font-medium">
              <CalendarOutlined className="mr-1" /> {formattedRange}
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <Tooltip title="Add a checklist task">
              <Button icon={<CheckSquareOutlined />} onClick={handleAddTask}>Checklist</Button>
            </Tooltip>
            <Tooltip title="Add a label">
              <Button icon={<TagsOutlined />}>Label</Button>
            </Tooltip>
            <Tooltip title="Edit this day">
              <Button icon={<EditOutlined />} onClick={() => alert("Edit mode")}>Edit</Button>
            </Tooltip>
            <Tooltip title="Reset all selections for this day">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  setTasks(tasks.map(t => ({ ...t, done: false })));
                  setMood(null);
                  setIsDayCompleted(false);
                }}
              >
                Reset
              </Button>
            </Tooltip>
          </div>

          <div className="mb-4 text-sm bg-blue-50 text-blue-800 border border-blue-200 px-3 py-2 rounded">
            <span className="font-semibold">ℹ️ Description:</span> Please check off each task as you complete it. Once all tasks are done, you can mark the day as completed by checking the top box.
          </div>

          <Divider orientation="left" className="-mx-6 mt-4 mb-2 text-sm font-semibold text-gray-700">
            <CheckSquareOutlined className="mr-2 text-[#1f845a]" /> Checklist
          </Divider>

          <div className="space-y-2">
            {tasks.map((t, i) => (
              <div key={i} className="flex items-center gap-2">
                <Checkbox checked={t.done} onChange={() => toggleTask(i)} />
                <Input value={t.title} onChange={(e) => handleEditTask(i, e.target.value)} className="flex-1" />
                <Button icon={<DeleteOutlined />} onClick={() => handleRemoveTask(i)} size="small" />
              </div>
            ))}
          </div>

          <Divider orientation="left" className="-mx-6 mt-6 mb-2 text-sm font-semibold text-gray-700">
            <SmileOutlined className="mr-2 text-[#1f845a]" /> How do you feel today?
          </Divider>

          <div className="flex gap-4 text-2xl mb-4">
            {MOOD_EMOJIS.map((m, i) => (
              <Tooltip title={m.label} key={i}>
                <Button
                  shape="circle"
                  type={mood === m.label ? "primary" : "default"}
                  onClick={() => setMood(m.label)}
                  className="text-3xl w-14 h-14 flex items-center justify-center"
                >
                  {m.emoji}
                </Button>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* RIGHT: Comments section */}
        <div className="w-2/5 px-6 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <CommentSection day={day} />
        </div>
      </div>
    </Modal>
  );
};

export default DayModal;
