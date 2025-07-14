import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FaLeaf, FaSpinner } from "react-icons/fa";
import api from "../../configs/axios";

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [packageDetails, setPackageDetails] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Lấy memberPackageId từ location.state hoặc query params
  const memberPackageId = location.state?.memberPackageId || searchParams.get("memberPackageId");

  useEffect(() => {
    // Cuộn lên đầu trang khi tải
    window.scrollTo(0, 0);

    if (!memberPackageId) {
      alert("Không tìm thấy gói thành viên!");
      navigate("/membership");
      return;
    }

    // Lưu memberPackageId vào localStorage
    localStorage.setItem("memberPackageId", memberPackageId);

    // Gọi API để lấy chi tiết gói
    api
      .get(`/member-packages/${memberPackageId}`)
      .then((response) => {
        setPackageDetails(response.data);
        setFetching(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy chi tiết gói:", error);
        alert("Không thể tải thông tin gói, vui lòng thử lại!");
        setFetching(false);
      });
  }, [memberPackageId, navigate]);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await api.post("/payment", {
        memberPackageId: parseInt(memberPackageId),
      });
      const { paymentUrl } = response.data;
      window.location.href = paymentUrl; // Chuyển hướng đến VNPay
    } catch (error) {
      console.error("Lỗi khi tạo thanh toán:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/membership");
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-50 flex items-center justify-center pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-6 mx-auto"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="h-12 bg-gray-200 rounded-lg mt-8"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-50 flex items-center justify-center pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 border border-green-100">
        <div className="flex items-center justify-center mb-6">
          <FaLeaf className="text-green-600 text-3xl mr-2" />
          <h2 className="text-3xl font-extrabold text-gray-900">Thanh toán gói thành viên</h2>
        </div>
        {packageDetails && (
          <div className="bg-green-50 rounded-lg p-6 mb-8 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin gói</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Gói:</span>
                <span className="text-gray-900 font-semibold">{packageDetails.packageName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Giá:</span>
                <span className="text-gray-900 font-semibold">{packageDetails.price.toLocaleString()} VND</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Thời hạn:</span>
                <span className="text-gray-900 font-semibold">{packageDetails.duration} ngày</span>
              </div>
            </div>
          </div>
        )}
        <div className="flex space-x-4">
          <button
            onClick={handlePayment}
            disabled={loading || fetching}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold text-white transition duration-300 flex items-center justify-center ${
              loading || fetching
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Đang xử lý...
              </>
            ) : (
              "Thanh toán qua VNPay"
            )}
          </button>
          <button
            onClick={handleCancel}
            disabled={loading || fetching}
            className="flex-1 py-3 px-4 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-300"
          >
            Hủy
          </button>
        </div>
        <p className="mt-6 text-sm text-gray-500 text-center">
          Thanh toán an toàn với VNPay. Hỗ trợ 24/7 qua hotline: <a href="tel:1900555577" className="text-green-600 hover:underline">1900 555 577</a>
        </p>
      </div>
    </div>
  );
};

export default Payment;