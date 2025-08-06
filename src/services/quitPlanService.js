import api from '../configs/axios';

// Quit Plan API Services
export const quitPlanService = {
  // Create a new quit plan
  createPlan: async (planData) => {
    try {
      const response = await api.post('/quit-plan', {
        title: planData.title,
        startDate: planData.startDate,
        expectedEndDate: planData.endDate || planData.expectedEndDate,
        reason: planData.reason,
        stagesDescription: planData.stagesDescription || '',
        customNotes: planData.customNotes || '',
        userId: planData.userId,
        coachId: planData.coachId || null,
        recommendedPackageId: planData.recommendedPackageId || null,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating quit plan:', error);
      throw error;
    }
  },

  // Get quit plan by ID
  getPlanById: async (planId) => {
    try {
      const response = await api.get(`/quit-plan/${planId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quit plan:', error);
      throw error;
    }
  },

  // Get all plans for a user
  getUserPlans: async (userId) => {
    try {
      const response = await api.get(`/quit-plan/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user plans:', error);
      throw error;
    }
  },

  // Get current active plan for user
  getCurrentPlan: async (userId) => {
    try {
      const response = await api.get(`/quit-plan/user/${userId}/current`);
      return response.data;
    } catch (error) {
      console.error('Error fetching current plan:', error);
      throw error;
    }
  },

  // Update quit plan (user)
  updatePlan: async (planId, planData) => {
    try {
      const response = await api.put(`/quit-plan/${planId}/user`, {
        title: planData.title,
        startDate: planData.startDate,
        expectedEndDate: planData.expectedEndDate || planData.endDate,
        reason: planData.reason,
        stagesDescription: planData.stagesDescription || '',
        customNotes: planData.customNotes || '',
        userId: planData.userId,
        coachId: planData.coachId || null,
        recommendedPackageId: planData.recommendedPackageId || null,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating quit plan:', {
        error: error.response?.data || error.message,
        config: error.config
      });
      throw error;
    }
  },

  // Complete quit plan
  completePlan: async (planId) => {
    try {
      const response = await api.put(`/quit-plan/${planId}/complete`);
      return response.data;
    } catch (error) {
      console.error('Error completing quit plan:', error);
      throw error;
    }
  },

  // Cancel quit plan
  cancelPlan: async (planId, reason) => {
    try {
      const response = await api.put(`/quit-plan/${planId}/cancel`, null, {
        params: { reason }
      });
      return response.data;
    } catch (error) {
      console.error('Error canceling quit plan:', error);
      throw error;
    }
  },

  // Delete quit plan
  deletePlan: async (planId, userId) => {
    try {
      const response = await api.delete(`/quit-plan/${planId}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting quit plan:', error);
      throw error;
    }
  },

  // Get free plans
  getFreePlans: async () => {
    try {
      const response = await api.get('/quit-plan/free');
      return response.data;
    } catch (error) {
      console.error('Error fetching free plans:', error);
      throw error;
    }
  },

  // Coach update plan
  coachUpdatePlan: async (planId, planData) => {
    try {
      const response = await api.put(`/quit-plan/${planId}/coach`, {
        title: planData.name || planData.title,
        startDate: planData.startDate,
        expectedEndDate: planData.endDate || planData.expectedEndDate,
        reason: planData.reason,
        stagesDescription: planData.stagesDescription || '',
        customNotes: planData.customNotes || '',
        userId: planData.userId,
        coachId: planData.coachId || null,
        recommendedPackageId: planData.recommendedPackageId || null,
      });
      return response.data;
    } catch (error) {
      console.error('Error coach updating quit plan:', error);
      throw error;
    }
  }
};

// Cigarette Recommendation API Services
export const cigaretteRecommendationService = {
  // Get all recommendations
  getAllRecommendations: async () => {
    try {
      const response = await api.get('/cigarette-recommendations/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching all recommendations:', error);
      throw error;
    }
  },

  // Get recommendation by ID
  getRecommendationById: async (recId) => {
    try {
      const response = await api.get(`/cigarette-recommendations/${recId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendation:', error);
      throw error;
    }
  },

  // Get recommendations for specific cigarette
  getRecommendationsForCigarette: async (cigaretteId) => {
    try {
      const response = await api.get(`/cigarette-recommendations/for-cigarette/${cigaretteId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations for cigarette:', error);
      throw error;
    }
  },

  // Get same flavor recommendations
  getSameFlavorRecommendations: async (cigaretteId) => {
    try {
      const response = await api.get(`/cigarette-recommendations/same-flavor/${cigaretteId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching same flavor recommendations:', error);
      throw error;
    }
  },

  // Get same brand recommendations
  getSameBrandRecommendations: async (cigaretteId) => {
    try {
      const response = await api.get(`/cigarette-recommendations/same-brand/${cigaretteId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching same brand recommendations:', error);
      throw error;
    }
  },

  // Get comprehensive recommendations
  getComprehensiveRecommendations: async (cigaretteId) => {
    try {
      const response = await api.get(`/cigarette-recommendations/comprehensive/${cigaretteId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comprehensive recommendations:', error);
      throw error;
    }
  },

  // Get recommendations by smoking level
  getRecommendationsBySmokingLevel: async (smokingLevel) => {
    try {
      const response = await api.get(`/cigarette-recommendations/by-smoking-level/${smokingLevel}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations by smoking level:', error);
      throw error;
    }
  },

  // Get recommendations by preference
  getRecommendationsByPreference: async (flavor, nicotineLevel) => {
    try {
      const response = await api.get('/cigarette-recommendations/by-preference', {
        params: { flavor, nicotineLevel }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations by preference:', error);
      throw error;
    }
  },

  // Get recommendations based on current cigarette
  getRecommendationsBasedOnCurrent: async (cigaretteId) => {
    try {
      const response = await api.get(`/cigarette-recommendations/based-on-current/${cigaretteId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations based on current cigarette:', error);
      throw error;
    }
  },

  // Admin: Update recommendation priority
  updateRecommendationPriority: async (recId, priority) => {
    try {
      const response = await api.put(`/cigarette-recommendations/admin/${recId}/priority`, null, {
        params: { priority }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating recommendation priority:', error);
      throw error;
    }
  },

  // Admin: Toggle recommendation active status
  toggleRecommendationActive: async (recId) => {
    try {
      const response = await api.patch(`/cigarette-recommendations/admin/${recId}/toggle-active`);
      return response.data;
    } catch (error) {
      console.error('Error toggling recommendation active status:', error);
      throw error;
    }
  }
};

// Quit Progress API Services
export const quitProgressService = {
  // Update quit progress
  updateProgress: async (progressData) => {
    try {
      const response = await api.post('/quit-progress/update', {
        date: progressData.date,
        cigarettesSmoked: progressData.cigarettesSmoked,
        smokingFreeDays: progressData.smokingFreeDays,
        healthStatus: progressData.healthStatus,
        stageId: progressData.stageId
      });
      return response.data;
    } catch (error) {
      console.error('Error updating quit progress:', error);
      throw error;
    }
  }
};

// Helper functions for No Smoking theme
export const noSmokingHelpers = {
  // Generate motivational messages for no smoking
  getMotivationalMessage: (daysSmokeFree) => {
    if (daysSmokeFree === 0) return "🚭 Start your smoke-free journey today!";
    if (daysSmokeFree === 1) return "🎉 Congratulations! Your first smoke-free day!";
    if (daysSmokeFree < 7) return `💪 ${daysSmokeFree} days smoke-free! Keep going strong!`;
    if (daysSmokeFree < 30) return `🌟 Amazing! ${daysSmokeFree} days without smoking!`;
    if (daysSmokeFree < 90) return `🏆 Incredible! ${daysSmokeFree} days smoke-free! You're a champion!`;
    return `👑 Outstanding! ${daysSmokeFree} days smoke-free! You're an inspiration!`;
  },

  // Calculate health improvements based on smoke-free days
  getHealthImprovements: (daysSmokeFree) => {
    const improvements = [];
    
    if (daysSmokeFree >= 1) {
      improvements.push("🫁 Your oxygen levels are improving");
    }
    if (daysSmokeFree >= 3) {
      improvements.push("👃 Your sense of taste and smell are returning");
    }
    if (daysSmokeFree >= 7) {
      improvements.push("💨 Your breathing is getting easier");
    }
    if (daysSmokeFree >= 14) {
      improvements.push("❤️ Your circulation is improving");
    }
    if (daysSmokeFree >= 30) {
      improvements.push("🦷 Your teeth and gums are healthier");
    }
    if (daysSmokeFree >= 90) {
      improvements.push("🏃 Your lung function has significantly improved");
    }
    
    return improvements;
  },

  // Calculate money saved from not smoking
  calculateMoneySaved: (daysSmokeFree, cigarettesPerDay, pricePerCigarette) => {
    return daysSmokeFree * cigarettesPerDay * pricePerCigarette;
  },

  // Calculate cigarettes avoided
  calculateCigarettesAvoided: (daysSmokeFree, cigarettesPerDay) => {
    return daysSmokeFree * cigarettesPerDay;
  },

  // Get stage-based reduction plan for no smoking
  getNoSmokingStages: (initialCigarettesPerDay, durationInDays) => {
    const stages = [];
    const stageCount = Math.min(5, Math.floor(durationInDays / 7)); // Max 5 stages, 1 week each
    const daysPerStage = Math.floor(durationInDays / stageCount);
    
    for (let i = 0; i < stageCount; i++) {
      const reduction = Math.floor((initialCigarettesPerDay * (i + 1)) / stageCount);
      const targetCigs = Math.max(0, initialCigarettesPerDay - reduction);
      
      stages.push({
        stageNumber: i + 1,
        stageName: `Week ${i + 1}: Reduce to ${targetCigs} cigarettes/day`,
        targetCigarettesPerDay: targetCigs,
        duration: daysPerStage,
        tips: [
          "🚭 Replace smoking breaks with short walks",
          "💧 Drink water when you feel the urge to smoke",
          "🧘 Practice deep breathing exercises",
          "🍎 Keep healthy snacks nearby",
          "📱 Use a quit smoking app for motivation"
        ]
      });
    }
    
    return stages;
  }
};