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

  if (!coachData) {
    return <div className="p-8 text-center">Loading coach profile...</div>;
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handlePrint = () => {
    window.print();
  };

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

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-gray-50">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <div className="relative">
          <img
            src={coachData.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330"}
            alt={coachData.fullName}
            className="w-32 h-32 rounded-full object-cover shadow-lg"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde";
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

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <FaEnvelope className="text-blue-600" />
            <span>{coachData.email}</span>
            <button
              onClick={() => copyToClipboard(coachData.email)}
              className="ml-auto text-blue-600 hover:text-blue-800"
              title="Copy email"
            >
              <FaCopy />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <FaPhone className="text-blue-600" />
            <a href={`tel:${coachData.phone}`} className="hover:text-blue-600">
              {coachData.phone}
            </a>
            <button
              onClick={() => copyToClipboard(coachData.phone)}
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
                new Date(coachData.registrationDate || "2023-01-01"),
                "MMMM dd, yyyy"
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Rating breakdown - optional */}
      {coachData.ratingBreakdown && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Rating Breakdown</h2>
          {Object.entries(coachData.ratingBreakdown)
            .reverse()
            .map(([rating, count]) => (
              <div key={rating} className="flex items-center gap-4 mb-2">
                <span className="w-4">{rating}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 rounded-full h-2"
                    style={{
                      width: `${(count / coachData.totalRatings) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="w-12 text-right">{count}</span>
              </div>
            ))}
        </div>
      )}

      {/* Comments - optional */}
      {coachData.comments && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Client Comments</h2>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {coachData.comments
              .slice(0, showAllComments ? undefined : 2)
              .map((comment) => (
                <div key={comment.id} className="border-b pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{comment.name}</span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(comment.date), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {renderStars(comment.rating)}
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              ))}
          </div>
          {coachData.comments.length > 2 && (
            <button
              onClick={() => setShowAllComments(!showAllComments)}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              {showAllComments ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      )}

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
