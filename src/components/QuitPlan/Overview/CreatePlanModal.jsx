import React, { useState, useEffect } from 'react'; 
import { AnimatePresence, motion } from 'framer-motion';
import dayjs from 'dayjs';
import api from '../../../configs/axios';

const CreatePlanModal = ({ open, onClose, onCreate }) => {
  const [duration, setDuration] = useState(null);
  const [packageName, setPackageName] = useState('');
  const [memberPackageId, setMemberPackageId] = useState(null);
  const [touched, setTouched] = useState(false);
  const [form, setForm] = useState({
    name: '',
    reason: '',
    startDate: '',
    endDate: '',
    customNotes: '',
  });
  const [dateError, setDateError] = useState('');
  const [selectedDays, setSelectedDays] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pkgListRes, meRes, smokingStatusRes] = await Promise.all([
          api.get('/member-packages'),
          api.get('/user-membership/me'),
          api.get('/smoking-status').catch(() => ({ data: null }))
        ]);

        const pkgs = pkgListRes?.data ?? [];
        const smokingData = smokingStatusRes?.data;
        const memberPackageId = meRes?.data?.memberPackageId;

        let activePkg = pkgs.find(p => Number(p.memberPackageId) === Number(memberPackageId));
        if (!activePkg) {
          activePkg = pkgs.find(p => String(p.packageName).toUpperCase().includes('FREE')) || pkgs[0];
        }

        if (activePkg) {
          setDuration(activePkg.duration);
          setPackageName(activePkg.packageName);
          setMemberPackageId(activePkg.memberPackageId);
          setForm(prev => ({
            ...prev,
            name: prev.name || `No Smoking Plan`,
          }));
        } else {
          setDuration(30);
          setPackageName('DEFAULT');
          setForm(prev => ({ ...prev, name: prev.name || 'No Smoking Plan - 30 Days' }));
        }

      } catch (err) {
        console.error('Fetch membership/packages error:', err);
        setDuration(30);
        setPackageName('DEFAULT');
        setForm(prev => ({ ...prev, name: prev.name || 'No Smoking Plan - 30 Days' }));
      }
    };

    if (open) fetchData();
  }, [open]);

  useEffect(() => {
    if (form.startDate && form.endDate) {
      const start = dayjs(form.startDate);
      const end = dayjs(form.endDate);
      const days = end.diff(start, 'day') + 1;
      setSelectedDays(days);

      // Only validate if not package 10
      if (memberPackageId !== 10 && duration) {
        if (days > duration) {
          setDateError(`Your package only allows ${duration} days. Please select a shorter period.`);
        } else {
          setDateError('');
        }
      } else {
        setDateError('');
      }
    } else {
      setSelectedDays(0);
      setDateError('');
    }
  }, [form.startDate, form.endDate, duration, memberPackageId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.name.trim()) return false;
    if (form.reason.trim().length < 5) return false;
    if (!form.startDate) return false;
    if (!form.endDate) return false;
    // Only check date error for non-package 10
    if (memberPackageId !== 10 && dateError) return false;
    return true;
  };

  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!validateForm()) return;

    const start = dayjs(form.startDate);
    const end = dayjs(form.endDate);
    const durationDays = end.diff(start, 'day') + 1;

    const planData = {
      ...form,
      title: form.name,
      reason: form.reason.trim(),
      durationInDays: durationDays > 0 ? durationDays : 0,
      membershipPackageName: packageName,
    };
    onCreate(planData);
  };

  const isUnlimitedPackage = memberPackageId === 10;

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
            className="w-full max-w-lg bg-white rounded-xl shadow-xl p-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">Create Quit Plan</h2>
            <p className="mb-2 text-sm text-gray-600">
              Membership: <b>{packageName || '...'}</b>
              {!isUnlimitedPackage && (
                <>
                  {" "}— Duration: <b>{duration != null ? `${duration} Days` : '...'}</b>
                </>
              )}
            </p>

            <form onSubmit={submit} className="space-y-4 text-sm">
              <div>
                <label className="block mb-1 text-gray-700 font-medium">
                  Plan Title <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="e.g., 30 Days to Freedom"
                  className={`w-full border p-3 rounded ${touched && !form.name.trim() ? 'border-red-400' : ''}`}
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-700 font-medium">
                  Reason <span className="text-red-500">*</span>
                </label>
                <input
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  maxLength={240}
                  placeholder="Why do you want to quit smoking?"
                  className={`w-full border p-3 rounded ${touched && form.reason.trim().length < 5 ? 'border-red-400' : ''}`}
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-700 font-medium">
                  Custom Notes
                </label>
                <textarea
                  name="customNotes"
                  value={form.customNotes}
                  onChange={handleChange}
                  placeholder="Any notes for yourself or your coach..."
                  className="w-full border p-3 rounded min-h-[80px]"
                />
              </div>

              <div className="flex gap-4 text-xs">
                <div className="flex-1">
                  <label className="text-gray-500 block mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className={`w-full border p-3 rounded ${touched && !form.startDate ? 'border-red-400' : ''}`}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-gray-500 block mb-1">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className={`w-full border p-3 rounded ${touched && !form.endDate ? 'border-red-400' : ''}`}
                  />
                </div>
              </div>

              {form.startDate && form.endDate && (
                <div className="text-sm text-gray-600">
                  You've selected {selectedDays} day{selectedDays !== 1 ? 's' : ''}
                </div>
              )}

              {dateError && (
                <div className="text-sm text-red-500 p-2 bg-red-50 rounded">
                  {dateError}
                </div>
              )}

              <div className="flex gap-4 text-sm">
                <button
                  type="submit"
                  disabled={!validateForm()}
                  className={`flex-1 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition ${
                    !validateForm() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Create Plan
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border rounded-lg hover:bg-gray-50 transition"
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

export default CreatePlanModal;