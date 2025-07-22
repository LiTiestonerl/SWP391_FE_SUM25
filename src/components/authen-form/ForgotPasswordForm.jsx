import { useState } from "react";
import { MailOutlined, LockOutlined, NumberOutlined } from "@ant-design/icons";
import { Button, Input, Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../configs/axios";
import "./forgot-password.css";

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) =>
    String(email).toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

  const handleRequestReset = async () => {
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

  const handleVerifyAndReset = async () => {
    if (!otp || !newPassword) {
      return setError("Vui lòng nhập đầy đủ OTP và mật khẩu mới.");
    }

    setError("");
    setIsLoading(true);

    try {
      await api.post("/auth/reset-password", { email, otp, newPassword });
      setSuccessMsg("Đổi mật khẩu thành công. Đang chuyển hướng...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "OTP không hợp lệ hoặc đã hết hạn.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-form">
      <div className="forgot-password-form-container">
        <h1 className="forgot-title">Forgot Password</h1>

        {successMsg ? (
          <div style={{ marginBottom: 20, textAlign: "center", color: "green" }}>
            {successMsg}
          </div>
        ) : (
          <Form layout="vertical" onFinish={step === "request" ? handleRequestReset : handleVerifyAndReset}>
            {step === "request" ? (
              <Form.Item
                label="Email"
                name="email"
                initialValue={email}
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Nhập email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>
            ) : (
              <>
                <Form.Item
                  label="Mã OTP"
                  name="otp"
                  rules={[{ required: true, message: "Nhập mã OTP!" }]}
                >
                  <Input
                    prefix={<NumberOutlined />}
                    placeholder="Nhập mã OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </Form.Item>

                <Form.Item
                  label="Mật khẩu mới"
                  name="newPassword"
                  rules={[{ required: true, message: "Nhập mật khẩu mới!" }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </Form.Item>
              </>
            )}

            {error && (
              <div style={{ color: "red", marginBottom: 16 }}>{error}</div>
            )}

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
              >
                {step === "request" ? "Gửi mã OTP" : "Đặt lại mật khẩu"}
              </Button>
            </Form.Item>
          </Form>
        )}

        <div style={{ textAlign: "center", marginTop: "-10px" }}>
          <Button type="link" onClick={() => navigate("/login")}>
            Quay lại đăng nhập
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
