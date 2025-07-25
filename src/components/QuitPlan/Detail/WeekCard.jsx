import React from 'react';
import { notify } from './QuitPlan';

const WeekCard = ({
  week,
  weekIndex,
  selectedPlan,
  handleCompleteDay,
  handleMenuAction,
  onDayClick,
  selectedStartDate,
  selectedEndDate,
}) => {
  const progress = (week.plans.filter((p) => p.completed).length / week.plans.length) * 100;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleToggleComplete = (idx) => {
    handleCompleteDay(weekIndex, idx);
    const plan = week.plans[idx];
    if (plan.completed) {
      notify('info', 'Day marked as incomplete!', `toggle-${weekIndex}-${idx}`, { backgroundColor: '#90A4AE' });
    } else {
      notify('success', 'Day marked as completed! +10 points', `toggle-${weekIndex}-${idx}`);
    }
  };

  const filteredPlans = selectedStartDate && selectedEndDate
    ? week.plans.filter(plan => {
      const planDate = new Date(plan.date);
      return planDate >= new Date(selectedStartDate) && planDate <= new Date(selectedEndDate);
    })
    : week.plans;

  return (
    <div
      className="rounded-2xl shadow-xl p-4 border border-emerald-200 transition relative"
      style={{
        background: 'linear-gradient(to bottom right, #f9fafb, #e0f2f1)',
      }}
    >
      <h3
        className="text-xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent"
      >
        {selectedStartDate && selectedEndDate ? (
          <>
            {new Date(selectedStartDate).toLocaleDateString()} ➜{' '}
            {new Date(selectedEndDate).toLocaleDateString()}
          </>
        ) : (
          <>
            Week {week.id} – {new Date(week.start).toLocaleDateString()} ➜{' '}
            {new Date(week.end).toLocaleDateString()}
          </>
        )}
      </h3>

      <div className="w-full bg-gray-300 rounded-full h-2 mb-4">
        <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${progress}%` }} />
      </div>

      <div className="overflow-x-auto pb-4">
        <div
          className="grid gap-4 mt-8"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${filteredPlans.length}, minmax(0, 1fr))`,
            width: 'max-content',
            minWidth: '100%',
          }}
        >
          {filteredPlans.map((d, idx) => {
            const planDate = new Date(d.date);
            planDate.setHours(0, 0, 0, 0);

            const isToday = planDate.getTime() === today.getTime();
            const pastOrToday = planDate <= today;

            return (
              <div key={idx} className="flex flex-col items-center relative" style={{ height: 200 }}>
                {isToday && (
                  <span className="absolute -top-6.5 left-1/2 -translate-x-1/2 text-blue-500 text-xl">
                    📍
                  </span>
                )}

                <div
                  onClick={() => pastOrToday && onDayClick(idx)}
                  className={`w-32 h-40 p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer relative
                    ${d.completed ? 'bg-[#d4f4dd] border-[2px] border-emerald-700' : 'bg-white border border-gray-1000'}
                    ${d.highlight ? 'border-rose-400' : ''}
                    ${!pastOrToday ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {d.highlight && (
                    <>
                      <span className="absolute w-0 h-0 border-t-[18px] border-t-rose-400 border-r-[18px] border-r-transparent -left-1 -top-1" />
                      <span className="absolute w-0 h-0 border-b-[18px] border-b-rose-400 border-l-[18px] border-l-transparent -right-1 -bottom-1" />
                    </>
                  )}

                  <span className="font-semibold text-sm sm:text-base block">
                    {d.date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="block text-xs sm:text-sm mt-1">
                    {d.date.getDate()}/{d.date.getMonth() + 1}/{d.date.getFullYear()}
                  </span>
                  <hr className="w-20 border-t mt-2 mb-1" />
                  <span className="block text-center text-sm sm:text-base font-medium">{d.plan}</span>
                </div>

                {pastOrToday && (
                  <button
                    title="Mark as done"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleComplete(idx);
                    }}
                    className={`w-5 h-5 rounded-full text-white text-[10px] flex items-center
                      justify-center mt-2 transition
                      ${d.completed
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-gray-400 hover:bg-gray-500'
                      }`}
                  >
                    ✓
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {['HEALTH+', 'OTHERS'].includes(selectedPlan) && (
        <div className="mt-2 flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMenuAction(weekIndex, 0, 'edit');
            }}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          >
            ⋮
          </button>
        </div>
      )}
    </div>
  );
};

export default WeekCard;
