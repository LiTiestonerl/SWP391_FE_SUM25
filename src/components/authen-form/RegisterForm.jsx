import React from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom'; // 👈 Thêm useNavigate
import './register.css';

function RegisterForm() {
  const navigate = useNavigate(); // 👈 Khởi tạo navigate

  const onFinish = values => {
    console.log('Success:', values);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };
  const handleGoogleRegister = () => {
    // Placeholder cho đăng nhập Google (sẽ tích hợp sau)
    message.info("Chức năng đăng nhập Google sẽ được thêm sau!");
  };

  return (
    <div className='register-form'>
      <div className='register-form-container'>
       <div className="register-title-box">
          <h1>SignUp</h1>
        </div>
        <Form
          name="basic"
          layout='vertical'
          labelCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Full Name"
            name="fullname"
            rules={[
              { required: true, message: 'Please input your full name!' },
              { min: 2, message: 'Full name must be at least 2 characters' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              { required: true, message: 'Please input your phone number!' },
              {
                pattern: /^[0-9]{9,11}$/,
                message: 'Phone number must be 9–11 digits',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
          <button className="google-login-button" onClick={handleGoogleRegister}>
            <img src="https://www.google.com/favicon.ico" alt="Google Icon" />
            Signup with Google
          </button>

          <Form.Item style={{ textAlign: 'center' }}>
            Already have an account?{' '}
            <Button type="link" onClick={handleLoginRedirect}>
              Login!
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default RegisterForm;
