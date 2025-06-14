import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./login.css";

function LoginForm() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        message.success("Đăng nhập thành công!");
        navigate("/membership");
      } else {
        message.error(data.message || "Đăng nhập thất bại, vui lòng thử lại!");
      }
    } catch (err) {
      console.error(err);
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleGoogleLogin = () => {
    message.info("Chức năng đăng nhập Google sẽ được thêm sau!");
  };

  return (
    <div className="login-form">
      <div className="login-form-container">
        <div className="login-title-box">
          <h1>Login</h1>
        </div>
        <Form
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
            />
          </Form.Item>

          <Form.Item style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a href="/forgot-password" className="forgot-password-link">Forgot password?</a>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>

          <div className="or-divider">or</div>

          <button className="google-login-button" onClick={handleGoogleLogin}>
            <img src="https://www.google.com/favicon.ico" alt="Google Logo" className="google-icon" />
            Continue with Google
          </button>

          <div className="login-footer">
            <a href="/register">Don't have an account? Register!</a>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default LoginForm;