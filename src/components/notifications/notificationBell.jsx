import React from 'react';
import { Badge, Popover, List, Button } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './notifications.css';

const NotificationBell = ({ notifications = [], isDarkMode }) => {
  const navigate = useNavigate();
  const count = notifications.length;
  const displayCount = count > 5 ? '5+' : count;

  const popoverContent = (
    <div className="notification-popover">
      <div className="notification-header">
        <h3>NOTIFICATIONS</h3>
        <span>{new Date().toLocaleTimeString()}</span>
      </div>
      {notifications.length > 0 ? (
        <List
          size="small"
          dataSource={notifications.slice(0, 5)}
          renderItem={(item) => (
            <List.Item className="notification-item">
              <div className="notification-icon">{item.icon}</div>
              <div className="notification-item-content">
                <div className="notification-title">{item.title}</div>
                <div>{item.content}</div>
              </div>
              <span className="notification-item-time">
                {new Date(item.date).toLocaleTimeString()}
              </span>
            </List.Item>
          )}
        />
      ) : (
        <p className="notification-empty">No new health updates. Stay strong!</p>
      )}
      <div className="notification-footer">
        <Button
          size="small"
          className="notification-view-all-button"
          onClick={() => navigate('/notifications')}
        >
          VIEW ALL PROGRESS
        </Button>
      </div>
    </div>
  );

  return (
    <Popover content={popoverContent} trigger="click" placement="bottomRight">
      <Badge
        count={displayCount}
        size="small"
        offset={[-5, 5]}
        style={{ backgroundColor: '#ff4d4f' }}
      >
        <BellOutlined
          style={{
            fontSize: '22px',
            color: isDarkMode ? '#ecf0f1' : '#2c3e50',
            cursor: 'pointer',
            transition: 'color 0.3s',
          }}
        />
      </Badge>
    </Popover>
  );
};

export default NotificationBell;