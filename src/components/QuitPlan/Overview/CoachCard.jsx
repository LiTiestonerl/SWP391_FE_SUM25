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

// Mock data for when API fails
const MOCK_RATING_DATA = {
  coachRating: 4,
  coachComment: "Great effort! Keep up the good work!",
  userRating: null,
  userComment: null
};

const formatVND = (v) => 
  typeof v === 'number' ? v.toLocaleString('vi-VN') + ' VND' : 'N/A';

const formatNicotineStrength = (strength) => {
  if (!strength) return 'Unknown';
  const strengths = {
    'ULTRA_LIGHT': 'Ultra Light (0.1-0.4mg)',
    'LIGHT': 'Light (0.5-0.8mg)',
    'REGULAR': 'Regular (0.9-1.2mg)',
    'STRONG': 'Strong (1.3-1.6mg)',
    'EXTRA_STRONG': 'Extra Strong (>1.6mg)'
  };
  return strengths[strength] || strength;
};

// Mock data from your database
const MOCK_DATA = {
  currentPackage: {
    cigarettePackageId: 1,
    cigarettePackageName: "Marlboro Menthol",
    brand: "Marlboro",
    flavor: "menthol",
    nicotineLevel: "high",
    nicotineMg: 1.2,
    pricePerPack: 45000,
    sticksPerPack: 20
  },
  recommendation: {
    notes: "Switch from Marlboro to Camel to begin reducing nicotine intake",
    recommendedPackage: {
      cigaretteId: 2,
      cigaretteName: "Camel Classic",
      brand: "Camel",
      flavor: "classic",
      nicoteneStrength: "medium",
      nicotineMg: 0.8,
      price: 42000,
      sticksPerPack: 20
    }
  }
};

export const CoachSuggestionCard = ({ planId, userId }) => {
  const [currentPackage, setCurrentPackage] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Try to fetch real data first
        const statusRes = await api.get(`/smoking-status/${userId}`);
        const currentPackageId = statusRes.data?.cigarettePackageId;
        
        if (currentPackageId) {
          const packageRes = await api.get(`/cigarette-packages/${currentPackageId}`);
          setCurrentPackage(packageRes.data);
        }

        if (planId) {
          const planRes = await api.get(`/quit-plan/${planId}`);
          const planData = planRes.data;
          
          if (planData) {
            const recommendedPackage = planData.nicotineSuggestions?.find(
              p => p.cigaretteId === planData.recommendedPackageId
            );
            
            setRecommendation({
              notes: planData.recommendationNotes || "Based on your smoking habits, we recommend this alternative",
              recommendedPackage
            });
          }
        }

        setError(null);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load data. Showing sample recommendations.");
        setCurrentPackage(MOCK_DATA.currentPackage);
        setRecommendation(MOCK_DATA.recommendation);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [planId, userId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 border">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border">
      <h3 className="font-semibold text-emerald-700 text-md mb-3">
        🚬 Nicotine Replacement Recommendation
      </h3>

      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-3 text-sm">
          <p className="text-yellow-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-md p-3">
          <h4 className="font-medium text-gray-700 mb-2 pb-2 border-b">Current Package</h4>
          {currentPackage ? (
            <>
              <p className="font-semibold text-gray-900">
                {currentPackage.cigarettePackageName}
              </p>
              <div className="mt-2 space-y-1 text-sm">
                <p><span className="font-medium">Brand:</span> {currentPackage.brand}</p>
                <p><span className="font-medium">Flavor:</span> {currentPackage.flavor}</p>
                <p><span className="font-medium">Strength:</span> {formatNicotineStrength(currentPackage.nicotineLevel)}</p>
                <p><span className="font-medium">Nicotine:</span> {currentPackage.nicotineMg?.toFixed(1)} mg/stick</p>
                <p><span className="font-medium">Price:</span> {formatVND(currentPackage.pricePerPack)} per pack</p>
                <p><span className="font-medium">Sticks:</span> {currentPackage.sticksPerPack} per pack</p>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">No current package selected</p>
          )}
        </div>

        <div className="border rounded-md p-3 bg-emerald-50 border-emerald-100">
          <h4 className="font-medium text-emerald-700 mb-2 pb-2 border-b border-emerald-200">Recommended Package</h4>
          {recommendation?.recommendedPackage ? (
            <>
              <p className="font-semibold text-gray-900">
                {recommendation.recommendedPackage.cigaretteName}
              </p>
              <div className="mt-2 space-y-1 text-sm">
                <p><span className="font-medium">Brand:</span> {recommendation.recommendedPackage.brand}</p>
                <p><span className="font-medium">Flavor:</span> {recommendation.recommendedPackage.flavor}</p>
                <p><span className="font-medium">Strength:</span> {formatNicotineStrength(recommendation.recommendedPackage.nicoteneStrength)}</p>
                <p><span className="font-medium">Nicotine:</span> {recommendation.recommendedPackage.nicotineMg?.toFixed(1)} mg/stick</p>
                <p><span className="font-medium">Price:</span> {formatVND(recommendation.recommendedPackage.price)} per pack</p>
                <p><span className="font-medium">Sticks:</span> {recommendation.recommendedPackage.sticksPerPack} per pack</p>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">No recommendation available</p>
          )}
        </div>
      </div>

      {recommendation?.notes && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
          <h4 className="font-medium text-blue-700 text-sm mb-1">Coach's Notes</h4>
          <p className="text-sm text-gray-700">{recommendation.notes}</p>
        </div>
      )}
    </div>
  );
};

export const CoachFeedbackCard = ({
  coachId,
  coachName = 'Coach',
  planId,
  memberId
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratingData, setRatingData] = useState(MOCK_RATING_DATA);
  const [tempRating, setTempRating] = useState(5);
  const [tempComment, setTempComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);
        
        // Try to fetch coach ratings
        if (coachId) {
          try {
            const res = await api.get(`/rating/coach/${coachId}`);
            if (res.data && res.data.length > 0) {
              const latestRating = res.data[0];
              setRatingData(prev => ({
                ...prev,
                coachRating: latestRating.ratingValue,
                coachComment: latestRating.feedbackText
              }));
            }
          } catch (err) {
            console.log("No permission to view coach ratings or no data");
          }
        }

        // Try to fetch user's rating
        if (memberId && planId) {
          try {
            const res = await api.get(`/rating/member/${memberId}`);
            if (res.data) {
              const userRating = Array.isArray(res.data) 
                ? res.data.find(r => r.planId === planId)
                : null;
              if (userRating) {
                setRatingData(prev => ({
                  ...prev,
                  userRating: userRating.ratingValue,
                  userComment: userRating.feedbackText
                }));
              }
            }
          } catch (err) {
            console.log("No permission to view user ratings or no data");
          }
        }
        
        setError(null);
      } catch (err) {
        console.error("Failed to fetch ratings:", err);
        setError("Failed to load rating data. Using sample data.");
        setRatingData(MOCK_RATING_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [coachId, planId, memberId]);

  const handleSubmitRating = async () => {
    if (!coachId || !planId || !memberId) {
      alert("Missing required data to submit rating");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const ratingPayload = {
        ratingValue: tempRating,
        feedbackText: tempComment,
        ratingType: "COACH",
        coachId: coachId,
        planId: planId,
        memberId: memberId
      };

      // Try to call API
      try {
        await api.post('/rating', ratingPayload);
      } catch (err) {
        console.error("API failed but we'll save locally", err);
      }
      
      // Save locally regardless of API success
      setRatingData(prev => ({
        ...prev,
        userRating: tempRating,
        userComment: tempComment
      }));
      
      setOpen(false);
    } catch (err) {
      console.error("Failed to submit rating:", err);
      alert("Failed to submit rating. Your feedback has been saved locally.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
        <h3 className="font-semibold text-emerald-700">Coach Feedback</h3>
        
        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-3 text-sm">
            <p className="text-yellow-700">{error}</p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <StarRow value={ratingData.coachRating} readOnly />
          <span className="text-sm text-gray-600">{ratingData.coachRating}/5</span>
        </div>
        <p className="text-sm text-gray-700 italic">“{ratingData.coachComment}” — <b>{coachName}</b></p>
        
        {ratingData.userRating > 0 && (
          <div className="space-y-1 pt-3 border-t">
            <p className="text-sm text-gray-600 font-medium">Your Feedback:</p>
            <div className="flex items-center gap-2">
              <StarRow value={ratingData.userRating} readOnly />
              <span className="text-sm text-gray-600">{ratingData.userRating}/5</span>
            </div>
            {ratingData.userComment && <p className="text-sm text-gray-600 italic">“{ratingData.userComment}”</p>}
          </div>
        )}
        
        <button
          onClick={() => {
            setTempRating(ratingData.userRating || 5);
            setTempComment(ratingData.userComment || '');
            setOpen(true);
          }}
          className="px-4 py-2 bg-emerald-600 text-white text-sm rounded shadow hover:bg-emerald-700"
        >
          {ratingData.userRating ? 'Edit Feedback' : 'Give Feedback'}
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
              <StarRow value={tempRating} onChange={setTempRating} />
              <textarea
                rows={4} 
                value={tempComment}
                onChange={(e) => setTempComment(e.target.value)}
                className="w-full border rounded p-3 text-sm"
                placeholder="Write a comment…"
              />
              <div className="flex gap-4">
                <button
                  onClick={handleSubmitRating}
                  className="flex-1 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
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