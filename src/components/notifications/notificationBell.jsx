import React from 'react';
import { Badge, Popover, List, Button } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const NotificationBell = ({ notifications = [], isDarkMode }) => {
  const navigate = useNavigate();
  const count = notifications.length;
  const displayCount = count > 5 ? '5+' : count;

  const popoverContent = (
    <div style={{
      width: '340px',
      maxHeight: '400px',
      overflowY: 'auto',
      background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      borderRadius: '15px',
      padding: '15px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
    }}>
      <div style={{
        borderBottom: '2px solid rgba(70, 92, 113, 0.7)',
        paddingBottom: '12px',
        marginBottom: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '20px',
          fontWeight: '700',
          color: '#ecf0f1',
          textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
        }}>Thông báo</h3>
        <span style={{ fontSize: '12px', color: '#a3bffa' }}>{new Date().toLocaleTimeString()}</span>
      </div>
      {notifications.length > 0 ? (
        <List
          size="small"
          dataSource={notifications.slice(0, 5)}
          renderItem={(item) => (
            <List.Item style={{
              padding: '12px 15px',
              marginBottom: '10px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(70, 92, 113, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{
                color: '#ecf0f1',
                fontSize: '14px',
                lineHeight: '1.5',
                maxWidth: '75%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {item.content}
              </div>
              <span style={{
                color: '#a3bffa',
                fontSize: '12px',
                minWidth: '60px',
                textAlign: 'right',
              }}>
                {new Date(item.date).toLocaleTimeString()}
              </span>
            </List.Item>
          )}
        />
      ) : (
        <p style={{
          margin: 0,
          padding: '15px',
          color: '#bdc3c7',
          textAlign: 'center',
          fontStyle: 'italic',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          border: '1px solid rgba(70, 92, 113, 0.3)',
        }}>Không có thông báo nào.</p>
      )}
      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <Button
          size="small"
          type="primary"
          onClick={() => navigate('/notifications')}
          style={{
            background: 'linear-gradient(90deg, #e74c3c, #c0392b)',
            border: 'none',
            color: '#fff',
            borderRadius: '8px',
            padding: '8px 25px',
            fontWeight: '600',
            textTransform: 'uppercase',
            boxShadow: '0 4px 15px rgba(231, 76, 60, 0.4)',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'linear-gradient(90deg, #c0392b, #a93226)';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(231, 76, 60, 0.6)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'linear-gradient(90deg, #e74c3c, #c0392b)';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(231, 76, 60, 0.4)';
          }}
        >
          VIEW ALL
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
        style={{ backgroundColor: '#e74c3c' }}
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