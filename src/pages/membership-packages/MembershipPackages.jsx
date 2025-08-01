import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button, Modal, message } from "antd";
import { useSelector } from "react-redux";
import api from "../../configs/axios";

const Membership = () => {
  const [plans, setPlans] = useState([]);
  const [currentPackageId, setCurrentPackageId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.user);
  const userRole = user?.role;
  const isBlockedRole = userRole === "COACH" || userRole === "ADMIN";

  const fetchPackages = async () => {
    try {
      const response = await api.get("/member-packages");
      const apiPlans = response?.data.map((plan) => ({
        ...plan,
        buttonColor: getButtonColor(plan.packageName),
        recommended: plan.packageName === "HEALTH+",
      }));
      setPlans(apiPlans);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUserPackage = async () => {
    try {
      const res = await api.get("/user-membership/me");
      if (res.data?.memberPackageId) {
        setCurrentPackageId(Number(res.data.memberPackageId));
      }
    } catch (err) {
      console.error("Lỗi khi lấy gói hiện tại:", err);
    }
  };

  const handleCancelPackage = async () => {
    try {
      await api.delete("/user-membership/me");
      message.success("Đã hủy gói hiện tại.");
      fetchCurrentUserPackage();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Hủy gói thất bại. Vui lòng thử lại."
      );
    }
  };

  const showCancelModal = () => {
    setCancelModalOpen(true);
  };

  const confirmCancelPackage = async () => {
    setCancelModalOpen(false);
    await handleCancelPackage();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoading(true);
      fetchPackages();
      fetchCurrentUserPackage();
    } else {
      setPlans([]);
      setCurrentPackageId(null);
      setLoading(false);
    }
  }, [location.key]);

  useEffect(() => {
    if (location.state?.paymentSuccess) {
      alert("Thanh toán thành công! Gói của bạn đã được cập nhật.");
      fetchCurrentUserPackage();
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  const handleChoosePlan = (plan) => {
    if (isBlockedRole) {
      alert("Tài khoản Admin hoặc Coach không thể chọn gói.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập để mua gói!");
      navigate("/login");
      return;
    }

    const currentPlanData = plans.find(
      (p) => p.memberPackageId === currentPackageId
    );
    const currentPrice = currentPlanData?.price || 0;

    if (plan.price < currentPrice) {
      alert("Bạn đang sở hữu gói cao hơn. Không thể mua gói thấp hơn.");
      return;
    }

    if (plan.packageName === "HEALTH") {
      navigate("/dashboard");
    } else {
      navigate("/payment", {
        state: { memberPackageId: plan.memberPackageId },
      });
    }
  };

  const getButtonColor = (packageName) => {
    switch (packageName) {
      case "HEALTH":
        return "bg-green-600 hover:bg-green-700";
      case "HEALTH+":
        return "bg-red-600 hover:bg-red-700";
      case "HEALTH PRO PACKAGE":
      case "PREMIUM":
      case "PREMIUM PAID":
        return "bg-yellow-600 hover:bg-yellow-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative w-full h-[75vh] flex items-center justify-center text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: `url('/images/hero.jpg')`,
            backgroundColor: "#4a5568",
          }}
        />
        <div className="absolute inset-0 z-10 bg-black opacity-10" />
        <div className="relative z-20 max-w-4xl px-4 pt-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            Start Your Smoke-Free Journey
          </h1>
          <p className="text-lg md:text-xl text-white mb-8 max-w-3xl mx-auto">
            Choose a membership plan tailored to support your progress, with
            personalized tracking and expert guidance.
          </p>
          <button
            onClick={() => {
              const el = document.getElementById("plans");
              if (el) {
                const yOffset = -50;
                const y =
                  el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: "smooth" });
              }
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold text-lg transition duration-100"
          >
            Explore Plans
          </button>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="py-16 px-4 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4"
        >
          Choose Your Plan
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto"
        >
          Each plan is designed to help you quit smoking effectively and
          sustainably.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const isCurrentPlan =
              Number(plan.memberPackageId) === currentPackageId;
            const currentPlan = plans.find(
              (p) => p.memberPackageId === currentPackageId
            );
            const isDowngrade = currentPlan && plan.price < currentPlan.price;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative flex flex-col justify-between h-full rounded-2xl shadow-md border-2 p-8 transform hover:-translate-y-2 transition duration-300
                  ${index === 0 ? "bg-green-50 border-green-500" : ""}
                  ${index === 1 ? "bg-yellow-50 border-yellow-500" : ""}
                  ${index === 2 ? "bg-blue-50 border-blue-500" : ""}
                `}
              >
                {plan.recommended && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-2xl">
                    Most Popular
                  </span>
                )}
                {isCurrentPlan && (
                  <span className="absolute top-2 left-2 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded">
                    Current Plan
                  </span>
                )}

                <h3 className="text-2xl font-extrabold uppercase text-gray-800 mb-4">
                  {plan.packageName}
                </h3>

                {isCurrentPlan && (
                  <div className="flex items-center gap-2 mb-4 text-green-600 font-semibold">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Currently Subscribed</span>
                  </div>
                )}

                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {plan.price === 0
                    ? "FREE"
                    : `${plan.price.toLocaleString()} VND`}
                </div>
                <p className="text-gray-500 mb-6">
                  {plan.price === 0
                    ? "Không giới hạn"
                    : `${plan.duration} ngày`}
                </p>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.featuresDescription
                    .split(/(?<=[.!?])\s+/)
                    .map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start text-gray-700 gap-2"
                      >
                        <svg
                          className="w-5 h-5 text-green-500 mt-1 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{feature.trim()}</span>
                      </li>
                    ))}
                </ul>

                <button
                  onClick={() => {
                    if (!isCurrentPlan && !isDowngrade && !isBlockedRole) {
                      handleChoosePlan(plan);
                    }
                  }}
                  disabled={isCurrentPlan || isDowngrade || isBlockedRole}
                  className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
                    isCurrentPlan || isDowngrade || isBlockedRole
                      ? "bg-gray-400 cursor-not-allowed"
                      : plan.buttonColor + " text-white"
                  }`}
                >
                  {isBlockedRole
                    ? "Can't Select"
                    : isCurrentPlan
                    ? "Current Plan"
                    : isDowngrade
                    ? "Cannot Downgrade"
                    : "Select Plan"}
                </button>

                {isCurrentPlan && plan.price > 0 && !isBlockedRole && (
                  <>
                    <Button
                      danger
                      type="primary"
                      className="mt-4 w-full"
                      onClick={showCancelModal}
                    >
                      Hủy gói
                    </Button>

                    <Modal
                      title="Xác nhận hủy gói"
                      open={cancelModalOpen}
                      onOk={confirmCancelPackage}
                      onCancel={() => setCancelModalOpen(false)}
                      okText="Đồng ý"
                      cancelText="Hủy"
                    >
                      <p>Bạn chắc chắn muốn hủy gói hiện tại?</p>
                    </Modal>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Membership;