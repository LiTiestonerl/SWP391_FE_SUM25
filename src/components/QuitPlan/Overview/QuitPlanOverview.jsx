import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { message, Modal } from "antd";
import { LeftOutlined } from "@ant-design/icons";
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

  const [plan, setPlan] = useState(null);
  const [duration, setDuration] = useState(30);
  const [membership, setMembership] = useState("HEALTH+");
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [smokingFreeDays, setSmokingFreeDays] = useState(0);
  const [coachList, setCoachList] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyPlans, setHistoryPlans] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [isViewingHistory, setIsViewingHistory] = useState(false);

  const [showCreate, setCreate] = useState(false);
  const [showEdit, setEdit] = useState(false);
  const [showDelete, setDel] = useState(false);
  const [showComplete, setComplete] = useState(false);
  const [showCancel, setCancel] = useState(false);

  const isPlanReadOnly = isViewingHistory || plan?.status === "COMPLETED" || plan?.status === "CANCELLED";

  const loadCurrentPlan = async () => {
    if (!userId) {
      setLoading(false);
      message.error("User ID not found. Please log in again.");
      return;
    }

    try {
      const currentPlan = await quitPlanService.getCurrentPlan(userId);
      if (currentPlan) {
        setPlan(currentPlan);
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
      message.error("Failed to load current plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentPlan();
  }, [userId]);

  const loadHistoryPlans = async () => {
    if (!userId) return;

    setHistoryLoading(true);
    try {
      const plans = await quitPlanService.getUserPlans(userId);
      setHistoryPlans(plans);
    } catch (error) {
      console.error("Error loading history plans:", error);
      message.error("Failed to load history plans");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleBackToOverview = () => {
    setIsViewingHistory(false);
    loadCurrentPlan();
  };

  const handleOpenHistory = () => {
    setShowHistory(true);
    loadHistoryPlans();
  };

  const loadCoaches = async () => {
    try {
      const response = await api.get("/coach");
      setCoachList(response.data || []);
    } catch (error) {
      console.error("Failed to load coaches:", error);
      message.error("Failed to load coaches.");
    }
  };

  useEffect(() => {
    loadCoaches();
  }, []);

  const handleCreatePlan = async (formData) => {
    if (!userId) {
      console.log("userId is missing at handleCreatePlan");
      message.error("User ID not found. Please log in again.");
      return;
    }

    try {
      const payload = {
        title: formData.name || `No Smoking Plan - ${formData.durationInDays} Days`,
        startDate: formData.startDate,
        expectedEndDate: formData.endDate,
        reason: formData.reason,
        stagesDescription: noSmokingHelpers
          .getNoSmokingStages(formData.averageCigarettes, formData.durationInDays)
          .map((stage) => stage.stageName)
          .join("; "),
        customNotes: formData.customNotes || `🚭 No Smoking Plan - ${noSmokingHelpers.getMotivationalMessage(0)}`,
        userId,
      };

      const newPlan = await quitPlanService.createPlan(payload);

      const processedPlan = {
        ...newPlan,
        endDate: newPlan.endDate || newPlan.expectedEndDate,
        durationInDays: dayjs(newPlan.expectedEndDate || newPlan.endDate).diff(
          dayjs(newPlan.startDate),
          "day"
        ) + 1,
      };

      setPlan(processedPlan);
      setCreate(false);
      message.success("🎉 Your No Smoking plan has been created successfully!");
    } catch (error) {
      console.error("Error creating plan:", error);
      message.error("Failed to create quit plan. Please try again.");
    }
  };

  const handleUpdatePlan = async (updatedData) => {
    try {
      const updatedPlan = await quitPlanService.updatePlan(plan.planId, updatedData);
      setPlan(updatedPlan);
      message.success("Plan updated successfully!");
      return true;
    } catch (error) {
      console.error("Error updating plan:", error);
      message.error(error.response?.data?.message || "Failed to update plan");
      return false;
    }
  };

  const handleCoachChange = async (coach) => {
    try {
      if (!plan?.planId || !coach?.userId) {
        message.error("Missing plan or coach information");
        return;
      }

      await api.put(
        `/quit-plan/${plan.planId}/assign-coach?coachId=${coach.userId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setPlan((prev) => ({
        ...prev,
        coachId: coach.userId,
        coachName: coach.fullName,
      }));

      message.success(`Coach ${coach.fullName} assigned successfully!`);
    } catch (error) {
      console.error("Error assigning coach:", error);
      message.error(error.response?.data?.message || "Failed to assign coach");
    }
  };

  const handleCompletePlan = async () => {
    try {
      const completedPlan = await quitPlanService.completePlan(plan.planId);
      setPlan(completedPlan);
      setComplete(false);
      message.success("🏆 Congratulations! You have completed your No Smoking journey!");
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error("Error completing plan:", error);
      message.error(error.response?.data?.message || "Failed to complete plan. Please try again.");
    }
  };

  const handleCancelPlan = async (reason) => {
    try {
      await quitPlanService.cancelPlan(plan.planId, reason);
      setPlan(null);
      setCancel(false);
      setCreate(true);
      message.info("Plan has been cancelled. You can create a new one anytime.");
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error("Error cancelling plan:", error);
      message.error(error.response?.data?.message || "Failed to cancel plan. Please try again.");
    }
  };

  const handleDeletePlan = async () => {
    try {
      await quitPlanService.deletePlan(plan.planId, userId);
      setPlan(null);
      setDel(false);
      setCreate(true);
      message.success("Plan deleted successfully.");
    } catch (error) {
      console.error("Error deleting plan:", error);
      message.error(error.response?.data?.message || "Failed to delete plan. Please try again.");
    }
  };

  const handleSelectPackage = async (recommendation) => {
    if (!plan?.planId) {
      message.error("No active plan found");
      return;
    }

    if (isPlanReadOnly) {
      message.error("Cannot update a completed or cancelled plan");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Authentication token is missing. Please log in again.");
      return;
    }

    try {
      const updateData = {
        title: plan.title || "No Smoking Plan",
        startDate: plan.startDate,
        expectedEndDate: plan.expectedEndDate || plan.endDate,
        reason: plan.reason || "Quit smoking",
        stagesDescription: plan.stagesDescription || "",
        customNotes: plan.customNotes || "",
        userId: userId,
        coachId: plan.coachId || null,
        recommendedPackageId: recommendation.toPackageId,
      };

      const response = await api.put(
        `/api/quit-plan/${plan.planId}/user`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPlan((prev) => ({
        ...prev,
        ...response.data,
        recommendedPackageId: recommendation.toPackageId,
      }));

      // Lưu vào localStorage để giữ trạng thái khi tải lại trang
      localStorage.setItem(`selectedPackage_${plan.planId}`, recommendation.toPackageId);
      
      message.success("Recommended package updated successfully!");
    } catch (error) {
      console.error("Error updating package:", error);
      let errorMessage = "Failed to update package. Please try again.";
      if (error.response) {
        if (error.response.status === 403) {
          errorMessage = "You are not authorized to update this plan.";
        } else if (error.response.status === 400) {
          errorMessage = error.response.data.message || "Invalid data provided.";
        } else if (error.response.status === 404) {
          errorMessage = "Plan not found.";
        }
      }
      message.error(errorMessage);
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

  const isExpired = plan && dayjs().isAfter(dayjs(plan.expectedEndDate || plan.endDate));
  const completedDays = plan ? dayjs().diff(dayjs(plan.startDate), "day") + 1 : 0;
  const allCompleted = plan && completedDays >= (plan.durationInDays || duration);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c3e4dd] via-[#dfeee5] to-[#a1cfc1] py-8 px-2 sm:px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header với nút Back khi xem lịch sử */}
        <div className="flex items-center justify-between mt-18">
          {isViewingHistory ? (
            <>
              <button
                onClick={handleBackToOverview}
                className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900"
              >
                <LeftOutlined /> Back to Overview
              </button>
              <h1 className="text-4xl font-extrabold !text-emerald-700 drop-shadow tracking-wide">
                Plan History Details
              </h1>
              <div></div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <div className="text-6xl">🚭</div>
                <div>
                  <h1 className="text-4xl font-extrabold !text-emerald-700 drop-shadow tracking-wide">
                    No Smoking Plan
                  </h1>
                  {plan && (
                    <p className="text-emerald-600 font-medium mt-1">
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
                          endDate: plan.endDate || plan.expectedEndDate,
                          isViewOnly: isPlanReadOnly,
                          quitPlanStages: plan.quitPlanStages,
                        },
                      })
                    }
                    className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 flex items-center gap-2"
                  >
                    📊 View Detail
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setCreate(true)}
                    className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 flex items-center gap-2"
                  >
                    🚭 Start No Smoking Journey
                  </button>
                  <button
                    onClick={handleOpenHistory}
                    className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 flex items-center gap-2"
                  >
                    📜 View History
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Phần hiển thị khi không có plan */}
        {!plan && !isViewingHistory && (
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

        {/* History Modal */}
        <Modal
          title="Your Quit Plan History"
          open={showHistory}
          onCancel={() => setShowHistory(false)}
          footer={null}
          width={800}
        >
          {historyLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your history...</p>
            </div>
          ) : historyPlans.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No history plans found</p>
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b">
                    <th className="text-left p-3">Title</th>
                    <th className="text-left p-3">Period</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {historyPlans.map((p) => {
                    const endDate = p.endDate || p.expectedEndDate;
                    return (
                      <tr key={p.planId} className="border-b hover:bg-gray-50">
                        <td className="p-3">{p.title || "Untitled Plan"}</td>
                        <td className="p-3">
                          {dayjs(p.startDate).format("DD/MM/YYYY")} -{" "}
                          {dayjs(endDate).format("DD/MM/YYYY")}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              p.status === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : p.status === "CANCELLED"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {p.status || "UNKNOWN"}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => {
                              setPlan(p);
                              setShowHistory(false);
                              setIsViewingHistory(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Modal>

        {/* Phần hiển thị khi xem lịch sử */}
        {isViewingHistory && plan && (
          <>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <CoachBox
                  selectedCoachId={plan.coachId}
                  membership={membership}
                  onSelect={handleCoachChange}
                  coachList={coachList}
                  isViewOnly={isPlanReadOnly}
                />
              </div>
              <div className="flex flex-col gap-6">
                <PlanSummaryCard
                  plan={{
                    ...plan,
                    coachName: plan.coachId
                      ? coachList.find((c) => c.userId === plan.coachId)?.fullName
                      : null,
                  }}
                  onEdit={() => setEdit(true)}
                  onComplete={handleCompletePlan}
                  onCancel={() => setCancel(true)}
                  isCompleted={plan.status === "COMPLETED"}
                  isCancelled={plan.status === "CANCELLED"}
                  isViewOnly={isPlanReadOnly}
                />
                <StageList
                  durationInDays={plan.durationInDays}
                  startDate={plan.startDate}
                  endDate={plan.endDate || plan.expectedEndDate}
                  membership={membership}
                  planId={plan.planId}
                  averageCigarettes={plan.cigarettesPerDay}
                  quitPlanStages={plan.quitPlanStages}
                  isViewOnly={isPlanReadOnly}
                />
              </div>
            </div>

            <div className="mt-6">
              <CigaretteRecommendations
                recommendations={recommendations}
                currentCigaretteId={plan.cigarettePackageId}
                onSelectPackage={handleSelectPackage}
                isViewOnly={isPlanReadOnly}
                planId={plan.planId}
              />
            </div>
          </>
        )}

        {!isViewingHistory && plan && (
          <>
            {isExpired && (
              <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg border border-yellow-300 flex items-center gap-3">
                <div className="text-2xl">⚠️</div>
                <div>
                  <div className="font-semibold">Plan Expired</div>
                  <div className="text-sm">
                    This plan has expired. Consider creating a new No Smoking plan.
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
                      You've completed your No Smoking journey! You're now smoke-free!
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <CoachBox
                  selectedCoachId={plan.coachId}
                  membership={membership}
                  onSelect={handleCoachChange}
                  coachList={coachList}
                  isViewOnly={isPlanReadOnly}
                />
              </div>
              <div className="flex flex-col gap-6">
                <PlanSummaryCard
                  plan={{
                    ...plan,
                    coachName: plan.coachId
                      ? coachList.find((c) => c.userId === plan.coachId)?.fullName
                      : null,
                  }}
                  onEdit={() => setEdit(true)}
                  onComplete={() => setComplete(true)}
                  onCancel={() => setCancel(true)}
                  isCompleted={plan.status === "COMPLETED"}
                  isCancelled={plan.status === "CANCELLED"}
                  isViewOnly={isPlanReadOnly}
                />
                <StageList
                  durationInDays={plan.durationInDays}
                  startDate={plan.startDate}
                  endDate={plan.endDate || plan.expectedEndDate}
                  membership={membership}
                  planId={plan.planId}
                  averageCigarettes={plan.cigarettesPerDay}
                  quitPlanStages={plan.quitPlanStages}
                  isViewOnly={isPlanReadOnly}
                />
              </div>
            </div>

            <div className="mt-6">
              <CigaretteRecommendations
                recommendations={recommendations}
                currentCigaretteId={plan.cigarettePackageId}
                onSelectPackage={handleSelectPackage}
                isViewOnly={isPlanReadOnly}
                planId={plan.planId}
              />
            </div>
          </>
        )}

        {/* Các modal - chỉ hiển thị khi không ở chế độ read-only */}
        {!isPlanReadOnly && !isViewingHistory && (
          <>
            <CreatePlanModal
              open={showCreate}
              onClose={() => setCreate(false)}
              onCreate={handleCreatePlan}
            />

            <EditPlanModal
              open={showEdit}
              plan={plan}
              onClose={() => setEdit(false)}
              onSave={(updatedPlan) => {
                setPlan(updatedPlan);
                setEdit(false);
              }}
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
          </>
        )}
      </div>
    </div>
  );
};

export default QuitPlanOverview;