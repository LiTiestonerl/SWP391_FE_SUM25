import React, { useState, useEffect } from 'react';
import {
  Badge,
  Button,
  Card,
  Typography,
  Tabs,
  Spin,
  Empty,
  Tag,
  Row,
  Col,
  Statistic,
  Avatar,
  Divider,
  Popover,
  Skeleton,
  Progress
} from 'antd';
import {
  CheckOutlined,
  ArrowLeftOutlined,
  TrophyOutlined,
  HeartOutlined,
  DollarOutlined,
  FireOutlined,
  TeamOutlined,
  BulbOutlined,
  CalendarOutlined,
  SmileOutlined,
  ArrowUpOutlined,
  MessageOutlined,
  NotificationOutlined,
  LikeOutlined,
  ShareAltOutlined,
  CommentOutlined,
  StarFilled,
  ThunderboltFilled,
  CrownFilled,
  MedicineBoxOutlined,
  WalletOutlined,
  FireFilled
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Enhanced Color Palette
const COLORS = {
  primary: '#00a65a',       // Fresh green
  secondary: '#00bcd4',     // Teal
  accent: '#ff6b6b',        // Coral
  background: '#f5fbf5',    // Very light green
  card: '#ffffff',          // White
  textDark: '#2c3e50',      // Dark blue-gray
  textLight: '#7f8c8d',     // Gray
  success: '#27ae60',       // Green
  warning: '#f39c12',       // Orange
  danger: '#e74c3c',        // Red
  info: '#3498db',          // Blue
  purple: '#9b59b6',        // Purple
  gold: '#f1c40f'           // Gold
};

// Enhanced Notification types with colors
const NOTIFICATION_TYPES = {
  achievement: {
    color: COLORS.gold,
    icon: <CrownFilled />,
    gradient: 'linear-gradient(135deg, #f1c40f, #f39c12)'
  },
  health: {
    color: COLORS.success,
    icon: <MedicineBoxOutlined />,
    gradient: 'linear-gradient(135deg, #27ae60, #2ecc71)'
  },
  savings: {
    color: COLORS.info,
    icon: <WalletOutlined />,
    gradient: 'linear-gradient(135deg, #3498db, #2980b9)'
  },
  motivation: {
    color: COLORS.primary,
    icon: <FireFilled />,
    gradient: 'linear-gradient(135deg, #00a65a, #16a085)'
  },
  community: {
    color: COLORS.purple,
    icon: <TeamOutlined />,
    gradient: 'linear-gradient(135deg, #9b59b6, #8e44ad)'
  }
};

// Enhanced Health data calculations
const HealthStatsPanel = ({ daysSmokeFree }) => {
  const healthImprovement = Math.min(daysSmokeFree * 3.5, 100).toFixed(1);
  const cigarettesAvoided = daysSmokeFree * 10;
  const moneySaved = (daysSmokeFree * 50000).toLocaleString();

  // Milestones
  const milestones = [7, 14, 30, 60, 90];
  const reachedMilestones = milestones.filter(m => daysSmokeFree >= m);
  const nextMilestone = milestones.find(m => daysSmokeFree < m) || 100;
  const progressPercent = (daysSmokeFree / nextMilestone) * 100;

  return (
    <Card className="health-stats-panel">
      <div className="stats-header">
        <Title level={4} className="stats-title">
          <FireOutlined style={{ color: COLORS.danger }} /> {daysSmokeFree} Days Smoke-Free
        </Title>
        <Tag color={COLORS.success} className="health-percent">
          {healthImprovement}% Healthier
        </Tag>
      </div>

      <Progress 
        percent={progressPercent} 
        strokeColor={COLORS.primary}
        trailColor="#f0f0f0"
        showInfo={false}
        className="milestone-progress"
      />
      <Text type="secondary" className="next-milestone">
        Next milestone: {nextMilestone} days ({nextMilestone - daysSmokeFree} days to go)
      </Text>

      <Row gutter={16} className="stats-row">
        <Col span={12}>
          <Statistic
            title="Cigarettes Avoided"
            value={cigarettesAvoided}
            prefix={<FireOutlined style={{ color: COLORS.danger }} />}
            valueStyle={{ color: COLORS.danger, fontSize: 24 }}
            className="health-statistic"
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Money Saved"
            value={moneySaved}
            prefix={<DollarOutlined style={{ color: COLORS.success }} />}
            valueStyle={{ color: COLORS.success, fontSize: 24 }}
            suffix="VND"
            className="health-statistic"
          />
        </Col>
      </Row>

      <Divider dashed />
      
      <div className="milestones-container">
        <Text strong style={{ marginBottom: 8, display: 'block' }}>Achieved Milestones:</Text>
        {reachedMilestones.length > 0 ? (
          reachedMilestones.map(day => (
            <Tag
              key={day}
              icon={<StarFilled />}
              color="gold"
              className="milestone-tag"
            >
              {day} days
            </Tag>
          ))
        ) : (
          <Text type="secondary">No milestones reached yet. Keep going!</Text>
        )}
      </div>

      <div className="daily-tip">
        <BulbOutlined className="tip-icon" />
        <div>
          <Text strong style={{ display: 'block' }}>Today's Tip</Text>
          <Text>Drink a glass of water when cravings hit to help reduce the urge to smoke.</Text>
        </div>
      </div>
    </Card>
  );
};

const HealthBenefitsPanel = () => (
  <Card className="health-benefits">
    <Title level={4} className="panel-title">
      <HeartOutlined style={{ color: COLORS.success }} /> Health Benefits Timeline
    </Title>
    <div className="benefit-item">
      <div className="benefit-marker" style={{ backgroundColor: COLORS.success }} />
      <div className="benefit-content">
        <Text strong>24 hours</Text>
        <Text type="secondary">Carbon monoxide eliminated from your body</Text>
      </div>
    </div>
    <div className="benefit-item">
      <div className="benefit-marker" style={{ backgroundColor: COLORS.success }} />
      <div className="benefit-content">
        <Text strong>2 weeks</Text>
        <Text type="secondary">Lung function improves up to 30%</Text>
      </div>
    </div>
    <div className="benefit-item">
      <div className="benefit-marker" style={{ backgroundColor: COLORS.success }} />
      <div className="benefit-content">
        <Text strong>1 year</Text>
        <Text type="secondary">Risk of heart disease cut in half</Text>
      </div>
    </div>
    <div className="benefit-item">
      <div className="benefit-marker" style={{ backgroundColor: COLORS.success }} />
      <div className="benefit-content">
        <Text strong>5 years</Text>
        <Text type="secondary">Stroke risk reduced to that of a non-smoker</Text>
      </div>
    </div>
  </Card>
);

const CommunityPanel = () => {
  const [communityPosts, setCommunityPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setCommunityPosts([
        {
          id: 1,
          user: 'John D.',
          avatarColor: '#1890ff',
          content: 'Just passed 1 month smoke-free! The cravings are much less intense now. For those just starting - it gets easier!',
          likes: 24,
          comments: 5,
          time: '2 hours ago'
        },
        {
          id: 2,
          user: 'Sarah M.',
          avatarColor: '#00a65a',
          content: 'The mobile app really helped me track my progress and stay motivated during the first difficult weeks. Highly recommend using the craving timer feature!',
          likes: 18,
          comments: 3,
          time: '5 hours ago'
        },
        {
          id: 3,
          user: 'Michael T.',
          avatarColor: '#9b59b6',
          content: 'Celebrating 6 months today! Saved over $3,000 and can finally run without getting winded. Best decision ever!',
          likes: 42,
          comments: 8,
          time: '1 day ago'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLike = (id) => {
    setCommunityPosts(posts =>
      posts.map(post =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  return (
    <Card className="community-panel">
      <Title level={4} className="panel-title">
        <TeamOutlined style={{ color: COLORS.purple }} /> Community Feed
      </Title>

      {loading ? (
        <>
          <Skeleton active avatar paragraph={{ rows: 2 }} />
          <Skeleton active avatar paragraph={{ rows: 2 }} />
        </>
      ) : (
        <div className="community-feed">
          {communityPosts.map(post => (
            <div key={post.id} className="community-post">
              <div className="post-header">
                <Avatar
                  size="default"
                  style={{
                    backgroundColor: post.avatarColor,
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  {post.user.charAt(0)}
                </Avatar>
                <div className="post-user">
                  <Text strong>{post.user}</Text>
                  <Text type="secondary" className="post-time">{post.time}</Text>
                </div>
              </div>
              <Text className="post-content">{post.content}</Text>
              <div className="post-actions">
                <Button
                  type="text"
                  icon={<LikeOutlined />}
                  onClick={() => handleLike(post.id)}
                  className="post-action-btn"
                >
                  {post.likes}
                </Button>
                <Button 
                  type="text" 
                  icon={<CommentOutlined />} 
                  className="post-action-btn"
                >
                  {post.comments}
                </Button>
                <Button 
                  type="text" 
                  icon={<ShareAltOutlined />} 
                  className="post-action-btn"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <Button 
        type="primary" 
        block 
        className="join-button"
        style={{ background: COLORS.purple, borderColor: COLORS.purple }}
      >
        Join Support Group
      </Button>
    </Card>
  );
};

const MotivationPanel = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showEmergencyPopup, setShowEmergencyPopup] = useState(false);
  const [motivationQuote, setMotivationQuote] = useState({
    text: '"Every cigarette not smoked is a victory!"',
    author: 'Anonymous'
  });

  const quotes = [
    {
      text: '"The secret of getting ahead is getting started."',
      author: 'Mark Twain'
    },
    {
      text: '"You don\'t have to be perfect to be amazing."',
      author: 'Unknown'
    },
    {
      text: '"Every day is a new opportunity to change your life."',
      author: 'Unknown'
    },
    {
      text: '"You are stronger than your cravings."',
      author: 'Unknown'
    }
  ];

  useEffect(() => {
    const milestones = [7, 14, 21, 30, 60, 90];
    const daysSmokeFree = 32;
    if (milestones.includes(daysSmokeFree)) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }

    // Change quote daily
    const today = new Date().getDate();
    setMotivationQuote(quotes[today % quotes.length]);
  }, []);

  return (
    <Card className="motivation-panel">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      <Title level={4} className="panel-title">
        <FireFilled style={{ color: COLORS.warning }} /> Daily Motivation
      </Title>
      
      <div className="motivation-quote">
        <Text className="motivation-text">{motivationQuote.text}</Text>
        <Text className="motivation-author">— {motivationQuote.author}</Text>
      </div>

      <Divider />
      
      <div className="motivation-facts">
        <div className="motivation-fact">
          <CheckOutlined style={{ color: COLORS.success }} />
          <Text>Your lung capacity has increased by 15%</Text>
        </div>
        <div className="motivation-fact">
          <CheckOutlined style={{ color: COLORS.success }} />
          <Text>Your risk of heart disease is decreasing</Text>
        </div>
        <div className="motivation-fact">
          <CheckOutlined style={{ color: COLORS.success }} />
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

      {/* Emergency Popup */}
      {showEmergencyPopup && (
        <div className="emergency-popup-overlay">
          <div className="emergency-popup-content">
            <h3><ThunderboltFilled style={{ color: COLORS.danger }} /> Emergency Craving Help</h3>
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
            <Button 
              type="default" 
              onClick={() => setShowEmergencyPopup(false)}
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

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const notificationType = NOTIFICATION_TYPES[notification.type];

  return (
    <div className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}>
      <div 
        className="notification-badge" 
        style={{ background: notificationType.gradient }}
      >
        {notificationType.icon}
      </div>
      <div className="notification-content">
        <div className="notification-header">
          <Text strong className="notification-title">
            {notification.title}
          </Text>
          <Tag 
            color={notificationType.color}
            style={{ 
              fontWeight: 500,
              textTransform: 'capitalize'
            }}
          >
            {notification.type}
          </Tag>
        </div>
        <Text className="notification-message">{notification.content}</Text>
        <div className="notification-footer">
          <CalendarOutlined style={{ color: COLORS.textLight }} />
          <Text type="secondary">{notification.date} • {notification.time}</Text>
          <div className="notification-actions">
            {!notification.isRead && (
              <Button
                type="text"
                icon={<CheckOutlined />}
                onClick={() => onMarkAsRead(notification.id)}
                className="mark-read-button"
                title="Mark as read"
              />
            )}
            <Button 
              type="text" 
              icon={<LikeOutlined />} 
              className="action-button"
              title="Like"
            />
            <Button 
              type="text" 
              icon={<CommentOutlined />} 
              className="action-button"
              title="Comment"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationCenter = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('unread');
  const [daysSmokeFree] = useState(32);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setNotifications([
        {
          id: 1,
          type: 'achievement',
          title: '7 Days Smoke-Free Milestone Reached!',
          content: "Congratulations! Your lung function has improved by 15% compared to when you started. Keep up the great work!",
          isRead: false,
          time: "10:30 AM",
          date: "Today",
        },
        {
          id: 2,
          type: 'health',
          title: 'Health Improvement Detected',
          content: "Medical reports indicate your blood oxygen levels have normalized to healthy ranges.",
          isRead: false,
          time: "Yesterday",
          date: "Jun 14",
        },
        {
          id: 3,
          type: 'savings',
          title: 'Significant Savings Achieved',
          content: "You've saved approximately ₫1,750,000 this month by not purchasing cigarettes.",
          isRead: true,
          time: "9:15 AM",
          date: "Jun 13",
        },
        {
          id: 4,
          type: 'motivation',
          title: 'Weekly Motivation',
          content: "Remember why you started this journey. You're stronger than your cravings!",
          isRead: true,
          time: "3:45 PM",
          date: "Jun 12",
        },
        {
          id: 5,
          type: 'community',
          title: 'New Support Group Available',
          content: "A new support group has started in your area. Meet others on the same journey every Thursday at 6PM.",
          isRead: false,
          time: "11:20 AM",
          date: "Jun 11",
        },
        {
          id: 6,
          type: 'achievement',
          title: '30 Days Smoke-Free!',
          content: "Amazing achievement! Your risk of heart disease has decreased significantly.",
          isRead: true,
          time: "8:00 AM",
          date: "Jun 5",
        }
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  const handleMarkAsRead = (id) => {
    const updatedNotifications = notifications.map(noti =>
      noti.id === id ? { ...noti, isRead: true } : noti
    );
    setNotifications(updatedNotifications);
  };

  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map(noti =>
      !noti.isRead ? { ...noti, isRead: true } : noti
    );
    setNotifications(updatedNotifications);
  };

  const filteredNotifications = notifications.filter(noti =>
    activeTab === 'unread' ? !noti.isRead : true
  );

  const unreadCount = notifications.filter(noti => !noti.isRead).length;

  // Group notifications by date
  const groupedNotifications = filteredNotifications.reduce((acc, noti) => {
    const date = noti.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(noti);
    return acc;
  }, {});

  return (
    <div className="no-smoking-dashboard">
      {/* Common Header */}
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
        {/* Left Column - Health Stats */}
        <Col xs={24} md={8} className="left-panel">
          <HealthStatsPanel daysSmokeFree={daysSmokeFree} />
          <HealthBenefitsPanel />
          <MotivationPanel />
        </Col>

        {/* Main Content - Notifications */}
        <Col xs={24} md={16}>
          <div className="notification-main-container">
            <div className="notification-tabs-container">
              <Tabs activeKey={activeTab} onChange={setActiveTab} className="notification-tabs">
                <TabPane 
                  tab={
                    <span>
                      <Badge dot={unreadCount > 0}>Unread</Badge>
                    </span>
                  } 
                  key="unread" 
                />
                <TabPane tab="All" key="all" />
              </Tabs>
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

            <div className="notification-content-container">
              <Spin spinning={loading} tip="Loading notifications...">
                {filteredNotifications.length === 0 ? (
                  <Empty
                    image={<SmileOutlined className="empty-icon" />}
                    description={
                      <Text type="secondary">
                        {activeTab === 'unread'
                          ? "You're all caught up! No unread notifications."
                          : "No notifications available"
                        }
                      </Text>
                    }
                    className="empty-notifications"
                  />
                ) : (
                  <div className="notification-list">
                    {Object.entries(groupedNotifications).map(([date, notis]) => (
                      <div key={date} className="notification-group">
                        <Divider orientation="left">
                          <Text strong>{date}</Text>
                        </Divider>
                        {notis.map(notification => (
                          <Card
                            key={notification.id}
                            className="notification-card"
                            hoverable
                          >
                            <NotificationItem
                              notification={notification}
                              onMarkAsRead={handleMarkAsRead}
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

          {/* Community Panel moved below notifications */}
          <CommunityPanel />
        </Col>
      </Row>

      <style jsx global>{`
        .no-smoking-dashboard {
          padding: 24px;
          max-width: 1600px;
          margin: 0 auto;
          background-color: ${COLORS.background};
          min-height: 100vh;
          font-family: 'Segoe UI', 'Roboto', sans-serif;
          color: ${COLORS.textDark};
        }
        
        /* Global Header */
        .global-header {
          display: flex;
          align-items: center;
          margin-bottom: 24px;
          padding: 16px 24px;
          background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary});
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 166, 90, 0.15);
        }
        
        .back-button {
          font-size: 20px;
          color: white;
          padding: 0;
          margin-right: 16px;
          width: 40px;
          height: 40px;
          transition: all 0.3s;
        }
        
        .back-button:hover {
          color: white;
          transform: translateX(-2px);
        }
        
        .title-container {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-grow: 1;
        }
        
        .main-title {
          color: white;
          margin: 0;
          font-size: 28px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .unread-badge {
          background-color: ${COLORS.accent};
          color: white;
          font-size: 14px;
          font-weight: 600;
          box-shadow: 0 2px 4px rgba(255, 107, 107, 0.3);
        }
        
        /* Left Panel Cards */
        .health-stats-panel,
        .health-benefits,
        .community-panel,
        .motivation-panel {
          margin-bottom: 24px;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
          border: none;
          background-color: ${COLORS.card};
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        
        .health-stats-panel {
          border-top: 4px solid ${COLORS.primary};
        }
        
        .health-benefits {
          border-top: 4px solid ${COLORS.secondary};
        }
        
        .community-panel {
          border-top: 4px solid ${COLORS.purple};
          margin-top: 24px;
        }
        
        .motivation-panel {
          border-top: 4px solid ${COLORS.warning};
        }
        
        .health-stats-panel:hover,
        .health-benefits:hover,
        .community-panel:hover,
        .motivation-panel:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
        
        /* Stats Section */
        .stats-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .stats-title {
          color: ${COLORS.textDark};
          margin: 0;
          font-size: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .health-percent {
          background: ${COLORS.success} !important;
          color: white !important;
          padding: 0 8px;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .milestone-progress {
          margin: 12px 0;
        }
        
        .next-milestone {
          display: block;
          margin-bottom: 16px;
          font-size: 13px;
          color: ${COLORS.textLight};
        }
        
        .stats-row {
          margin: 20px 0;
        }
        
        .health-statistic .ant-statistic-title {
          font-size: 14px;
          color: ${COLORS.textLight};
        }
        
        .health-statistic .ant-statistic-content {
          margin-top: 8px;
        }
        
        .milestones-container {
          margin: 16px 0;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .milestone-tag {
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 20px;
        }
        
        .daily-tip {
          display: flex;
          align-items: flex-start;
          background: rgba(0, 166, 90, 0.08);
          padding: 16px;
          border-radius: 8px;
          margin-top: 20px;
          border-left: 4px solid ${COLORS.primary};
          gap: 12px;
        }
        
        .tip-icon {
          color: ${COLORS.primary};
          font-size: 20px;
          margin-top: 2px;
        }
        
        /* Panel Titles */
        .panel-title {
          color: ${COLORS.textDark};
          margin-bottom: 16px;
          font-size: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        /* Benefit Items */
        .benefit-item {
          display: flex;
          gap: 12px;
          margin: 16px 0;
          font-size: 15px;
        }
        
        .benefit-marker {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-top: 7px;
          flex-shrink: 0;
        }
        
        .benefit-content {
          flex: 1;
        }
        
        .benefit-content strong {
          color: ${COLORS.textDark};
        }
        
        /* Community Feed */
        .community-feed {
          margin: 16px 0;
        }
        
        .community-post {
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .post-header {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .post-user {
          margin-left: 12px;
        }
        
        .post-time {
          font-size: 12px;
          display: block;
        }
        
        .post-content {
          margin-left: 44px;
          color: ${COLORS.textDark};
          margin-bottom: 8px;
        }
        
        .post-actions {
          margin-left: 44px;
          margin-top: 8px;
        }
        
        .post-action-btn {
          color: ${COLORS.textLight};
        }
        
        .post-action-btn:hover {
          color: ${COLORS.primary};
        }
        
        /* Join Button */
        .join-button {
          height: 40px;
          font-weight: 500;
          margin-top: 16px;
        }
        
        /* Motivation Panel */
        .motivation-quote {
          background: rgba(255, 214, 102, 0.1);
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 16px;
          border-left: 4px solid ${COLORS.warning};
        }
        
        .motivation-text {
          font-style: italic;
          color: ${COLORS.textDark};
          font-size: 16px;
          display: block;
          margin-bottom: 4px;
        }
        
        .motivation-author {
          color: ${COLORS.textLight};
          font-size: 14px;
        }
        
        .motivation-facts {
          margin: 16px 0;
        }
        
        .motivation-fact {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 12px 0;
          color: ${COLORS.textDark};
        }
        
        /* Emergency Button */
        .emergency-button {
          background: ${COLORS.danger};
          border-color: ${COLORS.danger};
          margin-top: 16px;
          height: 40px;
          font-weight: 500;
        }
        
        .emergency-button:hover {
          background: #c0392b;
          border-color: #c0392b;
        }

        /* Emergency Popup */
        .emergency-popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .emergency-popup-content {
          background: white;
          padding: 24px;
          border-radius: 12px;
          border: 2px solid ${COLORS.danger};
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          max-width: 450px;
          width: 90%;
          text-align: left;
          animation: fadeIn 0.3s ease-out;
        }

        .emergency-popup-content h3 {
          color: ${COLORS.danger};
          margin-bottom: 20px;
          font-size: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .emergency-tip {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 16px 0;
        }

        .emergency-tip-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: ${COLORS.danger};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          flex-shrink: 0;
        }

        .emergency-tip p {
          margin: 0;
          color: ${COLORS.textDark};
        }

        .close-popup-btn {
          margin-top: 20px;
          border-color: ${COLORS.danger};
          color: ${COLORS.danger};
          width: 100%;
        }

        .close-popup-btn:hover {
          background: #ffeeee;
          border-color: ${COLORS.danger};
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Notification Container */
        .notification-main-container {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          background: ${COLORS.card};
          border: 1px solid #000; /* Added black border */
        }
        
        .notification-tabs-container {
          background: ${COLORS.card};
          padding: 16px 24px 0;
          border-bottom: 1px solid #000; /* Added black border */
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .notification-content-container {
          background: ${COLORS.card};
          padding: 16px 24px;
          min-height: 500px;
        }
        
        /* Tabs */
        .notification-tabs {
          flex: 1;
        }
        
        .notification-tabs .ant-tabs-nav {
          margin: 0;
        }
        
        .notification-tabs .ant-tabs-tab {
          font-size: 15px;
          padding: 12px 20px;
          color: ${COLORS.textLight};
          transition: all 0.3s;
        }
        
        .notification-tabs .ant-tabs-tab:hover {
          color: ${COLORS.primary};
        }
        
        .notification-tabs .ant-tabs-tab-active {
          font-weight: 600;
          color: ${COLORS.primary};
        }
        
        .notification-tabs .ant-tabs-ink-bar {
          background: ${COLORS.primary};
          height: 3px;
        }
        
        .mark-all-button {
          color: ${COLORS.primary};
          font-weight: 500;
          font-size: 15px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        /* Notification List */
        .notification-list {
          margin-top: 16px;
        }
        
        .notification-group {
          margin-bottom: 24px;
        }
        
        .notification-card {
          margin-bottom: 12px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border: none;
          transition: all 0.3s;
        }
        
        .notification-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .notification-card .ant-card-body {
          padding: 0;
        }
        
        /* Notification Item */
        .notification-item {
          display: flex;
          padding: 16px;
        }
        
        .notification-item.unread {
          background: rgba(0, 166, 90, 0.03);
          border-left: 3px solid ${COLORS.primary};
        }
        
        .notification-badge {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          color: white;
          font-size: 20px;
          flex-shrink: 0;
        }
        
        .notification-content {
          flex: 1;
        }
        
        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .notification-title {
          font-size: 16px;
          color: ${COLORS.textDark};
          font-weight: 600;
        }
        
        .notification-message {
          font-size: 15px;
          color: ${COLORS.textDark};
          margin-bottom: 12px;
          line-height: 1.5;
        }
        
        .notification-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          color: ${COLORS.textLight};
          font-size: 14px;
          flex-wrap: wrap;
        }
        
        .notification-actions {
          margin-left: auto;
          display: flex;
          gap: 4px;
        }
        
        .mark-read-button {
          color: ${COLORS.success};
        }
        
        .action-button {
          color: ${COLORS.textLight};
        }
        
        .action-button:hover {
          color: ${COLORS.primary};
        }
        
        /* Empty State */
        .empty-notifications {
          margin-top: 60px;
          padding: 40px 0;
        }
        
        .empty-icon {
          font-size: 48px;
          color: ${COLORS.primary};
          margin-bottom: 16px;
        }
        
        /* Animations */
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(0, 166, 90, 0.3); }
          70% { box-shadow: 0 0 0 8px rgba(0, 166, 90, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 166, 90, 0); }
        }
        
        /* Responsive */
        @media (max-width: 992px) {
          .no-smoking-dashboard {
            padding: 16px;
          }
          
          .global-header {
            padding: 12px 16px;
          }
          
          .main-title {
            font-size: 22px;
          }
          
          .left-panel {
            padding-right: 0;
            margin-bottom: 24px;
          }
          
          .notification-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .mark-all-button {
            margin-left: 0;
            margin-top: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationCenter;