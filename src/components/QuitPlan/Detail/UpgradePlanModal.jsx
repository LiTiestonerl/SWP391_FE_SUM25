import React from "react";
import { Modal } from "antd";

const UpgradePlanModal = ({ open, onUpgrade, onClose }) => {
  return (
    <Modal open={open} footer={null} centered onCancel={onClose}>
      <div className="text-center p-6">
        <div className="text-5xl mb-3">🔓</div>
        <h2 className="text-xl font-bold text-emerald-700 mb-2">Unlock More Days</h2>
        <p className="text-gray-700 mb-4">
          You're using the 7-day FREE plan. To access more weeks, please upgrade your membership.
        </p>
        <button
          className="px-5 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          onClick={onUpgrade}
        >
          Upgrade Now
        </button>
      </div>
    </Modal>
  );
};

export default UpgradePlanModal;
