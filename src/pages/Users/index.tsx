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
  Avatar,
  Drawer,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
  DeleteOutlined,
  EditOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, updateUser, deleteUser, inviteUser } from '@services/users';
import type { User, CreateUserParams, InviteUserParams } from '@services/users';

const Users: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [form] = Form.useForm();
  const [inviteForm] = Form.useForm();
  const queryClient = useQueryClient();

  // 获取用户列表
  const { data, isLoading } = useQuery({
    queryKey: ['users', { search: searchText, role: roleFilter }],
    queryFn: () =>
      getUsers({
        search: searchText || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
      }),
  });

  // 创建用户
  const createMutation = useMutation({
    mutationFn: (params: CreateUserParams) => createUser(params),
    onSuccess: () => {
      message.success('用户创建成功');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsModalVisible(false);
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '创建失败');
    },
  });

  // 更新用户
  const updateMutation = useMutation({
    mutationFn: ({ id, params }: { id: string; params: any }) => updateUser(id, params),
    onSuccess: () => {
      message.success('用户更新成功');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsModalVisible(false);
      form.resetFields();
      setEditingUser(null);
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '更新失败');
    },
  });

  // 删除用户
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      message.success('用户删除成功');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '删除失败');
    },
  });

  // 邀请用户
  const inviteMutation = useMutation({
    mutationFn: (params: InviteUserParams) => inviteUser(params),
    onSuccess: () => {
      message.success('邀请邮件已发送');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsInviteModalVisible(false);
      inviteForm.resetFields();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '邀请失败');
    },
  });

  const handleCreate = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleInvite = () => {
    inviteForm.resetFields();
    setIsInviteModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setIsModalVisible(true);
  };

  const handleViewDetail = (user: User) => {
    setSelectedUser(user);
    setIsDrawerVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const params = {
        name: values.name,
        email: values.email,
        role: values.role,
        ...(values.password && { password: values.password }),
      };

      if (editingUser) {
        updateMutation.mutate({ id: editingUser.id, params });
      } else {
        createMutation.mutate(params);
      }
    });
  };

  const handleInviteSubmit = () => {
    inviteForm.validateFields().then((values) => {
      inviteMutation.mutate(values);
    });
  };

  const getRoleTag = (role: string) => {
    const roleMap: Record<string, { color: string; text: string }> = {
      admin: { color: 'red', text: '管理员' },
      tenant_admin: { color: 'blue', text: '租户管理员' },
      user: { color: 'green', text: '普通用户' },
    };
    const { color, text } = roleMap[role] || { color: 'default', text: role };
    return <Tag color={color}>{text}</Tag>;
  };

  const columns = [
    {
      title: '用户',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: User) => (
        <div className="flex items-center gap-3">
          <Avatar icon={<UserOutlined />} className="bg-primary-500" />
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => getRoleTag(role),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (timestamp: number) => new Date(timestamp * 1000).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<UserOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm title="确定删除此用户？" onConfirm={() => handleDelete(record.id)}>
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
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">用户管理</h1>
        <Space>
          <Button icon={<MailOutlined />} onClick={handleInvite}>
            邀请用户
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新增用户
          </Button>
        </Space>
      </div>

      {/* 筛选栏 */}
      <div className="flex gap-4 flex-wrap">
        <Input
          placeholder="搜索用户名或邮箱"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 240 }}
          allowClear
        />
        <Select
          value={roleFilter}
          onChange={setRoleFilter}
          style={{ width: 150 }}
          options={[
            { value: 'all', label: '全部角色' },
            { value: 'admin', label: '管理员' },
            { value: 'tenant_admin', label: '租户管理员' },
            { value: 'user', label: '普通用户' },
          ]}
        />
      </div>

      {/* 用户表格 */}
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

      {/* 新增/编辑用户弹窗 */}
      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingUser(null);
        }}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入邮箱" disabled={!!editingUser} />
          </Form.Item>
          {!editingUser && (
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="选择角色">
              <Select.Option value="user">普通用户</Select.Option>
              <Select.Option value="tenant_admin">租户管理员</Select.Option>
              <Select.Option value="admin">管理员</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 邀请用户弹窗 */}
      <Modal
        title="邀请用户"
        open={isInviteModalVisible}
        onOk={handleInviteSubmit}
        onCancel={() => setIsInviteModalVisible(false)}
        confirmLoading={inviteMutation.isPending}
      >
        <Form inviteForm={inviteForm} layout="vertical">
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="选择角色">
              <Select.Option value="user">普通用户</Select.Option>
              <Select.Option value="tenant_admin">租户管理员</Select.Option>
              <Select.Option value="admin">管理员</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 用户详情抽屉 */}
      <Drawer
        title="用户详情"
        placement="right"
        width={400}
        open={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar size={64} icon={<UserOutlined />} className="bg-primary-500" />
              <div>
                <h3 className="text-lg font-bold">{selectedUser.name}</h3>
                <p className="text-gray-500">{selectedUser.email}</p>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">角色</div>
              <div className="mt-1">{getRoleTag(selectedUser.role)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">用户 ID</div>
              <div className="mt-1 font-mono text-sm">{selectedUser.id}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">创建时间</div>
              <div className="mt-1">
                {new Date(selectedUser.created_at * 1000).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Users;
