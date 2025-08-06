import React, { useEffect, useState, useRef } from "react";
import { Card, Row, Col, Typography, Spin, Tag, Divider, Button, Select, message } from "antd";
import {
  FaTint,
  FaHashtag,
  FaDollarSign,
  FaLeaf,
  FaChevronRight,
  FaCheckCircle,
  FaCheck,
  FaArrowLeft,
  FaArrowRight,
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
  minWidth: "100%",
  minHeight: "280px",
  width: "290px",
};

const HEADER_GRADIENT = (colors) => ({
  background: `linear-gradient(135deg, ${colors.join(", ")})`,
  padding: "16px",
  color: "#fff",
});

const labelStyle = { fontWeight: 600, marginRight: 8 };

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
};

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

export default function CigaretteRecommendations({ onSelectPackage, currentCigaretteId, isViewOnly }) {
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
  const [filterType, setFilterType] = useState(null); // Bắt đầu với null để hiển thị khung chọn
  const controls = useAnimation();
  const containerRef = useRef(null);

  // ========== CÁC HÀM XỬ LÝ ==========

  // Hàm lấy thông tin gói thuốc hiện tại
  const fetchCurrentPackage = async (packageId) => {
    try {
      const response = await api.get(`/cigarette-packages/${packageId}`);
      setCurrentPackage(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy gói thuốc hiện tại:", error);
      message.error("Không thể tải thông tin gói thuốc hiện tại");
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
      console.log("Không có currentStatus hoặc dữ liệu rỗng:", { currentStatus, recs });
      return [];
    }

    console.log("Trước khi lọc:", {
      preferredFlavor: currentStatus.preferredFlavor,
      preferredNicotineLevel: currentStatus.preferredNicotineLevel,
      filterType,
    });

    return recs
      .filter((rec) => {
        // Chuẩn hóa dữ liệu
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

        // Kiểm tra nicotine
        const isNicotineValid =
          toNicotine &&
          preferredNicotine &&
          NICOTINE_STRENGTH_ORDER[toNicotine] <= NICOTINE_STRENGTH_ORDER[preferredNicotine];

        // Kiểm tra hương vị
        const isFlavorValid = filterType === "same-flavor" ? toFlavor === preferredFlavor : true;

        // Không hiển thị gói hiện tại
        const isNotCurrent =
          rec.toPackageId !== (currentCigaretteId || currentStatus?.cigarettePackageId);

        console.log("Kiểm tra bản ghi:", {
          toPackageId: rec.toPackageId,
          toCigaretteName: rec.toCigaretteName,
          toFlavor,
          preferredFlavor,
          isFlavorValid,
          toNicotine,
          preferredNicotine,
          isNicotineValid,
          isNotCurrent,
        });

        return isNicotineValid && isFlavorValid && isNotCurrent;
      })
      .sort((a, b) => {
        // Sắp xếp theo nicotine thấp dần
        return (
          NICOTINE_STRENGTH_ORDER[a.toNicoteneStrength.trim().toUpperCase()] -
          NICOTINE_STRENGTH_ORDER[b.toNicoteneStrength.trim().toUpperCase()]
        );
      });
  };

  // Hàm lấy gợi ý từ API
  const fetchRecommendations = async () => {
    if (!filterType) {
      console.log("Chưa chọn loại gợi ý (filterType = null)");
      return;
    }

    try {
      if (!currentStatus || !isValidStatus(currentStatus)) {
        console.log("Dữ liệu currentStatus không hợp lệ:", currentStatus);
        setRecommendations([]);
        setFilteredRecommendations([]);
        message.info("Vui lòng cập nhật sở thích hương vị và mức nicotine hợp lệ");
        return;
      }

      const { preferredFlavor, preferredNicotineLevel, cigarettePackageId } = currentStatus;
      let data = [];

      if (filterType === "same-flavor") {
        // API cho same-flavor
        const endpoint = `/cigarette-recommendations/by-preference?flavor=${preferredFlavor}&nicotineLevel=${preferredNicotineLevel}`;
        const response = await api.get(endpoint);
        console.log("Dữ liệu API /by-preference:", response.data);
        data = response.data || [];
      } else {
        // API cho lighter-options
        const endpoint = `/cigarette-recommendations/by-smoking-level/${preferredNicotineLevel}`;
        try {
          const response = await api.get(endpoint);
          console.log("Dữ liệu API /by-smoking-level:", response.data);
          data = response.data || [];
        } catch (error) {
          console.log("API /by-smoking-level thất bại, dùng fallback /cigarette-packages");
          const fallback = await api.get("/cigarette-packages");
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

      // Fallback nếu không có gợi ý
      if (!data || data.length === 0) {
        const fallback = await api.get("/cigarette-packages");
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
        console.log("Dữ liệu dự phòng:", fallbackRecs);
      }

      console.log("Gợi ý đã lọc:", filtered);
      setRecommendations(data);
      setFilteredRecommendations(filtered);

      // Thông báo khi không có gói phù hợp
      if (filtered.length === 0) {
        const noResultsMsg = filterType === "same-flavor"
          ? `Không tìm thấy gói thuốc lá ${preferredFlavor || "không xác định"} cùng hương vị với mức nicotine thấp hơn`
          : "Không tìm thấy gói thuốc lá nào có mức nicotine thấp hơn";
        message.info(noResultsMsg, 3);
      }
    } catch (error) {
      console.error("Lỗi khi lấy gợi ý:", error);
      message.error("Lỗi khi tải gợi ý gói thuốc lá");
      setRecommendations([]);
      setFilteredRecommendations([]);
    }
  };

  // Hàm thay đổi loại bộ lọc
  const handleFilterChange = (value) => {
    setFilterType(value);
    setCarouselPosition(0);
    controls.stop();
    controls.set({ x: 0 });
    // Gọi lại fetchRecommendations
    if (currentStatus && isValidStatus(currentStatus)) {
      fetchRecommendations();
    }
  };

  // ========== HIỆU ỨNG VÀ TƯƠNG TÁC ==========

  // Hiệu ứng cuộn tự động
  useEffect(() => {
    if (filteredRecommendations.length > 1) {
      const totalWidth = filteredRecommendations.length * 306;
      const duration = filteredRecommendations.length * 10;

      if (!isPaused) {
        controls.start({
          x: -totalWidth,
          transition: {
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: duration,
              ease: "linear",
            },
          },
        });
      }

      const pauseTimeout = setTimeout(() => {
        setIsPaused(false);
        if (!isPaused) {
          controls.start({
            x: -totalWidth,
            transition: {
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: duration,
                ease: "linear",
              },
            },
          });
        }
      }, 10000);

      return () => clearTimeout(pauseTimeout);
    } else {
      controls.set({ x: 0 });
    }
  }, [filteredRecommendations, isPaused, controls]);

  // Xử lý khi chọn gói thuốc
  const handleSelect = async (recommendation) => {
    if (isSubmitting || isViewOnly) return;

    setSelectedPackageId(recommendation.toPackageId);
    setIsSubmitting(true);

    try {
      if (onSelectPackage) {
        await onSelectPackage(recommendation);
      }
      setSuccessPackageId(recommendation.toPackageId);
      message.success("Đã chọn gói thuốc lá mới");
    } catch (error) {
      console.error("Lỗi khi chọn gói:", error);
      message.error("Lỗi khi chọn gói thuốc lá");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSuccessPackageId(null), 3000);
    }
  };

  // Xử lý điều hướng carousel
  const handlePrev = () => {
    setIsPaused(true);
    controls.stop();
    const newPosition = Math.min(carouselPosition + 306, 0);
    setCarouselPosition(newPosition);
    controls.start({
      x: newPosition,
      transition: { duration: 0.5, ease: "easeInOut" },
    });
  };

  const handleNext = () => {
    setIsPaused(true);
    controls.stop();
    const totalWidth = filteredRecommendations.length * 306;
    const newPosition = Math.max(carouselPosition - 306, -totalWidth);
    setCarouselPosition(newPosition);
    controls.start({
      x: newPosition,
      transition: { duration: 0.5, ease: "easeInOut" },
    });
  };

  // ========== LẤY DỮ LIỆU KHI KHỞI TẠO ==========
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Lấy trạng thái hút thuốc hiện tại
        const { data: status } = await api.get("/smoking-status");
        console.log("Dữ liệu smoking_status:", status);
        setCurrentStatus(status);

        const cigaretteId = currentCigaretteId || status?.cigarettePackageId;
        if (cigaretteId) {
          await fetchCurrentPackage(cigaretteId);
          if (isValidStatus(status)) {
            if (filterType) {
              await fetchRecommendations();
            }
          } else {
            console.log("Dữ liệu currentStatus không hợp lệ, chờ user chọn filterType");
            setFilteredRecommendations([]);
            message.info("Vui lòng chọn loại gợi ý");
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        message.error("Lỗi khi tải thông tin hút thuốc lá");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentCigaretteId]);

  // Gọi lại fetchRecommendations khi filterType thay đổi
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

  // Chỉ nhân đôi nếu có nhiều hơn 1 gói
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
                    {currentPackage?.cigarettePackageName}
                  </Title>
                  <Text style={{ color: "rgba(255,255,255,0.85)" }}>
                    {currentPackage?.cigaretteBrand}
                  </Text>
                </Col>
                <Col>
                  <Tag color="warning">Current</Tag>
                  <NicotineTag level={currentStatus?.preferredNicotineLevel} />
                </Col>
              </Row>
            </div>
            <Row gutter={[16, 16]} style={{ padding: "16px" }}>
              <Col span={12}>
                <FaLeaf />
                <Text style={{ marginLeft: 8 }}>
                  <span style={labelStyle}>Flavor:</span>
                  {currentStatus?.preferredFlavor}
                </Text>
              </Col>
              <Col span={12}>
                <FaTint />
                <Text style={{ marginLeft: 8 }}>
                  <span style={labelStyle}>Nicotine:</span>
                  <NicotineTag level={currentStatus?.preferredNicotineLevel} />
                </Text>
              </Col>
              <Col span={12}>
                <FaHashtag />
                <Text style={{ marginLeft: 8 }}>
                  <span style={labelStyle}>Sticks/Pack:</span>
                  {currentPackage?.sticksPerPack}
                </Text>
              </Col>
              <Col span={12}>
                <FaDollarSign />
                <Text style={{ marginLeft: 8 }}>
                  <span style={labelStyle}>Price:</span>
                  {currentPackage?.pricePerPack?.toLocaleString("vi-VN")} VND
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

            {/* Nút điều hướng */}
            <Button
              style={{
                ...NAV_BUTTON_STYLE,
                position: "absolute",
                left: -20,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
              }}
              onClick={handlePrev}
              disabled={isViewOnly || carouselPosition === 0}
            >
              <FaArrowLeft color="#52c41a" size={20} />
            </Button>

            {/* Carousel hiển thị gợi ý */}
            <div
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                paddingBottom: 12,
                width: "100%",
              }}
              ref={containerRef}
            >
              <motion.div
                animate={controls}
                initial={{ x: 0 }}
                style={{
                  display: "inline-flex",
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
                    style={{
                      display: "inline-block",
                      width: 290,
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
                      isViewOnly={isViewOnly}
                      NicotineTag={NicotineTag}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <Button
              style={{
                ...NAV_BUTTON_STYLE,
                position: "absolute",
                right: -20,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
              }}
              onClick={handleNext}
              disabled={isViewOnly || carouselPosition <= -(filteredRecommendations.length * 306)}
            >
              <FaArrowRight color="#52c41a" size={20} />
            </Button>
          </div>
        </Col>
      </Row>
    </Card>
  );
}

// Component hiển thị thông tin gói thuốc được gợi ý
function RecommendationCard({ recommendation, onSelect, isSubmitting, isSuccess, isViewOnly, NicotineTag }) {
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
            <div style={{ display: "flex", alignItems: "center" }}>
              {isSuccess && (
                <FaCheck
                  style={{
                    color: "#52c41a",
                    marginRight: 8,
                    fontSize: 16,
                  }}
                />
              )}
              <Tag color="success">Recommended</Tag>
              <NicotineTag level={recommendation?.toNicoteneStrength} />
            </div>
          </Col>
        </Row>
      </div>

      <Row gutter={[8, 8]} style={{ padding: "12px" }}>
        <Col span={12}>
          <FaLeaf />
          <Text style={{ marginLeft: 8 }}>
            <span style={labelStyle}>Flavor:</span>
            {recommendation?.toFlavor}
          </Text>
        </Col>
        <Col span={12}>
          <FaTint />
          <Text style={{ marginLeft: 8 }}>
            <span style={labelStyle}>Nicotine:</span>
            <NicotineTag level={recommendation?.toNicoteneStrength} />
          </Text>
        </Col>
        <Col span={12}>
          <FaHashtag />
          <Text style={{ marginLeft: 8 }}>
            <span style={labelStyle}>Sticks:</span>
            {recommendation?.toSticksPerPack}
          </Text>
        </Col>
        <Col span={12}>
          <FaDollarSign />
          <Text style={{ marginLeft: 8 }}>
            <span style={labelStyle}>Price:</span>
            {recommendation?.toPrice?.toLocaleString("vi-VN")} VND
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
            cursor: (isSubmitting || isViewOnly) ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            opacity: (isSubmitting || isViewOnly) ? 0.7 : 1,
          }}
          onClick={() => onSelect(recommendation)}
          disabled={isSubmitting || isViewOnly}
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