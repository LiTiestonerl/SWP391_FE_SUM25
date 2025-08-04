import React from 'react';
import dayjs from 'dayjs';
import { FiEdit2, FiCheckCircle, FiX } from 'react-icons/fi';

const PlanSummaryCard = ({ 
  plan, 
  onEdit, 
  onComplete,
  onCancel,
  isCompleted,
  isCancelled
}) => {
  const startDate = plan.startDate ? dayjs(plan.startDate) : dayjs();
  const endDate = plan.endDate 
    ? dayjs(plan.endDate) 
    : plan.expectedEndDate 
      ? dayjs(plan.expectedEndDate) 
      : startDate.add(30, 'day');
  const daysPassed = dayjs().diff(dayjs(plan.startDate), 'day') + 1;
  const totalDays = dayjs(plan.endDate).diff(dayjs(plan.startDate), 'day') + 1;
  const percent = Math.min(100, Math.max(0, Math.round((daysPassed / totalDays) * 100)));

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 ring-1 ring-emerald-200/60 hover:shadow-2xl transition relative min-h-[240px]">
      <div className="absolute top-3 right-3 flex gap-2">
        {/* Nút Complete - chỉ hiện khi plan chưa completed hoặc cancelled */}
        {!isCompleted && !isCancelled && (
          <button
            onClick={onComplete}
            className="p-2 rounded-full bg-gray-100 hover:bg-emerald-100 text-emerald-600"
            title="Mark as Completed"
          >
            <FiCheckCircle />
          </button>
        )}
        
        {/* Nút Cancel - chỉ hiện khi plan chưa completed hoặc cancelled */}
        {!isCompleted && !isCancelled && (
          <button
            onClick={onCancel}
            className="p-2 rounded-full bg-gray-100 hover:bg-orange-100 text-orange-500"
            title="Cancel Plan"
          >
            <FiX />
          </button>
        )}
        
        {/* Nút Edit */}
        <button
          onClick={onEdit}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
          title="Edit Plan"
        >
          <FiEdit2 />
        </button>
      </div>

      {/* Phần còn lại giữ nguyên */}
      <h2 className="text-2xl font-bold text-emerald-700 mb-4">{plan.name || plan.title}</h2>
      
      <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
        <div><b className="text-gray-800">Reason:</b> {plan.reason || 'Not specified'}</div>
        <div><b className="text-gray-800">Coach:</b> {plan.coachName || 'Not selected'}</div>
        <div><b className="text-gray-800">Status:</b> {plan.status || 'Active'}</div>
        <div><b className="text-gray-800">Start:</b> {startDate.format('DD/MM/YYYY')}</div>
        <div><b className="text-gray-800">End:</b> {endDate.format('DD/MM/YYYY')}</div>
      </div>

      {plan.customNotes && (
        <p className="text-sm text-gray-600 mt-4 italic">{plan.customNotes}</p>
      )}
    </div>
  );
};

export default PlanSummaryCard;