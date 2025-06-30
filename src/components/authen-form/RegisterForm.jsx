import React from 'react';
import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  IdcardOutlined
} from '@ant-design/icons';
import './register.css';

function RegisterForm() {
  const navigate = useNavigate();

  const onFinish = values => {
    console.log('Success:', values);
  };

  return (
    <div className='register-form'>
      <div className='register-form-container'>
        <div className="register-title-box">
          <h1>SignUp</h1>
        </div>
        <Form
          layout='vertical'
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="fullname"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input prefix={<IdcardOutlined />} placeholder="Full Name" />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: 'Please input your phone number!' },
              {
                pattern: /^[0-9]{9,11}$/,
                message: 'Phone number must be 9–11 digits',
              },
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
          </Form.Item>

          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>

          <div className="or-divider">or</div>

          <button className="google-login-button">
            <img src="https://www.google.com/favicon.ico" alt="Google Logo" className="google-icon" />
            Continue with Google
          </button>

          <Form.Item style={{ textAlign: 'center', marginTop: 10 }}>
            Already have an account?{' '}
            <Button type="link" className="login-link" onClick={() => navigate('/login')}>
            Login!
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default RegisterForm;