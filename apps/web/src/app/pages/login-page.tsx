import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, message } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { authApi, setToken, setStoredUser } from '../../api';

const { Title, Text } = Typography;

export const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const response = await authApi.login(values.username, values.password);

      if (response.success && response.data) {
        setToken(response.data.token);
        setStoredUser(response.data.user);

        message.success({
          content: `Welcome back, ${response.data.user.username}!`,
          style: { marginTop: '20vh' },
        });

        navigate('/dashboard');
      }
    } catch (error: any) {
      message.error(
        error.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #FAFAFA 0%, #F5F5F7 100%)',
      }}
    >
      {/* 背景装饰 - Apple 风格极简 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 柔和的大圆形光晕 */}
        <div
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background:
              'radial-gradient(circle, rgba(0,122,255,0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-30"
          style={{
            background:
              'radial-gradient(circle, rgba(88,86,214,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* 极简网格背景 */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* 主卡片 */}
      <div
        className="relative z-10 w-full max-w-[420px] mx-4 animate-fade-in-scale"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: '24px',
          boxShadow:
            '0 25px 80px rgba(0, 0, 0, 0.08), 0 10px 30px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          padding: '56px 48px',
        }}
      >
        {/* Logo & Header */}
        <div className="text-center mb-10">
          {/* 简洁的 Logo 图标 */}
          <div
            className="w-20 h-20 mx-auto mb-6 rounded-[22px] flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
              boxShadow:
                '0 8px 32px rgba(0, 122, 255, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              <path d="M2 2l7.586 7.586" />
              <circle cx="11" cy="11" r="2" />
            </svg>
          </div>

          <Title
            level={2}
            className="!m-0 !mb-2"
            style={{
              fontSize: '32px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#1D1D1F',
            }}
          >
            Drawnix
          </Title>
          <Text
            style={{
              fontSize: '16px',
              color: '#6E6E73',
              fontWeight: 400,
            }}
          >
            Sign in to your workspace
          </Text>
        </div>

        {/* 表单 */}
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please enter your username' }]}
            className="!mb-5"
          >
            <Input
              prefix={
                <UserOutlined
                  style={{
                    color: '#86868B',
                    fontSize: '18px',
                    marginRight: '8px',
                  }}
                />
              }
              placeholder="Username"
              size="large"
              style={{
                height: '56px',
                borderRadius: '14px',
                border: '1px solid #E5E5E5',
                backgroundColor: '#FAFAFA',
                fontSize: '16px',
                paddingLeft: '20px',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = '#FFFFFF';
                e.target.style.borderColor = '#007AFF';
                e.target.style.boxShadow = '0 0 0 4px rgba(0, 122, 255, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = '#FAFAFA';
                e.target.style.borderColor = '#E5E5E5';
                e.target.style.boxShadow = 'none';
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
            className="!mb-8"
          >
            <Input.Password
              prefix={
                <LockOutlined
                  style={{
                    color: '#86868B',
                    fontSize: '18px',
                    marginRight: '8px',
                  }}
                />
              }
              placeholder="Password"
              size="large"
              style={{
                height: '56px',
                borderRadius: '14px',
                border: '1px solid #E5E5E5',
                backgroundColor: '#FAFAFA',
                fontSize: '16px',
                paddingLeft: '20px',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = '#FFFFFF';
                e.target.style.borderColor = '#007AFF';
                e.target.style.boxShadow = '0 0 0 4px rgba(0, 122, 255, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = '#FAFAFA';
                e.target.style.borderColor = '#E5E5E5';
                e.target.style.boxShadow = 'none';
              }}
            />
          </Form.Item>

          <Form.Item className="!mb-0">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{
                width: '100%',
                height: '56px',
                borderRadius: '14px',
                fontSize: '17px',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #007AFF 0%, #0056D6 100%)',
                border: 'none',
                boxShadow: '0 4px 16px rgba(0, 122, 255, 0.35)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 8px 24px rgba(0, 122, 255, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 4px 16px rgba(0, 122, 255, 0.35)';
              }}
            >
              Sign In
              <ArrowRightOutlined style={{ marginLeft: '8px' }} />
            </Button>
          </Form.Item>
        </Form>

        {/* 底部提示 */}
        <div
          className="mt-8 pt-6 text-center"
          style={{ borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}
        >
          <Text style={{ fontSize: '14px', color: '#86868B' }}>
            Demo accounts:{' '}
            <span style={{ color: '#1D1D1F', fontWeight: 500 }}>123</span>
            {' / '}
            <span style={{ color: '#1D1D1F', fontWeight: 500 }}>123</span>
          </Text>
        </div>
      </div>

      {/* 底部版权 */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <Text style={{ fontSize: '13px', color: '#86868B' }}>
          © 2026 Drawnix. All rights reserved.
        </Text>
      </div>
    </div>
  );
};
