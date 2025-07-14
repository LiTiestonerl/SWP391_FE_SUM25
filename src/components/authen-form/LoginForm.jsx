import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, message, Modal } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";
import api from "../../configs/axios";
import { useGoogleLogin } from "@react-oauth/google";
import "./login.css";

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const showBlockedAccountModal = () => {
    Modal.error({
      title: "Tài khoản đã bị khóa",
      content: (
        <div>
          Vui lòng liên hệ với admin qua email:{" "}
          <a href="mailto:tiennmse173628@fpt.edu.vn">
            tiennmse173628@fpt.edu.vn
          </a>
        </div>
      ),
    });
  };

  const onFinish = async (values) => {
    try {
      const response = await api.post("/auth/login", {
        login: values.username,
        password: values.password,
      });

      // ✅ Kiểm tra nếu tài khoản bị admin khóa
      if (
        response.data.status === "inactive" ||
        response.data?.user?.status === "inactive"
      ) {
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
      message.success("Đăng nhập thành công!");
      navigate("/membership");
    } catch (err) {
      console.error("❌ Lỗi đăng nhập:", err);

      const errorData = err.response?.data;
      const errorMessage =
        typeof errorData === "string"
          ? errorData
          : errorData?.message ||
            "Tài khoản đang bị khóa, vui lòng liên hệ với admin qua email: tiennmse173628@fpt.edu.vn";

      Modal.error({
        title: "Không thể đăng nhập",
        content: errorMessage,
      });
    }
  };

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // ✅ Đăng nhập bằng Google
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        
        console.log("djihjkhf", clientId)

        const response = await api.post("/auth/google", {
          idToken: clientId,
        });

        const resData = response.data;

        // ✅ Nếu trả về chuỗi chứa "bị khóa"
        if (
          typeof resData === "string" &&
          resData.toLowerCase().includes("bị khóa")
        ) {
          Modal.error({
            title: "Tài khoản Google đã bị khóa",
            content: (
              <div>
                Vui lòng liên hệ với admin qua email:{" "}
                <a href="mailto:tiennmse173628@fpt.edu.vn">
                  tiennmse173628@fpt.edu.vn
                </a>
              </div>
            ),
          });
          return;
        }

        // ✅ Nếu trả về object có status
        if (resData.status === "inactive") {
          showBlockedAccountModal();
          return;
        }

        const data = resData;
        dispatch(login(data));
        localStorage.setItem("token", data.token);
        message.success("Đăng nhập Google thành công!");
        navigate("/membership");
      } catch (err) {
        console.error(err);
        const errorData = err.response?.data;
        const errorMessage =
          typeof errorData === "string"
            ? errorData
            : errorData?.message || "Đăng nhập Google thất bại!";
        Modal.error({
          title: "Không thể đăng nhập bằng Google",
          content: errorMessage,
        });
      }
    },
    onError: () => {
      Modal.error({
        title: "Google login thất bại",
        content: "Không thể xác thực tài khoản Google.",
      });
    },
    flow: "implicit",
  });

  return (
    <div className="login-form">
      <div className="login-form-container">
        <div className="login-title-box">
          <h1>Login</h1>
        </div>

        <Form
          name="loginForm"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Username or Email"
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
              placeholder="Enter your username or email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              size="large"
            />
          </Form.Item>

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
              Submit
            </Button>
          </Form.Item>

          <div className="or-divider">or</div>

          <Button
            type="default"
            onClick={() => googleLogin()}
            block
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              backgroundColor: "#fff",
              border: "1px solid #ddd",
            }}
            icon={
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                style={{ width: 18, height: 18 }}
              />
            }
          >
            Continue with Google
          </Button>

          <div className="login-footer">
            <a href="/register">Don't have an account? Register!</a>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default LoginForm;
