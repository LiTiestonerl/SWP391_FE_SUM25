/**
 * 🖼️ Lấy emoji phù hợp với loại thông báo
 */
export const getNotificationIcon = (type) => {
  switch (type?.toUpperCase()) {
    case 'ACHIEVEMENT': return '🏆';
    case 'COACH_MESSAGE': return '💬';
    case 'SAVINGS': return '💰';
    case 'REMINDER': return '⏰';
    case 'ARTICLE': return '📰';
    case 'HEALTH_UPDATE': return '❤️';
    case 'SYSTEM': return '🔔';
    default: return '🔔';
  }
};

/**
 * 🏷️ Lấy tiêu đề phù hợp với loại thông báo
 */
export const getNotificationTitle = (type, content) => {
  switch (type?.toUpperCase()) {
    case 'ACHIEVEMENT': return 'New Achievement!';
    case 'COACH_MESSAGE': return 'Message from Coach';
    case 'SAVINGS': return 'Savings Update';
    case 'REMINDER': return 'Reminder';
    case 'ARTICLE': return 'New Article';
    case 'HEALTH_UPDATE': return 'Health Update';
    case 'SYSTEM': return 'System Notification';
    default: return content?.slice(0, 30) + (content?.length > 30 ? '...' : '');
  }
};
