import React, { useEffect, useState, useRef, useCallback } from "react";
import { Card, Row, Col, Typography, Spin, Tag, Divider, Button, Select, message } from "antd";
import {
  FaTint,
  FaHashtag,
  FaDollarSign,
  FaLeaf,
  FaChevronRight,
  FaCheckCircle,
  FaCheck,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import api from "../../../configs/axios";

const { Title, Text } = Typography;
const { Option } = Select;

// ========== HẰNG SỐ VÀ STYLE ==========
const OUTER_CARD = {
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  margin: "24px 0",
};

const INNER_CARD_STYLE = {
  borderRadius: "8px",
  overflow: "hidden",
  minHeight: "280px",
  width: "100%",
};

const RECOMMENDATION_CONTAINER = {
  height: "500px",
  overflow: "hidden",
  position: "relative",
  width: "100%",
};

const NAV_BUTTON_STYLE = {
  backgroundColor: "#fff",
  border: "1px solid #e8e8e8",
  borderRadius: "50%",
  width: 40,
  height: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  cursor: "pointer",
  transition: "all 0.3s",
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 10,
};

const HEADER_GRADIENT = (colors) => ({
  background: `linear-gradient(135deg, ${colors.join(", ")})`,
  padding: "16px",
  color: "#fff",
});

const labelStyle = { fontWeight: 600, marginRight: 8 };

const SELECT_STYLE = {
  width: "200px",
  marginBottom: "8px",
};

// Thứ tự sắp xếp nicotine
const NICOTINE_STRENGTH_ORDER = {
  ZERO: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
};

// Danh sách flavor hợp lệ
const VALID_FLAVORS = ["CHERRY", "MENTHOL", "MINT", "ORIGINAL", "CHOCOLATE", "VANILLA"];

// Màu sắc cho từng mức nicotine
const NICOTINE_COLORS = {
  ZERO: "#52c41a", // Xanh lá
  LOW: "#1890ff", // Xanh dương
  MEDIUM: "#faad14", // Cam
  HIGH: "#f5222d", // Đỏ
};

export default function CigaretteRecommendations({ 
  onSelectPackage, 
  currentCigaretteId, 
  isViewOnly,
  planId 
}) {
  // ========== TRẠNG THÁI (STATE) ==========
  const [currentStatus, setCurrentStatus] = useState(null);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carouselPosition, setCarouselPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successPackageId, setSuccessPackageId] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const controls = useAnimation();
  const containerRef = useRef(null);

  // Khởi tạo selectedPackageId từ localStorage
  useEffect(() => {
    if (planId) {
      const savedPackageId = localStorage.getItem(`selectedPackage_${planId}`);
      if (savedPackageId) {
        setSelectedPackageId(savedPackageId);
        setSuccessPackageId(savedPackageId);
      }
    }
  }, [planId]);

  // Hàm lấy thông tin gói thuốc hiện tại
  const fetchCurrentPackage = async (packageId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      const response = await api.get(`/cigarette-packages/${packageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentPackage(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy gói thuốc hiện tại:", error);
      message.error(error.message || "Không thể tải thông tin gói thuốc hiện tại");
    }
  };

  // Hàm kiểm tra tính hợp lệ của flavor và nicotine
  const isValidStatus = (status) => {
    const flavor = status?.preferredFlavor?.trim().toUpperCase();
    const nicotine = status?.preferredNicotineLevel?.trim().toUpperCase();
    return (
      flavor &&
      VALID_FLAVORS.includes(flavor) &&
      nicotine &&
      NICOTINE_STRENGTH_ORDER.hasOwnProperty(nicotine)
    );
  };

  // Hàm lọc gợi ý dựa trên nicotine và hương vị
  const filterRecommendations = (recs) => {
    if (!currentStatus || !recs || recs.length === 0) {
      return [];
    }

    return recs
      .filter((rec) => {
        const toFlavor = rec.toFlavor ? rec.toFlavor.trim().toUpperCase() : "";
        const preferredFlavor = currentStatus.preferredFlavor
          ? currentStatus.preferredFlavor.trim().toUpperCase()
          : "";
        const toNicotine = rec.toNicoteneStrength
          ? rec.toNicoteneStrength.trim().toUpperCase()
          : "";
        const preferredNicotine = currentStatus.preferredNicotineLevel
          ? currentStatus.preferredNicotineLevel.trim().toUpperCase()
          : "";

        const isNicotineValid =
          toNicotine &&
          preferredNicotine &&
          NICOTINE_STRENGTH_ORDER[toNicotine] <= NICOTINE_STRENGTH_ORDER[preferredNicotine];

        const isFlavorValid = filterType === "same-flavor" ? toFlavor === preferredFlavor : true;

        const isNotCurrent =
          rec.toPackageId !== (currentCigaretteId || currentStatus?.cigarettePackageId);

        return isNicotineValid && isFlavorValid && isNotCurrent;
      })
      .sort((a, b) => {
        return (
          NICOTINE_STRENGTH_ORDER[a.toNicoteneStrength.trim().toUpperCase()] -
          NICOTINE_STRENGTH_ORDER[b.toNicoteneStrength.trim().toUpperCase()]
        );
      });
  };

  // Hàm lấy gợi ý từ API
  const fetchRecommendations = async () => {
    if (!filterType) return;

    try {
      if (!currentStatus || !isValidStatus(currentStatus)) {
        setRecommendations([]);
        setFilteredRecommendations([]);
        message.info("Vui lòng cập nhật sở thích hương vị và mức nicotine hợp lệ");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Authentication token is missing. Please log in again.");
        return;
      }

      const { preferredFlavor, preferredNicotineLevel } = currentStatus;
      let data = [];

      if (filterType === "same-flavor") {
        const response = await api.get(
          `/cigarette-recommendations/by-preference?flavor=${preferredFlavor}&nicotineLevel=${preferredNicotineLevel}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        data = response.data || [];
      } else {
        try {
          const response = await api.get(
            `/cigarette-recommendations/by-smoking-level/${preferredNicotineLevel}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          data = response.data || [];
        } catch (error) {
          const fallback = await api.get("/cigarette-packages", {
            headers: { Authorization: `Bearer ${token}` }
          });
          data = fallback.data.map((pkg) => ({
            toPackageId: pkg.cigarettePackageId,
            toCigaretteName: pkg.cigarettePackageName,
            toBrand: pkg.cigaretteBrand,
            toFlavor: pkg.flavor,
            toNicoteneStrength: pkg.nicotineLevel,
            toPrice: pkg.pricePerPack,
            toSticksPerPack: pkg.sticksPerPack,
            notes: `Alternative with ${pkg.nicotineLevel.toLowerCase()} nicotine`,
          }));
        }
      }

      let filtered = filterRecommendations(data);

      if (!data || data.length === 0) {
        const fallback = await api.get("/cigarette-packages", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const fallbackRecs = fallback.data.map((pkg) => ({
          toPackageId: pkg.cigarettePackageId,
          toCigaretteName: pkg.cigarettePackageName,
          toBrand: pkg.cigaretteBrand,
          toFlavor: pkg.flavor,
          toNicoteneStrength: pkg.nicotineLevel,
          toPrice: pkg.pricePerPack,
          toSticksPerPack: pkg.sticksPerPack,
          notes: `Alternative with ${pkg.nicotineLevel.toLowerCase()} nicotine`,
        }));
        filtered = filterRecommendations(fallbackRecs);
      }

      setRecommendations(data);
      setFilteredRecommendations(filtered);
      setCarouselPosition(0);
      controls.set({ y: 0 }); // Reset animation
    } catch (error) {
      console.error("Lỗi khi lấy gợi ý:", error);
      message.error(error.response?.data?.message || "Lỗi khi tải gợi ý gói thuốc lá");
      setRecommendations([]);
      setFilteredRecommendations([]);
    }
  };

  // Hàm thay đổi loại bộ lọc
  const handleFilterChange = useCallback((value) => {
    setFilterType(value);
    setCarouselPosition(0);
    controls.stop();
    controls.set({ y: 0 });
    if (currentStatus && isValidStatus(currentStatus)) {
      fetchRecommendations();
    }
  }, [currentStatus]);

  // Xử lý khi chọn gói thuốc
  const handleSelect = useCallback(async (recommendation) => {
    if (isSubmitting || isViewOnly) return;

    if (!recommendation?.toPackageId) {
      console.error("Invalid recommendation data:", recommendation);
      message.error("Invalid package data. Please try another package.");
      return;
    }

    setSelectedPackageId(recommendation.toPackageId);
    setIsSubmitting(true);

    try {
      console.log("Selecting package:", recommendation);
      if (onSelectPackage) {
        await onSelectPackage(recommendation);
      }
      
      // Lưu vào localStorage
      if (planId) {
        localStorage.setItem(`selectedPackage_${planId}`, recommendation.toPackageId);
      }
      
      setSuccessPackageId(recommendation.toPackageId);
      message.success("Đã chọn gói thuốc lá mới");
    } catch (error) {
      console.error("Lỗi khi chọn gói:", error);
      let errorMessage = "Lỗi khi chọn gói thuốc lá";
      if (error.response) {
        if (error.response.status === 403) {
          errorMessage = "Bạn không có quyền cập nhật gói này.";
        } else if (error.response.status === 400) {
          errorMessage = error.response.data.message || "Dữ liệu không hợp lệ.";
        } else if (error.response.status === 404) {
          errorMessage = "Kế hoạch không tồn tại.";
        }
      }
      message.error(errorMessage);
      setSelectedPackageId(null);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSuccessPackageId(null), 3000);
    }
  }, [isSubmitting, isViewOnly, onSelectPackage, planId]);

  // Xử lý điều hướng carousel
  const handleScrollUp = useCallback(() => {
    setIsPaused(true);
    controls.stop();
    const cardHeight = 320; // Approximate card height (280px + 16px margin + padding)
    const newPosition = Math.min(carouselPosition + cardHeight, 0);
    setCarouselPosition(newPosition);
    controls.start({
      y: newPosition,
      transition: { duration: 0.5, ease: "easeInOut" },
    });
  }, [carouselPosition, controls]);

  const handleScrollDown = useCallback(() => {
    setIsPaused(true);
    controls.stop();
    const cardHeight = 320;
    const totalHeight = filteredRecommendations.length * cardHeight;
    const newPosition = Math.max(carouselPosition - cardHeight, -totalHeight);
    setCarouselPosition(newPosition);
    controls.start({
      y: newPosition,
      transition: { duration: 0.5, ease: "easeInOut" },
    });
  }, [carouselPosition, filteredRecommendations.length, controls]);

  // Hiệu ứng tự động scroll
  useEffect(() => {
    if (filteredRecommendations.length <= 1) {
      controls.set({ y: 0 });
      return;
    }

    const cardHeight = 320;
    const totalHeight = filteredRecommendations.length * cardHeight;
    const duration = filteredRecommendations.length * 8; // Reduced for smoother pacing

    if (!isPaused) {
      controls.start({
        y: -totalHeight,
        transition: {
          y: {
            repeat: Infinity,
            repeatType: "loop",
            duration,
            ease: "linear",
          },
        },
      });
    }

    const pauseTimeout = setTimeout(() => {
      setIsPaused(false);
      if (!isPaused) {
        controls.start({
          y: -totalHeight,
          transition: {
            y: {
              repeat: Infinity,
              repeatType: "loop",
              duration,
              ease: "linear",
            },
          },
        });
      }
    }, 5000); // Reduced pause for better UX

    return () => clearTimeout(pauseTimeout);
  }, [filteredRecommendations.length, isPaused, controls]);

  // Lấy dữ liệu khi khởi tạo
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          message.error("Authentication token is missing. Please log in again.");
          return;
        }

        const { data: status } = await api.get("/smoking-status", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentStatus(status);

        const cigaretteId = currentCigaretteId || status?.cigarettePackageId;
        if (cigaretteId) {
          await fetchCurrentPackage(cigaretteId);
          if (isValidStatus(status) && filterType) {
            await fetchRecommendations();
          } else {
            setFilteredRecommendations([]);
            message.info("Vui lòng chọn loại gợi ý");
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        message.error(error.response?.data?.message || "Lỗi khi tải thông tin hút thuốc lá");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentCigaretteId]);

  useEffect(() => {
    if (filterType && currentStatus && isValidStatus(currentStatus)) {
      fetchRecommendations();
    }
  }, [filterType, currentStatus]);

  // Component hiển thị mức nicotine
  const NicotineTag = ({ level }) => (
    <Tag color={NICOTINE_COLORS[level] || "#d9d9d9"} style={{ fontWeight: 600 }}>
      {level}
    </Tag>
  );

  // Hiển thị khi đang tải
  if (loading) return <Spin tip="Loading cigarette recommendations..." />;

  // Hiển thị khung chọn mặc định nếu chưa chọn filterType
  if (!filterType || !currentStatus || !isValidStatus(currentStatus)) {
    return (
      <Card style={OUTER_CARD} bordered>
        <div style={{ textAlign: "center", padding: "32px" }}>
          <Title level={4}>Please select a recommendation type</Title>
          <Text type="secondary">
            Choose how you want to view cigarette package recommendations
          </Text>
          <div style={{ marginTop: 16 }}>
            <Select
              style={SELECT_STYLE}
              value={filterType}
              onChange={handleFilterChange}
              disabled={isViewOnly}
              placeholder="Select recommendation type"
            >
              <Option value="same-flavor">Same flavor recommendations</Option>
              <Option value="lighter-options">Lower nicotine recommendations</Option>
            </Select>
          </div>
        </div>
      </Card>
    );
  }

  // Hiển thị khi không có gợi ý
  if (filteredRecommendations.length === 0) {
    return (
      <Card style={OUTER_CARD} bordered>
        <div style={{ textAlign: "center", padding: "32px" }}>
          <Title level={4}>No suitable cigarette packages found</Title>
          <Text type="secondary">
            {filterType === "same-flavor"
              ? `No ${currentStatus?.preferredFlavor || "unknown"} flavored packages found with lower nicotine`
              : "No packages found with lower nicotine"}
          </Text>
          <div style={{ marginTop: 16 }}>
            <Select
              style={SELECT_STYLE}
              value={filterType}
              onChange={handleFilterChange}
              disabled={isViewOnly}
            >
              <Option value="same-flavor">Same flavor recommendations</Option>
              <Option value="lighter-options">Lower nicotine recommendations</Option>
            </Select>
          </div>
        </div>
      </Card>
    );
  }

  // Nhân đôi danh sách để tạo hiệu ứng vòng lặp
  const doubledRecommendations = filteredRecommendations.length > 1
    ? [...filteredRecommendations, ...filteredRecommendations]
    : filteredRecommendations;

  return (
    <Card style={OUTER_CARD} bordered>
      <div style={{ textAlign: "center", padding: "16px 0" }}>
        <Title level={3} style={{ margin: 0, color: "#333" }}>
          🚬 Compare Cigarette Packages
        </Title>
        <Text type="secondary">
          Compare your current cigarette package with alternatives
        </Text>
      </div>
      <Divider />
      <Row align="middle" justify="center" gutter={32}>
        {/* Gói thuốc hiện tại */}
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
                    {currentPackage?.cigarettePackageName || "Unknown"}
                  </Title>
                  <Text style={{ color: "rgba(255,255,255,0.85)" }}>
                    {currentPackage?.cigaretteBrand || "N/A"}
                  </Text>
                </Col>
                <Col>
                  <Tag color="warning">Current</Tag>
                  <NicotineTag level={currentStatus?.preferredNicotineLevel || "N/A"} />
                </Col>
              </Row>
            </div>
            <Row gutter={[16, 16]} style={{ padding: "16px" }}>
              <Col span={12}>
                <FaLeaf />
                <Text style={{ marginLeft: 8 }}>
                  <span style={labelStyle}>Flavor:</span>
                  {currentStatus?.preferredFlavor || "N/A"}
                </Text>
              </Col>
              <Col span={12}>
                <FaTint />
                <Text style={{ marginLeft: 8 }}>
                  <span style={labelStyle}>Nicotine:</span>
                  <NicotineTag level={currentStatus?.preferredNicotineLevel || "N/A"} />
                </Text>
              </Col>
              <Col span={12}>
                <FaHashtag />
                <Text style={{ marginLeft: 8 }}>
                  <span style={labelStyle}>Sticks/Pack:</span>
                  {currentPackage?.sticksPerPack || "N/A"}
                </Text>
              </Col>
              <Col span={12}>
                <FaDollarSign />
                <Text style={{ marginLeft: 8 }}>
                  <span style={labelStyle}>Price:</span>
                  {currentPackage?.pricePerPack?.toLocaleString("vi-VN") || "N/A"} VND
                </Text>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Mũi tên */}
        <Col xs={24} md={2} style={{ textAlign: "center" }}>
          <FaChevronRight
            size={36}
            style={{ transform: "translateX(12px)" }}
            color="#52c41a"
          />
        </Col>

        {/* Các gói thuốc được gợi ý */}
        <Col xs={24} md={12}>
          <div style={{ position: "relative" }}>
            {/* Ô chọn bộ lọc */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Select
                style={SELECT_STYLE}
                value={filterType}
                onChange={handleFilterChange}
                disabled={isViewOnly}
              >
                <Option value="same-flavor">Same flavor recommendations</Option>
                <Option value="lighter-options">Lower nicotine recommendations</Option>
              </Select>
            </div>

            {/* Thông tin số lượng gói */}
            <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
              Found {filteredRecommendations.length} suitable packages
            </Text>

            {/* Nút điều hướng lên */}
            <Button
              style={{
                ...NAV_BUTTON_STYLE,
                left: -20,
              }}
              onClick={handleScrollUp}
              disabled={isViewOnly || carouselPosition === 0}
            >
              <FaArrowUp color="#52c41a" size={20} />
            </Button>

            {/* Carousel hiển thị gợi ý */}
            <div style={RECOMMENDATION_CONTAINER} ref={containerRef}>
              <motion.div
                animate={controls}
                initial={{ y: 0 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
                onHoverStart={() => {
                  setIsPaused(true);
                  controls.stop();
                }}
                onHoverEnd={() => {
                  setIsPaused(false);
                }}
              >
                {doubledRecommendations.map((rec, idx) => (
                  <motion.div
                    key={`${rec.toPackageId}-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ marginBottom: "16px" }}
                  >
                    <RecommendationCard
                      recommendation={rec}
                      onSelect={handleSelect}
                      isSubmitting={isSubmitting && selectedPackageId === rec.toPackageId}
                      isSuccess={successPackageId === rec.toPackageId}
                      isViewOnly={isViewOnly}
                      NicotineTag={NicotineTag}
                      selectedPackageId={selectedPackageId}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Nút điều hướng xuống */}
            <Button
              style={{
                ...NAV_BUTTON_STYLE,
                right: -20,
              }}
              onClick={handleScrollDown}
              disabled={
                isViewOnly ||
                carouselPosition <= -(filteredRecommendations.length * 320)
              }
            >
              <FaArrowDown color="#52c41a" size={20} />
            </Button>
          </div>
        </Col>
      </Row>
    </Card>
  );
}

function RecommendationCard({ 
  recommendation, 
  onSelect, 
  isSubmitting, 
  isSuccess, 
  isViewOnly, 
  NicotineTag,
  selectedPackageId 
}) {
  const isSelected = selectedPackageId === recommendation.toPackageId;
  
  return (
    <Card
      bordered={false}
      style={{
        ...INNER_CARD_STYLE,
        border: isSelected ? "2px solid #52c41a" : "none",
        boxShadow: isSelected ? "0 0 0 2px rgba(82, 196, 26, 0.3)" : "none"
      }}
      bodyStyle={{ padding: 0, background: isSelected ? "#f6ffed" : "#e8f5e9" }}
    >
      <div style={HEADER_GRADIENT(["#81c784", "#388e3c"])}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={5} style={{ margin: 0 }}>
              {recommendation?.toCigaretteName || "Unknown"}
            </Title>
            <Text style={{ color: "rgba(255,255,255,0.85)" }}>
              {recommendation?.toBrand || "N/A"}
            </Text>
          </Col>
          <Col>
            <div style={{ display: "flex", alignItems: "center" }}>
              {isSelected && (
                <FaCheck
                  style={{
                    color: "#52c41a",
                    marginRight: 8,
                    fontSize: 16,
                  }}
                />
              )}
              <Tag color="success">Recommended</Tag>
              <NicotineTag level={recommendation?.toNicoteneStrength || "N/A"} />
            </div>
          </Col>
        </Row>
      </div>

      <Row gutter={[8, 8]} style={{ padding: "12px" }}>
        <Col span={12}>
          <FaLeaf />
          <Text style={{ marginLeft: 8 }}>
            <span style={labelStyle}>Flavor:</span>
            {recommendation?.toFlavor || "N/A"}
          </Text>
        </Col>
        <Col span={12}>
          <FaTint />
          <Text style={{ marginLeft: 8 }}>
            <span style={labelStyle}>Nicotine:</span>
            <NicotineTag level={recommendation?.toNicoteneStrength || "N/A"} />
          </Text>
        </Col>
        <Col span={12}>
          <FaHashtag />
          <Text style={{ marginLeft: 8 }}>
            <span style={labelStyle}>Sticks:</span>
            {recommendation?.toSticksPerPack || "N/A"}
          </Text>
        </Col>
        <Col span={12}>
          <FaDollarSign />
          <Text style={{ marginLeft: 8 }}>
            <span style={labelStyle}>Price:</span>
            {recommendation?.toPrice?.toLocaleString("vi-VN") || "N/A"} VND
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
        {!isSelected ? (
          <button
            style={{
              width: "100%",
              padding: "8px 12px",
              backgroundColor: "#4caf50",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: isSubmitting || isViewOnly ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: isSubmitting || isViewOnly ? 0.7 : 1,
            }}
            onClick={() => onSelect(recommendation)}
            disabled={isSubmitting || isViewOnly}
          >
            {isSubmitting ? (
              <>
                <Spin size="small" />
                Processing...
              </>
            ) : (
              "Select this package"
            )}
          </button>
        ) : (
          <div style={{
            padding: "8px 12px",
            backgroundColor: "#f6ffed",
            color: "#52c41a",
            borderRadius: 6,
            textAlign: "center",
            border: "1px solid #b7eb8f"
          }}>
            <FaCheck /> Selected
          </div>
        )}
      </div>
    </Card>
  );
}