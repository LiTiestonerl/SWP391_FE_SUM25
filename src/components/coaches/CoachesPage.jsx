import React, { useState } from "react";
import {
  FiCalendar,
  FiStar,
  FiMessageSquare,
  FiFilter,
  FiVideo,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CoachesPage = () => {
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState({});
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleBookConsultation = () => {
    if (!user) {
      navigate("/booking");
    } else {
      navigate("/booking");
    }
  };

  const handleAddComment = () => {
    if (newComment.trim() === "" || !selectedCoach) return;

    const newEntry = {
      user: user?.name || "Anonymous",
      text: newComment,
      rating: 5,
    };

    setComments((prev) => ({
      ...prev,
      [selectedCoach.id]: [newEntry, ...(prev[selectedCoach.id] || [])],
    }));

    setNewComment("");
  };

  const coaches = [
      {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialization: "Behavioral Therapy",
    experience: 12,
    rate: "$120/hour",
    introduction:
      "Specialized in cognitive behavioral therapy for smoking cessation",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2",
    availability: "Available",
    success_rate: "89%",
    qualification: "Ph.D. in Psychology",
    methodology: "Combines CBT with mindfulness techniques",
  },
  {
    id: 2,
    name: "Michael Chen",
    specialization: "Holistic Approach",
    experience: 8,
    rate: "$95/hour",
    introduction:
      "Integrative approach combining Eastern and Western methods",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d",
    availability: "Limited",
    success_rate: "85%",
    qualification: "Certified Addiction Specialist",
    methodology: "Natural healing and behavioral modification",
  },
  {
    id: 3,
    name: "Emily Nguyen",
    specialization: "Motivational Coaching",
    experience: 10,
    rate: "$110/hour",
    introduction:
      "Helping clients build lasting habits through positive psychology",
    image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
    availability: "Available",
    success_rate: "91%",
    qualification: "Certified Life Coach (CLC)",
    methodology: "Goal setting, habit tracking, and motivational interviewing",
  },
];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* Hero Section */}
      <div
        className="relative h-[500px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506126613408-eca07ce68773')",
        }}
      >
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
            Begin Your Journey to a Smoke-Free Life
          </h1>
          <p className="text-xl md:text-2xl text-center mb-8">
            Expert coaches ready to guide you through your transformation
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={handleBookConsultation}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition duration-300"
            >
              Book Consultation
            </button>
          </div>
        </div>
      </div>

      {/* Coaches Directory */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Our Expert Coaches
          </h2>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <FiFilter /> Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coaches.map((coach) => (
            <div
              key={coach.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105"
            >
              <img
                src={coach.image}
                alt={coach.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {coach.name}
                    </h3>
                    <p className="text-green-600 font-medium">
                      {coach.specialization}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      coach.availability === "Available"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {coach.availability}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{coach.introduction}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>{coach.experience} years experience</span>
                  <span>{coach.rate}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedCoach(coach);
                      setShowModal(true);
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                  >
                    <FiVideo /> View Profile
                  </button>
                  <button
                    onClick={handleBookConsultation}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                  >
                    <FiCalendar /> Book now!
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coach Profile Modal */}
      {showModal && selectedCoach && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedCoach.image}
                    alt={selectedCoach.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {selectedCoach.name}
                    </h3>
                    <p className="text-green-600">
                      {selectedCoach.specialization}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">Qualification</h4>
                  <p>{selectedCoach.qualification}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">Success Rate</h4>
                  <p className="text-green-600 font-bold">
                    {selectedCoach.success_rate}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-bold mb-2">Methodology</h4>
                <p className="text-gray-600">{selectedCoach.methodology}</p>
              </div>

              {/* Reviews Section */}
              <div className="mb-6">
                <h4 className="font-bold mb-4">Reviews & Comments</h4>
                <div className="space-y-4 mb-4">
                  {(comments[selectedCoach.id] || []).map((comment, index) => (
                    <div key={index} className="bg-gray-100 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-700">
                          {comment.user}
                        </span>
                      </div>
                      <p className="text-gray-600">{comment.text}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <textarea
                    className="w-full p-3 border rounded-lg"
                    rows="3"
                    placeholder="Leave a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button
                    onClick={handleAddComment}
                    className="self-end bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Submit Comment
                  </button>
                </div>
              </div>

              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold">
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachesPage;
