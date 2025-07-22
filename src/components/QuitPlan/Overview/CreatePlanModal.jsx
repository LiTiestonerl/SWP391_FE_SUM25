import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import dayjs from 'dayjs';

const CreatePlanModal = ({ open, duration, onClose, onCreate }) => {
  const [form, setForm] = useState({
    name: `Quit in ${duration} Days`,
    reason: '',
    addictionLevel: 'Mild',
    package: '',
    startDate: '', // Không có giá trị mặc định
    endDate: '',
    averageCigarettes: '',
    pricePerCigarette: '',
    averageSpending: '',
    // Thêm trường numeric để lưu giá trị số
    pricePerCigaretteNumeric: 0,
    averageSpendingNumeric: 0
  });

  // Hàm chuyển đổi input tiền thành số
  const parseMoneyInput = (value) => {
    return Number(String(value).replace(/[^0-9]/g, ''));
  };

  const handleChange = e => {
    const { name, value } = e.target;

    if (name === 'startDate') {
      const newStart = dayjs(value);
      const newEnd = newStart.add(duration - 1, 'day');
      setForm(prev => ({
        ...prev,
        startDate: value,
        endDate: newEnd.format('YYYY-MM-DD'),
      }));
    } 
    // Xử lý các trường tiền (cho phép nhập nhiều định dạng)
    else if (name === 'pricePerCigarette') {
      const numericValue = parseMoneyInput(value);
      setForm(prev => ({ 
        ...prev, 
        [name]: value,
        pricePerCigaretteNumeric: numericValue
      }));
    } 
    else if (name === 'averageSpending') {
      const numericValue = parseMoneyInput(value);
      setForm(prev => ({ 
        ...prev, 
        [name]: value,
        averageSpendingNumeric: numericValue
      }));
    } 
    else {
      setForm(prev => ({ 
        ...prev, 
        [name]: value
      }));
    }
  };

  const submit = e => {
    e.preventDefault();
    
    // Validate required fields
    if (!form.startDate) {
      alert('Please select a start date');
      return;
    }
    if (!form.reason) {
      alert('Please enter your reason to quit');
      return;
    }

    // Sử dụng giá trị numeric đã được parse
    const avgCigs = parseInt(form.averageCigarettes) || 0;
    const pricePer = form.pricePerCigaretteNumeric || 0;
    const avgSpend = form.averageSpendingNumeric || 0;
    
    const finalAvgSpending = avgSpend > 0 ? avgSpend : avgCigs * pricePer;
    const finalPricePer = pricePer > 0 ? pricePer : (avgCigs > 0 ? Math.round(avgSpend / avgCigs) : 0);
    
    const planData = {
      ...form,
      averageCigarettes: avgCigs,
      pricePerCigarette: finalPricePer,
      averageSpending: finalAvgSpending,
      durationInDays: duration
    };
    
    onCreate(planData);
  };

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
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">Create Quit Plan</h2>

            <p className="mb-2 text-sm text-gray-500 flex items-center gap-2">
              Duration locked to <b>{duration} days</b> (membership)
              <span className="relative group">
                <span className="text-gray-400 cursor-pointer text-xs">ℹ️</span>
                <div className="absolute top-5 left-0 z-10 hidden group-hover:block bg-white border border-gray-200 shadow-md rounded-md text-xs p-3 w-56 text-gray-600">
                  <b className="block text-gray-800 mb-1">Membership duration:</b>
                  ▸ HEALTH → 7 days<br />
                  ▸ HEALTH+ → 30 days<br />
                  ▸ OTHERS → 60 days
                </div>
              </span>
            </p>

            <form onSubmit={submit} className="space-y-4 text-sm">
              <input
                name="name"
                value={form.name}
                disabled
                className="w-full border p-3 rounded bg-gray-100"
              />
              
              <input
                name="reason"
                placeholder="Your reason to quit (required)"
                value={form.reason}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded"
              />
              
              <select
                name="addictionLevel"
                value={form.addictionLevel}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              >
                <option value="Mild">Mild (1-10 cigarettes/day)</option>
                <option value="Moderate">Moderate (11-20 cigarettes/day)</option>
                <option value="Severe">Severe (20+ cigarettes/day)</option>
              </select>
              
              <input
                name="package"
                placeholder="Your current cigarette brand/pack"
                value={form.package}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />

              {/* Smoking Habit Section */}
              <div className="space-y-2">
                <h3 className="font-medium text-emerald-700">Smoking Habit</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-gray-500 block mb-1">Cigarettes/day</label>
                    <input
                      type="number"
                      name="averageCigarettes"
                      value={form.averageCigarettes}
                      onChange={handleChange}
                      className="w-full border p-2 rounded"
                      min="1"
                      placeholder="20"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-1">Price per cig (VND)</label>
                    <input
                      type="text" // Đổi thành text để nhập nhiều định dạng
                      name="pricePerCigarette"
                      value={form.pricePerCigarette}
                      onChange={handleChange}
                      className="w-full border p-2 rounded"
                      placeholder="1.000"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-1">Daily spending (VND)</label>
                    <input
                      type="text" // Đổi thành text để nhập nhiều định dạng
                      name="averageSpending"
                      value={form.averageSpending}
                      onChange={handleChange}
                      className="w-full border p-2 rounded"
                      placeholder="20.000"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Fill any two fields and we'll calculate the third one automatically.
                </p>
              </div>

              <div className="flex gap-4 text-xs">
                <div className="flex-1">
                  <label className="text-gray-500 block mb-1">Start Date (required)</label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="text-gray-500 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={form.endDate}
                    disabled
                    className="w-full border p-3 rounded bg-gray-100"
                  />
                </div>
              </div>

              <div className="flex gap-4 text-sm">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
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