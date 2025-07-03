import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./login.css";
import api from "../../configs/axios";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      const response = await api.post("/auth/login", {
        login: values.username,
        password: values.password,
      });

      const data = response.data;
      dispatch(login(response.data));
      localStorage.setItem("token", data.token);

      message.success("Đăng nhập thành công!");
      navigate("/membership");
    } catch (err) {
      console.error(err);
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleGoogleLogin = () => {
    message.info("Chức năng đăng nhập Google sẽ được thêm sau!");
      message.error(err.response?.data?.message || "Đăng nhập thất bại!");
      console.error("Login error:", err);
    }
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
            rules={[
              {
                required: true,
                message: "Please input your username or email!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your username"
            />
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your email or username"
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
          <Form.Item
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a href="/forgot-password" className="forgot-password-link">
              Forgot password?
            </a>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
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
          <div className="login-footer">
            <a href="/register">Don't have an account? Register!</a>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default LoginForm;