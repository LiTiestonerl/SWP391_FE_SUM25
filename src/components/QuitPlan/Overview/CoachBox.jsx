import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../../../configs/axios';

const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    height: 5px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(100, 116, 139, 0.3);
    border-radius: 10px;
  }
  .custom-scrollbar:hover::-webkit-scrollbar-thumb {
    background-color: rgba(100, 116, 139, 0.5);
  }
`;

const UpgradeModal = ({ open, onClose, onUpgrade }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        >
          <h3 className="text-xl font-bold text-emerald-700">Upgrade to select a coach</h3>
          <p className="text-sm text-gray-600 mt-2">
            FREE packages do not support coach selection. Upgrade now to get 1-on-1 coaching, live chat, and personalized feedback.
          </p>
          <ul className="text-sm text-gray-700 list-disc ml-5 mt-3 space-y-1">
            <li>Select a coach with the right expertise</li>
            <li>Live chat with your coach anytime</li>
            <li>Get personalized plan adjustments</li>
          </ul>
          <div className="flex gap-3 mt-6">
            <button
              onClick={onUpgrade}
              className="flex-1 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Upgrade now
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const CoachBox = ({ selectedCoachId, onSelect, membership }) => {
  const navigate = useNavigate();
  const [coachList, setCoachList] = useState([]);
  const [showSelector, setShowSelector] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const scrollRef = useRef(null);

  const isFree = String(membership || '').toUpperCase().includes('FREE');
  const selected = coachList.find((c) => c.userId === selectedCoachId);

  // 🔹 Load coach list từ API
  useEffect(() => {
    api.get('/coach')
      .then(res => {
        const list = (res.data || []).map(c => ({
          ...c,
          specialization: c.roleName || 'Coach',
          avatarUrl: c.avatarUrl || null,
        }));
        setCoachList(list);
      })
      .catch(err => console.error('Failed to load coach list', err));
  }, []);

  // 🔹 Nếu có selectedCoachId nhưng chưa có trong danh sách thì fetch chi tiết
  useEffect(() => {
    if (!selectedCoachId) return;
    const found = coachList.find(c => c.userId === selectedCoachId);
    if (found) return;

    api.get(`/coach/${selectedCoachId}`)
      .then(res => {
        if (!res?.data) return;
        const detail = {
          ...res.data,
          specialization: res.data.roleName || 'Coach',
          avatarUrl: res.data.avatarUrl || null,
        };
        setCoachList(prev => prev.some(c => c.userId === detail.userId) ? prev : [detail, ...prev]);
      })
      .catch(err => console.error('Failed to load coach detail', err));
  }, [selectedCoachId, coachList]);

  const handleOpenSelector = () => {
    if (isFree) {
      setShowUpgrade(true);
      return;
    }
    setShowSelector(true);
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  return (
    <>
      <style>{customScrollbarStyles}</style>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[685px] flex flex-col">
        <h3 className="text-lg font-semibold text-emerald-700 px-6 pt-6 pb-1">Coach</h3>

        {!selected ? (
          <div className="flex flex-col items-center justify-center flex-1 px-6 pb-6">
            <div
              onClick={handleOpenSelector}
              className="w-[80%] aspect-[4/5] bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-emerald-400 transition"
            >
              <div className="text-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  alt="Select Coach"
                  className="w-20 h-20 opacity-60 mx-auto mb-3"
                />
                <p className="text-gray-500 text-sm">
                  {isFree ? 'Upgrade to select your coach' : 'Click to select your coach'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="w-[90%] h-76 rounded-xl bg-gray-100 ring-2 ring-gray-300 mx-auto mt-3 flex items-center justify-center overflow-hidden">
              {selected.avatarUrl ? (
                <img src={selected.avatarUrl} alt={selected.fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
            </div>
            <div className="p-6 flex flex-col flex-1 overflow-hidden text-[14px] text-gray-700 space-y-2 leading-relaxed">
              <h4 className="text-xl font-bold text-gray-800">{selected.fullName}</h4>
              <p className="text-emerald-600 font-medium">{selected.specialization}</p>
              <p><span className="font-semibold text-gray-800">Experience:</span> {selected.experience || 0} years</p>
              <p><span className="font-semibold text-gray-800">Qualification:</span> {selected.qualification || 'N/A'}</p>
              <p className="italic text-gray-600">{selected.introduction || ''}</p>
              <div className="flex gap-3 mt-auto pt-4">
                <button
                  onClick={handleOpenSelector}
                  className="flex-1 px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                >
                  Change Coach
                </button>
                <button
                  onClick={() => navigate('/chat')}
                  className="flex-1 px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                >
                  Chat
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Popup chọn coach */}
      <AnimatePresence>
        {showSelector && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowSelector(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl px-10 py-8 w-full max-w-6xl max-h-[95vh] h-[400px] shadow-xl relative"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            >
              <h3 className="text-2xl font-bold text-emerald-700 mb-6 text-center">
                Select Your Coach
              </h3>

              <div className="relative">
                <button
                  onClick={() => scroll('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-emerald-100"
                >
                  ◀
                </button>

                <div ref={scrollRef} className="flex gap-6 overflow-x-auto custom-scrollbar pb-4 px-8">
                  {coachList.map((coach) => (
                    <button
                      key={coach.userId}
                      onClick={() => {
                        onSelect(coach); // trả full object cho parent
                        setShowSelector(false);
                      }}
                      className="min-w-[240px] flex-shrink-0 flex flex-col items-center gap-2 border p-4 rounded-2xl bg-white hover:bg-emerald-50"
                    >
                      <div className="w-full h-[180px] rounded-xl overflow-hidden ring-1 ring-gray-200">
                        {coach.avatarUrl ? (
                          <img src={coach.avatarUrl} alt={coach.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-400">No Image</span>
                        )}
                      </div>
                      <div className="text-sm text-center mt-2">
                        <div className="font-semibold text-gray-800 text-[14px]">{coach.fullName}</div>
                        <div className="text-gray-500 text-xs">{coach.specialization}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => scroll('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-emerald-100"
                >
                  ▶
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popup upgrade */}
      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        onUpgrade={() => {
          setShowUpgrade(false);
          navigate('/membership');
        }}
      />
    </>
  );
};

export default CoachBox;