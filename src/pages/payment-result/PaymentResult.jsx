import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaHome, FaHistory } from "react-icons/fa";
import { format } from "date-fns";
import api from "../../configs/axios";

const PaymentResult = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const txnRef = queryParams.get("vnp_TxnRef");
    const responseCode = queryParams.get("vnp_ResponseCode");
    const amount = queryParams.get("vnp_Amount");
    const transactionDate = queryParams.get("vnp_PayDate");

    if (!txnRef) {
      setLoading(false);
      navigate("/membership");
      return;
    }

    api
      .get(`/payment/vnpay-return?vnp_TxnRef=${txnRef}`)
      .then(async (response) => {
        const status = responseCode === "00" ? "success" : "failed";
        setPaymentStatus(status);

        setOrderDetails({
          orderNumber: txnRef,
          amount: amount ? parseFloat(amount) / 100 : 0,
          paymentMethod: "VNPAY",
          transactionDate: transactionDate
            ? format(
                new Date(
                  `${transactionDate.slice(0, 4)}-${transactionDate.slice(4, 6)}-${transactionDate.slice(6, 8)}T${transactionDate.slice(8, 10)}:${transactionDate.slice(10, 12)}:${transactionDate.slice(12, 14)}`
                ),
                "PPpp"
              )
            : format(new Date(), "PPpp"),
        });

        // 👉 Nếu thanh toán thành công, lấy duration
        if (status === "success") {
          const storedPackageId = localStorage.getItem("memberPackageId");
          if (storedPackageId) {
            try {
              const packagesRes = await api.get("/member-packages");
              const selected = packagesRes.data.find(
                (p) => p.memberPackageId === Number(storedPackageId)
              );
              if (selected) {
                localStorage.setItem("duration", selected.duration);
                localStorage.setItem("packageName", selected.packageName);
              }
            } catch (error) {
              console.error("Không lấy được thông tin gói:", error);
            }
          }
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi kiểm tra trạng thái thanh toán:", error);
        setPaymentStatus("failed");
        setOrderDetails({
          orderNumber: txnRef || "N/A",
          amount: amount ? parseFloat(amount) / 100 : 0,
          paymentMethod: "VNPAY",
          transactionDate: format(new Date(), "PPpp"),
        });
        setLoading(false);
      });
  }, [location, navigate]);

  const failureReasons = [
    "Số dư tài khoản không đủ",
    "Thẻ bị từ chối",
    "Lỗi kết nối mạng",
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
        <div className={`p-8 ${paymentStatus === "success" ? "bg-green-50" : "bg-red-50"}`}>
          {paymentStatus === "success" ? (
            <div className="text-center">
              <FaCheckCircle className="mx-auto h-16 w-16 text-green-500 animate-bounce" />
              <h2 className="mt-4 text-3xl font-bold text-green-800">Thanh toán thành công!</h2>
              <div className="mt-6 space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Mã giao dịch:</span>
                  <span className="font-semibold">{orderDetails?.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-semibold">{orderDetails?.amount.toLocaleString()} VND</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Phương thức:</span>
                  <span className="font-semibold">{orderDetails?.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Thời gian:</span>
                  <span className="font-semibold">{orderDetails?.transactionDate}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <FaTimesCircle className="mx-auto h-16 w-16 text-red-500 animate-bounce" />
              <h2 className="mt-4 text-3xl font-bold text-red-800">Thanh toán thất bại!</h2>
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-red-700 mb-4">Lý do có thể:</h3>
                <ul className="text-left space-y-2">
                  {failureReasons.map((reason, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span className="text-gray-700">{reason}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-gray-600">
                  Vui lòng thử lại hoặc liên hệ hỗ trợ nếu sự cố tiếp diễn.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 space-y-4">
          <button
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            onClick={() => navigate("/")}
          >
            <FaHome className="mr-2" /> Về trang chủ
          </button>
          <button
            className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            onClick={() => navigate("/orders")}
          >
            <FaHistory className="mr-2" /> Xem lịch sử đơn hàng
          </button>
          {paymentStatus === "failed" && (
            <button
              className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              onClick={() => navigate("/payment", { state: { memberPackageId: orderDetails?.memberPackageId } })}
            >
              Thử lại thanh toán
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
