import React from 'react';
import NotificationList from '../../components/notifications/NotificationList'; 
import './notification.css';

function NotificationsPage() {
  return (
    <div className="notifications-page">
      <NotificationList />
    </div>
  );
}

export default NotificationsPage;