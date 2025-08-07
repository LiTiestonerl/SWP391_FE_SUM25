import { useState, useEffect } from "react";
import { Modal as AntdModal, Input, Button, Divider, message, Alert } from "antd";
import { quitProgressService } from "../../../services/quitPlanService";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const DayModal = ({ 
  open, 
  onClose, 
  day, 
  quitPlanStages,
  isViewOnly = false,
  planStatus = "IN_PROGRESS"
}) => {
  const [cigarettesSmoked, setCigarettesSmoked] = useState(0);
  const [smokingFreeDays, setSmokingFreeDays] = useState(0);
  const [healthStatus, setHealthStatus] = useState("");
  const [moneySpent, setMoneySpent] = useState(0);
  const [moneySaved, setMoneySaved] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState(null);
  const [stageLoading, setStageLoading] = useState(true);

  const findStageForDate = (dateString) => {
    if (!quitPlanStages || !dateString) {
      console.warn('Missing stages or date');
      return null;
    }

    try {
      const currentDate = dayjs(dateString);
      const matchedStage = quitPlanStages.find(stage => {
        try {
          const startDate = dayjs(stage.stageStartDate);
          const endDate = dayjs(stage.stageEndDate);
          return currentDate.isBetween(startDate, endDate, 'day', '[]');
        } catch (e) {
          console.error('Error processing stage dates:', e);
          return false;
        }
      });
      
      return matchedStage || null;
    } catch (error) {
      console.error('Error finding stage:', error);
      return null;
    }
  };

  useEffect(() => {
    if (day?.date) {
      setStageLoading(true);
      const matchedStage = findStageForDate(day.date);
      setCurrentStage(matchedStage);
      
      if (day.progressId) {
        setCigarettesSmoked(day.cigarettesSmoked || 0);
        setSmokingFreeDays(day.smokingFreeDays || 0);
        setHealthStatus(day.healthStatus || "");
        setMoneySpent(day.moneySpent || 0);
        setMoneySaved(day.moneySaved || 0);
      }
      setStageLoading(false);
    }
  }, [day]);

  const isSaveDisabled = isViewOnly || 
                        planStatus !== "IN_PROGRESS" || 
                        !currentStage ||
                        cigarettesSmoked < 0;

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

      const response = await quitProgressService.updateProgress(progressData);
      setMoneySpent(response.moneySpent || 0);
      setMoneySaved(response.moneySaved || 0);
      message.success("Progress saved successfully!");
      onClose(true);
    } catch (error) {
      console.error('Save progress error:', error);
      message.error(error.response?.data?.message || "Failed to save progress");
    } finally {
      setLoading(false);
    }
  };

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
        {!currentStage && !stageLoading && (
          <Alert 
            type="warning" 
            message="No matching stage found for this date" 
            showIcon
          />
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium text-gray-700">Date:</label>
            <Input value={day.date} disabled />
          </div>
          
          <div>
            <label className="font-medium text-gray-700">Stage:</label>
            <Input 
              value={
                stageLoading ? "Loading..." :
                currentStage ? `${currentStage.stageName}` : 
                "Not assigned"
              } 
              disabled 
            />
          </div>
        </div>

        <div>
          <label className="font-medium text-gray-700">Cigarettes Smoked:</label>
          <Input
            type="number"
            min={0}
            value={cigarettesSmoked}
            onChange={(e) => setCigarettesSmoked(Number(e.target.value))}
            disabled={isViewOnly}
          />
          {currentStage && (
            <p className="text-xs text-gray-500 mt-1">
              Target suggestion: {currentStage.targetCigarettesPerDay} cigarettes/day
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
          <label className="font-medium text-gray-700">Money Spent:</label>
          <Input
            type="number"
            value={moneySpent}
            disabled
          />
        </div>

        <div>
          <label className="font-medium text-gray-700">Money Saved:</label>
          <Input
            type="number"
            value={moneySaved}
            disabled
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
                disabled={isSaveDisabled}
              >
                Save
              </Button>
              <Button onClick={() => onClose(false)}>Cancel</Button>
            </div>
          </>
        )}
      </div>
    </AntdModal>
  );
};

export default DayModal;