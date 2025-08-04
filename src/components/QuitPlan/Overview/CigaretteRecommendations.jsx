import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Spin, Tag, Divider } from "antd";
import {
  FaTint,
  FaHashtag,
  FaDollarSign,
  FaLeaf,
  FaChevronRight,
  FaCheckCircle,
  FaCheck,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../configs/axios";

const { Title, Text } = Typography;

const OUTER_CARD = {
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  margin: "24px 0",
};

const INNER_CARD_STYLE = {
  borderRadius: "8px",
  overflow: "hidden",
  minWidth: "100%",
};

const HEADER_GRADIENT = (colors) => ({
  background: `linear-gradient(135deg, ${colors.join(", ")})`,
  padding: "16px",
  color: "#fff",
});

const labelStyle = { fontWeight: 600, marginRight: 8 };

export default function CigaretteRecommendations({ onSelectPackage }) {
  const [currentStatus, setCurrentStatus] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successPackageId, setSuccessPackageId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: status } = await api.get("/smoking-status");
        setCurrentStatus(status);

        if (status?.cigarettePackageId) {
          const { data } = await api.get(
            `/cigarette-recommendations/for-cigarette/${status.cigarettePackageId}`
          );
          setRecommendations(data || []);
        }
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Auto-rotate if few items
  useEffect(() => {
    if (recommendations.length > 1 && recommendations.length <= 3) {
      const interval = setInterval(() => {
        setCarouselIndex((prev) => (prev + 1) % recommendations.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [recommendations]);

  const handleSelect = async (recommendation) => {
    if (isSubmitting) return;
    
    setSelectedPackageId(recommendation.toPackageId);
    setIsSubmitting(true);
    
    try {
      console.log("Selected package:", recommendation);
      if (onSelectPackage) {
        await onSelectPackage(recommendation);
      }
      setSuccessPackageId(recommendation.toPackageId);
    } catch (error) {
      console.error("Error selecting package:", error);
    } finally {
      setIsSubmitting(false);
      // Reset success indicator after 3 seconds
      setTimeout(() => setSuccessPackageId(null), 3000);
    }
  };

  if (loading) return <Spin tip="Loading recommendations..." />;
    if (recommendations.length === 0) {
    return (
      <Card style={OUTER_CARD} bordered>
        <div style={{ textAlign: "center", padding: "32px" }}>
          <Title level={4}>Không có đề xuất nào</Title>
          <Text type="secondary">
            Chúng tôi không tìm thấy gói thuốc nào phù hợp để đề xuất cho bạn lúc này.
          </Text>
        </div>
      </Card>
    );
    }

  const currentRecommendation = recommendations[0];

  return (
    <Card style={OUTER_CARD} bordered>
      <div style={{ textAlign: "center", padding: "16px 0" }}>
        <Title level={3} style={{ margin: 0, color: "#333" }}>
          🚬 Smoking Package Comparison
        </Title>
        <Text type="secondary">
          Compare your current pack with our recommended options
        </Text>
      </div>
      <Divider />
      <Row align="middle" justify="center" gutter={32}>
        {/* Current Package */}
        <Col xs={24} md={10}>
          <Card
            bordered={false}
            style={INNER_CARD_STYLE}
            bodyStyle={{ padding: 0, background: "#fff8e1" }}
          >
            <div style={HEADER_GRADIENT(["#f9a825", "#f57f17"])}>
              <Row justify="space-between" align="middle">
                <Col>
                  <Title level={5} style={{ margin: 0 }}>
                    {currentRecommendation?.fromCigaretteName}
                  </Title>
                  <Text style={{ color: "rgba(255,255,255,0.85)" }}>
                    {currentRecommendation?.fromBrand}
                  </Text>
                </Col>
                <Col>
                  <Tag color="warning">Current</Tag>
                </Col>
              </Row>
            </div>
            <Row gutter={[16, 16]} style={{ padding: "16px" }}>
              <Col span={12}>
                <FaLeaf />{" "}
                <Text>
                  <span style={labelStyle}>Flavor:</span>
                  {currentRecommendation?.fromFlavor}
                </Text>
              </Col>
              <Col span={12}>
                <FaTint />{" "}
                <Text>
                  <span style={labelStyle}>Nicotine:</span>
                  {currentRecommendation?.fromNicoteneStrength}
                </Text>
              </Col>
              <Col span={12}>
                <FaHashtag />{" "}
                <Text>
                  <span style={labelStyle}>Sticks/Pack:</span>
                  {currentRecommendation?.fromSticksPerPack}
                </Text>
              </Col>
              <Col span={12}>
                <FaDollarSign />{" "}
                <Text>
                  <span style={labelStyle}>Price:</span>
                  {currentRecommendation?.fromPrice?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Text>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Arrow */}
        <Col xs={24} md={2} style={{ textAlign: "center" }}>
          <FaChevronRight
            size={36}
            style={{ transform: "translateX(12px)" }}
            color="#52c41a"
          />
        </Col>

        {/* Recommended Packages */}
        <Col xs={24} md={10}>
          {recommendations.length > 3 ? (
            <div style={{ overflowX: "auto", whiteSpace: "nowrap", paddingBottom: 12 }}>
              {recommendations.map((rec, idx) => (
                <motion.div
                  key={idx}
                  style={{
                    display: "inline-block",
                    width: 280,
                    marginRight: 16,
                    verticalAlign: "top",
                  }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <RecommendationCard 
                    recommendation={rec} 
                    onSelect={handleSelect}
                    isSubmitting={isSubmitting && selectedPackageId === rec.toPackageId}
                    isSuccess={successPackageId === rec.toPackageId}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={carouselIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <RecommendationCard 
                  recommendation={recommendations[carouselIndex]} 
                  onSelect={handleSelect}
                  isSubmitting={isSubmitting && selectedPackageId === recommendations[carouselIndex].toPackageId}
                  isSuccess={successPackageId === recommendations[carouselIndex].toPackageId}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </Col>
      </Row>
    </Card>
  );
}

function RecommendationCard({ recommendation, onSelect, isSubmitting, isSuccess }) {
  return (
    <Card
      bordered={false}
      style={INNER_CARD_STYLE}
      bodyStyle={{ padding: 0, background: "#e8f5e9" }}
    >
      <div style={HEADER_GRADIENT(["#81c784", "#388e3c"])}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={5} style={{ margin: 0 }}>
              {recommendation?.toCigaretteName}
            </Title>
            <Text style={{ color: "rgba(255,255,255,0.85)" }}>
              {recommendation?.toBrand}
            </Text>
          </Col>
          <Col>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {isSuccess && (
                <FaCheck 
                  style={{ 
                    color: '#52c41a', 
                    marginRight: 8,
                    fontSize: 16
                  }} 
                />
              )}
              <Tag color="success">Recommended</Tag>
            </div>
          </Col>
        </Row>
      </div>

      <Row gutter={[8, 8]} style={{ padding: "12px" }}>
        <Col span={12}>
          <FaLeaf />{" "}
          <Text>
            <span style={labelStyle}>Flavor:</span>
            {recommendation?.toFlavor}
          </Text>
        </Col>
        <Col span={12}>
          <FaTint />{" "}
          <Text>
            <span style={labelStyle}>Nicotine:</span>
            {recommendation?.toNicoteneStrength}
          </Text>
        </Col>
        <Col span={12}>
          <FaHashtag />{" "}
          <Text>
            <span style={labelStyle}>Sticks:</span>
            {recommendation?.toSticksPerPack}
          </Text>
        </Col>
        <Col span={12}>
          <FaDollarSign />{" "}
          <Text>
            <span style={labelStyle}>Price:</span>
            {recommendation?.toPrice?.toLocaleString("en-US", {
              style: "currency",
              currency: "VND",
            })}
          </Text>
        </Col>
      </Row>

      {recommendation?.notes && (
        <div style={{ padding: "0 16px 8px", display: "flex", gap: 8 }}>
          <FaCheckCircle style={{ color: "#52c41a" }} />
          <Text type="secondary">{recommendation.notes}</Text>
        </div>
      )}

      <div style={{ padding: "0 16px 16px" }}>
        <button
          style={{
            width: "100%",
            padding: "8px 12px",
            backgroundColor: isSuccess ? "#52c41a" : "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: isSubmitting ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            opacity: isSubmitting ? 0.7 : 1,
          }}
          onClick={() => onSelect(recommendation)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spin size="small" />
              Processing...
            </>
          ) : isSuccess ? (
            <>
              <FaCheck />
              Selected
            </>
          ) : (
            "Select this package"
          )}
        </button>
      </div>
    </Card>
  );
}