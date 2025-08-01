import React, { useState } from "react";
import { FaStar, FaPlus } from "react-icons/fa";
import { MoreOutlined } from "@ant-design/icons";
import { Input, Button, Dropdown, Menu } from "antd";
import DayCard from "./DayCard";
import DayModal from "./DayModal";
import dayjs from "dayjs";

const WeekColumn = ({ weekNumber, days = [], planStartDate, isHighlighted = false }) => {
  const [dayCards, setDayCards] = useState(days);
  const [addingCard, setAddingCard] = useState(false);
  const [newCardName, setNewCardName] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(`Week ${weekNumber}`);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleAddCard = () => {
    const title = newCardName.trim();
    if (!title) return;

    const nextDayNumber = dayCards.reduce((max, d) => Math.max(max, d.dayNumber || 0), 0) + 1;

    const newCard = {
      id: `${Date.now()}`,
      dayNumber: nextDayNumber,
      date: dayjs(planStartDate).format("YYYY-MM-DD"),
      title,
      status: "",
      tasks: [],
      comments: [],
    };

    setDayCards((prev) => [...prev, newCard]);
    setNewCardName("");
    setAddingCard(false);
  };

  const handleDeleteCard = (id) => {
    setDayCards((prev) => prev.filter((card) => card.id !== id));
    setSelectedCard(null);
  };

  const handleMenuClick = ({ key }) => {
    if (key === "edit") setEditingTitle(true);
    if (key === "add") setAddingCard(true);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="edit">Edit name list</Menu.Item>
      <Menu.Item key="add">Add a card</Menu.Item>
    </Menu>
  );

  return (
    <div className="relative">
      {isHighlighted && (
        <div className="absolute right-3 top-3 z-20">
          <FaStar className="text-red-500 text-xl drop-shadow" />
        </div>
      )}

      <div className="rounded-2xl shadow-lg w-70 min-w-[18rem] border bg-white overflow-hidden transition relative">
        <div className="flex justify-between items-center px-3 py-2 border-b border-gray-200">
          {editingTitle ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onPressEnter={() => setEditingTitle(false)}
              onBlur={() => setEditingTitle(false)}
              autoFocus
            />
          ) : (
            <h2 className="text-lg font-bold text-black">{title}</h2>
          )}
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button icon={<MoreOutlined />} shape="circle" />
          </Dropdown>
        </div>

        <div className="scroll-area px-3 pb-4 pt-2" style={{ maxHeight: "63vh", overflowY: "auto" }}>
          <div className="space-y-4">
            {dayCards.map((day) => (
              <DayCard
                key={day.id}
                day={day}
                weekNumber={weekNumber}
                weekTitle={title}
                planStartDate={planStartDate}
                onClick={() => setSelectedCard(day)}
              />
            ))}
          </div>

          {addingCard ? (
            <div className="flex gap-2 mt-4">
              <Input
                value={newCardName}
                onChange={(e) => setNewCardName(e.target.value)}
                placeholder="Enter card name"
                onPressEnter={handleAddCard}
                autoFocus
              />
              <Button type="primary" onClick={handleAddCard}>
                Save
              </Button>
            </div>
          ) : (
            <Button type="dashed" block className="mt-4" onClick={() => setAddingCard(true)}>
              <FaPlus className="mr-2" />
              Add a card
            </Button>
          )}
        </div>
      </div>

      <DayModal
        visible={!!selectedCard}
        day={selectedCard}
        weekTitle={title}
        onClose={() => setSelectedCard(null)}
        onDelete={() => handleDeleteCard(selectedCard.id)}
      />

      <style>
        {`
          .scroll-area::-webkit-scrollbar {
            width: 8px;
          }
          .scroll-area::-webkit-scrollbar-track {
            background: transparent;
          }
          .scroll-area::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.25);
            border-radius: 10px;
          }
          .scroll-area {
            scrollbar-width: thin;
            scrollbar-color: rgba(0, 0, 0, 0.25) transparent;
          }
        `}
      </style>
    </div>
  );
};

export default WeekColumn;
