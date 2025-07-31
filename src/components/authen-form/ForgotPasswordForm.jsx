import { useState } from "react";
import { MdEmail } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import api from "../../configs/axios";

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("request"); // "request" or "verify"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) =>
    String(email).toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

  const handleRequestReset = async (e) => {
    e.preventDefault();

    if (!email) return setError("Vui lòng nhập email.");
    if (!validateEmail(email)) return setError("Email không hợp lệ.");
    setError("");
    setIsLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setStep("verify");
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi gửi yêu cầu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndReset = async (e) => {
    e.preventDefault();

    if (!otp || !newPassword) {
      return setError("Vui lòng nhập đầy đủ OTP và mật khẩu mới.");
    }

    setError("");
    setIsLoading(true);

    try {
      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      setSuccessMsg("Đổi mật khẩu thành công. Đang chuyển hướng...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "OTP không hợp lệ hoặc đã hết hạn.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearInput = () => {
    setEmail("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg transition-all duration-300">
        <div className="text-center">
          <img
            className="mx-auto h-12 w-auto"
            src="https://images.unsplash.com/photo-1633409361618-c73427e4e206?auto=format&fit=crop&q=80&w=100"
            alt="Logo"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Forgot Password?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === "request"
              ? "Nhập email để nhận mã OTP khôi phục."
              : "Nhập mã OTP và mật khẩu mới để khôi phục tài khoản."}
          </p>
        </div>

        {successMsg ? (
          <div className="bg-green-50 p-4 rounded-md">
            <p className="text-green-800 text-center">{successMsg}</p>
          </div>
        ) : (
          <form
            className="mt-8 space-y-6"
            onSubmit={step === "request" ? handleRequestReset : handleVerifyAndReset}
          >
            {step === "request" ? (
              <div className="relative">
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdEmail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`appearance-none rounded-md relative block w-full px-3 py-2 pl-10 ${
                    error
                      ? "border-red-300 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                  } text-gray-900 focus:outline-none focus:z-10 sm:text-sm border`}
                  placeholder="Nhập email"
                />
                {email && (
                  <button
                    type="button"
                    onClick={handleClearInput}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <IoMdClose className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  </button>
                )}
              </div>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Mã OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  placeholder="Mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </>
            )}

            {error && (
              <p className="text-red-600 text-sm mt-2 animate-fade-in">
                {error}
              </p>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  isLoading
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }`}
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin h-5 w-5" />
                ) : step === "request" ? (
                  "Gửi mã OTP"
                ) : (
                  "Đặt lại mật khẩu"
                )}
              </button>
            </div>
          </form>
        )}

        <div className="text-center">
          <button
            onClick={() => navigate("/login")}
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
          >
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
