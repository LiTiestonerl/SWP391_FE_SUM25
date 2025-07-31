import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import dayjs from 'dayjs';
import api from '../../../configs/axios';

const CreatePlanModal = ({ open, onClose, onCreate }) => {
  const [packages, setPackages] = useState([]);
  const [memberPackages, setMemberPackages] = useState([]);
  const [duration, setDuration] = useState(null);
  const [packageName, setPackageName] = useState('');
  const [touched, setTouched] = useState(false); // ✅ chỉ báo lỗi sau submit
  const [form, setForm] = useState({
    name: '',
    reason: '',
    addictionLevel: 'Mild',
    package: '',
    startDate: '',
    endDate: '',
    averageCigarettes: '',
    pricePerCigarette: '',
    pricePerCigaretteNumeric: 0,
  });

  // Load member packages
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pkgListRes, meRes] = await Promise.all([
          api.get('/member-packages'),
          api.get('/user-membership/me'),
        ]);

        const pkgs = pkgListRes?.data ?? [];
        setMemberPackages(pkgs);

        const memberPackageId = meRes?.data?.memberPackageId;
        let activePkg = pkgs.find(p => Number(p.memberPackageId) === Number(memberPackageId));

        if (!activePkg) {
          activePkg =
            pkgs.find(p => String(p.packageName).toUpperCase().includes('FREE')) || pkgs[0];
        }

        if (activePkg) {
          setDuration(activePkg.duration);
          setPackageName(activePkg.packageName);
          // 🔁 CHỈ đặt tên nếu trước đó chưa có name
          setForm(prev => ({
            ...prev,
            name: prev.name || `Quit in ${activePkg.duration} Days`,
          }));
        } else {
          setDuration(30);
          setPackageName('DEFAULT');
          // 🔁 CHỈ đặt tên nếu trước đó chưa có name
          setForm(prev => ({ ...prev, name: prev.name || 'Quit in 30 Days' }));
        }
      } catch (err) {
        console.error('Fetch membership/packages error:', err);
        setDuration(30);
        setPackageName('DEFAULT');
        // 🔁 CHỈ đặt tên nếu trước đó chưa có name
        setForm(prev => ({ ...prev, name: prev.name || 'Quit in 30 Days' }));
      }
    };

    if (open) fetchData();
  }, [open]);

  // Load cigarette packages
  useEffect(() => {
    const fetchCigPackages = async () => {
      try {
        const res = await api.get('/cigarette-packages');
        setPackages(res.data || []);
      } catch (err) {
        console.error('Failed to fetch cigarette packages', err);
      }
    };
    if (open) fetchCigPackages();
  }, [open]);

  const parseMoneyInput = (value) => Number(String(value).replace(/[^0-9]/g, ''));

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'startDate') {
      const newStart = dayjs(value);
      const totalDays = Number(duration) || 0;
      const newEnd = totalDays > 0 ? newStart.add(totalDays - 1, 'day') : newStart;
      setForm(prev => ({
        ...prev,
        startDate: value,
        endDate: newEnd.format('YYYY-MM-DD'),
      }));
      return;
    }

    if (name === 'pricePerCigarette') {
      const numericValue = parseMoneyInput(value);
      setForm(prev => ({
        ...prev,
        [name]: value,
        pricePerCigaretteNumeric: numericValue,
      }));
      return;
    }

    if (name === 'package') {
      const selected = packages.find(p => String(p.cigarettePackageId) === value);
      const autoPrice = selected
        ? Math.round(selected.pricePerPack / selected.sticksPerPack)
        : '';
      setForm(prev => ({
        ...prev,
        package: value,
        pricePerCigarette: autoPrice,
        pricePerCigaretteNumeric: autoPrice,
      }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (form.reason.trim().length < 5) return false;
    if (!form.startDate) return false;
    if (!form.package) return false;
    if (!form.averageCigarettes) return false;
    if (!form.pricePerCigarette) return false;
    return true;
  };

  const submit = (e) => {
    e.preventDefault();
    setTouched(true); // ✅ bắt đầu hiện lỗi khi submit

    if (!validateForm()) return;

    const reasonTrim = form.reason.trim();
    const avgCigs = parseInt(form.averageCigarettes) || 0;
    const pricePer = form.pricePerCigaretteNumeric || 0;
    const avgSpending = avgCigs * pricePer;

    const selectedPackage = packages.find(
      p => String(p.cigarettePackageId) === form.package
    );

    const planData = {
      ...form,
      reason: reasonTrim,
      averageCigarettes: avgCigs,
      pricePerCigarette: pricePer,
      averageSpending: avgSpending,
      durationInDays: Number(duration) || 0,
      membershipPackageName: packageName,
      brand: selectedPackage?.brand || '',
      flavor: selectedPackage?.flavor || '',
      nicotineLevel: selectedPackage?.nicotineLevel || '',
      nicotineMg: selectedPackage?.nicotineMg || '',
      sticksPerPack: selectedPackage?.sticksPerPack || '',
    };

    onCreate(planData);
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
            className="w-full max-w-lg bg-white rounded-xl shadow-xl p-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">Create Quit Plan</h2>

            <p className="mb-2 text-sm text-gray-600">
              Membership: <b>{packageName || '...'}</b> — Duration:&nbsp;
              <b>{duration != null ? `${duration} Days` : '...'}</b>
            </p>

            <form onSubmit={submit} className="space-y-4 text-sm">
              <input
                name="name"
                value={form.name}
                disabled
                className="w-full border p-3 rounded bg-gray-100"
              />

              {/* Reason */}
              <div>
                <label className="block mb-1 text-gray-700 font-medium">
                  Reason <span className="text-red-500">*</span>
                </label>
                <input
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  maxLength={240}
                  placeholder="E.g. for my family, save money, improve health..."
                  className={`w-full border p-3 rounded ${
                    touched && form.reason.trim().length < 5 ? 'border-red-400' : ''
                  }`}
                />
                {touched && form.reason.trim().length < 5 && (
                  <p className="text-xs text-red-500 mt-1">
                    Please enter at least 5 characters for the reason.
                  </p>
                )}
              </div>

              {/* Addiction level */}
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

              {/* Package */}
              <div>
                <select
                  name="package"
                  value={form.package}
                  onChange={handleChange}
                  className={`w-full border p-3 rounded ${
                    touched && !form.package ? 'border-red-400' : ''
                  }`}
                >
                  <option value="">Select a cigarette package</option>
                  {packages.map(p => (
                    <option key={p.cigarettePackageId} value={p.cigarettePackageId}>
                      {p.cigarettePackageName} — {p.brand} ({p.flavor}, {p.nicotineLevel})
                    </option>
                  ))}
                </select>
                {touched && !form.package && (
                  <p className="text-xs text-red-500 mt-1">Please select a cigarette package.</p>
                )}
              </div>

              {/* Smoking habit */}
              <div className="space-y-2">
                <h3 className="font-medium text-emerald-700">Smoking Habit</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-500 block mb-1">Cigarettes/day</label>
                    <input
                      type="number"
                      name="averageCigarettes"
                      value={form.averageCigarettes}
                      onChange={handleChange}
                      className={`w-full border p-2 rounded ${
                        touched && !form.averageCigarettes ? 'border-red-400' : ''
                      }`}
                      min="1"
                      placeholder="20"
                    />
                    {touched && !form.averageCigarettes && (
                      <p className="text-xs text-red-500 mt-1">
                        Please enter number of cigarettes/day.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-1">Price per cig (VND)</label>
                    <input
                      type="text"
                      name="pricePerCigarette"
                      value={form.pricePerCigarette}
                      onChange={handleChange}
                      className={`w-full border p-2 rounded ${
                        touched && !form.pricePerCigarette ? 'border-red-400' : ''
                      }`}
                      placeholder="1.000"
                    />
                    {touched && !form.pricePerCigarette && (
                      <p className="text-xs text-red-500 mt-1">
                        Please enter price per cigarette.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="flex gap-4 text-xs">
                <div className="flex-1">
                  <label className="text-gray-500 block mb-1">Start Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className={`w-full border p-3 rounded ${
                      touched && !form.startDate ? 'border-red-400' : ''
                    }`}
                  />
                  {touched && !form.startDate && (
                    <p className="text-xs text-red-500 mt-1">Please select a start date.</p>
                  )}
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

              {/* Buttons */}
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
