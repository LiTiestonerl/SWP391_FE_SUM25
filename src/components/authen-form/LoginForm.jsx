import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, message } from "antd";
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
      console.error("Lỗi khi đăng nhập:", err);
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleGoogleLogin = () => {
    // Placeholder cho đăng nhập Google (sẽ tích hợp sau)
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
          labelCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" label={null}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>

          <button className="google-login-button" onClick={handleGoogleLogin}>
            <img src="https://www.google.com/favicon.ico" alt="Google Icon" />
            Login with Google
          </button>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <a href="/forgot-password">Forgot password?</a>
            <a href="/register">Don't have an account? Register!</a>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default LoginForm;
