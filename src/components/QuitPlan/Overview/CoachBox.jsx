import React, { useState, useRef, useEffect } from 'react';
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
  const selected = coachList.find((c) => c.id === selectedCoachId);

  useEffect(() => {
    api.get('/coach')
      .then((res) => {
        const formatted = res.data.map(c => ({
          id: c.userId,
          name: c.fullName || c.userName || "Không rõ",
        }));
        setCoachList(formatted);
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách huấn luyện viên:", err);
      });
  }, []);

  const handleOpenSelector = () => {
    if (isFree) {
      setShowUpgrade(true);
    } else {
      setShowSelector(true);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  return (
    <>
      <style>{customScrollbarStyles}</style>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[300px] flex flex-col">
        <h3 className="text-lg font-semibold text-emerald-700 px-6 pt-6 pb-1">Coach</h3>

        {!selected ? (
          <div className="flex flex-col items-center justify-center flex-1 px-6 pb-6">
            <div
              onClick={handleOpenSelector}
              className="w-[80%] aspect-[4/5] bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-emerald-400 transition"
            >
              <div className="text-center">
                <p className="text-gray-500 text-sm">
                  {isFree ? 'Upgrade to select your coach' : 'Click to select your coach'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 flex flex-col flex-1 overflow-hidden text-[14px] text-gray-700 space-y-2 leading-relaxed">
            <h4 className="text-xl font-bold text-gray-800">{selected.name}</h4>

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
        )}
      </div>

      {/* Coach selector popup */}
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
                      key={coach.id}
                      onClick={() => {
                        onSelect(coach.id);
                        setShowSelector(false);
                      }}
                      className="min-w-[240px] flex-shrink-0 flex flex-col items-center gap-2 border p-4 rounded-2xl bg-white hover:bg-emerald-50"
                    >
                      <div className="w-full h-[180px] rounded-xl bg-gray-100 ring-1 ring-gray-200 flex items-center justify-center text-gray-400 text-sm">
                        No Image
                      </div>
                      <div className="text-sm text-center mt-2">
                        <div className="font-semibold text-gray-800 text-[14px]">{coach.name}</div>
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

      {/* Upgrade popup */}
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
