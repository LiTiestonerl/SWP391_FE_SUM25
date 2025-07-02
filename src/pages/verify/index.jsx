import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NumberOutlined } from "@ant-design/icons";
import api from "../../configs/axios";

const Verify = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    } else {
      message.error("Không có email để xác thực");
      navigate("/register");
    }
  }, [searchParams, navigate]);

  const onFinish = async (values) => {
    try {
      const response = await api.post("/auth/email/verify", {
        email: email,
        otp: values.otp,
      });

      message.success("Xác thực email thành công!");
      navigate("/login");
    } catch (error) {
      message.error(error.response?.data?.message || "Xác thực thất bại!");
      console.error("Verify error:", error);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", paddingTop: 100 }}>
      <h2>Email Verification</h2>
      <p>
        Chúng tôi đã gửi mã xác thực đến: <strong>{email}</strong>
      </p>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="otp"
          label="OTP Code"
          rules={[
            { required: true, message: "Vui lòng nhập mã OTP" },
            { len: 6, message: "OTP phải gồm 6 chữ số" },
          ]}
        >
          <Input
            prefix={<NumberOutlined />}
            placeholder="Nhập mã OTP"
            maxLength={6}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Xác thực email
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Verify;
