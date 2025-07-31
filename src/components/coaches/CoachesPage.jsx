import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../configs/axios";
import {
  FiCalendar,
  FiFilter,
  FiVideo,
} from "react-icons/fi";

const CoachPage = () => {
  const [coaches, setCoaches] = useState([]);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const fetchCoaches = async () => {
    try {
      const response = await api.get("/coach");
      setCoaches(response.data);
    } catch (error) {
      console.error("Error fetching coaches:", error);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  const handleBookConsultation = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/membership");
    }
  };

  const handleViewProfile = (id) => {
    navigate(`/coach/${id}`);
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50 px-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Meet Our Coaches
      </h1>

      <div className="flex justify-end mb-6">
        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100">
          <FiFilter /> Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coaches.map((coach) => (
          <div
            key={coach.userId}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
          >
            <div className="mb-4">
              <h2 className="text-xl font-bold">{coach.fullName}</h2>
              <p className="text-sm text-gray-500">{coach.email}</p>
              <p className="text-sm text-gray-500">{coach.phone}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleViewProfile(coach.userId)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
              >
                <FiVideo /> View Profile
              </button>
              <button
                onClick={handleBookConsultation}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
              >
                <FiCalendar /> Chat Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoachPage;
