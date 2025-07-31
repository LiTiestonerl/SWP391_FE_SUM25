import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Tabs,
  Spin,
  Empty,
  Tag,
  Row,
  Col,
  Button,
  Select,
  Badge
} from 'antd';
import {
  CheckOutlined,
  ArrowLeftOutlined,
  HeartOutlined,
  FireOutlined,
  TrophyOutlined,
  DollarOutlined,
  TeamOutlined,
  CalendarOutlined,
  NotificationOutlined,
  MedicineBoxOutlined,
  ThunderboltFilled,
  MessageOutlined,
  StarOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './NotificationList.css';
import {
  fetchUserNotifications,
  markNotificationAsRead,
  deleteNotification
} from "../../services/notificationService";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const NOTIFICATION_TYPES = {
  health: {
    color: '#27ae60',
    icon: <MedicineBoxOutlined style={{ color: '#ffffff' }} />,
    gradient: 'linear-gradient(135deg, #27ae60, #2ecc71)',
    borderColor: '#27ae60'
  },
  motivation: {
    color: '#00bcd4',
    icon: <FireOutlined style={{ color: '#ffffff' }} />,
    gradient: 'linear-gradient(135deg, #00bcd4, #16a085)',
    borderColor: '#00bcd4'
  },
  achievement: {
    color: '#f1c40f',
    icon: <TrophyOutlined style={{ color: '#ffffff' }} />,
    gradient: 'linear-gradient(135deg, #f1c40f, #f39c12)',
    borderColor: '#f1c40f'
  },
  savings: {
    color: '#3498db',
    icon: <DollarOutlined style={{ color: '#ffffff' }} />,
    gradient: 'linear-gradient(135deg, #3498db, #2980b9)',
    borderColor: '#3498db'
  },
  community: {
    color: '#9b59b6',
    icon: <TeamOutlined style={{ color: '#ffffff' }} />,
    gradient: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
    borderColor: '#9b59b6'
  },
  coach_reply: {
    color: '#e67e22',
    icon: <MessageOutlined style={{ color: '#ffffff' }} />,
    gradient: 'linear-gradient(135deg, #e67e22, #d35400)',
    borderColor: '#e67e22'
  },
  badge: {
    color: '#d4af37',
    icon: <StarOutlined style={{ color: '#ffffff' }} />,
    gradient: 'linear-gradient(135deg, #d4af37, #b8860b)',
    borderColor: '#d4af37'
  },
  system: {
    color: '#2c3e50',
    icon: <NotificationOutlined style={{ color: '#ffffff' }} />,
    gradient: 'linear-gradient(135deg, #34495e, #2c3e50)',
    borderColor: '#2c3e50'
  }

};

// ------------------- Panel phụ -------------------

const HealthBenefitsPanel = () => (
  <Card className="health-benefits">
    <Title level={4} className="panel-title">
      <HeartOutlined /> Health Benefits Timeline
    </Title>
    <div className="benefit-item">
      <div className="benefit-marker" />
      <div className="benefit-content">
        <Text strong>24 hours:</Text> <Text type="secondary">Carbon monoxide eliminated from your body</Text>
      </div>
    </div>
    <div className="benefit-item">
      <div className="benefit-marker" />
      <div className="benefit-content">
        <Text strong>2 weeks:</Text> <Text type="secondary">Lung function improves up to 30%</Text>
      </div>
    </div>
    <div className="benefit-item">
      <div className="benefit-marker" />
      <div className="benefit-content">
        <Text strong>1 year:</Text> <Text type="secondary">Risk of heart disease cut in half</Text>
      </div>
    </div>
    <div className="benefit-item">
      <div className="benefit-marker" />
      <div className="benefit-content">
        <Text strong>5 years:</Text> <Text type="secondary">Stroke risk reduced to that of a non-smoker</Text>
      </div>
    </div>
  </Card>
);

const MotivationPanel = () => {
  const [motivationQuote, setMotivationQuote] = useState({
    text: '"Every cigarette not smoked is a victory!"',
    author: 'Anonymous'
  });
  const [showEmergencyPopup, setShowEmergencyPopup] = useState(false);

  const quotes = [
    { text: '"The secret of getting ahead is getting started."', author: 'Mark Twain' },
    { text: '"You don\'t have to be perfect to be amazing."', author: 'Unknown' },
    { text: '"Every day is a new opportunity to change your life."', author: 'Unknown' },
    { text: '"You are stronger than your cravings."', author: 'Unknown' }
  ];

  useEffect(() => {
    const today = new Date().getDate();
    setMotivationQuote(quotes[today % quotes.length]);
  }, []);

  return (
    <Card className="motivation-panel">
      <Title level={4} className="panel-title">
        <FireOutlined /> Daily Motivation
      </Title>
      <div className="motivation-quote">
        <Text className="motivation-text">{motivationQuote.text}</Text>
        <Text className="motivation-author">— {motivationQuote.author}</Text>
      </div>
      <div className="motivation-facts">
        <div className="motivation-fact">
          <CheckOutlined />
          <Text>Your lung capacity has increased significantly</Text>
        </div>
        <div className="motivation-fact">
          <CheckOutlined />
          <Text>Your risk of heart disease is decreasing</Text>
        </div>
        <div className="motivation-fact">
          <CheckOutlined />
          <Text>Your sense of taste and smell has improved</Text>
        </div>
      </div>
      <Button
        type="primary"
        danger
        block
        icon={<ThunderboltFilled />}
        className="emergency-button"
        onClick={() => setShowEmergencyPopup(true)}
      >
        Emergency Craving Help
      </Button>
      {showEmergencyPopup && (
        <div className="emergency-popup-overlay">
          <div className="emergency-popup-content">
            <h3><ThunderboltFilled /> Emergency Craving Help</h3>
            <div className="emergency-tip"><div className="emergency-tip-icon">1</div><p>Drink a glass of cold water slowly</p></div>
            <div className="emergency-tip"><div className="emergency-tip-icon">2</div><p>Do 10 deep breaths (inhale 4s, hold 4s, exhale 6s)</p></div>
            <div className="emergency-tip"><div className="emergency-tip-icon">3</div><p>Chew sugar-free gum or eat a healthy snack</p></div>
            <div className="emergency-tip"><div className="emergency-tip-icon">4</div><p>Distract yourself for 15 minutes (craving will pass)</p></div>
            <Button
              type="default"
              onClick={() => setShowEmergencyPopup(false)}
              style={{ marginTop: 16 }}
            >
              I Feel Better Now
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

// ------------------- Item thông báo -------------------

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const rawType = notification.notificationType?.toLowerCase();
  const type = NOTIFICATION_TYPES[rawType] || {
    color: '#888',
    icon: <NotificationOutlined style={{ color: '#ffffff' }} />,
    gradient: 'linear-gradient(135deg, #bdc3c7, #2c3e50)',
    borderColor: '#888'
  };

  return (
    <div className={`notification-item ${notification.status === 'READ' ? 'read' : 'unread'}`}
      style={{ borderLeft: `3px solid ${type.borderColor}` }}>
      <div className="notification-badge" style={{ background: type.gradient }}>
        {type.icon}
      </div>
      <div className="notification-content">
        <div className="notification-header">
          <Text strong>{notification.content.split('.')[0]}</Text>
          <Tag color={type.color}>{notification.notificationType?.replace(/_/g, ' ')}</Tag>
        </div>
        <Text className="notification-message" style={{ backgroundColor: `${type.color}10` }}>
          {notification.content}
        </Text>
        <div className="notification-footer">
          <CalendarOutlined />
          <Text type="secondary">{new Date(notification.sendDate).toLocaleString()}</Text>
          <div className="notification-actions">
            {notification.status !== 'READ' && (
              <Button type="text" icon={<CheckOutlined />} onClick={() => onMarkAsRead(notification.notificationId)} />
            )}
            <Button type="text" icon={<CloseOutlined />} onClick={() => onDelete(notification.notificationId)} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ------------------- Trang chính -------------------

const NotificationList = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('unread');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      const data = await fetchUserNotifications();

      // Sắp xếp thông báo mới nhất lên đầu
      const sortedData = data.sort((a, b) => {
        return new Date(b.sendDate) - new Date(a.sendDate);
      });

      setNotifications(sortedData);
      setLoading(false);
    };
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    await markNotificationAsRead(id);
    setNotifications(prev => prev.map(noti => noti.notificationId === id ? { ...noti, status: 'READ' } : noti));
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
    setNotifications(prev => prev.filter(noti => noti.notificationId !== id));
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter(noti => noti.status !== 'READ').map(n => n.notificationId);
    await Promise.all(unreadIds.map(id => markNotificationAsRead(id)));
    setNotifications(prev => prev.map(noti => ({ ...noti, status: 'READ' })));
  };

  const filtered = notifications.filter(noti => {
    const matchTab = activeTab === 'unread' ? noti.status !== 'READ' : true;
    const matchType = filterType === 'all' || noti.notificationType === filterType;
    return matchTab && matchType;
  });

  const unreadCount = notifications.filter(noti => noti.status !== 'READ').length;

  const grouped = filtered
    .sort((a, b) => new Date(b.sendDate) - new Date(a.sendDate))
    .reduce((acc, noti) => {
      const date = new Date(noti.sendDate).toLocaleDateString();
      acc[date] = acc[date] || [];
      acc[date].push(noti);
      return acc;
    }, {});

  return (
    <div className="no-smoking-dashboard">
      <div className="global-header">
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/')} />
        <div className="title-container">
          <Title level={2}><NotificationOutlined /> Notifications</Title>
          {unreadCount > 0 && <Badge count={unreadCount} />}
        </div>
      </div>

      <Row gutter={24}>
        <Col xs={24} md={8}>
          <HealthBenefitsPanel />
          <MotivationPanel />
        </Col>

        <Col xs={24} md={16}>
          <div className="notification-tabs-container">
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab={<Badge dot={unreadCount > 0}>Unread</Badge>} key="unread" />
              <TabPane tab="All" key="all" />
            </Tabs>
            <div className="notification-controls">
              <Select value={filterType} onChange={setFilterType}>
                <Option value="all">All Types</Option>
                {Object.keys(NOTIFICATION_TYPES).map(type => (
                  <Option key={type} value={type}>{type.replace('_', ' ')}</Option>
                ))}
              </Select>
              {activeTab === 'unread' && unreadCount > 0 && (
                <Button type="link" onClick={handleMarkAllAsRead} icon={<CheckOutlined />}>
                  Mark All as Read
                </Button>
              )}
            </div>
          </div>

          <div className="notification-content-container">
            <Spin spinning={loading}>
              {filtered.length === 0 ? (
                <Empty description={<Text type="secondary">No notifications</Text>} />
              ) : (
                Object.entries(grouped).map(([date, group]) => (
                  <div key={date}>
                    <Text strong>{date}</Text>
                    {group.map(noti => (
                      <Card key={noti.notificationId}>
                        <NotificationItem
                          notification={noti}
                          onMarkAsRead={handleMarkAsRead}
                          onDelete={handleDelete}
                        />
                      </Card>
                    ))}
                  </div>
                ))
              )}
            </Spin>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default NotificationList;