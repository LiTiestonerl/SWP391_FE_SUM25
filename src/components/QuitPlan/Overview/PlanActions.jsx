import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { quitPlanService } from '../../../services/quitPlanService'; // Điều chỉnh đường dẫn cho đúng
import { message } from 'antd';

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
  const [form, setForm] = useState({
    title: plan?.title || '',
    reason: plan?.reason || '',
    customNotes: plan?.customNotes || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Gọi API PUT để cập nhật
      const updatedPlan = await quitPlanService.updatePlan(plan.planId, {
        title: form.title,
        reason: form.reason,
        customNotes: form.customNotes,
        startDate: plan.startDate,
        expectedEndDate: plan.expectedEndDate || plan.endDate,
        userId: plan.userId,
        coachId: plan.coachId,
        recommendedPackageId: plan.recommendedPackageId
      });

      message.success('Plan updated successfully!');
      onSave(updatedPlan);
    } catch (error) {
      console.error('Error updating plan:', error);
      message.error(error.response?.data?.message || 'Failed to update plan');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              {/* Các trường form giữ nguyên */}
              <div className="grid grid-cols-3 gap-3 items-center">
                <label className="font-medium text-gray-700">Plan Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="col-span-2 border p-3 rounded"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3 items-center">
                <label className="font-medium text-gray-700">Reason</label>
                <input
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  className="col-span-2 border p-3 rounded"
                  required
                  minLength={5}
                />
              </div>

              <div className="grid grid-cols-3 gap-3 items-start">
                <label className="font-medium text-gray-700 pt-2">Note</label>
                <textarea
                  name="customNotes"
                  rows={3}
                  value={form.customNotes}
                  onChange={handleChange}
                  className="col-span-2 border p-3 rounded resize-none"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  className={`flex-1 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 ${loading ? 'opacity-70' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
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