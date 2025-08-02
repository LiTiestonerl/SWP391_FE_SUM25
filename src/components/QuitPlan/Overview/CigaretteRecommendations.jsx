import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cigaretteRecommendationService } from '../../../services/quitPlanService';

const CigaretteRecommendations = ({ recommendations, currentCigaretteId }) => {
  const [localRecommendations, setLocalRecommendations] = useState(recommendations || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentCigaretteId && !recommendations?.length) {
      loadRecommendations();
    }
  }, [currentCigaretteId]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const bestRecs = await cigaretteRecommendationService.getBestRecommendations(currentCigaretteId);
      setLocalRecommendations(bestRecs.slice(0, 3)); // Show top 3
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayRecommendations = recommendations || localRecommendations;

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl">🚭</div>
          <h3 className="text-lg font-semibold text-gray-700">Loading Recommendations...</h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!displayRecommendations?.length) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl">🚭</div>
          <h3 className="text-lg font-semibold text-gray-700">Cigarette Alternatives</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🌱</div>
          <p className="text-gray-600 mb-4">
            Great news! You're on your way to being completely smoke-free!
          </p>
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <h4 className="font-semibold text-emerald-700 mb-2">Healthy Alternatives:</h4>
            <div className="space-y-2 text-sm text-emerald-600">
              <div className="flex items-center gap-2">
                <span>🥕</span>
                <span>Carrot sticks or celery</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🍃</span>
                <span>Herbal tea or mint leaves</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🧘‍♀️</span>
                <span>Deep breathing exercises</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="text-3xl">🚭</div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Lighter Alternatives</h3>
          <p className="text-sm text-gray-500">Gradual reduction recommendations</p>
        </div>
      </div>

      <div className="space-y-4">
        {displayRecommendations.map((rec, index) => (
          <motion.div
            key={rec.recId || index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">📦</span>
                  <h4 className="font-semibold text-gray-800">
                    {rec.toCigaretteName || 'Alternative Option'}
                  </h4>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Brand:</span>
                    <span className="ml-1 font-medium">{rec.toBrand || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Nicotine:</span>
                    <span className="ml-1 font-medium text-green-600">
                      {rec.toNicoteneStrength || 'Lower'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Flavor:</span>
                    <span className="ml-1 font-medium">{rec.toFlavor || 'Similar'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Price:</span>
                    <span className="ml-1 font-medium">
                      {rec.toPrice ? `${rec.toPrice.toLocaleString()} VND` : 'N/A'}
                    </span>
                  </div>
                </div>

                {rec.notes && (
                  <div className="mt-3 p-2 bg-white rounded border border-blue-100">
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Note:</span> {rec.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="ml-4 text-center">
                <div className="bg-green-100 rounded-full p-2 mb-1">
                  <span className="text-green-600 text-sm font-bold">
                    #{rec.priorityOrder || index + 1}
                  </span>
                </div>
                <span className="text-xs text-gray-500">Priority</span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-red-400 to-green-400 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.max(20, 100 - (rec.priorityOrder || 1) * 20)}%` 
                  }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">Reduction Level</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">⚠️</span>
          <h4 className="font-semibold text-yellow-800">Important Reminder</h4>
        </div>
        <p className="text-sm text-yellow-700">
          These are transitional alternatives to help reduce nicotine dependency. 
          The ultimate goal is to become completely smoke-free for your health and well-being.
        </p>
      </div>
    </motion.div>
  );
};

export default CigaretteRecommendations;
