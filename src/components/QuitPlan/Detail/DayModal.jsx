import React, { useState, useEffect } from "react";
import { Modal as AntdModal, Input, Button, Divider, message } from "antd";
import { quitProgressService, noSmokingHelpers } from "../../../services/quitPlanService";
import dayjs from "dayjs";

const DayModal = ({ 
  open, 
  onClose, 
  day, 
  weekNumber, 
  quitPlanStages, // Pass stages data from parent
  planStartDate
}) => {
  const [cigarettesSmoked, setCigarettesSmoked] = useState(0);
  const [smokingFreeDays, setSmokingFreeDays] = useState(0);
  const [healthStatus, setHealthStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // Find matching stage for the current day's date
  const getStageForDate = (date) => {
    if (!quitPlanStages || !date) return null;
    
    const currentDate = dayjs(date);
    return quitPlanStages.find(stage => {
      const startDate = dayjs(stage.stageStartDate);
      const endDate = dayjs(stage.stageEndDate);
      return currentDate.isBetween(startDate, endDate, null, '[]'); // Inclusive comparison
    });
  };

  // Get correct stage info for current day
  const getStageInfo = () => {
    if (!day?.date) return { stageId: weekNumber, stageName: `Week ${weekNumber}` };
    
    const matchedStage = getStageForDate(day.date);
    return {
      stageId: matchedStage?.stageId || weekNumber,
      stageName: matchedStage?.stageName || `Week ${weekNumber}`,
      targetCigs: matchedStage?.targetCigarettesPerDay || 0
    };
  };

  useEffect(() => {
    if (day) {
      // Reset form when day changes
      setCigarettesSmoked(0);
      setSmokingFreeDays(0);
      setHealthStatus("");
    }
  }, [day]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { stageId, stageName, targetCigs } = getStageInfo();
      
      // Calculate money saved based on target vs actual
      const moneySaved = (targetCigs - cigarettesSmoked) * 1750; // Assuming 1750 VND per cigarette
      
      const progressData = {
        date: day.date,
        cigarettesSmoked,
        smokingFreeDays,
        healthStatus,
        stageId, // Correct stageId from matching
        stageName, // Correct stageName from matching
        moneySaved,
        moneySpent: 0 // Can be calculated if needed
      };

      await quitProgressService.updateProgress(progressData);

      const motivationalMsg = noSmokingHelpers.getMotivationalMessage(smokingFreeDays);
      message.success(`Progress saved! ${motivationalMsg}`);
      onClose();
    } catch (error) {
      console.error('Error saving progress:', error);
      message.error("Failed to save progress. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!day) return null;

  const { stageId, stageName } = getStageInfo();

  return (
    <AntdModal
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      closable={false}
    >
      <div className="flex justify-between items-center border-b border-gray-300 px-6 py-3 bg-white">
        <h2 className="text-xl font-bold text-gray-800">
          Update Progress - Day {day.dayNumber}
        </h2>
        <button onClick={onClose} className="text-xl text-gray-500 hover:text-black">
          ✕
        </button>
      </div>

      <div className="px-6 py-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium text-gray-700">Date:</label>
            <Input value={day.date} disabled />
          </div>
          <div>
            <label className="font-medium text-gray-700">Stage:</label>
            <Input value={`${stageName} (ID: ${stageId})`} disabled />
          </div>
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