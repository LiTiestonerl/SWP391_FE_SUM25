import React from 'react';
import { Badge, Popover, List, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FiBell } from 'react-icons/fi'; // 👉 Icon chuông
import './notifications.css';

const NotificationBell = ({ notifications = [], isDarkMode }) => {
  const navigate = useNavigate();

  const sortedNotifications = [...notifications]
    .sort((a, b) => new Date(b.sendDate) - new Date(a.sendDate))
    .slice(0, 5);

  const count = notifications.length;
  const displayCount = count > 5 ? '5+' : count;

  const popoverContent = (
    <div className="notification-popover">
      <div className="notification-header">
        <h3>NOTIFICATIONS</h3>
        <span>{new Date().toLocaleTimeString()}</span>
      </div>

      {sortedNotifications.length > 0 ? (
        <List
          size="small"
          dataSource={sortedNotifications}
          renderItem={(item) => (
            <List.Item className="notification-item">
              <div className="notification-item-content">
                <div className="notification-title">
                  {item.notificationType?.replace(/_/g, ' ') || 'Notification'}
                </div>
                <div>{item.content}</div>
              </div>
              <span className="notification-item-time">
                {new Date(item.sendDate).toLocaleTimeString()}
              </span>
            </List.Item>
          )}
        />
      ) : (
        <p className="notification-empty">No new notifications.</p>
      )}

      <div className="notification-footer">
        <Button
          size="small"
          className="notification-view-all-button"
          onClick={() => navigate('/notifications')}
        >
          VIEW ALL
        </Button>
      </div>
    </div>
  );

  return (
    <Popover content={popoverContent} trigger="click" placement="bottomRight">
      <Badge count={displayCount} size="small" offset={[-5, 5]} style={{ backgroundColor: '#ff4d4f' }}>
        <div
          style={{
            fontSize: '18px',
            color: isDarkMode ? '#ecf0f1' : '#2c3e50',
            cursor: 'pointer',
            padding: '4px 8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FiBell size={20} />
        </div>
      </Badge>
    </Popover>
  );
};

export default NotificationBell;
