import React from 'react';
import NotificationList from '../../components/notifications/NotificationList'; 
import NotificationBell from '../../components/notifications/notificationBell'; 


function NotificationsPage() {
  return (
    <div className="notifications-page">
      <NotificationList />
    </div>
  );
}

export default NotificationsPage;