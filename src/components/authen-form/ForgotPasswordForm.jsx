import React from "react";
import { Button, Form, Input, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { MailOutlined } from '@ant-design/icons';
import './forgot-password.css';

function ForgotPasswordForm() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });
      const data = await response.json();

      if (data.success) {
        message.success("Reset link sent! Please check your email.");
        navigate("/login");
      } else {
        message.error(data.message || "Failed to send request, please try again!");
      }
    } catch (err) {
        console.error(err);
      message.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="forgot-password-form">
      <div className="forgot-password-form-container">
        <h1 className="forgot-title">Forgot Password</h1>
        <Form name="forgot" layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Invalid email format!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Enter your email" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Send Reset Link
            </Button>
          </Form.Item>

          <Form.Item style={{ textAlign: "center", marginTop: "-10px" }}>
            <Link to="/login">Back to Login</Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;
