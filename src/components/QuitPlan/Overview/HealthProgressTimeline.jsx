import React from 'react';
import dayjs from 'dayjs';
import { Tooltip, Progress, Badge } from 'antd';
import { 
  HeartOutlined, 
  DashboardOutlined, // Thay cho LungsIcon
  CloudOutlined,    // Thay cho OxygenIcon
  ExperimentOutlined, // Thay cho BloodIcon
  FireOutlined      // Thay cho TasteIcon
} from '@ant-design/icons';
import styled from 'styled-components';

// 1. Tạo các styled components
const TimelineContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin: 20px 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const TimelineHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h3 {
    margin: 0;
    font-size: 1.25rem;
    color: #1f845a;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const ProgressContainer = styled.div`
  width: 200px;
`;

const MilestoneContainer = styled.div`
  position: relative;
  padding-left: 40px;
`;

const MilestoneCard = styled.div`
  position: relative;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  border-left: 3px solid ${props => props.$achieved ? '#52c41a' : '#d9d9d9'};
  background-color: ${props => props.$achieved ? '#f6ffed' : '#fafafa'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const MilestoneIcon = styled.div`
  position: absolute;
  left: -32px;
  top: 16px;
  background: white;
  padding: 8px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MilestoneContent = styled.div`
  margin-left: 8px;
`;

const MilestoneTime = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.$achieved ? '#52c41a' : '#595959'};
`;

const AchievementBadge = styled.span`
  background: #52c41a;
  color: white;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.75rem;
  display: inline-flex;
  align-items: center;
`;

const MilestoneBenefit = styled.div`
  color: #595959;
  font-size: 0.9rem;
`;

const DaysRemaining = styled.div`
  font-size: 0.75rem;
  color: #8c8c8c;
  margin-top: 4px;
  font-style: italic;
`;

const TimelineConnector = styled.div`
  position: absolute;
  left: -20px;
  top: 48px;
  bottom: -16px;
  width: 2px;
  background: ${props => props.$active ? '#52c41a' : '#d9d9d9'};
`;

// 2. Dữ liệu các mốc sức khỏe
const HEALTH_MILESTONES = [
  { 
    time: '20 minutes', 
    benefit: 'Heart rate normalizes', 
    icon: <HeartOutlined style={{ fontSize: '18px' }} />,
    key: 'heart',
    threshold: 20 // minutes
  },
  { 
    time: '8 hours', 
    benefit: 'Oxygen levels recover', 
    icon: <CloudOutlined style={{ fontSize: '18px' }} />,
    key: 'oxygen',
    threshold: 480
  },
  { 
    time: '24 hours', 
    benefit: 'Carbon monoxide eliminated', 
    icon: <DashboardOutlined style={{ fontSize: '18px' }} />,
    key: 'lungs',
    threshold: 1440 
  },
  { 
    time: '2 weeks', 
    benefit: 'Circulation improves', 
    icon: <ExperimentOutlined style={{ fontSize: '18px' }} />,
    key: 'circulation',
    threshold: 20160 
  },
  { 
    time: '1 month', 
    benefit: 'Lung function increases', 
    icon: <DashboardOutlined style={{ fontSize: '18px' }} />,
    key: 'lung-capacity',
    threshold: 43200 
  },
  { 
    time: '3 months', 
    benefit: 'Sense of taste/smell improves', 
    icon: <FireOutlined style={{ fontSize: '18px' }} />,
    key: 'senses',
    threshold: 131400 
  },
  { 
    time: '1 year', 
    benefit: 'Heart disease risk drops 50%', 
    icon: <HeartOutlined style={{ fontSize: '18px' }} />,
    key: 'heart-risk',
    threshold: 525600 
  }
];

// 3. Component chính
const HealthProgressTimeline = ({ startDate }) => {
  const now = dayjs();
  const quitStart = dayjs(startDate);
  const minutesQuit = now.diff(quitStart, 'minute');
  const daysQuit = now.diff(quitStart, 'day');

  const overallProgress = Math.min(
    Math.floor((minutesQuit / HEALTH_MILESTONES[HEALTH_MILESTONES.length - 1].threshold) * 100),
    100
  );

  return (
    <TimelineContainer>
      <TimelineHeader>
        <h3>
          <span role="img" aria-label="health">🩺</span> Health Recovery Progress
          <Badge 
            count={`Day ${daysQuit}`} 
            style={{ 
              backgroundColor: '#52c41a', 
              marginLeft: 12,
              fontWeight: 'bold'
            }} 
          />
        </h3>
        <ProgressContainer>
          <Tooltip title={`Overall recovery: ${overallProgress}%`}>
            <Progress 
              percent={overallProgress} 
              strokeColor={{
                '0%': '#ff7875',
                '100%': '#52c41a',
              }}
              showInfo={false}
              strokeWidth={10}
            />
          </Tooltip>
        </ProgressContainer>
      </TimelineHeader>

      <MilestoneContainer>
        {HEALTH_MILESTONES.map((milestone, index) => {
          const isAchieved = minutesQuit >= milestone.threshold;
          const daysToGo = Math.ceil((milestone.threshold - minutesQuit) / 1440);
          
          return (
            <MilestoneCard 
              key={milestone.key}
              $achieved={isAchieved}
            >
              <MilestoneIcon>
                {React.cloneElement(milestone.icon, {
                  style: { 
                    color: isAchieved ? '#52c41a' : '#d9d9d9',
                  }
                })}
              </MilestoneIcon>
              
              <MilestoneContent>
                <MilestoneTime $achieved={isAchieved}>
                  {milestone.time}
                  {isAchieved && (
                    <AchievementBadge>
                      <span style={{ marginRight: 4 }}>✓</span> Achieved
                    </AchievementBadge>
                  )}
                </MilestoneTime>
                <MilestoneBenefit>
                  {milestone.benefit}
                </MilestoneBenefit>
                {!isAchieved && daysToGo > 0 && (
                  <DaysRemaining>
                    Estimated: ~{daysToGo} day{daysToGo !== 1 ? 's' : ''} to go
                  </DaysRemaining>
                )}
              </MilestoneContent>

              {index < HEALTH_MILESTONES.length - 1 && (
                <TimelineConnector $active={isAchieved} />
              )}
            </MilestoneCard>
          );
        })}
      </MilestoneContainer>
    </TimelineContainer>
  );
};

export default HealthProgressTimeline;