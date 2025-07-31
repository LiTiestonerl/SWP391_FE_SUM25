import React from 'react';
import dayjs from 'dayjs';
import { FiEdit2, FiTrash2, FiCheckCircle } from 'react-icons/fi';

const coachList = [
  { id: 1, name: "Dr. Sarah Johnson" },
  { id: 2, name: "Michael Chen" },
  { id: 3, name: "Emma Williams" },
  { id: 4, name: "Dr. Robert Anderson" },
  { id: 5, name: "Dr. Emily Nguyen" },
  { id: 6, name: "Dr. David Lee" },
];

const formatMoney = (amount) => {
  if (!amount && amount !== 0) return '0 VND';
  const num = Number(String(amount).replace(/[.,]/g, ''));
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(num);
};

const PlanSummaryCard = ({ plan, onEdit, onDelete, onComplete }) => {
  const daysPassed = dayjs().diff(dayjs(plan.startDate), 'day') + 1;
  const totalDays = dayjs(plan.endDate).diff(dayjs(plan.startDate), 'day') + 1;
  const percent = Math.min(100, Math.max(0, Math.round((daysPassed / totalDays) * 100)));

  const selectedCoach = coachList.find(c => c.id === plan.coach);
  const isCompleted = plan?.status?.toLowerCase?.() === 'completed';

  // ✅ Lấy brand từ plan.brand (được trả về từ Create), có fallback nhẹ nếu tương lai đổi field
  const brandName = plan.brand || plan?.cigaretteBrand || 'N/A';

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 ring-1 ring-emerald-200/60 hover:shadow-2xl transition relative min-h-[260px]">
      <div className="absolute top-3 right-3 flex gap-2">
        {!isCompleted && (
          <button
            onClick={onComplete}
            className="p-2 rounded-full bg-gray-100 hover:bg-emerald-100 text-emerald-600"
            title="Mark as Completed"
          >
            <FiCheckCircle />
          </button>
        )}
        <button
          onClick={onEdit}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
          title="Edit Plan"
        >
          <FiEdit2 />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-full bg-gray-100 hover:bg-red-100 text-red-600"
          title="Delete Plan"
        >
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
        <div><b className="text-gray-800">Brand:</b> {brandName}</div>
        <div><b className="text-gray-800">Flavor:</b> {plan.flavor || 'N/A'}</div>
        <div><b className="text-gray-800">Nicotine Level:</b> {plan.nicotineLevel || 'N/A'}</div>
        <div><b className="text-gray-800">Sticks/Pack:</b> {plan.sticksPerPack || 'N/A'}</div>
        <div><b className="text-gray-800">Price/Cigarette:</b> {formatMoney(plan.pricePerCigarette)}</div>
      </div>

      <div className="mt-4">
        <div className="text-sm mb-3">Progress: {percent}% ({daysPassed}/{totalDays} days)</div>
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
