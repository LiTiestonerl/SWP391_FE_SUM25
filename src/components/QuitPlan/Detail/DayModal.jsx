import { useState, useEffect } from "react";
import { Modal as AntdModal, Input, Button, Divider, message } from "antd";
import { quitProgressService } from "../../../services/quitPlanService";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';

// Extend dayjs with isBetween plugin
dayjs.extend(isBetween);

const DayModal = ({ 
  open, 
  onClose, 
  day, 
  quitPlanStages,
  isViewOnly = false,
  planStatus = "IN_PROGRESS"
}) => {
  const [cigarettesSmoked, setCigarettesSmoked] = useState(day?.cigarettesSmoked || 0);
  const [smokingFreeDays, setSmokingFreeDays] = useState(day?.smokingFreeDays || 0);
  const [healthStatus, setHealthStatus] = useState(day?.healthStatus || "");
  const [loading, setLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState(null);

  const findStageForDate = (dateString) => {
    if (!quitPlanStages || !dateString) return null;
    
    try {
      const currentDate = dayjs(dateString);
      return quitPlanStages.find(stage => {
        const startDate = dayjs(stage.stageStartDate);
        const endDate = dayjs(stage.stageEndDate);
        return currentDate.isBetween(startDate, endDate, 'day', '[]');
      });
    } catch (error) {
      console.error('Error finding stage:', error);
      return null;
    }
  };

  useEffect(() => {
    if (day?.date) {
      const matchedStage = findStageForDate(day.date);
      setCurrentStage(matchedStage);
      
      if (day.progressId) {
        setCigarettesSmoked(day.cigarettesSmoked || 0);
        setSmokingFreeDays(day.smokingFreeDays || 0);
        setHealthStatus(day.healthStatus || "");
      }
    }
  }, [day]);

  const handleSave = async () => {
    if (!day || !currentStage) {
      message.error("Missing required data");
      return;
    }

    setLoading(true);
    try {
      const progressData = {
        date: day.date,
        cigarettesSmoked,
        smokingFreeDays,
        healthStatus,
        stageId: currentStage.stageId
      };

      await quitProgressService.updateProgress(progressData);
      message.success("Progress saved successfully!");
      onClose(true);
    } catch (error) {
      console.error('Save progress error:', error);
      message.error(error.response?.data?.message || "Failed to save progress");
    } finally {
      setLoading(false);
    }
  };

  const isSaveDisabled = isViewOnly || planStatus !== "IN_PROGRESS" || !currentStage;

  if (!day) return null;

  return (
    <AntdModal
      open={open}
      onCancel={() => onClose(false)}
      footer={null}
      width={600}
      centered
      closable={!isViewOnly}
    >
      <div className="flex justify-between items-center border-b border-gray-300 px-6 py-3 bg-white">
        <h2 className="text-xl font-bold text-gray-800">
          {isViewOnly ? "View Progress" : "Update Progress"} - {day.date}
        </h2>
      </div>

      <div className="px-6 py-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium text-gray-700">Date:</label>
            <Input value={day.date} disabled />
          </div>
          <div>
            <label className="font-medium text-gray-700">Stage:</label>
            <Input 
              value={currentStage ? `${currentStage.stageName} (ID: ${currentStage.stageId})` : "Not assigned"} 
              disabled 
            />
          </div>
        </div>

        <div>
          <label className="font-medium text-gray-700">Cigarettes Smoked:</label>
          <Input
            type="number"
            min={0}
            max={currentStage?.targetCigarettesPerDay || 20}
            value={cigarettesSmoked}
            onChange={(e) => setCigarettesSmoked(Number(e.target.value))}
            disabled={isViewOnly}
          />
          {currentStage && (
            <p className="text-xs text-gray-500 mt-1">
              Target: {currentStage.targetCigarettesPerDay} cigarettes/day
            </p>
          )}
        </div>

        <div>
          <label className="font-medium text-gray-700">Smoke-Free Days:</label>
          <Input
            type="number"
            min={0}
            value={smokingFreeDays}
            onChange={(e) => setSmokingFreeDays(Number(e.target.value))}
            disabled={isViewOnly}
          />
        </div>

        <div>
          <label className="font-medium text-gray-700 block mb-1">Health Status:</label>
          <Input.TextArea
            placeholder="How are you feeling today?"
            value={healthStatus}
            onChange={(e) => setHealthStatus(e.target.value)}
            rows={4}
            showCount
            maxLength={300}
            disabled={isViewOnly}
          />
        </div>

        {!isViewOnly && planStatus === "IN_PROGRESS" && (
          <>
            <Divider />
            <div className="flex justify-end gap-3">
              <Button 
                type="primary" 
                onClick={handleSave} 
                loading={loading}
              >
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </div>
          </>
        )}
      </div>
    </AntdModal>
  );
};

export default DayModal;