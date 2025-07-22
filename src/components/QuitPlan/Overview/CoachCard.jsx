import React, { useState, useEffect } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { HiLink } from 'react-icons/hi';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../../../configs/axios';

const StarRow = ({ value = 0, onChange = () => {}, readOnly = false }) => (
  <div className="flex flex-row gap-1">
    {Array.from({ length: 5 }, (_, i) => (
      <AiFillStar
        key={i}
        onClick={() => !readOnly && onChange(i + 1)}
        className={`text-xl cursor-pointer ${i < value ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ))}
  </div>
);

// Mock data based on your API structure
const MOCK_RECOMMENDATIONS = [
  {
    recId: 1,
    fromPackage: {
      cigaretteId: 1,
      cigaretteName: "Marlboro Red",
      price: 50000,
      sticksPerPack: 20,
      nicotineLevel: 10,
      moreInfoUrl: "https://www.who.int/tobacco"
    },
    toPackage: {
      cigaretteId: 2,
      cigaretteName: "Marlboro Gold",
      price: 45000,
      sticksPerPack: 20,
      nicotineLevel: 6,
      moreInfoUrl: "https://www.who.int/tobacco"
    },
    notes: "Reduced nicotine while maintaining flavor"
  }
];

export const CoachSuggestionCard = ({ level = 'Mild', currentPackage }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setApiError(false);
        
        // Try to fetch from API first
        if (currentPackage?.cigaretteId) {
          const response = await api.get(
            `/api/cigarette-packages/${currentPackage.cigaretteId}/recommendations`
          );
          if (response.data?.length > 0) {
            setRecommendations(response.data);
            return;
          }
        }
        
        // Fallback to mock data if API fails or returns empty
        setRecommendations(MOCK_RECOMMENDATIONS);
        
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
        setApiError(true);
        setRecommendations(MOCK_RECOMMENDATIONS); // Use mock data on error
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentPackage, level]);

  const getActiveRecommendation = () => {
    // Use first recommendation if available
    if (recommendations.length > 0) {
      const primaryRec = recommendations[0].toPackage;
      return {
        name: primaryRec.cigaretteName,
        nicotine: `${primaryRec.nicotineLevel}mg`,
        price: primaryRec.price,
        link: primaryRec.moreInfoUrl || '#'
      };
    }

    // Fallback to level-based defaults if no recommendations
    const DEFAULT_PACKAGES = {
      Mild: { 
        name: 'Nicotine Gum', 
        nicotine: '2mg', 
        price: 20000, 
        link: 'https://www.who.int/health-topics/tobacco' 
      },
      Moderate: { 
        name: 'Nicotine Patch', 
        nicotine: '5mg', 
        price: 30000, 
        link: 'https://www.nhs.uk/conditions/stop-smoking-treatments/' 
      },
      Severe: { 
        name: 'Prescription Aid', 
        nicotine: 'N/A', 
        price: 100000, 
        link: 'https://www.cdc.gov/tobacco/quit_smoking/index.htm' 
      },
    };

    return DEFAULT_PACKAGES[level] || DEFAULT_PACKAGES.Mild;
  };

  const pack = getActiveRecommendation();

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-3">
      <h3 className="font-semibold text-emerald-700">
        {apiError ? '🚬 Suggested Alternative' : '🚬 Recommended Package'}
      </h3>

      {loading && (
        <div className="text-sm text-gray-500">Loading recommendations...</div>
      )}

      <div className="space-y-2">
        {currentPackage?.cigaretteName && (
          <p className="text-sm text-gray-700">
            <span className="font-medium">Current:</span> {currentPackage.cigaretteName}
          </p>
        )}

        <p className="text-sm text-gray-700">
          <b>{pack.name}</b> — {pack.nicotine} nicotine
        </p>
        <p className="text-sm text-gray-700">
          Price: <b>{pack.price.toLocaleString()} VND</b>
        </p>

        {apiError && (
          <p className="text-xs text-orange-500">
            Showing default suggestions. Will update when connected.
          </p>
        )}
      </div>

      <button
        onClick={() => window.open(pack.link, '_blank')}
        className="inline-flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white text-sm rounded shadow hover:bg-emerald-700 w-fit"
      >
        <HiLink className="text-base" />
        More Info
      </button>
    </div>
  );
};

export const CoachFeedbackCard = ({
  coach = 'Coach',
  coachComment = 'Great effort!',
  coachRating = 4,
  savedRating = 0,
  savedComment = '',
  onSave = () => {},
}) => {
  const [open, setOpen] = useState(false);
  const [tempRating, setTemp] = useState(5);
  const [tempComment, setCom] = useState('');

  const openModal = () => {
    setTemp(savedRating || 5);
    setCom(savedComment || '');
    setOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
        <h3 className="font-semibold text-emerald-700">Coach Feedback</h3>
        <div className="flex items-center gap-2">
          <StarRow value={coachRating} readOnly />
          <span className="text-sm text-gray-600">{coachRating}/5</span>
        </div>
        <p className="text-sm text-gray-700 italic">“{coachComment}” — <b>{coach}</b></p>
        {savedRating > 0 && (
          <div className="space-y-1 pt-3 border-t">
            <p className="text-sm text-gray-600 font-medium">Your Feedback:</p>
            <div className="flex items-center gap-2">
              <StarRow value={savedRating} readOnly />
              <span className="text-sm text-gray-600">{savedRating}/5</span>
            </div>
            {savedComment && <p className="text-sm text-gray-600 italic">“{savedComment}”</p>}
          </div>
        )}
        <button
          onClick={openModal}
          className="px-4 py-2 bg-emerald-600 text-white text-sm rounded shadow hover:bg-emerald-700"
        >
          {savedRating ? 'Edit Feedback' : 'Give Feedback'}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-5"
            >
              <h3 className="text-lg font-semibold text-emerald-700">Rate your coach</h3>
              <StarRow value={tempRating} onChange={setTemp} />
              <textarea
                rows={4} value={tempComment}
                onChange={(e) => setCom(e.target.value)}
                className="w-full border rounded p-3 text-sm"
                placeholder="Write a comment…"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    onSave(tempRating, tempComment);
                    setOpen(false);
                  }}
                  className="flex-1 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};