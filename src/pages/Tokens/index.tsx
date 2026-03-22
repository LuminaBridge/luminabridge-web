import { useState } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Modal,
  Form,
  message,
  Popconfirm,
  Tag,
  Tooltip,
  Progress,
} from 'antd';
import {
  PlusOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTokens, createToken, deleteToken, updateTokenQuota, type CreateTokenParams } from '@services/tokens';
import type { Token } from '@types';

const Tokens: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [_editingToken, setEditingToken] = useState<Token | null>(null);
  const [quotaModalVisible, setQuotaModalVisible] = useState(false);
  const [selectedTokenForQuota, setSelectedTokenForQuota] = useState<Token | null>(null);
  const [form] = Form.useForm();
  const [quotaForm] = Form.useForm();
  const queryClient = useQueryClient();

  // 获取令牌列表
  const { data, isLoading } = useQuery({
    queryKey: ['tokens', { status: statusFilter }],
    queryFn: () => getTokens({ status: statusFilter !== 'all' ? statusFilter : undefined }),
  });

  // 创建令牌
  const createMutation = useMutation({
    mutationFn: (params: CreateTokenParams) => createToken(params),
    onSuccess: (data) => {
      message.success('令牌创建成功');
      queryClient.invalidateQueries({ queryKey: ['tokens'] });
      setIsModalVisible(false);
      form.resetFields();
      
      // 显示新令牌（仅显示一次）
      Modal.success({
        title: '令牌已创建',
        content: (
          <div>
            <p>请妥善保存此令牌，关闭后将不再显示：</p>
            <code className="bg-gray-100 dark:bg-gray-800 p-2 rounded block mt-2 break-all">
              {data.token}
            </code>
          </div>
        ),
        onOk: () => {
          navigator.clipboard.writeText(data.token);
          message.success('已复制到剪贴板');
        },
      });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '创建失败');
    },
  });

  // 删除令牌
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteToken(id),
    onSuccess: () => {
      message.success('令牌删除成功');
      queryClient.invalidateQueries({ queryKey: ['tokens'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '删除失败');
    },
  });

  // 更新额度
  const updateQuotaMutation = useMutation({
    mutationFn: ({ id, quota }: { id: string; quota: number }) => updateTokenQuota(id, quota),
    onSuccess: () => {
      message.success('额度更新成功');
      queryClient.invalidateQueries({ queryKey: ['tokens'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '更新失败');
    },
  });

  const handleCreate = () => {
    setEditingToken(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleCopy = (token: string) => {
    navigator.clipboard.writeText(token);
    message.success('已复制到剪贴板');
  };

  const handleUpdateQuota = (token: Token) => {
    setSelectedTokenForQuota(token);
    quotaForm.setFieldsValue({ quota: token.quota });
    setQuotaModalVisible(true);
  };

  const handleQuotaOk = () => {
    quotaForm.validateFields().then((values) => {
      const quota = parseInt(values.quota || '0', 10);
      if (quota < 0) {
        message.error('额度必须大于 0');
        return;
      }
      if (selectedTokenForQuota) {
        updateQuotaMutation.mutate({ id: selectedTokenForQuota.id, quota });
      }
      setQuotaModalVisible(false);
    });
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const params: CreateTokenParams = {
        name: values.name,
        quota: parseInt(values.quota, 10),
        expired_time: values.expired_time
          ? new Date(values.expired_time).getTime() / 1000
          : undefined,
        allowed_models: values.allowed_models?.split('\n').filter((m: string) => m.trim()) || [],
      };
      createMutation.mutate(params);
    });
  };

  const columns = [
    {
      title: '令牌名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '令牌',
      dataIndex: 'token',
      key: 'token',
      render: (token: string) => (
        <Space>
          <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
            {token.substring(0, 8)}...{token.substring(token.length - 8)}
          </code>
          <Tooltip title="复制令牌">
            <Button
              type="link"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => handleCopy(token)}
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: '额度使用',
      key: 'quota',
      render: (_: any, record: Token) => (
        <div className="w-48">
          <Progress
            percent={((record.used_quota || 0) / record.quota) * 100}
            size="small"
            strokeColor={
              (record.used_quota || 0) / record.quota > 0.9
                ? '#ef4444'
                : (record.used_quota || 0) / record.quota > 0.7
                ? '#f59e0b'
                : '#10b981'
            }
            format={() => `${record.used_quota?.toLocaleString()} / ${record.quota.toLocaleString()}`}
          />
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? <CheckCircleOutlined className="mr-1" /> : <CloseCircleOutlined className="mr-1" />}
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '过期时间',
      dataIndex: 'expired_time',
      key: 'expired_time',
      render: (timestamp?: number) =>
        timestamp ? new Date(timestamp * 1000).toLocaleDateString() : '永不过期',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Token) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleUpdateQuota(record)}
          >
            更新额度
          </Button>
          <Popconfirm title="确定删除此令牌？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">令牌管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          创建令牌
        </Button>
      </div>

      {/* 筛选栏 */}
      <div className="flex gap-4">
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 120 }}
          options={[
            { value: 'all', label: '全部状态' },
            { value: 'active', label: '启用' },
            { value: 'inactive', label: '禁用' },
          ]}
        />
      </div>

      {/* 令牌表格 */}
      <Table
        columns={columns}
        dataSource={data?.data || []}
        rowKey="id"
        loading={isLoading}
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />

      {/* 创建令牌弹窗 */}
      <Modal
        title="创建令牌"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        confirmLoading={createMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="令牌名称"
            rules={[{ required: true, message: '请输入令牌名称' }]}
          >
            <Input placeholder="例如：我的 API 密钥" />
          </Form.Item>
          <Form.Item
            name="quota"
            label="额度"
            rules={[{ required: true, message: '请输入额度' }]}
            initialValue={1000000}
          >
            <Input type="number" min={0} placeholder="1000000" />
          </Form.Item>
          <Form.Item name="expired_time" label="过期时间">
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item name="allowed_models" label="允许使用的模型 (每行一个)">
            <Input.TextArea rows={4} placeholder="gpt-4&#10;gpt-3.5-turbo" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 更新额度弹窗 */}
      <Modal
        title="更新额度"
        open={quotaModalVisible}
        onOk={handleQuotaOk}
        onCancel={() => setQuotaModalVisible(false)}
        confirmLoading={updateQuotaMutation.isPending}
      >
        <Form form={quotaForm} layout="vertical">
          <Form.Item
            name="quota"
            label="新额度"
            rules={[{ required: true, message: '请输入额度' }]}
          >
            <Input type="number" min={0} placeholder="1000000" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Tokens;
