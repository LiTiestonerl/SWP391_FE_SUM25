import React, { useState, useEffect } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../../../configs/axios';

/* =========================
 * Shared UI: Stars
 * ========================= */
const StarRow = ({ value = 0, onChange = () => {}, readOnly = false }) => (
  <div className="flex flex-row gap-1">
    {Array.from({ length: 5 }, (_, i) => (
      <AiFillStar
        key={i}
        onClick={() => !readOnly && onChange(i + 1)}
        className={`text-xl cursor-pointer ${i < value ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ))}
  </div>
);

/* =========================
 * Constants / Helpers
 * ========================= */
const MOCK_RATING_DATA = {
  coachRating: 4,
  coachComment: 'Great effort! Keep up the good work!',
  userRating: null,
  userComment: null,
};

const formatVND = (v) =>
  typeof v === 'number' ? v.toLocaleString('vi-VN') + ' VND' : 'N/A';

// Dữ liệu mẫu fallback khi API gói thuốc lỗi
const SAMPLE_PACKAGES = [
  { cigarette_id: 1, brand: 'Marlboro',   cigarette_name: 'Marlboro Red',   flavor: 'Classic Tobacco',  nicotene_strength: 'HIGH',   price: 45000.00, sticks_per_pack: 20 },
  { cigarette_id: 2, brand: 'Marlboro',   cigarette_name: 'Marlboro Gold',  flavor: 'Smooth Tobacco',   nicotene_strength: 'MEDIUM', price: 47000.00, sticks_per_pack: 20 },
  { cigarette_id: 3, brand: 'Camel',      cigarette_name: 'Camel Blue',     flavor: 'Mellow Tobacco',   nicotene_strength: 'LOW',    price: 43000.00, sticks_per_pack: 20 },
  { cigarette_id: 4, brand: 'Camel',      cigarette_name: 'Camel Crush',    flavor: 'Menthol',          nicotene_strength: 'MEDIUM', price: 46000.00, sticks_per_pack: 20 },
  { cigarette_id: 5, brand: 'L&M',        cigarette_name: 'L&M Blue Label', flavor: 'Tobacco',          nicotene_strength: 'LOW',    price: 39000.00, sticks_per_pack: 20 },
  { cigarette_id: 6, brand: 'L&M',        cigarette_name: 'L&M Zero',       flavor: 'Menthol-Free',     nicotene_strength: 'ZERO',   price: 42000.00, sticks_per_pack: 20 },
  { cigarette_id: 7, brand: 'Vinataba',   cigarette_name: 'Vinataba Classic', flavor: 'Vietnam Tobacco', nicotene_strength: 'HIGH',   price: 28000.00, sticks_per_pack: 20 },
  { cigarette_id: 8, brand: 'Thang Long', cigarette_name: 'Thang Long Gold',  flavor: 'Vietnam Tobacco', nicotene_strength: 'MEDIUM', price: 25000.00, sticks_per_pack: 20 },
];

// Bảng giảm bậc nicotine
const STEP_DOWN = { HIGH: 'MEDIUM', MEDIUM: 'LOW', LOW: 'ZERO', ZERO: null };

/* ============================================================
 * CoachSuggestionCard: chỉ hiển thị Recommend (không show Current)
 * Dựa trên currentPackageId (gói user đang hút) → gợi ý step-down
 * ============================================================ */
export const CoachSuggestionCard = ({ planId, currentPackageId }) => {
  const [packages, setPackages] = useState([]);
  const [currentPkg, setCurrentPkg] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load list packages từ API → fallback SAMPLE_PACKAGES
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/cigarette-packages');
        const list = res?.data || [];
        setPackages(list);

        if (currentPackageId) {
          // Dữ liệu API chuẩn nên là snake_case như SAMPLE_PACKAGES
          const found =
            list.find((p) => String(p.cigarette_id) === String(currentPackageId)) ||
            list.find((p) => String(p.cigarettePackageId) === String(currentPackageId)); // phòng khi backend trả kiểu khác
          setCurrentPkg(found || null);
        }
      } catch (err) {
        console.error('Failed to fetch cigarette packages. Using sample.', err);
        setPackages(SAMPLE_PACKAGES);
        setCurrentPkg(SAMPLE_PACKAGES.find((p) => String(p.cigarette_id) === String(currentPackageId)) || null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPackageId]);

  // Tính gợi ý giảm dần nicotine
  useEffect(() => {
    if (!currentPkg || packages.length === 0) return;

    const nextStrength = STEP_DOWN[currentPkg.nicotene_strength];
    if (!nextStrength) {
      setRecommendation(null); // Đang ZERO rồi thì không recommend
      return;
    }

    // Ưu tiên cùng brand
    let candidates = packages.filter(
      (p) => p.nicotene_strength === nextStrength && p.brand === currentPkg.brand
    );

    // Nếu không có cùng brand: chọn brand khác gần giá nhất
    if (candidates.length === 0) {
      candidates = packages.filter((p) => p.nicotene_strength === nextStrength);
      candidates.sort(
        (a, b) => Math.abs(a.price - currentPkg.price) - Math.abs(b.price - currentPkg.price)
      );
    }

    if (candidates.length > 0) {
      const best = candidates[0];
      setRecommendation({
        notes: `Step down from ${currentPkg.cigarette_name} (${currentPkg.nicotene_strength}) to ${best.cigarette_name} (${nextStrength}) for gradual nicotine reduction.`,
        recommendedPackage: best,
      });
    } else {
      setRecommendation(null);
    }
  }, [currentPkg, packages]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 border">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border">
      <h3 className="font-semibold text-emerald-700 text-md mb-3">🚬 Nicotine Replacement Recommendation</h3>

      {!recommendation ? (
        <p className="text-gray-500 text-sm">
          ✅ You are already at the lowest nicotine level (ZERO) or we have no recommendation yet.
        </p>
      ) : (
        <div className="border rounded-md p-3 bg-emerald-50 border-emerald-100">
          <p className="font-semibold text-gray-900 mb-2">
            {recommendation.recommendedPackage.cigarette_name}
          </p>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Brand:</span> {recommendation.recommendedPackage.brand}</p>
            <p><span className="font-medium">Strength:</span> {recommendation.recommendedPackage.nicotene_strength}</p>
            <p><span className="font-medium">Flavor:</span> {recommendation.recommendedPackage.flavor}</p>
            <p><span className="font-medium">Price:</span> {formatVND(Number(recommendation.recommendedPackage.price))} / pack</p>
          </div>

          <div className="mt-3 p-2 bg-blue-50 text-blue-700 text-sm rounded">
            {recommendation.notes}
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================
 * CoachFeedbackCard: chỉ hiển thị khi plan đã hoàn thành
 * Truyền prop: isPlanCompleted = true khi plan kết thúc
 * ============================================================ */
export const CoachFeedbackCard = ({
  coachId,
  coachName = 'Coach',
  planId,
  memberId,
  isPlanCompleted = false, // <- quan trọng: mặc định false
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(isPlanCompleted); // chỉ loading khi sẽ hiển thị
  const [error, setError] = useState(null);
  const [ratingData, setRatingData] = useState(MOCK_RATING_DATA);
  const [tempRating, setTempRating] = useState(5);
  const [tempComment, setTempComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ❗ Nếu chưa hoàn thành plan → KHÔNG fetch, KHÔNG render
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
            // ignore permission/no data
          }
        }

        // User's own rating for this plan
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
            // ignore permission/no data
          }
        }

        setError(null);
      } catch (err) {
        console.error('Failed to fetch ratings:', err);
        setError('Failed to load rating data. Using sample data.');
        setRatingData(MOCK_RATING_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [coachId, planId, memberId, isPlanCompleted]);

  // Nếu chưa hoàn thành plan → không render gì
  if (!isPlanCompleted) return null;

  const handleSubmitRating = async () => {
    if (!coachId || !planId || !memberId) {
      alert('Missing required data to submit rating');
      return;
    }

    try {
      setIsSubmitting(true);

      const ratingPayload = {
        ratingValue: tempRating,
        feedbackText: tempComment,
        ratingType: 'COACH',
        coachId,
        planId,
        memberId,
      };

      try {
        await api.post('/rating', ratingPayload);
      } catch (err) {
        console.error('API failed but we will save locally', err);
      }

      setRatingData((prev) => ({
        ...prev,
        userRating: tempRating,
        userComment: tempComment,
      }));

      setOpen(false);
    } catch (err) {
      console.error('Failed to submit rating:', err);
      alert('Failed to submit rating. Your feedback has been saved locally.');
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
          <span className="text-sm text-gray-600">{ratingData.coachRating}/5</span>
        </div>
        <p className="text-sm text-gray-700 italic">
          “{ratingData.coachComment}” — <b>{coachName}</b>
        </p>

        {ratingData.userRating > 0 && (
          <div className="space-y-1 pt-3 border-t">
            <p className="text-sm text-gray-600 font-medium">Your Feedback:</p>
            <div className="flex items-center gap-2">
              <StarRow value={ratingData.userRating} readOnly />
              <span className="text-sm text-gray-600">{ratingData.userRating}/5</span>
            </div>
            {ratingData.userComment && (
              <p className="text-sm text-gray-600 italic">“{ratingData.userComment}”</p>
            )}
          </div>
        )}

        <button
          onClick={() => {
            setTempRating(ratingData.userRating || 5);
            setTempComment(ratingData.userComment || '');
            setOpen(true);
          }}
          className="px-4 py-2 bg-emerald-600 text-white text-sm rounded shadow hover:bg-emerald-700"
        >
          {ratingData.userRating ? 'Edit Feedback' : 'Give Feedback'}
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
              <h3 className="text-lg font-semibold text-emerald-700">Rate your coach</h3>
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
                  {isSubmitting ? 'Saving...' : 'Save'}
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
