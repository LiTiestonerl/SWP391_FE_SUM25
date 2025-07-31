import React, { useState, useEffect, useMemo } from "react";
import { AiFillStar } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
import api from "../../../configs/axios";

/* =========================
 * Shared UI: Stars
 * ========================= */
const StarRow = ({ value = 0, onChange = () => {}, readOnly = false }) => (
  <div className="flex flex-row gap-1">
    {Array.from({ length: 5 }, (_, i) => (
      <AiFillStar
        key={i}
        onClick={() => !readOnly && onChange(i + 1)}
        className={`text-xl cursor-pointer ${
          i < value ? "text-yellow-400" : "text-gray-300"
        }`}
      />
    ))}
  </div>
);

/* =========================
 * Constants / Helpers
 * ========================= */
const MOCK_RATING_DATA = {
  coachRating: 4,
  coachComment: "Great effort! Keep up the good work!",
  userRating: null,
  userComment: null,
};

const formatVND = (v) =>
  typeof v === "number" ? v.toLocaleString("vi-VN") + " VND" : "N/A";

// Thứ tự mạnh → yếu
const ORDER = ["HIGH", "MEDIUM", "LOW", "ZERO"];
const STEP_DOWN = { HIGH: "MEDIUM", MEDIUM: "LOW", LOW: "ZERO", ZERO: null };

// Dự phòng sample packages (đúng với DB bạn cung cấp)
const SAMPLE_PACKAGES = [
  {
    cigarette_id: 1,
    brand: "Marlboro",
    cigarette_name: "Marlboro Red",
    flavor: "Classic Tobacco",
    nicotene_strength: "HIGH",
    price: 45000.0,
    sticks_per_pack: 20,
  },
  {
    cigarette_id: 2,
    brand: "Marlboro",
    cigarette_name: "Marlboro Gold",
    flavor: "Smooth Tobacco",
    nicotene_strength: "MEDIUM",
    price: 47000.0,
    sticks_per_pack: 20,
  },
  {
    cigarette_id: 3,
    brand: "Camel",
    cigarette_name: "Camel Blue",
    flavor: "Mellow Tobacco",
    nicotene_strength: "LOW",
    price: 43000.0,
    sticks_per_pack: 20,
  },
  {
    cigarette_id: 4,
    brand: "Camel",
    cigarette_name: "Camel Crush",
    flavor: "Menthol",
    nicotene_strength: "MEDIUM",
    price: 46000.0,
    sticks_per_pack: 20,
  },
  {
    cigarette_id: 5,
    brand: "L&M",
    cigarette_name: "L&M Blue Label",
    flavor: "Tobacco",
    nicotene_strength: "LOW",
    price: 39000.0,
    sticks_per_pack: 20,
  },
  {
    cigarette_id: 6,
    brand: "L&M",
    cigarette_name: "L&M Zero",
    flavor: "Menthol-Free",
    nicotene_strength: "ZERO",
    price: 42000.0,
    sticks_per_pack: 20,
  },
  {
    cigarette_id: 7,
    brand: "Vinataba",
    cigarette_name: "Vinataba Classic",
    flavor: "Vietnam Tobacco",
    nicotene_strength: "HIGH",
    price: 28000.0,
    sticks_per_pack: 20,
  },
  {
    cigarette_id: 8,
    brand: "Thang Long",
    cigarette_name: "Thang Long Gold",
    flavor: "Vietnam Tobacco",
    nicotene_strength: "MEDIUM",
    price: 25000.0,
    sticks_per_pack: 20,
  },
];

/* =========================
 * Normalizer cho package từ API/DB
 * ========================= */
function normalizePackage(p) {
  return {
    id: p.cigarette_id ?? p.cigarettePackageId ?? p.id,
    brand: p.brand,
    name: p.cigarette_name ?? p.cigarettePackageName ?? p.name,
    flavor: p.flavor,
    // API DB dùng "nicotene_strength" (typo), FE có thể là "nicotineLevel"
    strength: p.nicotene_strength ?? p.nicotineLevel ?? p.strength,
    // giá/bao & số điếu/bao
    price: Number(p.price ?? p.pricePerPack ?? 0),
    sticks: Number(p.sticks_per_pack ?? p.sticksPerPack ?? 0),
    // giữ lại raw để tuỳ ý hiển thị
    _raw: p,
  };
}

function pricePerCig(pkg) {
  if (!pkg?.sticks || !pkg?.price) return null;
  return Math.round(pkg.price / pkg.sticks);
}

// Xây lộ trình step‑down theo addictionLevel + tổng tuần (nếu cung cấp)
function buildStepDownPath(currentStrength, addictionLevel, durationInDays) {
  const startIdx = ORDER.indexOf((currentStrength || "").toUpperCase());
  if (startIdx < 0) return [];

  const level = (addictionLevel || "").toUpperCase();
  const steps = [];

  // Danh sách bậc cần đi qua
  for (let i = startIdx; i < ORDER.length - 1; i++) {
    const from = ORDER[i];
    const to = ORDER[i + 1];
    if (!to) break;
    steps.push({ from, to });
  }
  if (steps.length === 0) return [];

  // Nếu có durationInDays, phân bổ tuần đều cho số bước
  const totalWeeks = durationInDays
    ? Math.max(1, Math.ceil(Number(durationInDays) / 7))
    : null;
  if (totalWeeks) {
    const base = Math.max(1, Math.floor(totalWeeks / steps.length));
    let remain = Math.max(0, totalWeeks - base * steps.length);
    return steps.map((s, idx) => ({
      ...s,
      weeks: base + (idx < remain ? 1 : 0),
    }));
  }

  // Nếu không có durationInDays: set mặc định theo mức độ nghiện
  const defaultWeeks =
    level === "SEVERE"
      ? 2 // mỗi bước ~2 tuần
      : level === "MODERATE"
      ? 1 // mỗi bước ~1 tuần
      : 1;

  return steps.map((s) => ({ ...s, weeks: defaultWeeks }));
}

// Tìm candidates ở bậc kế tiếp: ưu tiên cùng brand; nếu không có → gần giá nhất
function findNextCandidates({ all, currentPkg, nextStrength, limit = 3 }) {
  const pool = all.filter((p) => p.strength === nextStrength);
  if (pool.length === 0) return [];

  const sameBrand = pool.filter((p) => p.brand === currentPkg.brand);
  const list = sameBrand.length > 0 ? sameBrand : pool;

  return list
    .sort(
      (a, b) =>
        Math.abs(a.price - currentPkg.price) -
        Math.abs(b.price - currentPkg.price)
    )
    .slice(0, limit);
}

/* ============================================================
 * CoachSuggestionCard: gợi ý Replacement theo mức độ nghiện + gói hiện tại
 * Props:
 *  - planId (optional)
 *  - currentPackageId: id gói hiện tại
 *  - addictionLevel: 'Mild' | 'Moderate' | 'Severe'
 *  - durationInDays (optional): để phân bổ tuần cho lộ trình
 * ============================================================ */
export const CoachSuggestionCard = ({
  planId,
  currentPackageId,
  addictionLevel = "Mild",
  durationInDays,
}) => {
  const [packages, setPackages] = useState([]);
  const [currentPkg, setCurrentPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kết quả gợi ý cho bước KẾ TIẾP
  const [nextStrength, setNextStrength] = useState(null);
  const [primary, setPrimary] = useState(null);
  const [alternatives, setAlternatives] = useState([]);

  // Lộ trình đầy đủ
  const stepPath = useMemo(() => {
    if (!currentPkg) return [];
    return buildStepDownPath(
      currentPkg.strength,
      addictionLevel,
      durationInDays
    );
  }, [currentPkg, addictionLevel, durationInDays]);

  // Fetch packages
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/cigarette-packages");
        const rawList = res?.data || [];
        const normalized = rawList.map(normalizePackage);
        setPackages(normalized);

        if (currentPackageId) {
          const found =
            normalized.find((p) => String(p.id) === String(currentPackageId)) ||
            // fallback: đôi khi FE đang giữ id ở field khác của raw
            normalized.find(
              (p) =>
                String(p._raw?.cigarettePackageId) ===
                  String(currentPackageId) ||
                String(p._raw?.cigarette_id) === String(currentPackageId)
            );
          setCurrentPkg(found || null);
        }
      } catch (err) {
        console.error("Failed to fetch cigarette packages. Using sample.", err);
        const normalized = SAMPLE_PACKAGES.map(normalizePackage);
        setPackages(normalized);
        const found = normalized.find(
          (p) => String(p.id) === String(currentPackageId)
        );
        setCurrentPkg(found || null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPackageId]);

  // Tính gói kế tiếp ở bậc thấp hơn + candidates
  useEffect(() => {
    if (!currentPkg || packages.length === 0) return;
    const next = STEP_DOWN[(currentPkg.strength || "").toUpperCase()];
    setNextStrength(next);

    if (!next) {
      setPrimary(null);
      setAlternatives([]);
      return;
    }

    const candidates = findNextCandidates({
      all: packages,
      currentPkg,
      nextStrength: next,
      limit: 3,
    });

    setPrimary(candidates[0] || null);
    setAlternatives(candidates.slice(1));
  }, [currentPkg, packages]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 border">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!currentPkg) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 border">
        <h3 className="font-semibold text-emerald-700 text-md mb-2">
          🚬 Replacement Suggestions
        </h3>
        <p className="text-sm text-gray-500">
          We couldn’t detect your current package. Please select a cigarette
          package in your plan first.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border">
      <h3 className="font-semibold text-emerald-700 text-md mb-3">
        🚬 Nicotine Replacement Suggestions
      </h3>

      {/* Current package */}
      <div className="mb-3">
        <div className="text-sm text-gray-600">Current package</div>
        <div className="mt-1 text-sm font-semibold">{currentPkg.name}</div>
      </div>

      {/* Next step recommendation */}
      {!nextStrength ? (
        <p className="text-gray-500 text-sm">
          ✅ You are already at the lowest nicotine level (ZERO).
        </p>
      ) : (
        <>
          <div className="text-sm text-gray-600 mb-1">
            Next step: <b>{nextStrength}</b>
          </div>

          {/* Primary recommendation */}
          {primary ? (
            <div className="border rounded-md p-3 bg-emerald-50 border-emerald-100">
              <p className="font-semibold text-gray-900 mb-1">{primary.name}</p>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Brand:</span> {primary.brand}
                </p>
                <p>
                  <span className="font-medium">Flavor:</span> {primary.flavor}
                </p>
                <p>
                  <span className="font-medium">Strength:</span>{" "}
                  {primary.strength}
                </p>
                <p>
                  <span className="font-medium">Price:</span>{" "}
                  {formatVND(Number(primary.price))} / pack
                  {pricePerCig(primary)
                    ? ` • ~${pricePerCig(primary).toLocaleString(
                        "vi-VN"
                      )} VND / cig`
                    : ""}
                </p>
              </div>
              <div className="mt-2 p-2 bg-blue-50 text-blue-700 text-xs rounded">
                Step down from <b>{currentPkg.name}</b> ({currentPkg.strength})
                to <b>{primary.name}</b> ({nextStrength}) to gradually reduce
                nicotine.
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              No same‑brand option at {nextStrength}. See alternatives below.
            </div>
          )}

          {/* Alternatives */}
          {alternatives.length > 0 && (
            <div className="mt-3">
              <div className="text-sm font-medium text-gray-700 mb-2">
                Other options at {nextStrength}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {alternatives.map((alt) => (
                  <div key={alt.id} className="border rounded p-2">
                    <div className="font-semibold text-sm">{alt.name}</div>
                    <div className="text-xs text-gray-600">
                      {alt.brand} • {alt.flavor}
                    </div>
                    <div className="text-xs text-gray-600">
                      Price: {formatVND(Number(alt.price))}
                      {pricePerCig(alt)
                        ? ` • ~${pricePerCig(alt).toLocaleString(
                            "vi-VN"
                          )} VND/cig`
                        : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

/* ============================================================
 * CoachFeedbackCard: chỉ hiển thị khi plan đã hoàn thành
 * ============================================================ */
export const CoachFeedbackCard = ({
  coachId,
  coachName = "Coach",
  planId,
  memberId,
  isPlanCompleted = false,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(isPlanCompleted);
  const [error, setError] = useState(null);
  const [ratingData, setRatingData] = useState(MOCK_RATING_DATA);
  const [tempRating, setTempRating] = useState(5);
  const [tempComment, setTempComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Nếu chưa hoàn thành plan → không fetch, không render
  useEffect(() => {
    if (!isPlanCompleted) return;

    const fetchRatings = async () => {
      try {
        setLoading(true);

        // Coach public rating
        if (coachId) {
          try {
            const res = await api.get(`/rating/coach/${coachId}`);
            if (res.data && res.data.length > 0) {
              const latestRating = res.data[0];
              setRatingData((prev) => ({
                ...prev,
                coachRating: latestRating.ratingValue,
                coachComment: latestRating.feedbackText,
              }));
            }
          } catch {
            /* ignore */
          }
        }

        // User rating for this plan
        if (memberId && planId) {
          try {
            const res = await api.get(`/rating/member/${memberId}`);
            if (res.data) {
              const userRating = Array.isArray(res.data)
                ? res.data.find((r) => r.planId === planId)
                : null;
              if (userRating) {
                setRatingData((prev) => ({
                  ...prev,
                  userRating: userRating.ratingValue,
                  userComment: userRating.feedbackText,
                }));
              }
            }
          } catch {
            /* ignore */
          }
        }

        setError(null);
      } catch (err) {
        console.error("Failed to fetch ratings:", err);
        setError("Failed to load rating data. Using sample data.");
        setRatingData(MOCK_RATING_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [coachId, planId, memberId, isPlanCompleted]);

  if (!isPlanCompleted) return null;

  const handleSubmitRating = async () => {
    if (!coachId || !planId || !memberId) {
      alert("Missing required data to submit rating");
      return;
    }

    try {
      setIsSubmitting(true);

      const ratingPayload = {
        ratingValue: tempRating,
        feedbackText: tempComment,
        ratingType: "COACH",
        coachId,
        planId,
        memberId,
      };

      try {
        await api.post("/rating", ratingPayload);
      } catch (err) {
        console.error("API failed but we will save locally", err);
      }

      setRatingData((prev) => ({
        ...prev,
        userRating: tempRating,
        userComment: tempComment,
      }));

      setOpen(false);
    } catch (err) {
      console.error("Failed to submit rating:", err);
      alert("Failed to submit rating. Your feedback has been saved locally.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
        <h3 className="font-semibold text-emerald-700">Coach Feedback</h3>

        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-3 text-sm">
            <p className="text-yellow-700">{error}</p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <StarRow value={ratingData.coachRating} readOnly />
          <span className="text-sm text-gray-600">
            {ratingData.coachRating}/5
          </span>
        </div>
        <p className="text-sm text-gray-700 italic">
          “{ratingData.coachComment}” — <b>{coachName}</b>
        </p>

        {ratingData.userRating > 0 && (
          <div className="space-y-1 pt-3 border-t">
            <p className="text-sm text-gray-600 font-medium">Your Feedback:</p>
            <div className="flex items-center gap-2">
              <StarRow value={ratingData.userRating} readOnly />
              <span className="text-sm text-gray-600">
                {ratingData.userRating}/5
              </span>
            </div>
            {ratingData.userComment && (
              <p className="text-sm text-gray-600 italic">
                “{ratingData.userComment}”
              </p>
            )}
          </div>
        )}

        <button
          onClick={() => {
            setTempRating(ratingData.userRating || 5);
            setTempComment(ratingData.userComment || "");
            setOpen(true);
          }}
          className="px-4 py-2 bg-emerald-600 text-white text-sm rounded shadow hover:bg-emerald-700"
        >
          {ratingData.userRating ? "Edit Feedback" : "Give Feedback"}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-5"
            >
              <h3 className="text-lg font-semibold text-emerald-700">
                Rate your coach
              </h3>
              <StarRow value={tempRating} onChange={setTempRating} />
              <textarea
                rows={4}
                value={tempComment}
                onChange={(e) => setTempComment(e.target.value)}
                className="w-full border rounded p-3 text-sm"
                placeholder="Write a comment…"
              />
              <div className="flex gap-4">
                <button
                  onClick={handleSubmitRating}
                  className="flex-1 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
