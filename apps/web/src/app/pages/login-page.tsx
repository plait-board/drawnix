import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message, ConfigProvider } from 'antd';
import { UserOutlined, LockOutlined, ArrowRightOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { MockAuthService } from '../services/mock-service';

const { Title, Text } = Typography;

export const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      const user = MockAuthService.login(values.username, values.password);
      if (user) {
        message.success({
          content: 'Welcome back!',
          style: { marginTop: '20vh' },
        });
        navigate('/dashboard');
      } else {
        message.error('Invalid credentials. Try "password123"');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#8b5cf6',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
        },
      }}
    >
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
        
        {/* Background Blobs (Softer) */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-[80px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000"></div>

        {/* Main Card */}
        <Card 
          className="w-full max-w-[400px] shadow-2xl rounded-3xl bg-white border-0 z-10 animate-fade-up"
          variant="borderless"
          styles={{ body: { padding: '48px 32px' } }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-4 animate-bounce animate-once animate-duration-1000 animate-delay-500">
              🔒
            </div>
            <Title level={2} className="!mb-2 !text-slate-800 !font-bold tracking-tight">
              Welcome Back
            </Title>
            <Text className="text-slate-400 text-sm">
              Enter your credentials to access your workspace
            </Text>
          </div>

          {/* Form */}
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            size="large"
            requiredMark={false}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your Username!' }]}
              className="mb-4"
            >
              <Input 
                prefix={<UserOutlined className="text-slate-400 mr-2" />} 
                placeholder="123" 
                className="!rounded-full !bg-slate-100 !border-transparent hover:!bg-slate-200 focus:!bg-white focus:!border-purple-500 focus:!shadow-none transition-all duration-300 h-12"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
              className="mb-8"
            >
              <Input.Password 
                prefix={<LockOutlined className="text-slate-400 mr-2" />} 
                placeholder="••••••••"
                iconRender={(visible) => (visible ? <EyeTwoTone twoToneColor="#a855f7" /> : <EyeInvisibleOutlined className="text-slate-400" />)}
                className="!rounded-full !bg-slate-100 !border-transparent hover:!bg-slate-200 focus:!bg-white focus:!border-purple-500 focus:!shadow-none transition-all duration-300 h-12"
              />
            </Form.Item>

            <Form.Item className="mb-6">
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                className="w-full !rounded-full !h-12 !text-base !font-medium bg-gradient-to-r from-violet-500 to-fuchsia-500 border-0 hover:!from-violet-600 hover:!to-fuchsia-600 shadow-lg shadow-purple-500/30 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Sign In <ArrowRightOutlined className="text-xs" />
              </Button>
            </Form.Item>
          </Form>
          
          {/* Footer */}
          <div className="text-center space-y-4">
             <div className="text-sm text-slate-400">
               Need an account? <span className="text-slate-800 font-semibold cursor-pointer hover:text-purple-600 transition-colors">Request Access</span>
             </div>
             <div className="text-xs text-slate-300">
               Demo: 123 / 123
             </div>
          </div>
        </Card>

        {/* Bottom Right Sparkle */}
        <div className="absolute bottom-8 right-8 text-white/80 animate-pulse">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="#E2E8F0" />
           </svg>
        </div>
      </div>
    </ConfigProvider>
  );
};