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

export const EditPlanModal = ({ open, plan, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: plan?.name || '',
    reason: plan?.reason || '',
    addictionLevel: plan?.addictionLevel || 'Mild',
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
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
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-5"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-emerald-700">Edit Plan</h3>
            <form onSubmit={submit} className="space-y-4 text-sm">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border p-3 rounded"
                placeholder="Plan Name"
              />
              <input
                name="reason"
                value={form.reason}
                onChange={handleChange}
                className="w-full border p-3 rounded"
                placeholder="Reason"
              />
              <select
                name="addictionLevel"
                value={form.addictionLevel}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              >
                <option>Mild</option>
                <option>Moderate</option>
                <option>Severe</option>
              </select>

              <div className="flex gap-4">
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
