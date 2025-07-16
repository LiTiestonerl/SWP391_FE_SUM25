import React from 'react';
import dayjs from 'dayjs';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const coachList = [
  { id: 1, name: "Dr. Sarah Johnson" },
  { id: 2, name: "Michael Chen" },
  { id: 3, name: "Emma Williams" },
  { id: 4, name: "Dr. Robert Anderson" },
  { id: 5, name: "Dr. Emily Nguyen" },
  { id: 6, name: "Dr. David Lee" },
];

const PlanSummaryCard = ({ plan, onEdit, onDelete }) => {
  const allTasks = plan.weeks?.flatMap(week =>
    week.days?.flatMap(day => day.tasks ?? []) ?? []
  ) ?? [];

  const completedTasks = allTasks.filter(t => t.done).length;
  const percent = plan.percent ?? (Math.round((completedTasks / allTasks.length) * 100) || 0);

  const selectedCoach = coachList.find(c => c.id === plan.coach);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 ring-1 ring-emerald-200/60 hover:shadow-2xl transition relative min-h-[260px]">
      <div className="absolute top-3 right-3 flex gap-2">
        <button onClick={onEdit} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600" title="Edit Plan" >
          <FiEdit2 />
        </button>
        <button onClick={onDelete} className="p-2 rounded-full bg-gray-100 hover:bg-red-100 text-red-600" title="Delete Plan" >
          <FiTrash2 />
        </button>
      </div>

      <h2 className="text-xl font-bold text-emerald-700">{plan.name}</h2>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-gray-600">
        <div><b className="text-gray-800">Reason:</b> {plan.reason}</div>
        <div><b className="text-gray-800">Coach:</b> {selectedCoach?.name || 'Not selected'}</div>
        <div><b className="text-gray-800">Status:</b> {plan.status ?? 'Active'}</div>
        <div><b className="text-gray-800">Addiction:</b> {plan.addictionLevel}</div>
        <div><b className="text-gray-800">Start:</b> {dayjs(plan.startDate).format('DD/MM/YYYY')}</div>
        <div><b className="text-gray-800">End:</b> {dayjs(plan.endDate).format('DD/MM/YYYY')}</div>
      </div>
      <div className="mt-4">
        <div className="text-sm mb-3">Progress: {percent}%</div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default PlanSummaryCard;