import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../configs/axios";

const defaultPlans = [
  {
    memberPackageId: "1",
    packageName: "HEALTH",
    price: 0,
    duration: 7,
    featuresDescription: "Basic tracking,Limited resources,No coach access",
    color: "bg-blue-50 border border-blue-500",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
  },
  {
    memberPackageId: "2",
    packageName: "HEALTH+",
    price: 100000,
    duration: 30,
    featuresDescription:
      "Full tracking,Access to premium blog,Partial coach support",
    color: "bg-green-50 border border-green-400",
    buttonColor: "bg-green-600 hover:bg-green-700",
    recommended: true,
  },
  {
    memberPackageId: "3",
    packageName: "OTHERS",
    price: 200000,
    duration: 60,
    featuresDescription: "Custom plan,Full coach support,Detailed statistics",
    color: "bg-purple-50 border border-purple-500",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
  },
];

const testimonials = [
  {
    name: "John Doe",
    quote:
      "Thanks to HEALTH+, I’ve significantly reduced smoking and feel healthier!",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80&q=80",
  },
  {
    name: "Jane Smith",
    quote: "The coach support in the OTHERS plan is amazing, totally worth it!",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80&q=80",
  },
];

const Membership = () => {
  const [plans, setPlans] = useState(defaultPlans);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPackages = async () => {
    try {
      const response = await api.get("/member-packages");
      const apiPlans = response?.data.map((plan) => ({
        ...plan,
        color: getCardColor(plan.packageName),
        buttonColor: getButtonColor(plan.packageName),
        recommended: plan.packageName === "HEALTH+",
      }));
      setPlans(apiPlans);
    } catch (error) {
      console.error("Error fetching packages:", error);
      setPlans(defaultPlans); // Fallback to default plans if API fails
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoading(true);
      fetchPackages();
    } else {
      setPlans(defaultPlans); // Hiển thị plans tĩnh nếu chưa đăng nhập
      setLoading(false);
    }
  }, []);

  const handleChoosePlan = (plan) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập để mua gói!");
      navigate("/login");
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

  const getCardColor = (packageName) => {
    switch (packageName) {
      case "HEALTH":
        return "bg-blue-50 border border-blue-500";
      case "HEALTH+":
        return "bg-green-50 border border-green-400";
      case "OTHERS":
        return "bg-purple-50 border border-purple-500";
      default:
        return "bg-white border border-gray-200";
    }
  };

  const getButtonColor = (packageName) => {
    switch (packageName) {
      case "HEALTH":
        return "bg-blue-600 hover:bg-blue-700";
      case "HEALTH+":
        return "bg-green-600 hover:bg-green-700";
      case "OTHERS":
        return "bg-purple-600 hover:bg-purple-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative w-full h-[75vh] flex items-center justify-center text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: `url('/images/hero.jpg')`,
            backgroundColor: "#4a5568",
          }}
        />
        <div
          className="absolute inset-0 z-10"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
        />
        <div className="relative z-20 max-w-4xl px-4 pt-16">
          <h1 className="text-4xl md:text-6xl font-extrabold !text-white mb-6">
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
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative rounded-2xl shadow-xl p-8 transform hover:-translate-y-2 transition duration-300 pricing-card ${
                plan.color
              } ${plan.recommended ? "ring-4 ring-green-500" : ""}`}
            >
              {plan.recommended && (
                <span className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-2xl">
                  Most Popular
                </span>
              )}
              <h3 className="text-2xl font-extrabold uppercase text-gray-800 mb-4">
                {plan.packageName}
              </h3>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {plan.price === 0
                  ? "FREE"
                  : `${plan.price.toLocaleString()} VND`}
              </div>
              <p className="text-gray-500 mb-6">{plan.duration} ngày</p>
              <ul className="space-y-3 mb-8">
                {plan.featuresDescription.split(",").map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
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
                    {feature.trim()}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleChoosePlan(plan)}
                className={`${plan.buttonColor} text-white w-full py-3 rounded-lg font-semibold transition duration-300`}
              >
                Select Plan
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-gray-100 py-16 px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center text-gray-900 mb-12"
        >
          Success Stories
        </motion.h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center"
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full object-cover mb-4"
              />
              <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
              <p className="font-semibold text-gray-800">{testimonial.name}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Membership;
