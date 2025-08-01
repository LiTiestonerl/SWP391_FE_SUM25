import React, { useState, useEffect } from "react";
import { Modal as AntdModal, Input, Button, Tooltip, Divider, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import api from "../../../configs/axios";

const DayModal = ({ open, onClose, day, weekNumber, weekTitle, onDelete }) => {
  if (!day) return null;

  const [cigarettesSmoked, setCigarettesSmoked] = useState(0);
  const [smokingFreeDays, setSmokingFreeDays] = useState(0);
  const [healthStatus, setHealthStatus] = useState("");
  const [stageId, setStageId] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.post("/quit-progress/update", {
        date: day.date,
        cigarettesSmoked,
        smokingFreeDays,
        healthStatus,
        stageId,
      });
      message.success("Progress saved successfully!");
      onClose();
    } catch (error) {
      message.error("Failed to save progress.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AntdModal
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      closable={false}
      centered
    >
      <div className="flex justify-between items-center border-b border-gray-300 px-6 py-3 bg-white">
        <h2 className="text-xl font-bold text-gray-800">
          Update Progress - {day.title || `Day ${day.dayNumber}`} (Week: {weekTitle || weekNumber})
        </h2>
        <div className="flex items-center gap-3">
          {onDelete && (
            <Tooltip title="Delete this day">
              <Button icon={<DeleteOutlined />} danger onClick={onDelete} />
            </Tooltip>
          )}
          <button
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="px-6 py-4 space-y-4">
        <div>
          <label className="font-medium text-gray-700">Date:</label>
          <Input value={day.date} disabled />
        </div>

        <div>
          <label className="font-medium text-gray-700">Cigarettes Smoked:</label>
          <Input
            type="number"
            min={0}
            value={cigarettesSmoked}
            onChange={(e) => setCigarettesSmoked(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="font-medium text-gray-700">Smoke-Free Days:</label>
          <Input
            type="number"
            min={0}
            value={smokingFreeDays}
            onChange={(e) => setSmokingFreeDays(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="font-medium text-gray-700 block mb-1">Health Status:</label>
          <Input.TextArea
            placeholder="How do you feel today?"
            value={healthStatus}
            onChange={(e) => setHealthStatus(e.target.value)}
            rows={4}
            showCount
            maxLength={300}
            style={{ resize: "vertical" }}
          />
        </div>

        <div>
          <label className="font-medium text-gray-700">Stage ID:</label>
          <Input
            type="number"
            min={1}
            value={stageId}
            onChange={(e) => setStageId(Number(e.target.value))}
          />
        </div>

        <Divider />

        <div className="flex justify-end gap-3">
          <Button type="primary" onClick={handleSave} loading={loading}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </AntdModal>
  );
};

export default DayModal;
