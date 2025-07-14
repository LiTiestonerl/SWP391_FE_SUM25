import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Modal } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";
import api from "../../configs/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";

const GOOGLE_CLIENT_ID =
  "661377403321-vckppct3j51pnobtf89o6lh0ou5j8c69.apps.googleusercontent.com";

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const showBlockedAccountModal = () => {
    toast.error(
      "Tài khoản đã bị khóa. Vui lòng liên hệ admin qua email: tiennmse173628@fpt.edu.vn"
    );
  };

  const onFinish = async (values) => {
    try {
      const response = await api.post("/auth/login", {
        login: values.username,
        password: values.password,
      });

      if (response.data?.status === "inactive") {
        showBlockedAccountModal();
        return;
      }

      const data = {
        id: response.data.userId,
        fullName: response.data.fullName,
        email: response.data.email,
        role: response.data.role,
        token: response.data.token,
        login: values.username,
      };

      dispatch(login(data));
      localStorage.setItem("token", data.token);
      navigate("/membership");
      toast.success("Đăng nhập thành công!");
    } catch (err) {
      const raw = err.response?.data?.message || "";
      let msg = "Đăng nhập thất bại.";
      if (raw.includes("không tìm thấy")) msg = "Tài khoản không tồn tại.";
      else if (raw.includes("mật khẩu")) msg = "Sai mật khẩu.";
      else if (raw.includes("xác thực")) msg = "Email chưa xác thực.";
      else if (raw.includes("khóa")) msg = "Tài khoản đã bị khoá.";
      toast.error(msg);
    }
  };

  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredentialResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleLoginDiv"),
      { theme: "outline", size: "large" }
    );
  }, []);

  const handleGoogleCredentialResponse = async (response) => {
    const idToken = response.credential;
    if (!idToken) {
      toast.error("Không nhận được mã xác thực Google.");
      return;
    }

    try {
      const res = await api.post("/auth/google", { idToken });
      const data = res.data;

      if (data.status === "inactive") {
        showBlockedAccountModal();
        return;
      }

      dispatch(login(data));
      localStorage.setItem("token", data.token);
      toast.success("Đăng nhập Google thành công!");

      if (data.isNewUser) navigate("/verify");
      else navigate("/membership");
    } catch (err) {
      console.error("❌ Google login failed", err);
      toast.error("Đăng nhập bằng Google thất bại.");
    }
  };

  return (
    <div className="login-form">
      <div className="login-form-container">
        <div className="login-title-box">
          <h1>Login</h1>
        </div>

        <Form name="loginForm" layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Username or Email"
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập username hoặc email!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập hoặc email" size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng nhập
            </Button>
          </Form.Item>

          <div className="or-divider">hoặc</div>

          <div id="googleLoginDiv" style={{ display: "flex", justifyContent: "center" }}></div>

          <div className="login-footer" style={{ marginTop: 16 }}>
            <a href="/register">Chưa có tài khoản? Đăng ký!</a>
          </div>
        </Form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default LoginForm;
