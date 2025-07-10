import React from 'react';
import dayjs from 'dayjs';

const PlanSummaryCard = ({ plan }) => (
  <div className="bg-white rounded-2xl shadow-xl p-6 ring-1 ring-emerald-200/60 hover:shadow-2xl transition">
    <h2 className="text-xl font-bold text-emerald-700 mb-2">{plan.name}</h2>
    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
      <div><b className="text-gray-800">Reason:</b> {plan.reason}</div>
      <div><b className="text-gray-800">Coach:</b> {plan.coach}</div>
      <div><b className="text-gray-800">Status:</b> {plan.status ?? 'Active'}</div>
      <div><b className="text-gray-800">Addiction:</b> {plan.addictionLevel}</div>
      <div><b className="text-gray-800">Start:</b> {dayjs(plan.startDate).format('DD/MM/YYYY')}</div>
      <div><b className="text-gray-800">End:</b> {dayjs(plan.endDate).format('DD/MM/YYYY')}</div>
    </div>
    <div className="mt-4">
      <div className="text-sm mb-1">Progress: {plan.percent}%</div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${plan.percent}%` }} />
      </div>
    </div>
  </div>
);

export default PlanSummaryCard;
