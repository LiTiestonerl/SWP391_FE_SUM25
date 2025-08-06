import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaCopy,
  FaStar,
} from "react-icons/fa";
import { format } from "date-fns";
import api from "../../configs/axios";

// Component con để render các ngôi sao (tái sử dụng)
const RenderStars = ({ rating }) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
        stars.push(
        <FaStar
            key={i}
            className={i < rating ? "text-yellow-400" : "text-gray-300"}
        />
        );
    }
    return <div className="flex gap-1">{stars}</div>;
};


const CoachProfile = () => {
  const { id } = useParams();
  const [coachData, setCoachData] = useState(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [myRatingForThisCoach, setMyRatingForThisCoach] = useState(null);
  const [isLoadingMyRating, setIsLoadingMyRating] = useState(true);
  const [ratingSummary, setRatingSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // CÁC HÀM XỬ LÝ
  const getLoggedInUser = () => {
    try {
      const persistRootString = localStorage.getItem("persist:root");
      if (!persistRootString) return null;
      const rootState = JSON.parse(persistRootString);
      const userString = rootState.user;
      if (!userString) return null;
      return JSON.parse(userString);
    } catch (error) {
      console.error("Lỗi khi đọc dữ liệu người dùng từ localStorage:", error);
      return null;
    }
  };
  const loggedInUser = getLoggedInUser();

  const handleSubmitFeedback = async () => {
    if (ratingValue === 0 || !feedbackText.trim()) {
      alert("Vui lòng chọn số sao và nhập nội dung đánh giá.");
      return;
    }
    if (!loggedInUser || !loggedInUser.id) {
      alert("Không tìm thấy thông tin đăng nhập. Vui lòng thử đăng nhập lại.");
      return;
    }
    setSubmitting(true);
    const payload = {
      memberId: loggedInUser.id,
      coachId: parseInt(id),
      ratingValue: ratingValue,
      feedbackText: feedbackText,
    };
    try {
      await api.post("/rating/coach", payload);
      alert("Gửi đánh giá thành công!");

      setShowFeedbackForm(false);
      setFeedbackText("");
      setRatingValue(0);

      const [myRatingsRes, summaryRes] = await Promise.all([
        api.get("/rating/member/me"),
        api.get(`/rating/coach/${id}/summary`),
      ]);

      const ratingForThisCoach = myRatingsRes.data.find(
        (r) => r.coach && r.coach.userId === parseInt(id)
      );
      setMyRatingForThisCoach(ratingForThisCoach);
      setRatingSummary(summaryRes.data);
    } catch (err) {
      console.error("Lỗi khi gửi đánh giá:", err);
      if (err.response && err.response.data && err.response.data.message) {
        alert(`Gửi đánh giá thất bại: ${err.response.data.message}`);
      } else {
        alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  //  TẢI DỮ LIỆU BAN ĐẦU
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const [coachRes, summaryRes] = await Promise.all([
          api.get(`/coach/${id}`),
          api.get(`/rating/coach/${id}/summary`),
        ]);

        setCoachData(coachRes.data);
        setRatingSummary(summaryRes.data);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu trang coach:", err);
        setRatingSummary({ averageRating: 0, totalRatings: 0 });
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [id]);

  useEffect(() => {
    if (loggedInUser && loggedInUser.id) {
      const fetchMyRatings = async () => {
        setIsLoadingMyRating(true);
        try {
          const response = await api.get("/rating/member/me");
          const ratingForThisCoach = response.data.find(
            (r) => r.coach && r.coach.userId === parseInt(id)
          );
          setMyRatingForThisCoach(ratingForThisCoach || null);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách đánh giá của tôi:", error);
          setMyRatingForThisCoach(null);
        } finally {
          setIsLoadingMyRating(false);
        }
      };
      fetchMyRatings();
    } else {
      setIsLoadingMyRating(false);
    }
  }, [id, loggedInUser?.id]);

  useEffect(() => {
    if (coachData?.fullName) {
      document.title = `${coachData.fullName} - Profile | NoSmoking`;
    }
  }, [coachData]);

  const copyToClipboard = (text) => text && navigator.clipboard.writeText(text);
  
  // RENDER GIAO DIỆN
  if (isLoading) {
    return <div className="p-8 text-center pt-[7.5rem]">Loading coach profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-[10rem] p-4 md-p-8 bg-gray-50">
     
       {/* Thông tin Coach */}
       <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800">
            {coachData?.fullName}
          </h1>
          <div className="flex items-center gap-2 justify-center md:justify-start mt-2">
            {ratingSummary ? (
              <>
                <RenderStars rating={ratingSummary.averageRating} />
                <span className="text-gray-600">
                  ({ratingSummary.totalRatings} ratings)
                </span>
              </>
            ) : (
              <span className="text-gray-500">No ratings yet.</span>
            )}
          </div>
        </div>
      </div>

      {/* Thông tin liên hệ */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <FaEnvelope className="text-blue-600" />
            <span>{coachData?.email}</span>
            <button
              onClick={() => copyToClipboard(coachData?.email)}
              className="ml-auto text-blue-600 hover:text-blue-800"
              title="Copy email"
            >
              <FaCopy />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <FaPhone className="text-blue-600" />
            <a href={`tel:${coachData?.phone}`} className="hover:text-blue-600">
              {coachData?.phone}
            </a>
            <button
              onClick={() => copyToClipboard(coachData?.phone)}
              className="ml-auto text-blue-600 hover:text-blue-800"
              title="Copy phone"
            >
              <FaCopy />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <FaCalendar className="text-blue-600" />
            <span>
              Registered on{" "}
              {format(
                new Date(coachData?.registrationDate || Date.now()),
                "MMMM dd, yyyy"
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Đánh giá của chính bạn cho Coach này */}
      {!isLoadingMyRating && myRatingForThisCoach && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Đánh giá của bạn cho HLV này
          </h2>
          <div className="flex items-center gap-1 mb-3">
            <RenderStars rating={myRatingForThisCoach.ratingValue} />
          </div>
          <p className="text-gray-700 italic">
            "{myRatingForThisCoach.feedbackText}"
          </p>
          <p className="text-right text-sm text-gray-500 mt-2">
            Đã gửi ngày:{" "}
            {format(new Date(myRatingForThisCoach.ratingDate), "dd/MM/yyyy")}
          </p>
        </div>
      )}

      {/* Khu vực hành động cho người dùng đã đăng nhập */}
      {loggedInUser && !isLoadingMyRating && (
        <div className="text-center mt-6 mb-8 flex justify-center items-center gap-4">
          {!myRatingForThisCoach && !showFeedbackForm && (
            <button
              onClick={() => setShowFeedbackForm(true)}
              className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
            >
              Leave Feedback
            </button>
          )}
        </div>
      )}

      {/* Form để gửi đánh giá */}
      {showFeedbackForm && !myRatingForThisCoach && (
         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
         <h2 className="text-xl font-semibold mb-4">Your Feedback</h2>
         <div className="flex gap-2 mb-4">
           {[1, 2, 3, 4, 5].map((star) => (
             <button
               key={star}
               onClick={() => setRatingValue(star)}
               className={`text-2xl transition-colors ${
                 star <= ratingValue
                   ? "text-yellow-400"
                   : "text-gray-300 hover:text-yellow-200"
               }`}
             >
               <FaStar />
             </button>
           ))}
         </div>
         <textarea
           value={feedbackText}
           onChange={(e) => setFeedbackText(e.target.value)}
           className="w-full border p-2 rounded mb-4"
           rows="4"
           placeholder="Write your feedback..."
         />
         <div className="flex justify-end gap-2">
           <button
             onClick={() => setShowFeedbackForm(false)}
             className="text-gray-600 px-4 py-2 border rounded hover:bg-gray-100"
           >
             Cancel
           </button>
           <button
             onClick={handleSubmitFeedback}
             disabled={submitting}
             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
           >
             {submitting ? "Đang gửi..." : "Gửi đánh giá"}
           </button>
         </div>
       </div>
      )}
    </div>
  );
};

export default CoachProfile;