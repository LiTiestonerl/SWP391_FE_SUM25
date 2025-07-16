import React, { useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { HiLink } from 'react-icons/hi';
import { AnimatePresence, motion } from 'framer-motion';

const StarRow = ({ value = 0, onChange = () => {}, readOnly = false }) => (
  <div className="flex flex-row gap-1">
    {Array.from({ length: 5 }, (_, i) => (
      <AiFillStar
        key={i}
        onClick={() => !readOnly && onChange(i + 1)}
        className={`text-xl cursor-pointer ${i < value ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ))}
  </div>
);

export const CoachSuggestionCard = ({ level = 'Mild' }) => {
  const PACKAGES = {
    Mild: { name: 'Mild Pack A', nicotine: '5 mg', price: 35000, link: 'https://www.who.int/health-topics/tobacco#tab=tab_1' },
    Moderate: { name: 'Moderate Pack B', nicotine: '10 mg', price: 50000, link: 'https://www.nhs.uk/conditions/stop-smoking-treatments/' },
    Severe: { name: 'Strong Pack C', nicotine: '15 mg', price: 75000, link: 'https://www.cdc.gov/tobacco/quit_smoking/index.htm' },
  };

  const pack = PACKAGES[level] || PACKAGES.Mild;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-3">
      <h3 className="font-semibold text-emerald-700">🚬 Alternative Cigarette Package</h3>
      <p className="text-sm text-gray-700">Suggested: <b>{pack.name}</b> — {pack.nicotine} Nicotine</p>
      <p className="text-sm text-gray-700">Price: <b>{pack.price.toLocaleString()} VND</b></p>
      <button
        onClick={() => window.open(pack.link, '_blank')}
        className="inline-flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white text-sm rounded shadow hover:bg-emerald-700 w-fit"
      >
        <HiLink className="text-base" />
        More Info
      </button>
    </div>
  );
};

export const CoachFeedbackCard = ({
  coach = 'Coach',
  coachComment = 'Great effort!',
  coachRating = 4,
  savedRating = 0,
  savedComment = '',
  onSave = () => {},
}) => {
  const [open, setOpen] = useState(false);
  const [tempRating, setTemp] = useState(5);
  const [tempComment, setCom] = useState('');

  const openModal = () => {
    setTemp(savedRating || 5);
    setCom(savedComment || '');
    setOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
        <h3 className="font-semibold text-emerald-700">Coach Feedback</h3>
        <div className="flex items-center gap-2">
          <StarRow value={coachRating} readOnly />
          <span className="text-sm text-gray-600">{coachRating}/5</span>
        </div>
        <p className="text-sm text-gray-700 italic">“{coachComment}” — <b>{coach}</b></p>
        {savedRating > 0 && (
          <div className="space-y-1 pt-3 border-t">
            <p className="text-sm text-gray-600 font-medium">Your Feedback:</p>
            <div className="flex items-center gap-2">
              <StarRow value={savedRating} readOnly />
              <span className="text-sm text-gray-600">{savedRating}/5</span>
            </div>
            {savedComment && <p className="text-sm text-gray-600 italic">“{savedComment}”</p>}
          </div>
        )}
        <button
          onClick={openModal}
          className="px-4 py-2 bg-emerald-600 text-white text-sm rounded shadow hover:bg-emerald-700"
        >
          {savedRating ? 'Edit Feedback' : 'Give Feedback'}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-5"
            >
              <h3 className="text-lg font-semibold text-emerald-700">Rate your coach</h3>
              <StarRow value={tempRating} onChange={setTemp} />
              <textarea
                rows={4} value={tempComment}
                onChange={(e) => setCom(e.target.value)}
                className="w-full border rounded p-3 text-sm"
                placeholder="Write a comment…"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    onSave(tempRating, tempComment);
                    setOpen(false);
                  }}
                  className="flex-1 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
