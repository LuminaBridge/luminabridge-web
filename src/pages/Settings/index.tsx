import { useState } from 'react';
import { Card, Form, Input, Switch, Button, Select, Divider, Space, message, Tabs } from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSystemSettings, updateSystemSettings } from '@services/settings';

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // 获取系统设置
  const { data, isLoading } = useQuery({
    queryKey: ['system-settings'],
    queryFn: getSystemSettings,
  });

  // 更新系统设置
  const updateMutation = useMutation({
    mutationFn: (values: any) => updateSystemSettings(values),
    onSuccess: () => {
      message.success('设置保存成功');
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '保存失败');
    },
  });

  // 填充表单数据
  useState(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  });

  const handleSubmit = (values: any) => {
    updateMutation.mutate(values);
  };

  const generalTab = (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={data}
      style={{ maxWidth: 600 }}
    >
      <Form.Item
        name="app_name"
        label="应用名称"
        rules={[{ required: true, message: '请输入应用名称' }]}
      >
        <Input placeholder="LuminaBridge" />
      </Form.Item>

      <Form.Item
        name="app_version"
        label="应用版本"
      >
        <Input placeholder="1.0.0" disabled />
      </Form.Item>

      <Form.Item
        name="company_name"
        label="公司名称"
      >
        <Input placeholder="公司名称" />
      </Form.Item>

      <Form.Item
        name="contact_email"
        label="联系邮箱"
        rules={[{ type: 'email', message: '请输入有效的邮箱地址' }]}
      >
        <Input placeholder="contact@example.com" />
      </Form.Item>

      <Form.Item
        name="timezone"
        label="时区"
      >
        <Select
          options={[
            { value: 'Asia/Shanghai', label: '上海 (UTC+8)' },
            { value: 'Asia/Tokyo', label: '东京 (UTC+9)' },
            { value: 'America/New_York', label: '纽约 (UTC-5)' },
            { value: 'Europe/London', label: '伦敦 (UTC+0)' },
          ]}
        />
      </Form.Item>

      <Form.Item
        name="language"
        label="语言"
      >
        <Select
          options={[
            { value: 'zh-CN', label: '简体中文' },
            { value: 'zh-TW', label: '繁体中文' },
            { value: 'en-US', label: 'English' },
          ]}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={updateMutation.isPending}>
          保存设置
        </Button>
      </Form.Item>
    </Form>
  );

  const securityTab = (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={data}
      style={{ maxWidth: 600 }}
    >
      <Form.Item
        name="session_timeout"
        label="会话超时时间 (分钟)"
        rules={[{ type: 'number', min: 1 }]}
      >
        <Input type="number" min={1} placeholder="30" />
      </Form.Item>

      <Form.Item
        name="max_login_attempts"
        label="最大登录尝试次数"
        rules={[{ type: 'number', min: 1 }]}
      >
        <Input type="number" min={1} placeholder="5" />
      </Form.Item>

      <Form.Item
        name="lockout_duration"
        label="锁定持续时间 (分钟)"
        rules={[{ type: 'number', min: 1 }]}
      >
        <Input type="number" min={1} placeholder="15" />
      </Form.Item>

      <Form.Item
        name="require_strong_password"
        label="要求强密码"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        name="enable_2fa"
        label="启用双因素认证"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        name="password_min_length"
        label="密码最小长度"
        rules={[{ type: 'number', min: 6 }]}
      >
        <Input type="number" min={6} placeholder="8" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={updateMutation.isPending}>
          保存设置
        </Button>
      </Form.Item>
    </Form>
  );

  const apiTab = (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={data}
      style={{ maxWidth: 600 }}
    >
      <Form.Item
        name="api_rate_limit"
        label="API 速率限制 (请求/分钟)"
        rules={[{ type: 'number', min: 1 }]}
      >
        <Input type="number" min={1} placeholder="100" />
      </Form.Item>

      <Form.Item
        name="api_timeout"
        label="API 超时时间 (秒)"
        rules={[{ type: 'number', min: 1 }]}
      >
        <Input type="number" min={1} placeholder="30" />
      </Form.Item>

      <Form.Item
        name="enable_api_logging"
        label="启用 API 日志"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        name="enable_cors"
        label="启用 CORS"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        name="allowed_origins"
        label="允许的源 (每行一个)"
      >
        <Input.TextArea rows={4} placeholder="https://example.com&#10;https://api.example.com" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={updateMutation.isPending}>
          保存设置
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">系统设置</h1>
        <Button icon={<ReloadOutlined />} onClick={() => queryClient.invalidateQueries({ queryKey: ['system-settings'] })}>
          刷新
        </Button>
      </div>

      <Card loading={isLoading}>
        <Tabs
          defaultActiveKey="general"
          items={[
            {
              key: 'general',
              label: '通用设置',
              children: generalTab,
            },
            {
              key: 'security',
              label: '安全设置',
              children: securityTab,
            },
            {
              key: 'api',
              label: 'API 设置',
              children: apiTab,
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default Settings;
