import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    image: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47',
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

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[580px] max-h-[580px] flex flex-col">
      <h3 className="text-lg font-semibold text-emerald-700 px-6 pt-6 pb-1">Coach</h3>

      {!selected ? (
        <div className="px-6 pb-6 flex-1 overflow-y-auto">
          <p className="text-sm text-gray-600 mt-1 mb-3">Please select your coach:</p>
          <div className="grid grid-cols-3 gap-4">
            {coachList.map((coach) => (
              <button
                key={coach.id}
                onClick={() => onSelect(coach.id)}
                className="flex flex-col items-center gap-2 border p-3 rounded-xl hover:bg-emerald-50 transition border-gray-200"
              >
                <div className="w-full aspect-[4/5] rounded-xl overflow-hidden ring-1 ring-gray-200">
                  <img
                    src={coach.image}
                    alt={coach.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-sm text-center mt-1">
                  <div className="font-semibold text-gray-800 leading-tight">{coach.name}</div>
                  <div className="text-gray-500 text-xs">{coach.specialization}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <img
            src={selected.image}
            alt={selected.name}
            className="w-[90%] h-56 object-cover rounded-xl shadow-sm ring-2 ring-gray-300 mx-auto mt-4"
          />
          <div className="p-6 flex flex-col flex-1 overflow-hidden">
            <h4 className="text-xl font-bold text-gray-800">{selected.name}</h4>
            <p className="text-emerald-600 font-medium">{selected.specialization}</p>
            <p className="text-sm text-gray-600">{selected.experience} years experience</p>
            <p className="text-sm text-gray-600">{selected.qualification}</p>
            <p className="text-sm text-gray-600 italic mt-1">{selected.introduction}</p>
            <p className="text-sm text-gray-600 mt-2"><b>Success Rate:</b> {selected.successRate}</p>
            <p className="text-sm text-gray-600"><b>Methodology:</b> {selected.methodology}</p>

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
  );
};

export default CoachBox;
