import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Custom CSS cho scrollbar (inline trong JSX)
const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    height: 5px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(100, 116, 139, 0.3);
    border-radius: 10px;
  }
  .custom-scrollbar:hover::-webkit-scrollbar-thumb {
    background-color: rgba(100, 116, 139, 0.5);
  }
`;

export const coachList = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialization: 'Behavioral Therapy',
    experience: 12,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2',
    qualification: 'Ph.D. in Psychology',
    introduction: 'Specialized in cognitive behavioral therapy for smoking cessation.',
    successRate: '89%',
    methodology: 'CBT + Mindfulness techniques.',
  },
  {
    id: 2,
    name: 'Michael Chen',
    specialization: 'Holistic Approach',
    experience: 8,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d',
    qualification: 'Certified Addiction Specialist',
    introduction: 'Integrative approach combining Eastern and Western methods.',
    successRate: '85%',
    methodology: 'Natural healing and behavioral modification.',
  },
  {
    id: 3,
    name: 'Emma Williams',
    specialization: 'NLP Practitioner',
    experience: 10,
    image: 'https://www.lasik.com/wp-content/uploads/2025/05/AdobeStock_320744517-2048x1365.jpeg.webp',
    qualification: 'Master NLP Practitioner',
    introduction: 'Expert in Neuro-Linguistic Programming for habit change.',
    successRate: '92%',
    methodology: 'NLP and Timeline Therapy.',
  },
  {
    id: 4,
    name: 'Dr. Robert Anderson',
    specialization: 'Addiction Psychology',
    experience: 15,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7',
    qualification: 'Ph.D. in Clinical Psychology',
    introduction: 'Evidence-based approaches for smoking cessation and addiction recovery.',
    successRate: '94%',
    methodology: 'Motivational interviewing & CBT.',
  },
  {
    id: 5,
    name: 'Dr. Emily Nguyen',
    specialization: 'Nicotine Addiction Counseling',
    experience: 9,
    image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e',
    qualification: 'M.S. in Clinical Psychology',
    introduction: 'Supports long-term cessation with individualized plans.',
    successRate: '85%',
    methodology: 'Motivational interviewing & relapse prevention.',
  },
  {
    id: 6,
    name: 'Dr. David Lee',
    specialization: 'Respiratory Health & Wellness',
    experience: 15,
    image: 'https://portraitpal.ai/wp-content/uploads/2024/10/doctor-headshot.jpg',
    qualification: 'MD, Pulmonologist',
    introduction: 'Helps improve lung health through education and support.',
    successRate: '91%',
    methodology: 'Medical treatment with behavioral coaching.',
  },
];

const CoachBox = ({ selectedCoachId, onSelect }) => {
  const navigate = useNavigate();
  const selected = coachList.find((c) => c.id === selectedCoachId);
  const [showSelector, setShowSelector] = useState(false);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  return (
    <>
      <style>{customScrollbarStyles}</style>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[685px] flex flex-col">
        <h3 className="text-lg font-semibold text-emerald-700 px-6 pt-6 pb-1">Coach</h3>

        {!selected ? (
          <div className="flex flex-col items-center justify-center flex-1 px-6 pb-6">
            <div
              onClick={() => setShowSelector(true)}
              className="w-[80%] aspect-[4/5] bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-emerald-400 transition"
            >
              <div className="text-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  alt="Select Coach"
                  className="w-20 h-20 opacity-60 mx-auto mb-3"
                />
                <p className="text-gray-500 text-sm">Click to select your coach</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <img
              src={selected.image}
              alt={selected.name}
              className="w-[90%] h-76 object-cover object-[top_3%] rounded-xl shadow-sm ring-2 ring-gray-300 mx-auto mt-3"
            />
            <div className="p-6 flex flex-col flex-1 overflow-hidden text-[14px] text-gray-700 space-y-2 leading-relaxed">
              <h4 className="text-xl font-bold text-gray-800">{selected.name}</h4>
              <p className="text-emerald-600 font-medium">{selected.specialization}</p>
              <p><span className="font-semibold text-gray-800">Experience:</span> {selected.experience} years</p>
              <p><span className="font-semibold text-gray-800">Qualification:</span> {selected.qualification}</p>
              <p className="italic text-gray-600">{selected.introduction}</p>
              <p><span className="font-semibold text-gray-800">Success Rate:</span> {selected.successRate}</p>
              <p><span className="font-semibold text-gray-800">Methodology:</span> {selected.methodology}</p>

              <div className="flex gap-3 mt-auto pt-4">
                <button
                  onClick={() => onSelect(null)}
                  className="flex-1 px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                >
                  Change Coach
                </button>
                <button
                  onClick={() => navigate('/chat')}
                  className="flex-1 px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                >
                  Chat
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {showSelector && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSelector(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl px-10 py-8 w-full max-w-6xl max-h-[95vh] h-[400px] shadow-xl relative"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <h3 className="text-2xl font-bold text-emerald-700 mb-6 text-center">
                Select Your Coach
              </h3>

              <div className="relative">
                {/* Nút trái */}
                <button
                  onClick={() => scroll('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-emerald-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Danh sách coach */}
                <div
                  ref={scrollRef}
                  className="flex gap-6 overflow-x-auto custom-scrollbar pb-4 px-8"
                >
                  {coachList.map((coach) => {
                    const isSelected = selectedCoachId === coach.id;

                    return (
                      <button
                        key={coach.id}
                        onClick={() => {
                          onSelect(coach.id);
                          setShowSelector(false);
                        }}
                        className={`min-w-[240px] flex-shrink-0 flex flex-col items-center gap-2 border p-4 rounded-2xl transition duration-300 ${
                          isSelected
                            ? 'ring-2 ring-emerald-500 bg-emerald-50'
                            : 'border-gray-200 bg-white hover:bg-emerald-50'
                        }`}
                      >
                        <div className="w-full h-[180px] rounded-xl overflow-hidden ring-1 ring-gray-200">
                          <img
                            src={coach.image}
                            alt={coach.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="text-sm text-center mt-2">
                          <div className="font-semibold text-gray-800 text-[14px]">
                            {coach.name}
                          </div>
                          <div className="text-gray-500 text-xs">{coach.specialization}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Nút phải */}
                <button
                  onClick={() => scroll('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-emerald-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CoachBox;
