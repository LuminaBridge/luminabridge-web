import { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, GithubOutlined, DiscordOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogin } from '@hooks/useAuth';
import { oauthLogin } from '@services/auth';

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useLogin();
  const [loading, setLoading] = useState(false);

  const from = (location.state as LocationState)?.from?.pathname || '/dashboard';

  const handleSubmit = async (values: { email: string; password: string; remember?: boolean }) => {
    setLoading(true);
    try {
      await login({ email: values.email, password: values.password });
      message.success('登录成功');
      navigate(from, { replace: true });
    } catch (error: any) {
      message.error(error.response?.data?.message || '登录失败，请检查邮箱和密码');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider: 'github' | 'discord') => {
    const url = oauthLogin(provider);
    window.location.href = url;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md shadow-2xl" bordered={false}>
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🌉</div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">LuminaBridge</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Illuminating AI Connections</p>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="邮箱 / Email"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="密码 / Password"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-between items-center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <a className="text-primary-500 hover:text-primary-600" href="/forgot-password">
                忘记密码？
              </a>
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              登 录
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>或继续</Divider>

        <div className="flex gap-4 mb-6">
          <Button
            icon={<GithubOutlined />}
            block
            size="large"
            onClick={() => handleOAuthLogin('github')}
          >
            GitHub
          </Button>
          <Button
            icon={<DiscordOutlined />}
            block
            size="large"
            onClick={() => handleOAuthLogin('discord')}
          >
            Discord
          </Button>
        </div>

        <div className="text-center text-gray-500 dark:text-gray-400">
          还没有账号？{' '}
          <a className="text-primary-500 hover:text-primary-600 font-medium" href="/register">
            立即注册
          </a>
        </div>
      </Card>
    </div>
  );
};

export default Login;
