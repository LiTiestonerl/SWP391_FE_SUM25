import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { message } from "antd";

import PlanSummaryCard from "./PlanSummaryCard";
import StageList from "./StageList";
import CreatePlanModal from "./CreatePlanModal";
import {
  EditPlanModal,
  ConfirmDeleteModal,
  ConfirmCompleteModal,
  ConfirmCancelModal,
} from "./PlanActions";
import CoachBox from "./CoachBox";
import { CoachFeedbackCard } from "./CoachCard";
import CigaretteRecommendations from "./CigaretteRecommendations";
import api from "../../../configs/axios";
import {
  quitPlanService,
  cigaretteRecommendationService,
  noSmokingHelpers,
} from "../../../services/quitPlanService";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

const QuitPlanOverview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const memberPackageId = location?.state?.memberPackageId;
  const reduxUser = useSelector((state) => state.user?.user);

  let user = reduxUser;

  if (!user) {
    try {
      const stored = localStorage.getItem("user");
      user = stored ? JSON.parse(JSON.parse(stored)) : null;
    } catch (e) {
      console.warn("Failed to parse user from localStorage:", e);
    }
  }

  const storedToken = localStorage.getItem("token");
  const parsedToken = parseJwt(storedToken);

  const userId = user?.id || parsedToken?.sub;

  useEffect(() => {
    console.log("User resolved from redux/localStorage/token:", user);
    console.log("Token payload:", parsedToken);
    console.log("UserID resolved:", userId);
  }, []);

  const [plan, setPlan] = useState(null);
  const [duration, setDuration] = useState(30);
  const [membership, setMembership] = useState("HEALTH+");
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [smokingFreeDays, setSmokingFreeDays] = useState(0);

  const [showCreate, setCreate] = useState(false);
  const [showEdit, setEdit] = useState(false);
  const [showDelete, setDel] = useState(false);
  const [showComplete, setComplete] = useState(false);
  const [showCancel, setCancel] = useState(false);

  // Load current plan from API
  useEffect(() => {
    const loadCurrentPlan = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const currentPlan = await quitPlanService.getCurrentPlan(userId);
        if (currentPlan) {
          setPlan(currentPlan);
          // Calculate smoking free days
          const startDate = dayjs(currentPlan.startDate);
          const today = dayjs();
          const daysDiff = today.diff(startDate, "day");
          setSmokingFreeDays(Math.max(0, daysDiff));
        } else {
          setCreate(true);
        }
      } catch (error) {
        console.error("Error loading current plan:", error);
        setCreate(true);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentPlan();
    console.log("UserID resolved:", userId);
  }, [userId]);

  // Load cigarette recommendations
  useEffect(() => {
    const loadRecommendations = async () => {
      if (!plan?.cigarettesPerDay) return;

      try {
        const mockRecommendations = [
          {
            fromPackageName: "L&M Blue (LOW)",
            toPackageName: "L&M Zero (ZERO)",
            notes:
              "Recommended to reduce nicotine to ZERO level for better health.",
            priority_order: 1,
          },
          {
            fromPackageName: "Marlboro Red (HIGH)",
            toPackageName: "Marlboro Gold (MEDIUM)",
            notes:
              "Suggested to reduce nicotine from HIGH to MEDIUM gradually.",
            priority_order: 2,
          },
          {
            fromPackageName: "Camel Crush (MEDIUM)",
            toPackageName: "Camel Blue (LOW)",
            notes: "Gradual transition to LOW nicotine with similar flavor.",
            priority_order: 3,
          },
          {
            fromPackageName: "Vinataba Classic (HIGH)",
            toPackageName: "Thăng Long Gold (MEDIUM)",
            notes: "Switching to a local tobacco brand with lower nicotine.",
            priority_order: 4,
          },
          {
            fromPackageName: "Camel Blue (LOW)",
            toPackageName: "L&M Zero (ZERO)",
            notes: "Next step to nicotine-free cigarette alternative.",
            priority_order: 5,
          },
        ];
        setRecommendations(mockRecommendations);
      } catch (error) {
        console.error("Error loading recommendations:", error);
      }
    };

    if (plan) {
      loadRecommendations();
    }
  }, [plan]);

  // Load membership package info
  useEffect(() => {
    if (!memberPackageId) return;

    api
      .get("/member-packages")
      .then((res) => {
        const packages = res.data || [];
        const selected = packages.find(
          (p) => p.memberPackageId === memberPackageId
        );
        if (selected) {
          setDuration(selected.duration || 30);
          setMembership(selected.packageName || "HEALTH+");
        }
      })
      .catch(() => {
        setDuration(7);
        setMembership("FREE");
      });
  }, [memberPackageId]);

  // Handle plan creation
  const handleCreatePlan = async (formData) => {
    if (!userId) {
      console.log("userId is missing at handleCreatePlan");
      message.error("User ID not found. Please log in again.");
      return;
    }

    try {
      // 1. Chuẩn bị dữ liệu gửi đi với đúng tên trường API yêu cầu
      const payload = {
        title:
          formData.name || `No Smoking Plan - ${formData.durationInDays} Days`,
        startDate: formData.startDate,
        expectedEndDate: formData.endDate, // Đổi từ endDate sang expectedEndDate
        reason: formData.reason,
        stagesDescription: noSmokingHelpers
          .getNoSmokingStages(
            formData.averageCigarettes,
            formData.durationInDays
          )
          .map((stage) => stage.stageName)
          .join("; "),
        customNotes:
          formData.customNotes ||
          `🚭 No Smoking Plan - ${noSmokingHelpers.getMotivationalMessage(0)}`,
        userId,
      };

      console.log("Data sent to API:", payload);

      // 2. Gọi API
      const newPlan = await quitPlanService.createPlan(payload);

      // 3. Xử lý dữ liệu trả về - đảm bảo có endDate
      const processedPlan = {
        ...newPlan,
        endDate: newPlan.endDate || newPlan.expectedEndDate,
        durationInDays:
          dayjs(newPlan.expectedEndDate || newPlan.endDate).diff(
            dayjs(newPlan.startDate),
            "day"
          ) + 1,
      };
      console.log("Data received from API:", processedPlan);

      // 4. Cập nhật state
      setPlan(processedPlan);
      setCreate(false);
      message.success("🎉 Your No Smoking plan has been created successfully!");
    } catch (error) {
      console.error("Error creating plan:", {
        error: error.response?.data || error.message,
        requestData: formData,
      });
      message.error("Failed to create quit plan. Please try again.");
    }
  };

  // Handle plan update
  const handleUpdatePlan = async (formData) => {
    try {
      const updatedPlan = await quitPlanService.updatePlan(plan.planId, {
        ...formData,
        userId,
      });
      setPlan(updatedPlan);
      setEdit(false);
      message.success("Plan updated successfully!");
    } catch (error) {
      console.error("Error updating plan:", error);
      message.error("Failed to update plan. Please try again.");
    }
  };

  const handleCoachChange = async (coach) => {
    try {
      // 1. Kiểm tra dữ liệu đầu vào
      if (!plan?.planId || !coach?.userId) {
        message.error("Thông tin Kế hoạch hoặc Huấn luyện viên bị thiếu.");
        return;
      }

      // 2. Gọi đúng API endpoint đã được tạo ở backend: /assign-coach
      const response = await api.put(
        `/quit-plan/${plan.planId}/assign-coach?coachId=${coach.userId}`,
        {}, // Body request có thể rỗng vì dữ liệu đã nằm trong URL
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Phản hồi từ API gán coach:", response.data);

      // 3. Cập nhật state bằng dữ liệu đầy đủ từ server trả về
      // Điều này đảm bảo giao diện luôn đồng bộ 100% với database
      setPlan(response.data);

      message.success(
        `Huấn luyện viên ${coach.fullName} đã được chỉ định thành công!`
      );
    } catch (error) {
      console.error("Lỗi khi chỉ định huấn luyện viên:", {
        error: error.response?.data || error.message,
      });
      // Hiển thị lỗi từ backend nếu có
      const errorMessage =
        error.response?.data?.message ||
        "Chỉ định huấn luyện viên thất bại. Vui lòng thử lại.";
      message.error(errorMessage);
    }
  };

  // Handle plan completion
  const handleCompletePlan = async () => {
    try {
      const completedPlan = await quitPlanService.completePlan(plan.planId);
      setPlan(completedPlan);
      setComplete(false);
      message.success(
        "🏆 Congratulations! You have completed your No Smoking journey!"
      );
    } catch (error) {
      console.error("Error completing plan:", error);
      message.error("Failed to complete plan. Please try again.");
    }
  };

  // Handle plan cancellation
  const handleCancelPlan = async (reason) => {
    try {
      await quitPlanService.cancelPlan(plan.planId, reason);
      setPlan(null);
      setCancel(false);
      setCreate(true);
      message.info(
        "Plan has been cancelled. You can create a new one anytime."
      );
    } catch (error) {
      console.error("Error cancelling plan:", error);
      message.error("Failed to cancel plan. Please try again.");
    }
  };

  // Handle plan deletion
  const handleDeletePlan = async () => {
    try {
      await quitPlanService.deletePlan(plan.planId, userId);
      setPlan(null);
      setDel(false);
      setCreate(true);
      message.success("Plan deleted successfully.");
    } catch (error) {
      console.error("Error deleting plan:", error);
      message.error("Failed to delete plan. Please try again.");
    }
  };

  const handleSelectPackage = async (recommendation) => {
    if (!plan?.planId) {
      message.error("No active plan found");
      return;
    }

    try {
      // Chuẩn bị dữ liệu cập nhật - chỉ gửi các trường cần thiết
      const updateData = {
        title: plan.title,
        startDate: plan.startDate,
        expectedEndDate: plan.expectedEndDate || plan.endDate,
        reason: plan.reason,
        stagesDescription: plan.stagesDescription,
        customNotes: plan.customNotes,
        userId: userId,
        coachId: plan.coachId || null,
        recommendedPackageId: recommendation.toPackageId,
      };

      console.log("Updating plan with:", updateData);

      // 2. Gọi API cập nhật
      const response = await api.put(
        `/quit-plan/${plan.planId}/user`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // 3. Cập nhật state với dữ liệu mới từ server
      setPlan((prev) => ({
        ...prev,
        ...response.data, // Sử dụng dữ liệu trả về từ server
        recommendedPackageId: recommendation.toPackageId,
      }));

      message.success("Gói thuốc khuyến nghị đã được cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật gói thuốc:", {
        error: error.response?.data || error.message,
        config: error.config,
      });
      message.error("Cập nhật gói thuốc thất bại. Vui lòng thử lại!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c3e4dd] via-[#dfeee5] to-[#a1cfc1] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚭</div>
          <div className="text-xl text-emerald-700 font-semibold">
            Loading your No Smoking journey...
          </div>
        </div>
      </div>
    );
  }

  const isExpired =
    plan && dayjs().isAfter(dayjs(plan.expectedEndDate || plan.endDate));
  const completedDays = plan
    ? dayjs().diff(dayjs(plan.startDate), "day") + 1
    : 0;
  const allCompleted =
    plan && completedDays >= (plan.durationInDays || duration);
  const motivationalMessage =
    noSmokingHelpers.getMotivationalMessage(smokingFreeDays);
  const healthImprovements =
    noSmokingHelpers.getHealthImprovements(smokingFreeDays);

  console.log("plan: ", plan);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c3e4dd] via-[#dfeee5] to-[#a1cfc1] py-8 px-2 sm:px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex items-center justify-between mt-18">
          <div className="flex items-center gap-4">
            <div className="text-6xl">🚭</div>
            <div>
              <h1 className="text-4xl font-extrabold !text-emerald-700 drop-shadow tracking-wide">
                No Smoking Plan
              </h1>
              {plan && (
                <p className="text-emerald-600 font-medium mt-1">
                  {motivationalMessage}
                </p>
              )}
            </div>
          </div>
          {plan ? (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() =>
                  navigate("/quit-plan/detail", {
                    state: {
                      startDate: plan.startDate,
                      endDate: plan.endDate || plan.expectedEndDate, // cần truyền cái này để tính số ngày
                    },
                  })
                }
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 flex items-center gap-2"
              >
                📊 View Detail
              </button>
              <button
                onClick={() => setCancel(true)}
                className="px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold shadow hover:bg-orange-600 flex items-center gap-2"
              >
                ⏸️ Cancel Plan
              </button>
              <button
                onClick={() => setComplete(true)}
                className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 flex items-center gap-2"
              >
                ✅ Complete!
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCreate(true)}
              className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 flex items-center gap-2"
            >
              🚭 Start No Smoking Journey
            </button>
          )}
        </div>

        {!plan && (
          <div className="text-center py-12">
            <div className="text-8xl mb-6">🚭</div>
            <h2 className="text-2xl font-bold text-emerald-700 mb-4">
              Ready to Quit Smoking?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Take the first step towards a healthier, smoke-free life. Our
              personalized No Smoking plan will guide you through your journey
              with proven strategies and continuous support.
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/80 p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-3">🫁</div>
                <h3 className="font-bold text-emerald-700 mb-2">
                  Better Health
                </h3>
                <p className="text-sm text-gray-600">
                  Improve your lung function and overall health
                </p>
              </div>
              <div className="bg-white/80 p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-3">💰</div>
                <h3 className="font-bold text-emerald-700 mb-2">Save Money</h3>
                <p className="text-sm text-gray-600">
                  Calculate how much you'll save by quitting
                </p>
              </div>
              <div className="bg-white/80 p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-3">👨‍👩‍👧‍👦</div>
                <h3 className="font-bold text-emerald-700 mb-2">
                  For Your Family
                </h3>
                <p className="text-sm text-gray-600">
                  Protect your loved ones from secondhand smoke
                </p>
              </div>
            </div>
          </div>
        )}

        {plan && (
          <>
            {/* No Smoking Motivation Section */}

            {isExpired && (
              <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg border border-yellow-300 flex items-center gap-3">
                <div className="text-2xl">⚠️</div>
                <div>
                  <div className="font-semibold">Plan Expired</div>
                  <div className="text-sm">
                    This plan has expired. Consider creating a new No Smoking
                    plan.
                  </div>
                </div>
              </div>
            )}
            {allCompleted && (
              <div className="bg-green-100 text-green-800 p-6 rounded-lg border border-green-300 shadow-md">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">🏆</div>
                  <div>
                    <div className="text-2xl font-bold">Congratulations!</div>
                    <div className="text-lg">
                      You've completed your No Smoking journey! You're now
                      smoke-free!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Phần chia 2 cột vẫn giữ nguyên */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <CoachBox
                  selectedCoachId={plan.coachId}
                  membership={membership}
                  onSelect={handleCoachChange}
                />
              </div>
              <div className="flex flex-col gap-6">
                <PlanSummaryCard
                  plan={plan}
                  onEdit={() => setEdit(true)}
                  onDelete={() => setDel(true)}
                  onComplet
                  e={() => setComplete(true)}
                />
                <StageList
                  durationInDays={plan.durationInDays}
                  startDate={plan.startDate}
                  endDate={plan.endDate || plan.expectedEndDate}
                  membership={plan.membership}
                  planId={plan.id}
                  averageCigarettes={plan.averageCigarettes}
                />
              </div>
            </div>

            {/* Phần khuyến nghị gói thuốc được đặt dưới grid, chiếm full chiều ngang */}
            <div className="mt-6">
              <CigaretteRecommendations
                recommendations={recommendations}
                currentCigaretteId={plan.cigarettePackageId}
                onSelectPackage={handleSelectPackage}
              />
            </div>
          </>
        )}

        <CreatePlanModal
          open={showCreate}
          onClose={() => setCreate(false)}
          onCreate={handleCreatePlan}
        />

        <EditPlanModal
          open={showEdit}
          plan={plan}
          onClose={() => setEdit(false)}
          onSave={handleUpdatePlan}
        />

        <ConfirmDeleteModal
          open={showDelete}
          onClose={() => setDel(false)}
          onConfirm={handleDeletePlan}
        />

        <ConfirmCompleteModal
          open={showComplete}
          onClose={() => setComplete(false)}
          onConfirm={handleCompletePlan}
        />

        <ConfirmCancelModal
          open={showCancel}
          onClose={() => setCancel(false)}
          onConfirm={handleCancelPlan}
        />
      </div>
    </div>
  );
};

export default QuitPlanOverview;