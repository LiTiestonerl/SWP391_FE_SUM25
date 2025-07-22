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
  Badge,
  Progress
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
  SmileOutlined,
  NotificationOutlined,
  MedicineBoxOutlined,
  ThunderboltFilled,
  MessageOutlined,
  StarOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './NotificationList.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// Notification types configuration
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
  }
};

const HealthBenefitsPanel = () => (
  <Card className="health-benefits">
    <Title level={4} className="panel-title">
      <HeartOutlined /> Health Benefits Timeline
    </Title>
    <div className="benefit-item">
      <div className="benefit-marker" />
      <div className="benefit-content">
        <Text strong>24 hours:</Text>
        <Text type="secondary"> Carbon monoxide eliminated from your body</Text>
      </div>
    </div>
    <div className="benefit-item">
      <div className="benefit-marker" />
      <div className="benefit-content">
        <Text strong>2 weeks:</Text>
        <Text type="secondary"> Lung function improves up to 30%</Text>
      </div>
    </div>
    <div className="benefit-item">
      <div className="benefit-marker" />
      <div className="benefit-content">
        <Text strong>1 year:</Text>
        <Text type="secondary"> Risk of heart disease cut in half</Text>
      </div>
    </div>
    <div className="benefit-item">
      <div className="benefit-marker" />
      <div className="benefit-content">
        <Text strong>5 years:</Text>
        <Text type="secondary"> Stroke risk reduced to that of a non-smoker</Text>
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
  const [timer, setTimer] = useState(900); // 15 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);

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

  useEffect(() => {
    let interval;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  const startTimer = () => {
    setTimer(900);
    setTimerActive(true);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

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
            <div className="emergency-tip">
              <div className="emergency-tip-icon">1</div>
              <p>Drink a glass of cold water slowly</p>
            </div>
            <div className="emergency-tip">
              <div className="emergency-tip-icon">2</div>
              <p>Do 10 deep breaths (inhale 4s, hold 4s, exhale 6s)</p>
            </div>
            <div className="emergency-tip">
              <div className="emergency-tip-icon">3</div>
              <p>Chew sugar-free gum or eat a healthy snack</p>
            </div>
            <div className="emergency-tip">
              <div className="emergency-tip-icon">4</div>
              <p>Distract yourself for 15 minutes (craving will pass)</p>
            </div>
            <div className="emergency-timer">
              <Text strong>Distraction Timer: </Text>
              <Progress
                percent={(1 - timer / 900) * 100}
                showInfo={false}
                strokeColor="#e74c3c"
                className="timer-progress"
              />
              <Text>{timer > 0 ? formatTime(timer) : 'You did it! The craving has passed!'}</Text>
              <Button
                type="primary"
                onClick={startTimer}
                disabled={timerActive && timer > 0}
                className="start-timer-btn"
              >
                {timer > 0 ? 'Timer Running' : 'Start Timer'}
              </Button>
            </div>
            <Button
              type="default"
              onClick={() => {
                setShowEmergencyPopup(false);
                setTimerActive(false);
              }}
              className="close-popup-btn"
            >
              I Feel Better Now
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const notificationType = NOTIFICATION_TYPES[notification.notificationType];

  return (
    <div
      className={`notification-item ${notification.status === 'READ' ? 'read' : 'unread'}`}
      style={{ borderLeft: `3px solid ${notificationType.borderColor}` }}
    >
      <div className="notification-badge" style={{ background: notificationType.gradient }}>
        {notificationType.icon}
      </div>
      <div className="notification-content">
        <div className="notification-header">
          <Text strong className="notification-title">{notification.content.split('.')[0]}</Text>
          <Tag color={notificationType.color} style={{ fontWeight: 500, textTransform: 'capitalize' }}>
            {notification.notificationType.replace('_', ' ')}
          </Tag>
        </div>
        <Text className="notification-message" style={{ backgroundColor: `${notificationType.color}10` }}>
          {notification.content}
        </Text>
        <div className="notification-footer">
          <CalendarOutlined />
          <Text type="secondary">{new Date(notification.sendDate).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
          })}</Text>
          <div className="notification-actions">
            {notification.status !== 'READ' && (
              <Button
                type="text"
                icon={<CheckOutlined />}
                onClick={() => onMarkAsRead(notification.notificationId)}
                className="mark-read-button"
                title="Mark as read"
              />
            )}
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => onDelete(notification.notificationId)}
              className="delete-button"
              title="Delete notification"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationList = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('unread');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    // Simulate API call with sample data matching NotificationResponse schema
    setTimeout(() => {
      setNotifications([
        {
          notificationId: 1,
          notificationType: 'health',
          content: 'Your blood oxygen levels have normalized to healthy ranges.',
          sendDate: '2025-07-20T08:30:00.000Z',
          status: 'UNREAD',
          userId: 9007199254740991,
          quitPlanId: 1073741824,
          achievementBadgeId: null
        },
        {
          notificationId: 2,
          notificationType: 'motivation',
          content: 'Keep it up! You’re stronger than your cravings.',
          sendDate: '2025-07-19T15:45:00.000Z',
          status: 'UNREAD',
          userId: 9007199254740991,
          quitPlanId: 1073741824,
          achievementBadgeId: null
        },
        {
          notificationId: 3,
          notificationType: 'achievement',
          content: 'Congratulations! You’ve reached 7 days smoke-free and earned the "One Week Strong" badge!',
          sendDate: '2025-07-18T09:15:00.000Z',
          status: 'READ',
          userId: 9007199254740991,
          quitPlanId: 1073741824,
          achievementBadgeId: 1073741824
        },
        {
          notificationId: 4,
          notificationType: 'savings',
          content: 'You’ve saved $50 by not smoking this week!',
          sendDate: '2025-07-17T14:20:00.000Z',
          status: 'READ',
          userId: 9007199254740991,
          quitPlanId: 1073741824,
          achievementBadgeId: null
        },
        {
          notificationId: 5,
          notificationType: 'community',
          content: 'Join our weekly support group meeting this Friday at 7 PM.',
          sendDate: '2025-07-16T11:00:00.000Z',
          status: 'UNREAD',
          userId: 9007199254740991,
          quitPlanId: 1073741824,
          achievementBadgeId: null
        },
        {
          notificationId: 6,
          notificationType: 'coach_reply',
          content: 'Your coach replied: "Great progress! Try reducing to 5 cigarettes per day this week."',
          sendDate: '2025-07-15T10:30:00.000Z',
          status: 'UNREAD',
          userId: 9007199254740991,
          quitPlanId: 1073741824,
          achievementBadgeId: null
        },
        {
          notificationId: 7,
          notificationType: 'badge',
          content: 'You’ve earned the "First Step" badge for completing your first quit plan stage!',
          sendDate: '2025-07-14T16:00:00.000Z',
          status: 'READ',
          userId: 9007199254740991,
          quitPlanId: 1073741824,
          achievementBadgeId: 1073741825
        },
        {
          notificationId: 8,
          notificationType: 'health',
          content: 'Your lung function has improved by 20% since quitting.',
          sendDate: '2025-07-13T12:45:00.000Z',
          status: 'UNREAD',
          userId: 9007199254740991,
          quitPlanId: 1073741824,
          achievementBadgeId: null
        },
        {
          notificationId: 9,
          notificationType: 'savings',
          content: 'You’ve saved $120 this month by staying smoke-free!',
          sendDate: '2025-07-12T09:00:00.000Z',
          status: 'UNREAD',
          userId: 9007199254740991,
          quitPlanId: 1073741824,
          achievementBadgeId: null
        },
        {
          notificationId: 10,
          notificationType: 'community',
          content: 'New post in the community: "Tips for Handling Stress Without Smoking"',
          sendDate: '2025-07-11T17:30:00.000Z',
          status: 'UNREAD',
          userId: 9007199254740991,
          quitPlanId: 1073741824,
          achievementBadgeId: null
        },
        {
          notificationId: 11,
          notificationType: 'coach_reply',
          content: 'Your coach suggests: "Incorporate daily walks to reduce stress."',
          sendDate: '2025-07-10T14:00:00.000Z',
          status: 'READ',
          userId: 9007199254740991,
          quitPlanId: 1073741824,
          achievementBadgeId: null
        },
        {
          notificationId: 12,
          notificationType: 'badge',
          content: 'You’ve earned the "Two Weeks Smoke-Free" badge!',
          sendDate: '2025-07-09T08:00:00.000Z',
          status: 'UNREAD',
          userId: 9007199254740991,
          quitPlanId: 1073741824,
          achievementBadgeId: 1073741826
        }
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(noti =>
      noti.notificationId === id ? { ...noti, status: 'READ' } : noti
    ));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(noti => noti.notificationId !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(noti =>
      noti.status !== 'READ' ? { ...noti, status: 'READ' } : noti
    ));
  };

  const filteredNotifications = notifications.filter(noti => {
    const matchesTab = activeTab === 'unread' ? noti.status !== 'READ' : true;
    const matchesType = filterType === 'all' || noti.notificationType === filterType;
    return matchesTab && matchesType;
  });

  const unreadCount = notifications.filter(noti => noti.status !== 'READ').length;

  const groupedNotifications = filteredNotifications.reduce((acc, noti) => {
    const date = new Date(noti.sendDate).toLocaleDateString('en-US', { dateStyle: 'medium' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(noti);
    return acc;
  }, {});

  return (
    <div className="no-smoking-dashboard">
      <div className="global-header">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          className="back-button"
        />
        <div className="title-container">
          <Title level={2} className="main-title">
            <NotificationOutlined /> Notifications
          </Title>
          {unreadCount > 0 && (
            <Badge count={unreadCount} className="unread-badge" />
          )}
        </div>
      </div>

      <Row gutter={24} className="content-row">
        <Col xs={24} md={8} className="left-panel">
          <HealthBenefitsPanel />
          <MotivationPanel />
        </Col>

        <Col xs={24} md={16}>
          <div className="notification-main-container">
            <div className="notification-tabs-container">
              <Tabs activeKey={activeTab} onChange={setActiveTab} className="notification-tabs">
                <TabPane
                  tab={<span><Badge dot={unreadCount > 0}>Unread</Badge></span>}
                  key="unread"
                />
                <TabPane tab="All" key="all" />
              </Tabs>
              <div className="notification-controls">
                <Select
                  value={filterType}
                  onChange={setFilterType}
                  className="notification-filter"
                  placeholder="Filter by type"
                >
                  <Option value="all">All Types</Option>
                  {Object.keys(NOTIFICATION_TYPES).map(type => (
                    <Option key={type} value={type}>
                      {type.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Option>
                  ))}
                </Select>
                {activeTab === 'unread' && unreadCount > 0 && (
                  <Button
                    type="link"
                    onClick={handleMarkAllAsRead}
                    className="mark-all-button"
                    icon={<CheckOutlined />}
                  >
                    Mark All as Read
                  </Button>
                )}
              </div>
            </div>

            <div className="notification-content-container">
              <Spin spinning={loading} tip="Loading notifications...">
                {filteredNotifications.length === 0 ? (
                  <Empty
                    image={<SmileOutlined className="empty-icon" />}
                    description={
                      <Text type="secondary">
                        {activeTab === 'unread'
                          ? "You're all caught up! No unread notifications."
                          : "No notifications available"}
                      </Text>
                    }
                    className="empty-notifications"
                  />
                ) : (
                  <div className="notification-list">
                    {Object.entries(groupedNotifications).map(([date, notis]) => (
                      <div key={date} className="notification-group">
                        <div className="notification-group-header">
                          <Text strong>{date}</Text>
                        </div>
                        {notis.map(notification => (
                          <Card key={notification.notificationId} className="notification-card" hoverable>
                            <NotificationItem
                              notification={notification}
                              onMarkAsRead={handleMarkAsRead}
                              onDelete={handleDelete}
                            />
                          </Card>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </Spin>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default NotificationList;