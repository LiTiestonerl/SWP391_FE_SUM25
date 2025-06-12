import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MembershipPage.css';

const plans = [
  {
    title: 'HEALTH',
    price: '300.000 VND',
    duration: '1 tháng',
    features: ['Basic tracking', 'Limited resources', 'No coach access'],
  },
  {
    title: 'HEALTH+',
    price: '800.000 VND',
    duration: '3 tháng',
    features: ['Full tracking', 'Access to premium blog', 'Partial coach support'],
  },
  {
    title: 'OTHERS',
    price: '2.000.000 VND',
    duration: '1 năm',
    features: ['Custom plan', 'Full coach support', 'Detailed statistics'],
  },
];

const MembershipPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleChoosePlan = (title) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập trước khi chọn gói!');
      navigate('/login');
      return;
    }

    alert(`Bạn đã chọn gói ${title}`);
    if (title === 'HEALTH') {
      navigate('/dashboard');
    } else {
      navigate('/payment', { state: { packageName: title } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black text-white flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-3">
          <img src="/images/logo1.jpg" alt="logo" className="h-10 w-10 rounded-full" />
          <span className="font-bold text-lg">NOSMOKING.COM</span>
        </div>
        <div>
          <button
            onClick={handleLoginClick}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium"
          >
            LOGI
          </button>
        </div>
      </header>

      <div className="marquee-container">
        <div className="marquee-track">
          {Array(20).fill('NO SMOKE').map((text, i) => (
            <span className="marquee-item" key={i}>{text}</span>
          ))}
        </div>
      </div>

      <main className="py-12 text-center px-4">
        <h2 className="text-3xl font-semibold italic px-4 py-5 font-medium">
          Upgrade Your Experience Today
        </h2>

        <div className="flex flex-wrap justify-center gap-10">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-8 w-72 hover:shadow-2xl transition"
            >
              <h3 className="text-xl font-bold uppercase italic text-gray-800 mb-3">
                {plan.title}
              </h3>
              <div className="text-green-600 bg-green-100 font-bold text-lg px-3 py-1 rounded inline-block mb-2">
                {plan.price}
              </div>
              <p className="text-gray-600 mb-4">{plan.duration}</p>
              <ul className="text-left mb-6 space-y-2 text-sm">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="text-gray-700 flex items-center">
                    <span className="text-green-600 mr-2">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleChoosePlan(plan.title)}
                className="bg-gray-800 text-white py-2 w-full rounded hover:bg-gray-900 transition font-semibold"
              >
                Choose
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MembershipPage;
