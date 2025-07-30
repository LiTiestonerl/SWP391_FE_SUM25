import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../../../configs/axios'; // điều chỉnh nếu khác

const CoachBox = ({ selectedCoachId, onSelect }) => {
  const navigate = useNavigate();
  const [coachList, setCoachList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoading(true);
        const res = await api.get('/coach');
        const data = res.data.map((c) => ({
          ...c,
          image: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.fullName || 'Coach')}`,
        }));
        setCoachList(data);
      } catch (err) {
        console.error('Failed to fetch coaches:', err);
        setError('Failed to load coaches.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  const selected = coachList.find((c) => c.userId === selectedCoachId);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[685px] flex flex-col">
        <h3 className="text-lg font-semibold text-emerald-700 px-6 pt-6 pb-1">Coach</h3>

        {!selected ? (
          <div className="flex flex-col items-center justify-center flex-1 px-6 pb-6">
            <div
              onClick={() => setShowSelector(true)}
              className="w-[80%] aspect-[4/5] bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-emerald-400 transition"
            >
              <div className="text-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  alt="Select Coach"
                  className="w-20 h-20 opacity-60 mx-auto mb-3"
                />
                <p className="text-gray-500 text-sm">Click to select your coach</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <img
              src={selected.image}
              alt={selected.fullName}
              className="w-[90%] h-76 object-cover object-[top_3%] rounded-xl shadow-sm ring-2 ring-gray-300 mx-auto mt-3"
            />
            <div className="p-6 flex flex-col flex-1 overflow-hidden text-[14px] text-gray-700 space-y-2 leading-relaxed">
              <h4 className="text-xl font-bold text-gray-800">{selected.fullName}</h4>
              <p className="text-emerald-600 font-medium">{selected.roleName || 'Coach'}</p>

              <p><span className="font-semibold text-gray-800">Email:</span> {selected.email}</p>
              <p><span className="font-semibold text-gray-800">Phone:</span> {selected.phone}</p>
              <p><span className="font-semibold text-gray-800">Status:</span> {selected.status}</p>
              <p><span className="font-semibold text-gray-800">Verified:</span> {selected.isEmailVerified ? 'Yes' : 'No'}</p>

              <div className="flex gap-3 mt-auto pt-4">
                <button
                  onClick={() => onSelect(null)}
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
              className="bg-white rounded-5xl p-6 w-full max-w-4xl h-fit max-h-[90vh] shadow-xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <h3 className="text-xl font-bold text-emerald-700 mb-4 text-center">Select Your Coach</h3>

              {loading ? (
                <div className="text-center text-gray-500 text-sm">Loading...</div>
              ) : error ? (
                <div className="text-center text-red-500 text-sm">{error}</div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {coachList.map((coach) => (
                    <button
                      key={coach.userId}
                      onClick={() => {
                        onSelect(coach.userId);
                        setShowSelector(false);
                      }}
                      className="flex flex-col items-center gap-2 border p-2 rounded-xl hover:bg-emerald-50 transition border-gray-200"
                    >
                      <div className="w-full h-[200px] rounded-xl overflow-hidden ring-1 ring-gray-200">
                        <img
                          src={coach.image}
                          alt={coach.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="text-sm text-center mt-1">
                        <div className="font-semibold text-gray-800 leading-tight text-[13px]">
                          {coach.fullName}
                        </div>
                        <div className="text-gray-500 text-xs">{coach.roleName || 'Coach'}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CoachBox;
