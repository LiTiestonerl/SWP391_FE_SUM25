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

export const ConfirmCancelModal = ({ open, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onConfirm(reason || 'User requested cancellation');
    setReason('');
  };

  return (
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
            className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full space-y-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">⏸️</div>
              <h3 className="text-lg font-bold text-orange-600">Cancel No Smoking Plan?</h3>
            </div>
            <p className="text-sm text-gray-600">
              Are you sure you want to cancel your No Smoking plan? You can always create a new one later.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation (optional):
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border rounded-lg p-3 text-sm"
                rows={3}
                placeholder="Let us know why you're cancelling..."
              />
            </div>
            <div className="flex gap-3 pt-3">
              <button
                onClick={handleConfirm}
                className="flex-1 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Cancel Plan
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2 border rounded hover:bg-gray-100"
              >
                Keep Plan
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const EditPlanModal = ({ open, plan, onClose, onSave }) => {
  const [touched, setTouched] = useState(false);
  const [form, setForm] = useState({
    title: plan?.title || '',
    reason: plan?.reason || '',
    customNotes: plan?.customNotes || '',
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateForm = () => {
    if (!form.title.trim()) return false;
    if (form.reason.trim().length < 5) return false;
    return true;
  };

  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!validateForm()) return;
    onSave(form); // Đảm bảo lưu đúng dữ liệu
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
              {/* Title */}
              <div className="grid grid-cols-3 gap-3 items-center">
                <label className="font-medium text-gray-700">Plan Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className={`col-span-2 border p-3 rounded ${
                    touched && !form.title ? 'border-red-400' : ''
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
                  placeholder="E.g. For my health, my family..."
                  className={`col-span-2 border p-3 rounded ${
                    touched && form.reason.trim().length < 5 ? 'border-red-400' : ''
                  }`}
                />
              </div>

              {/* Notes */}
              <div className="grid grid-cols-3 gap-3 items-start">
                <label className="font-medium text-gray-700 pt-2">Note</label>
                <textarea
                  name="customNotes"
                  rows={3}
                  value={form.customNotes}
                  onChange={handleChange}
                  placeholder="E.g. Start your smoke-free journey today..."
                  className="col-span-2 border p-3 rounded resize-none"
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