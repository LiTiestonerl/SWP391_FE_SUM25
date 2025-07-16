import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import dayjs from 'dayjs';

const HistoryDrawer = ({ open, onClose, plan }) => {
  // 💾 Lịch sử giả lập
  const [history] = useState([
    { date: '2025-07-01', plan: 'Drink water', mood: '😊', status: 'Done', note: 'Felt great!' },
    { date: '2025-07-02', plan: 'Meditate', mood: '😐', status: 'Done', note: 'Neutral day' },
    { date: '2025-07-03', plan: 'Walk 15m', mood: '😟', status: 'Missed', note: '' },
    { date: '2025-07-04', plan: 'Coach call', mood: '😊', status: 'Done', note: 'Proud of myself' }
  ]);

  const [selected, setSelected] = useState(null); // entry selected
  const [range, setRange] = useState('all'); // filter: '7d', '30d', 'all'
  const now = dayjs();

  const filterByRange = (entry) => {
    const daysAgo = now.diff(dayjs(entry.date), 'day');
    if (range === '7d') return daysAgo <= 7;
    if (range === '30d') return daysAgo <= 30;
    return true;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Drawer */}
          <motion.div
            className="ml-auto h-full w-full max-w-md bg-white shadow-xl overflow-y-auto p-6"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-xl text-emerald-700 mb-4">📜 History</h3>

            {/* Bộ lọc */}
            <div className="flex gap-2 mb-4 text-sm">
              {['7d', '30d', 'all'].map(opt => (
                <button key={opt}
                  onClick={() => setRange(opt)}
                  className={`px-3 py-1 rounded-full border ${
                    range === opt ? 'bg-emerald-600 text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  {opt === '7d' ? '7 Days' : opt === '30d' ? '1 Month' : 'All'}
                </button>
              ))}
            </div>

            {/* Danh sách */}
            <ul className="space-y-2 text-sm">
              {history.filter(filterByRange).map((h, i) => (
                <li
                  key={i}
                  onClick={() => setSelected(h)}
                  className="p-3 border rounded cursor-pointer hover:bg-gray-50 flex flex-col gap-1"
                >
                  <div className="flex justify-between font-medium">
                    <span>{dayjs(h.date).format('DD/MM/YYYY')}</span>
                    <span className={h.status === 'Done' ? 'text-emerald-600' : 'text-red-600'}>
                      {h.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>{h.plan}</span>
                    <span>{h.mood}</span>
                  </div>
                </li>
              ))}
              {history.filter(filterByRange).length === 0 && (
                <p className="text-gray-500 text-center mt-8">No records found.</p>
              )}
            </ul>

            {/* Đóng */}
            <button onClick={onClose}
              className="mt-6 w-full py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm"
            >
              Close
            </button>
          </motion.div>

          {/* Modal chi tiết */}
          <AnimatePresence>
            {selected && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSelected(null)}
              >
                <motion.div
                  className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl space-y-3"
                  initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h4 className="text-lg font-bold text-emerald-700">
                    {dayjs(selected.date).format('dddd, MMM D, YYYY')}
                  </h4>
                  <p><b>Plan:</b> {selected.plan}</p>
                  <p><b>Mood:</b> {selected.mood}</p>
                  <p><b>Status:</b> {selected.status}</p>
                  <p><b>Note:</b> {selected.note || 'No note saved.'}</p>

                  <button
                    onClick={() => setSelected(null)}
                    className="mt-3 w-full py-2 border rounded hover:bg-gray-100 text-sm"
                  >
                    Close
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HistoryDrawer;