import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export const ConfirmDeleteModal = ({ open, onClose, onConfirm }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full space-y-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-bold text-red-600">Delete Plan?</h3>
          <p className="text-sm text-gray-600">This action cannot be undone.</p>
          <div className="flex gap-3 pt-3">
            <button
              onClick={onConfirm}
              className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export const ConfirmCompleteModal = ({ open, onClose, onConfirm }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full space-y-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-bold text-emerald-700">Complete Plan?</h3>
          <p className="text-sm text-gray-600">
            Are you sure you want to mark this plan as completed?
          </p>
          <div className="flex gap-3 pt-3">
            <button
              onClick={onConfirm}
              className="flex-1 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
            >
              Complete
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export const EditPlanModal = ({ open, plan, onClose, onSave }) => {
  const [touched, setTouched] = useState(false);
  const [form, setForm] = useState({
    name: plan?.name || '',
    reason: plan?.reason || '',
    addictionLevel: plan?.addictionLevel || 'Mild',
    package: plan?.package || '',
    averageCigarettes: plan?.averageCigarettes || '',
    pricePerCigarette: plan?.pricePerCigarette || '',
    averageSpending: plan?.averageSpending || ''
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateForm = () => {
    if (form.reason.trim().length < 5) return false;
    if (!form.name) return false;
    if (!form.package) return false;
    if (!form.averageCigarettes) return false;
    if (!form.pricePerCigarette) return false;
    return true;
  };

  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!validateForm()) return;
    onSave(form);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-emerald-700 mb-4">Edit Plan</h3>
            <form onSubmit={submit} className="space-y-4 text-sm">
              {/* Name */}
              <div className="grid grid-cols-3 gap-3 items-center">
                <label className="font-medium text-gray-700">Plan Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`col-span-2 border p-3 rounded ${
                    touched && !form.name ? 'border-red-400' : ''
                  }`}
                />
              </div>

              {/* Reason */}
              <div className="grid grid-cols-3 gap-3 items-center">
                <label className="font-medium text-gray-700">Reason</label>
                <input
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  className={`col-span-2 border p-3 rounded ${
                    touched && form.reason.trim().length < 5 ? 'border-red-400' : ''
                  }`}
                  placeholder="E.g. for my family, save money..."
                />
              </div>

              {/* Addiction Level */}
              <div className="grid grid-cols-3 gap-3 items-center">
                <label className="font-medium text-gray-700">Addiction Level</label>
                <select
                  name="addictionLevel"
                  value={form.addictionLevel}
                  onChange={handleChange}
                  className="col-span-2 border p-3 rounded"
                >
                  <option value="Mild">Mild (1-10 cigs/day)</option>
                  <option value="Moderate">Moderate (11-20 cigs/day)</option>
                  <option value="Severe">Severe (20+ cigs/day)</option>
                </select>
              </div>

              {/* Package */}
              <div className="grid grid-cols-3 gap-3 items-center">
                <label className="font-medium text-gray-700">Cigarette Brand</label>
                <input
                  name="package"
                  value={form.package}
                  onChange={handleChange}
                  className={`col-span-2 border p-3 rounded ${
                    touched && !form.package ? 'border-red-400' : ''
                  }`}
                />
              </div>

              {/* Average Cigarettes */}
              <div className="grid grid-cols-3 gap-3 items-center">
                <label className="font-medium text-gray-700">Cigs/day</label>
                <input
                  name="averageCigarettes"
                  type="number"
                  value={form.averageCigarettes}
                  onChange={handleChange}
                  className={`col-span-2 border p-3 rounded ${
                    touched && !form.averageCigarettes ? 'border-red-400' : ''
                  }`}
                />
              </div>

              {/* Price per cigarette */}
              <div className="grid grid-cols-3 gap-3 items-center">
                <label className="font-medium text-gray-700">Price/cig (VND)</label>
                <input
                  name="pricePerCigarette"
                  value={form.pricePerCigarette}
                  onChange={handleChange}
                  className={`col-span-2 border p-3 rounded ${
                    touched && !form.pricePerCigarette ? 'border-red-400' : ''
                  }`}
                />
              </div>

              {/* Average spending */}
              <div className="grid grid-cols-3 gap-3 items-center">
                <label className="font-medium text-gray-700">Avg Spending</label>
                <input
                  name="averageSpending"
                  value={form.averageSpending}
                  onChange={handleChange}
                  className="col-span-2 border p-3 rounded bg-gray-100"
                  disabled
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

