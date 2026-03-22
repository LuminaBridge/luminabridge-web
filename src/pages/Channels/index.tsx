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
  Checkbox,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getChannels,
  createChannel,
  updateChannel,
  deleteChannel,
  testChannel,
  batchOperateChannels,
} from '@services/channels';
import type { Channel, CreateChannelParams } from '@types';

const { TextArea } = Input;

const Channels: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // 获取渠道列表
  const { data, isLoading } = useQuery({
    queryKey: ['channels', { search: searchText, status: statusFilter, group: groupFilter }],
    queryFn: () =>
      getChannels({
        search: searchText || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        group: groupFilter !== 'all' ? groupFilter : undefined,
      }),
  });

  // 创建渠道
  const createMutation = useMutation({
    mutationFn: (params: CreateChannelParams) => createChannel(params),
    onSuccess: () => {
      message.success('渠道创建成功');
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      setIsModalVisible(false);
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '创建失败');
    },
  });

  // 更新渠道
  const updateMutation = useMutation({
    mutationFn: ({ id, params }: { id: string; params: any }) => updateChannel(id, params),
    onSuccess: () => {
      message.success('渠道更新成功');
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      setIsModalVisible(false);
      form.resetFields();
      setEditingChannel(null);
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '更新失败');
    },
  });

  // 删除渠道
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteChannel(id),
    onSuccess: () => {
      message.success('渠道删除成功');
      queryClient.invalidateQueries({ queryKey: ['channels'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '删除失败');
    },
  });

  // 测试渠道
  const testMutation = useMutation({
    mutationFn: (id: string) => testChannel(id),
    onSuccess: (data) => {
      message[data.success ? 'success' : 'error'](
        data.message || (data.success ? '测试成功' : '测试失败')
      );
    },
    onError: (error: any) => {
      message.error('测试失败');
    },
  });

  // 批量操作
  const batchMutation = useMutation({
    mutationFn: ({ action, ids }: { action: any; ids: string[] }) =>
      batchOperateChannels(action, ids),
    onSuccess: () => {
      message.success('批量操作成功');
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      setSelectedRowKeys([]);
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '操作失败');
    },
  });

  const handleCreate = () => {
    setEditingChannel(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (channel: Channel) => {
    setEditingChannel(channel);
    form.setFieldsValue({
      name: channel.name,
      type: channel.type,
      base_url: channel.base_url,
      models: channel.models.join('\n'),
      weight: channel.weight,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleTest = (id: string) => {
    testMutation.mutate(id);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const params = {
        ...values,
        models: values.models.split('\n').filter((m: string) => m.trim()),
      };

      if (editingChannel) {
        updateMutation.mutate({ id: editingChannel.id, params });
      } else {
        createMutation.mutate(params);
      }
    });
  };

  const handleBatchAction = (action: 'enable' | 'disable' | 'delete') => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择渠道');
      return;
    }
    batchMutation.mutate({ action, ids: selectedRowKeys as string[] });
  };

  const columns = [
    {
      title: '',
      key: 'selection',
      render: () => null,
    },
    {
      title: '渠道名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string; icon: any }> = {
          active: { color: 'success', text: '正常', icon: CheckCircleOutlined },
          error: { color: 'error', text: '异常', icon: CloseCircleOutlined },
          inactive: { color: 'warning', text: '禁用', icon: ThunderboltOutlined },
        };
        const { color, text, icon: Icon } = statusMap[status] || {
          color: 'default',
          text: status,
          icon: ThunderboltOutlined,
        };
        return (
          <Tag color={color}>
            <Icon className="mr-1" />
            {text}
          </Tag>
        );
      },
    },
    {
      title: '模型数',
      dataIndex: 'models',
      key: 'models',
      render: (models: string[]) => models?.length || 0,
    },
    {
      title: '请求量',
      dataIndex: 'request_count',
      key: 'request_count',
      render: (count: number) => `${(count / 1000).toFixed(1)}K/天`,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Channel) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<ThunderboltOutlined />}
            onClick={() => handleTest(record.id)}
          >
            测试
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm title="确定删除此渠道？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">渠道管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          新增渠道
        </Button>
      </div>

      {/* 筛选栏 */}
      <div className="flex gap-4 flex-wrap">
        <Input
          placeholder="搜索渠道名称"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 240 }}
          allowClear
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 120 }}
          options={[
            { value: 'all', label: '全部状态' },
            { value: 'active', label: '正常' },
            { value: 'inactive', label: '禁用' },
            { value: 'error', label: '异常' },
          ]}
        />
        <Select
          value={groupFilter}
          onChange={setGroupFilter}
          style={{ width: 120 }}
          options={[
            { value: 'all', label: '全部分组' },
            { value: 'default', label: '默认' },
            { value: 'openai', label: 'OpenAI' },
            { value: 'anthropic', label: 'Anthropic' },
          ]}
        />
      </div>

      {/* 批量操作 */}
      {selectedRowKeys.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            已选择 {selectedRowKeys.length} 项
          </span>
          <Space>
            <Button size="small" onClick={() => handleBatchAction('enable')}>
              批量启用
            </Button>
            <Button size="small" onClick={() => handleBatchAction('disable')}>
              批量禁用
            </Button>
            <Popconfirm
              title={`确定删除选中的 ${selectedRowKeys.length} 个渠道？`}
              onConfirm={() => handleBatchAction('delete')}
            >
              <Button size="small" danger>
                批量删除
              </Button>
            </Popconfirm>
          </Space>
        </div>
      )}

      {/* 渠道表格 */}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data?.data || []}
        rowKey="id"
        loading={isLoading}
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingChannel ? '编辑渠道' : '新增渠道'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingChannel(null);
        }}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="渠道名称"
            rules={[{ required: true, message: '请输入渠道名称' }]}
          >
            <Input placeholder="例如：OpenAI-1" />
          </Form.Item>
          <Form.Item
            name="type"
            label="渠道类型"
            rules={[{ required: true, message: '请选择渠道类型' }]}
          >
            <Select placeholder="选择类型">
              <Select.Option value="openai">OpenAI</Select.Option>
              <Select.Option value="anthropic">Anthropic</Select.Option>
              <Select.Option value="google">Google</Select.Option>
              <Select.Option value="azure">Azure</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="base_url"
            label="API 地址"
            rules={[{ required: true, message: '请输入 API 地址' }]}
          >
            <Input placeholder="https://api.openai.com/v1" />
          </Form.Item>
          <Form.Item
            name="models"
            label="模型列表 (每行一个)"
            rules={[{ required: true, message: '请输入模型列表' }]}
          >
            <TextArea rows={4} placeholder="gpt-4&#10;gpt-3.5-turbo" />
          </Form.Item>
          <Form.Item name="weight" label="权重" initialValue={10}>
            <Input type="number" min={1} max={100} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Channels;
