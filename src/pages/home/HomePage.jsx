import React, { useEffect } from "react";
import {
  FaBan,
  FaLungs,
  FaHeartbeat,
  FaClinicMedical,
  FaQuoteLeft,
} from "react-icons/fa";
import { GiCigarette, GiHealthNormal } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const HomePage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const handleStartJourney = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/membership");
    }
  };

  useEffect(() => {
    const handleScroll = () => {};
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <FaLungs className="text-4xl text-red-600" />,
      title: "Healthy Lungs",
      description: "Improve your lung capacity and respiratory health",
    },
    {
      icon: <FaHeartbeat className="text-4xl text-red-600" />,
      title: "Better Heart Health",
      description: "Reduce risks of cardiovascular diseases",
    },
    {
      icon: <GiHealthNormal className="text-4xl text-red-600" />,
      title: "Overall Wellness",
      description: "Enhanced physical and mental well-being",
    },
    {
      icon: <FaClinicMedical className="text-4xl text-red-600" />,
      title: "Medical Benefits",
      description: "Save on healthcare costs and live longer",
    },
  ];

  const testimonials = [
    {
      name: "David Wilson",
      role: "Quit Smoking 2 Years Ago",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      quote:
        "After 15 years of smoking, I finally quit. My health has improved dramatically!",
    },
    {
      name: "Emma Thompson",
      role: "Smoke-Free for 1 Year",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      quote:
        "The support and resources helped me quit smoking for good. I feel amazing!",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-red-500 to-red-700">
        <div className="container mx-auto px-6 text-center text-white">
          <div className="flex justify-center mb-8">
            <GiCigarette className="text-8xl opacity-50" />
            <FaBan className="text-9xl text-white absolute opacity-80" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Break Free From Smoking
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Start your journey to a healthier, smoke-free life today
          </p>
          <button
            onClick={handleStartJourney}
            className="bg-white text-red-600 px-8 py-3 rounded-full font-semibold hover:bg-red-50 transition-colors"
          >
            Start Your Journey
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Our Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img
                src="/images/home3.jpg"
                alt="Quit Smoking"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Quit Smoking?
              </h2>
              <p className="text-gray-600 mb-6">
                Smoking is responsible for numerous health issues and reduces
                life expectancy. By quitting smoking, you can improve your
                health, save money, and enhance your quality of life.
              </p>
              <button
                onClick={handleStartJourney}
                className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors"
              >
                Get Support
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-8 bg-gray-50 rounded-lg shadow-lg">
                <span className="text-blue-600 text-2xl font-bold mb-4 block">
                  {index === 0 ? "TOP1" : "TOP2"}
                </span>
                <p className="text-gray-600 mb-6">{testimonial.quote}</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-red-600">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Ready to Quit Smoking?
            </h2>
            <p className="text-xl mb-8">
              Join our support group and receive daily motivation and tips
            </p>
            <form className="flex flex-col md:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-6 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-red-600 px-8 py-3 rounded-full font-semibold hover:bg-red-50 transition-colors">
                Join Support Group
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
