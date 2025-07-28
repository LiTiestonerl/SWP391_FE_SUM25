import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaShare,
  FaPrint,
  FaCopy,
  FaStar,
  FaStarHalf,
} from "react-icons/fa";
import { format } from "date-fns";
import api from "../../configs/axios";

const CoachProfile = () => {
  const { id } = useParams();
  const [coachData, setCoachData] = useState(null);
  const [showAllComments, setShowAllComments] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchCoach = async () => {
      try {
        const res = await api.get(`/coach/${id}`);
        setCoachData(res.data);
      } catch (err) {
        console.error("Failed to fetch coach:", err);
      }
    };
    fetchCoach();
  }, [id]);

  useEffect(() => {
    if (coachData?.fullName) {
      document.title = `${coachData.fullName} - Profile | NoSmoking`;
    }
  }, [coachData]);

  const copyToClipboard = (text) => navigator.clipboard.writeText(text);

  const handlePrint = () => window.print();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${coachData.fullName}'s Profile`,
        text: `Check out ${coachData.fullName}'s coaching profile!`,
        url: window.location.href,
      });
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalf key="half-star" className="text-yellow-400" />);
    }
    return stars;
  };

  if (!coachData) {
    return <div className="p-8 text-center pt-[7.5rem]">Loading coach profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-[10rem] p-4 md:p-8 bg-gray-50">
      {/* Avatar & Info */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <div className="relative">
          <img
            src={
              coachData.avatar ||
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
            }
            alt={coachData.fullName}
            className="w-32 h-32 rounded-full object-cover shadow-lg"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde";
            }}
          />
          <span
            className={`absolute bottom-0 right-0 w-6 h-6 rounded-full ${
              coachData.status === "active" ? "bg-green-500" : "bg-red-500"
            } border-2 border-white`}
            title={`Status: ${coachData.status}`}
          ></span>
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800">{coachData.fullName}</h1>
          <div className="flex items-center gap-2 justify-center md:justify-start mt-2">
            {renderStars(coachData.rating || 4.5)}
            <span className="text-gray-600">
              ({coachData.totalRatings || 123} ratings)
            </span>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <FaEnvelope className="text-blue-600" />
            <span>{coachData.email}</span>
            <button onClick={() => copyToClipboard(coachData.email)} className="ml-auto text-blue-600 hover:text-blue-800" title="Copy email"><FaCopy /></button>
          </div>
          <div className="flex items-center gap-4">
            <FaPhone className="text-blue-600" />
            <a href={`tel:${coachData.phone}`} className="hover:text-blue-600">{coachData.phone}</a>
            <button onClick={() => copyToClipboard(coachData.phone)} className="ml-auto text-blue-600 hover:text-blue-800" title="Copy phone"><FaCopy /></button>
          </div>
          <div className="flex items-center gap-4">
            <FaCalendar className="text-blue-600" />
            <span>
              Registered on{" "}
              {format(new Date(coachData.registrationDate || "2023-01-01"), "MMMM dd, yyyy")}
            </span>
          </div>
        </div>
      </div>

      {/* Leave Feedback Button */}
      <div className="text-center mt-6 mb-8">
        <button
          onClick={() => setShowFeedbackForm(true)}
          className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
        >
          Leave Feedback
        </button>
      </div>

      {/* Feedback Form */}
      {showFeedbackForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Feedback</h2>

          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRatingValue(star)}
                className={`text-2xl ${star <= ratingValue ? "text-yellow-400" : "text-gray-300"}`}
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
              onClick={async () => {
                if (ratingValue === 0 || !feedbackText.trim()) return;
                setSubmitting(true);
                try {
                  await api.post("/rating", {
                    ratingValue,
                    feedbackText,
                    ratingType: "COACH",
                    coachId: coachData.userId,
                    postId: null,
                    planId: null,
                  });
                  alert("Feedback submitted successfully!");
                  setShowFeedbackForm(false);
                  setFeedbackText("");
                  setRatingValue(0);
                } catch (err) {
                  console.error(err);
                  alert("Failed to submit feedback.");
                }
                setSubmitting(false);
              }}
              disabled={submitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      )}

      {/* Print & Share */}
      <div className="fixed bottom-4 right-4 flex gap-2">
        <button
          onClick={handleShare}
          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          title="Share Profile"
        >
          <FaShare />
        </button>
        <button
          onClick={handlePrint}
          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          title="Print Profile"
        >
          <FaPrint />
        </button>
      </div>
    </div>
  );
};

export default CoachProfile;