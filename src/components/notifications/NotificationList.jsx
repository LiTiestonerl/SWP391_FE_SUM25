import React, { useState, useEffect } from 'react';
import { Badge, List, Tabs, Button, Spin, message } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const NotificationList = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('unread');

  useEffect(() => {
    const testNotifications = [
      { id: 1, type: 'motivation', title: 'User A vừa tham gia Premium!', content: "User A vừa tham gia Premium!", isRead: false, date: "2025-06-10T10:30:00Z" },
      { id: 2, type: 'achievement', title: '3 ngày không hút thuốc', content: "Bạn đã hoàn thành 3 ngày không hút thuốc!", isRead: false, date: "2025-06-09T15:45:00Z" },
      { id: 3, type: 'reminder', title: 'Phản hồi từ Coach John', content: "Coach John đã phản hồi cho bạn.", isRead: true, date: "2025-06-08T08:20:00Z" },
    ];
    setTimeout(() => {
      setNotifications(testNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(noti => noti.id === id ? { ...noti, isRead: true } : noti));
    message.success('Đã đánh dấu đã đọc');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(noti => ({ ...noti, isRead: true })));
    message.success('Đã đọc tất cả');
  };

  const filteredNotifications = notifications.filter(noti => activeTab === 'unread' ? !noti.isRead : true);

  return (
    <div className="notifications-container">
      <h1 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '20px', fontSize: '32px' }}>
        <BellOutlined /> Thông báo
      </h1>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <Button icon={<CheckOutlined />} onClick={handleMarkAllAsRead} disabled={notifications.every(noti => noti.isRead)} style={{ marginRight: '10px' }}>
          Đánh dấu tất cả đã đọc
        </Button>
        <Button type="primary" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </div>
      <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
        <Tabs.TabPane tab={<Badge count={notifications.filter(noti => !noti.isRead).length}><span>Chưa đọc</span></Badge>} key="unread" />
        <Tabs.TabPane tab="Tất cả" key="all" />
      </Tabs>
      <Spin spinning={loading}>
        <List
          itemLayout="horizontal"
          dataSource={filteredNotifications}
          renderItem={notification => (
            <List.Item style={{ padding: '15px', borderBottom: '1px solid #e0e0e0' }}>
              <List.Item.Meta
                title={<span style={{ color: '#2c3e50', fontWeight: '600' }}>{notification.title}</span>}
                description={<span style={{ color: '#7f8c8d' }}>{notification.content} - {new Date(notification.date).toLocaleString()}</span>}
              />
              {!notification.isRead && <Button type="link" onClick={() => handleMarkAsRead(notification.id)}>Đánh dấu đã đọc</Button>}
            </List.Item>
          )}
          locale={{ emptyText: 'Không có thông báo nào' }}
        />
      </Spin>
    </div>
  );
};

export default NotificationList;