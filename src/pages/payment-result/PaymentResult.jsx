import { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaHome, FaHistory } from "react-icons/fa";
import { format } from "date-fns";

const PaymentResult = () => {
  const [paymentStatus, setPaymentStatus] = useState("success");
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState({
    orderNumber: "ORD123456789",
    amount: 1299.99,
    paymentMethod: "VNPAY",
    transactionDate: new Date(),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const failureReasons = [
    "Insufficient funds in the account",
    "Card has been declined",
    "Network connection error occurred"
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
              <h2 className="mt-4 text-3xl font-bold text-green-800">Payment Successful!</h2>
              <div className="mt-6 space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-semibold">{orderDetails.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">${orderDetails.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-semibold">{orderDetails.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-semibold">
                    {format(orderDetails.transactionDate, "PPpp")}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <FaTimesCircle className="mx-auto h-16 w-16 text-red-500 animate-bounce" />
              <h2 className="mt-4 text-3xl font-bold text-red-800">Payment Failed!</h2>
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-red-700 mb-4">Possible Reasons:</h3>
                <ul className="text-left space-y-2">
                  {failureReasons.map((reason, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span className="text-gray-700">{reason}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-gray-600">
                  Please try again or contact support if the issue persists.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 space-y-4">
          <button
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            onClick={() => window.location.href = "/"}
          >
            <FaHome className="mr-2" /> Return to Home
          </button>
          <button
            className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            onClick={() => window.location.href = "/orders"}
          >
            <FaHistory className="mr-2" /> View Order History
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;