// CreatePlanModal.jsx
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import dayjs from 'dayjs';

const coaches = ['Coach John', 'Coach Jane', 'Coach Minh'];

const CreatePlanModal = ({ open, duration, onClose, onCreate }) => {
  const today = dayjs();
  const [form, setForm] = useState({
    name: `Quit in ${duration} Days`,
    reason: '', note: '', addictionLevel: 'Mild', coach: coaches[0], package: '',
    startDate: today.format('YYYY-MM-DD'),
    endDate: today.add(duration, 'day').format('YYYY-MM-DD')
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = e => { e.preventDefault(); onCreate(form); };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-lg bg-white rounded-xl shadow-xl p-8"
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">Submit</h2>

            {/* Tooltip style */}
            <p className="mb-2 text-sm text-gray-500 flex items-center gap-2">
              Duration locked to <b>{duration} days</b> (membership)
              <span className="relative group">
                <span className="text-gray-400 cursor-pointer text-xs">ℹ️</span>
                <div className="absolute top-5 left-0 z-10 hidden group-hover:block bg-white border border-gray-200 shadow-md rounded-md text-xs p-3 w-56 text-gray-600">
                  <b className="block text-gray-800 mb-1">Membership duration:</b>
                  ▸ 1-month → 30 days<br />
                  ▸ 3-month → 90 days<br />
                  ▸ 12-month → 365 days
                </div>
              </span>
            </p>

            <form onSubmit={submit} className="space-y-4 text-sm">
              <input name="name" value={form.name} disabled className="w-full border p-3 rounded bg-gray-100" />
              <input name="reason" placeholder="Reason" value={form.reason} onChange={handleChange} required className="w-full border p-3 rounded" />
              <textarea name="note" placeholder="Note" value={form.note} onChange={handleChange} className="w-full border p-3 rounded" />
              <select name="addictionLevel" value={form.addictionLevel} onChange={handleChange} className="w-full border p-3 rounded">
                <option>Mild</option><option>Moderate</option><option>Severe</option>
              </select>
              <select name="coach" value={form.coach} onChange={handleChange} className="w-full border p-3 rounded">
                {coaches.map(c => <option key={c}>{c}</option>)}
              </select>
              <input name="package" placeholder="Current cigarette package" value={form.package} onChange={handleChange} className="w-full border p-3 rounded" />
              <div className="flex gap-4 text-xs">
                <input type="date" value={form.startDate} disabled className="flex-1 border p-3 rounded bg-gray-100" />
                <input type="date" value={form.endDate} disabled className="flex-1 border p-3 rounded bg-gray-100" />
              </div>
              <div className="flex gap-4 text-sm">
                <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition">Submit</button>
                <button type="button" onClick={onClose} className="flex-1 py-3 border rounded-lg hover:bg-gray-50 transition">Cancel</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreatePlanModal;
