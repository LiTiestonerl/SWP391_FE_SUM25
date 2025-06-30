import React from "react";
import { Card, Col, Row, Typography } from "antd";
import {
  CheckCircleOutlined,
  StarOutlined,
  TeamOutlined,
  DollarOutlined,
  LineChartOutlined,
  BellOutlined,
  MessageOutlined,
  TrophyOutlined,
  UserOutlined,
  PieChartOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const OverviewPage = () => {
  return (
    <div>
      <Title level={2}>Tổng quan nền tảng hỗ trợ cai nghiện thuốc lá</Title>
      <Paragraph>
        Nền tảng của chúng tôi hỗ trợ người dùng xây dựng kế hoạch và theo dõi
        hành trình cai thuốc thông qua nhiều chức năng hiện đại và cộng đồng hỗ
        trợ tích cực.
      </Paragraph>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={8}>
          <Card title="Giới thiệu nền tảng" bordered={false}>
            <p>
              - Trang chủ giới thiệu, blog chia sẻ, bảng xếp hạng thành tích
            </p>
            <StarOutlined style={{ fontSize: 24 }} />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card title="Đăng ký & Gói thành viên" bordered={false}>
            <p>- Người dùng có thể đăng ký tài khoản, chọn gói và thanh toán</p>
            <DollarOutlined style={{ fontSize: 24 }} />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card title="Tình trạng hút thuốc" bordered={false}>
            <p>- Ghi nhận số lượng điếu thuốc, tần suất, chi phí...</p>
            <LineChartOutlined style={{ fontSize: 24 }} />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card title="Kế hoạch cai thuốc" bordered={false}>
            <p>- Lý do, thời điểm bắt đầu, giai đoạn cai, hệ thống gợi ý</p>
            <CheckCircleOutlined style={{ fontSize: 24 }} />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card title="Theo dõi tiến trình" bordered={false}>
            <p>- Ngày không hút, tiền tiết kiệm, cải thiện sức khỏe...</p>
            <LineChartOutlined style={{ fontSize: 24 }} />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card title="Thông báo động viên" bordered={false}>
            <p>- Nhắc nhở hàng ngày/tuần, truyền động lực cai thuốc</p>
            <BellOutlined style={{ fontSize: 24 }} />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card title="Huy hiệu thành tích" bordered={false}>
            <p>- Ví dụ: 1 ngày không hút, tiết kiệm 100K...</p>
            <TrophyOutlined style={{ fontSize: 24 }} />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card title="Cộng đồng chia sẻ" bordered={false}>
            <p>- Chia sẻ huy hiệu, động viên, trao đổi kinh nghiệm</p>
            <TeamOutlined style={{ fontSize: 24 }} />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card title="Tư vấn trực tuyến" bordered={false}>
            <p>- Trò chuyện cùng huấn luyện viên hỗ trợ cai thuốc</p>
            <MessageOutlined style={{ fontSize: 24 }} />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card title="Quản lý gói phí & người dùng" bordered={false}>
            <p>- Khai báo gói thành viên, quản lý hồ sơ người dùng</p>
            <UserOutlined style={{ fontSize: 24 }} />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card title="Đánh giá & phản hồi" bordered={false}>
            <p>- Người dùng có thể gửi feedback, đánh giá hệ thống</p>
            <StarOutlined style={{ fontSize: 24 }} />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card title="Dashboard & Báo cáo" bordered={false}>
            <p>- Thống kê tiến trình người dùng, doanh thu, hiệu quả</p>
            <PieChartOutlined style={{ fontSize: 24 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OverviewPage;
