// src/utils/notificationData.js
export const sampleNotifications = [
  {
    notificationId: 1,
    content: "You've completed your first smoke-free week! Keep it up!",
    notificationType: "ACHIEVEMENT",
    sendDate: "2025-07-19T09:15:00Z",
    status: "UNREAD",
    userId: 1,
    quitPlanId: null,
    achievementBadgeId: 101
  },
  {
    notificationId: 2,
    content: "Your coach has sent you a new message about your quit plan",
    notificationType: "COACH_MESSAGE",
    sendDate: "2025-07-18T14:30:00Z",
    status: "READ",
    userId: 1,
    quitPlanId: 123,
    achievementBadgeId: null
  },
  {
    notificationId: 3,
    content: "You've saved $50 this month by not smoking!",
    notificationType: "SAVINGS",
    sendDate: "2025-07-17T11:45:00Z",
    status: "UNREAD",
    userId: 1,
    quitPlanId: null,
    achievementBadgeId: null
  },
  {
    notificationId: 4,
    content: "Time to check in with your daily progress",
    notificationType: "REMINDER",
    sendDate: "2025-07-19T08:00:00Z",
    status: "UNREAD",
    userId: 1,
    quitPlanId: 123,
    achievementBadgeId: null
  },
  {
    notificationId: 5,
    content: "New motivational article available: '5 Tips to Resist Cravings'",
    notificationType: "ARTICLE",
    sendDate: "2025-07-16T16:20:00Z",
    status: "READ",
    userId: 1,
    quitPlanId: null,
    achievementBadgeId: null
  }
];