import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import MonthNavigator from './MonthNavigator';
import DateRangePicker from './DateRangePicker';
import './modal.css';

const WeekCard = lazy(() => import('./WeekCard'));
const Modal = lazy(() => import('./Modal'));

const TOAST_DURATION = 3500;
const TOAST_PROPERTIES = {
  className: 'custom-toast',
  progressClassName: 'custom-toast-progress',
  autoClose: TOAST_DURATION,
  pauseOnHover: true,
};

const toastIds = new Map();

export const notify = (type = 'info', message = '', key = null, options = {}) => {
  const toastKey = key || message;
  if (toastIds.has(toastKey)) {
    toast.dismiss(toastIds.get(toastKey));
    toastIds.delete(toastKey);
  }

  toast.dismiss();

  const config = {
    ...TOAST_PROPERTIES,
    closeButton: true,
    draggable: false,
    transition: Zoom,
    transitionDuration: 300,
    onClose: () => toastIds.delete(toastKey),
    ...options,
  };

  const id =
    type === 'success' ? toast.success(message, config) :
    type === 'warning' ? toast.warning(message, config) :
    toast.info(message, config);

  toastIds.set(toastKey, id);
};

const QuitPlan = () => {
  const navigate = useNavigate();

  const [points, setPoints] = useState(() => parseInt(localStorage.getItem('plansPoints') || '0'));
  const [currentMonth, setMonth] = useState(new Date());
  const [selectedWeek, setWeek] = useState(null);
  const [selectedDay, setDay] = useState(null);
  const [searchTerm, setSearch] = useState('');
  const [plansByWeek, setWeeks] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [isDateRangeMode, setIsDateRangeMode] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  const selectedPlan = 'OTHERS';

  const generateWeeksForMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const weeks = [];
    let current = new Date(firstDay);
    let weekStart = new Date(current);

    while (current <= lastDay) {
      const weekDays = [];

      while (current <= lastDay && (weekDays.length === 0 || current.getDay() !== 1)) {
        weekDays.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }

      const weekEnd = new Date(weekDays[weekDays.length - 1]);

      weeks.push({
        id: weeks.length + 1,
        start: weekStart,
        end: weekEnd,
      });

      weekStart = new Date(current);
    }

    return weeks;
  };

  const generatePlans = (start, end) => {
    const res = [];
    let d = new Date(start);
    const templates = [
      'Deep breathing for 10 mins',
      'Drink 2L water daily',
      '15 mins light exercise',
      'Meditation session',
      'Avoid coffee triggers',
      'Journal your feelings',
      'Relax with calming music',
    ];

    while (d <= end && d.getMonth() === start.getMonth()) {
      res.push({
        plan: templates[(d.getDay() + 6) % 7],
        editable: false,
        completed: false,
        highlight: false,
        date: new Date(d),
        commentHistory: [],
      });
      d.setDate(d.getDate() + 1);
    }

    return res;
  };

  const generatePlansBetweenDates = (startDate, endDate) => {
    const allPlans = [];
    const current = new Date(startDate);
    const last = new Date(endDate);
    const templates = [
      'Deep breathing for 10 mins',
      'Drink 2L water daily',
      '15 mins light exercise',
      'Meditation session',
      'Avoid coffee triggers',
      'Journal your feelings',
      'Relax with calming music',
    ];

    while (current <= last) {
      allPlans.push({
        plan: templates[(current.getDay() + 6) % 7],
        editable: false,
        completed: false,
        highlight: false,
        date: new Date(current),
        commentHistory: [],
      });
      current.setDate(current.getDate() + 1);
    }

    return allPlans;
  };

  const restoreDates = (w) =>
    w.map((wk) => ({
      ...wk,
      start: new Date(wk.start),
      end: new Date(wk.end),
      plans: wk.plans.map((p) => ({ ...p, date: new Date(p.date) })),
    }));

  useEffect(() => {
    const arr = generateWeeksForMonth(currentMonth).map((w) => ({
      ...w,
      plans: generatePlans(w.start, w.end),
    }));
    setWeeks(arr);

    const today = new Date();
    const cur = arr.find((w) => w.start <= today && w.end >= today);
    setWeek(cur ? arr.indexOf(cur) : null);
  }, [currentMonth]);

  useEffect(() => {
    localStorage.setItem('plansPoints', points);
    localStorage.setItem('plansPlans', JSON.stringify(plansByWeek));
  }, [points, plansByWeek]);

  const toggleDay = (wIdx, dIdx) => {
    setWeeks((prev) => {
      const dup = restoreDates(JSON.parse(JSON.stringify(prev)));
      const day = dup[wIdx].plans[dIdx];
      day.completed = !day.completed;
      setPoints((p) => (day.completed ? p + 10 : Math.max(0, p - 10)));
      return dup;
    });
  };

  const handleCompleteDay = (wIdx, dIdx) => {
    const today = new Date();
    if (plansByWeek[wIdx].plans[dIdx].date > today) {
      return;
    }
    toggleDay(wIdx, dIdx);
  };

  const handleMenuAction = (wIdx, dIdx, act) => {
    switch (act) {
      case 'save':
        break;
      case 'share':
        break;
      case 'copy':
        navigator.clipboard.writeText(plansByWeek[wIdx].plans[dIdx].plan);
        break;
      case 'edit':
        setWeeks((prev) => {
          const dup = restoreDates(JSON.parse(JSON.stringify(prev)));
          dup[wIdx].plans[dIdx].editable = true;
          return dup;
        });
        setDay({ weekIndex: wIdx, dayIndex: dIdx });
        break;
      case 'highlight':
        setWeeks((prev) => {
          const dup = restoreDates(JSON.parse(JSON.stringify(prev)));
          dup[wIdx].plans[dIdx].highlight = !dup[wIdx].plans[dIdx].highlight;
          return dup;
        });
        break;
      default:
        break;
    }
  };

  const handleSaveEdit = (wIdx, dIdx, newText) => {
    setWeeks((prev) => {
      const dup = restoreDates(JSON.parse(JSON.stringify(prev)));
      dup[wIdx].plans[dIdx].plan = newText;
      dup[wIdx].plans[dIdx].editable = false;
      return dup;
    });
  };

  const pushComment = (wIdx, dIdx, text) => {
    setWeeks((prev) => {
      const dup = [...prev];
      const arr = dup[wIdx].plans[dIdx].commentHistory;
      if (!arr.length || arr[arr.length - 1].text !== text) {
        arr.push({ text, timestamp: new Date().toISOString() });
      }
      return dup;
    });
  };

  const handleDateRangeSelect = (startDate, endDate) => {
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
    setIsDateRangeMode(true);
    
    const dateRangePlans = generatePlansBetweenDates(startDate, endDate);
    
    const fakeWeek = {
      id: 'custom-range',
      start: startDate,
      end: endDate,
      plans: dateRangePlans
    };
    
    setWeeks([fakeWeek]);
    setWeek(0);
  };

  const resetToMonthView = () => {
    setIsDateRangeMode(false);
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    const arr = generateWeeksForMonth(currentMonth).map((w) => ({
      ...w,
      plans: generatePlans(w.start, w.end),
    }));
    setWeeks(arr);
    setWeek(null);
  };

  const highlightText = (text, term) => {
    if (!term) return text;
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === term.toLowerCase() 
        ? <mark key={i} className="bg-yellow-200">{part}</mark> 
        : part
    );
  };

  const filterPlans = (plans) => {
    if (!searchTerm.trim()) return plans;
    
    const searchTermLower = searchTerm.toLowerCase();
    
    return plans.map(week => ({
      ...week,
      plans: week.plans.map(plan => {
        // Clone plan to avoid mutating original
        const highlightedPlan = {...plan};
        
        // Check matches for each field
        const planContentMatch = plan.plan.toLowerCase().includes(searchTermLower);
        const dateStr = `${plan.date.getDate()}/${plan.date.getMonth() + 1}`;
        const fullDateStr = `${dateStr}/${plan.date.getFullYear()}`;
        const dateMatch = dateStr.includes(searchTermLower) || 
                         fullDateStr.includes(searchTermLower);
        const weekdayMatch = plan.date.toLocaleDateString('en-US', { 
          weekday: 'long' 
        }).toLowerCase().includes(searchTermLower) ||
        plan.date.toLocaleDateString('en-US', { 
          weekday: 'short' 
        }).toLowerCase().includes(searchTermLower);
        const statusMatch = (
          (plan.completed && 'completed'.includes(searchTermLower)) ||
          (!plan.completed && new Date(plan.date) < new Date() && 'missed'.includes(searchTermLower))
        );
        const highlightMatch = (
          plan.highlight && ('highlight'.includes(searchTermLower) || 
                          'important'.includes(searchTermLower))
        );
        
        // Add highlight to matching fields
        if (planContentMatch) {
          highlightedPlan.plan = highlightText(plan.plan, searchTerm);
        }
        
        return {
          ...highlightedPlan,
          _match: planContentMatch || dateMatch || weekdayMatch || 
                 statusMatch || highlightMatch
        };
      }).filter(plan => plan._match)
    })).filter(week => week.plans.length > 0);
  };

  const filteredWeeks = filterPlans(plansByWeek);
  const completedMonth = plansByWeek.reduce(
    (a, w) => a + w.plans.filter((p) => p.completed).length,
    0
  );

  const searchSuggestions = [
    'meditation',
    'water',
    'exercise',
    'completed',
    'missed',
    'highlight',
    `${new Date().getDate()}/${new Date().getMonth() + 1}`,
    'Monday',
    'Friday'
  ];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-100 to-emerald-50 text-gray-800">
      <div className="max-w-7xl mx-auto week-card-container">
        <ToastContainer
          position="top-right"
          autoClose={TOAST_DURATION}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable={false}
          hideProgressBar={false}
          limit={1}
          transition={Zoom}
          transitionDuration={300}
          theme="colored"
          style={{ zIndex: 9999, marginTop: 20, marginRight: 10, position: 'fixed' }}
        />

        <div className="flex justify-center mb-10 mt-4">
          <MonthNavigator
            currentMonth={currentMonth}
            onMonthChange={(o) => {
              const d = new Date(currentMonth);
              d.setMonth(d.getMonth() + o);
              setMonth(d);
            }}
          />
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 max-w-md relative">
            <input
              value={searchTerm}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSearchSuggestions(e.target.value.length > 0);
              }}
              onFocus={() => setShowSearchSuggestions(searchTerm.length > 0)}
              onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
              placeholder="Search plans by content, date (dd/mm), status..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
            {showSearchSuggestions && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md p-2 text-sm text-gray-500 border border-gray-200">
                <div className="text-xs text-gray-400 mb-2">Try searching for:</div>
                <div className="flex flex-wrap gap-2">
                  {searchSuggestions
                    .filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
                    .slice(0, 6)
                    .map((suggestion, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200"
                        onClick={() => {
                          setSearch(suggestion);
                          setShowSearchSuggestions(false);
                        }}
                      >
                        {suggestion}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 ml-4">
            {isDateRangeMode ? (
              <div className="flex items-center gap-2">
                <div className="date-range-display">
                  {selectedStartDate.toLocaleDateString()} - {selectedEndDate.toLocaleDateString()}
                </div>
                <button 
                  onClick={resetToMonthView}
                  className="date-range-clear-btn"
                >
                  ✕
                </button>
              </div>
            ) : null}
            
            <DateRangePicker onSelectDateRange={handleDateRangeSelect} />
          </div>
        </div>

        {!isDateRangeMode && (
          <div className="mb-6 text-center">
            <div className="flex justify-center flex-wrap gap-3">
              {filteredWeeks.map((w, i) => (
                <button
                  key={i}
                  onClick={() => setWeek(i)}
                  className={`px-4 py-2 rounded-lg transition ${selectedWeek === i
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                >
                  Week {w.id} ({w.plans.filter((p) => p.completed).length}/{w.plans.length})
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedWeek !== null && filteredWeeks[selectedWeek] && (
          <div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Suspense fallback={<div>Loading...</div>}>
              <WeekCard
                week={filteredWeeks[selectedWeek]}
                weekIndex={selectedWeek}
                selectedPlan={selectedPlan}
                handleCompleteDay={handleCompleteDay}
                handleMenuAction={handleMenuAction}
                onDayClick={(dIdx) => setDay({ weekIndex: selectedWeek, dayIndex: dIdx })}
                selectedStartDate={selectedStartDate}
                selectedEndDate={selectedEndDate}
              />
            </Suspense>
          </div>
        )}

        <div className="mt-16 p-6 bg-white/90 rounded-2xl shadow-2xl border border-emerald-200">
          <h3 className="text-2xl font-bold mb-4">Goals this week:</h3>
          <ul className="list-disc pl-5 mb-4 text-sm space-y-1">
            <li>Drink 2L water/day</li>
            <li>Avoid triggers</li>
            <li>Do meditation x3</li>
          </ul>
          <div className="flex flex-wrap justify-between items-center gap-4">
            <h3 className="text-2xl font-bold">Total Progress: {points} points</h3>
            <div className="text-sm">
              Completed: {completedMonth}/
              {plansByWeek.reduce((a, w) => a + w.plans.length, 0)} days
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="text-sm text-gray-600">
                Progress:{' '}
                {Math.round(
                  (completedMonth /
                    plansByWeek.reduce((a, w) => a + w.plans.length, 0)) *
                  100,
                )}
                %
              </div>
              <div className="w-full bg-gray-300 rounded-full h-3 mt-1">
                <div
                  className="bg-yellow-400 h-3 rounded-full"
                  style={{
                    width: `${Math.min(
                      (completedMonth /
                        plansByWeek.reduce((a, w) => a + w.plans.length, 0)) *
                        100,
                      100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedDay && (
        <Suspense fallback={<div>Loading modal...</div>}>
          <Modal
            day={plansByWeek[selectedDay.weekIndex].plans[selectedDay.dayIndex]}
            weekIndex={selectedDay.weekIndex}
            dayIndex={selectedDay.dayIndex}
            plansByWeek={plansByWeek}
            handleSaveEdit={handleSaveEdit}
            closeModal={() => setDay(null)}
            toggleDayCompletion={toggleDay}
            pushComment={pushComment}
            handleMenuAction={handleMenuAction}
          />
        </Suspense>
      )}
    </div>
  );
};

export default QuitPlan;