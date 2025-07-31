import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  IdcardOutlined,
  MailOutlined
} from '@ant-design/icons';
import './register.css';
import api from '../../configs/axios';

function RegisterForm() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await api.post('/auth/register', {
        userName: values.userName,
        password: values.password,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
      });

      message.success('Đăng ký thành công! Vui lòng xác thực email.');
      navigate(`/verify?email=${values.email}`);
    } catch (error) {
      message.error(error.response?.data?.message || 'Đăng ký thất bại!');
      console.error('Register error:', error);
    }
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
          {/* Username */}
          <Form.Item
            name="userName"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          {/* Password */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          {/* Full Name */}
          <Form.Item
            name="fullName"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input prefix={<IdcardOutlined />} placeholder="Full Name" />
          </Form.Item>

          {/* Email */}
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Invalid email format!' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          {/* Phone */}
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

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>

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
