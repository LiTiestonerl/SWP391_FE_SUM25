import React from "react";
import { Modal } from "antd";

const UpgradePlanModal = ({ open, freeDays = 7, onUpgrade, onClose }) => {
  return (
    <Modal open={open} footer={null} centered onCancel={onClose}>
      <div className="text-center p-6">
        <div className="text-5xl mb-3">🔓</div>
        <h2 className="text-xl font-bold text-emerald-700 mb-2">Unlock More Days</h2>
        <p className="text-gray-700 mb-4">
          You're using the {freeDays}-day FREE plan. To access more weeks, please upgrade your membership.
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="px-5 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
            onClick={onUpgrade}
          >
            Upgrade Now
          </button>
          <button
            className="px-5 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            No Thanks
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UpgradePlanModal;
