import { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Tag, Space, Button, Switch } from 'antd';
import {
  ThunderboltOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats, getRealtimeStats } from '@services/stats';
import StatCard from '@components/StatCard';
import ReactECharts from 'echarts-for-react';
import { useWebSocket } from '@hooks/useWebSocket';
import type { Stats, Alert } from '@types';

const Dashboard: React.FC = () => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [realtimeStats, setRealtimeStats] = useState<Stats | null>(null);

  // 获取仪表盘统计数据
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
    refetchInterval: autoRefresh ? 5000 : false,
  });

  // WebSocket 实时数据
  const { isConnected } = useWebSocket({
    onMessage: (message) => {
      if (message.type === 'stats') {
        setRealtimeStats(message.data);
      }
    },
  });

  // 渠道状态表格
  const channelColumns = [
    {
      title: '渠道名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          active: { color: 'success', text: '正常' },
          error: { color: 'error', text: '异常' },
          inactive: { color: 'warning', text: '禁用' },
        };
        const { color, text } = statusMap[status] || { color: 'default', text: status };
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  // 告警通知表格
  const alertColumns = [
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => {
        const levelMap: Record<string, { color: string; icon: string }> = {
          info: { color: 'info', icon: '📢' },
          warning: { color: 'warning', icon: '⚠️' },
          error: { color: 'error', icon: '🔴' },
          critical: { color: 'error', icon: '🚨' },
        };
        const { color, icon } = levelMap[level] || { color: 'default', icon: '📢' };
        return <Tag color={color}>{icon} {level}</Tag>;
      },
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: '时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (timestamp: number) => new Date(timestamp).toLocaleString(),
    },
  ];

  // 请求量趋势图配置
  const trendOption = {
    title: { text: '请求量趋势 (7 天)', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: dashboardData?.request_trend?.map((item: any) => item.date) || [],
    },
    yAxis: { type: 'value' },
    series: [
      {
        data: dashboardData?.request_trend?.map((item: any) => item.requests) || [],
        type: 'line',
        smooth: true,
        areaStyle: {
          color: 'rgba(139, 92, 246, 0.2)',
        },
        itemStyle: {
          color: '#8b5cf6',
        },
      },
    ],
  };

  const stats = realtimeStats || dashboardData;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">仪表盘</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {isConnected ? '🟢 实时连接中' : '🔴 未连接'}
          </span>
          <Switch
            checked={autoRefresh}
            onChange={setAutoRefresh}
            checkedChildren="自动刷新"
            unCheckedChildren="手动刷新"
          />
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="总请求数"
            value={stats?.total_requests?.toLocaleString() || '0'}
            trend={15}
            icon={<ThunderboltOutlined className="text-primary-500" />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="总 Token"
            value={stats?.total_tokens?.toLocaleString() || '0'}
            trend={23}
            icon={<ThunderboltOutlined className="text-info-500" />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="活跃渠道"
            value={`${stats?.active_channels || 0}/15`}
            trend={5}
            icon={<CheckCircleOutlined className="text-success-500" />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="今日收入"
            value={stats?.today_revenue?.toFixed(2) || '0.00'}
            suffix="¥"
            trend={8}
            icon={<DollarOutlined className="text-warning-500" />}
          />
        </Col>
      </Row>

      {/* 请求量趋势图 */}
      <Card>
        <ReactECharts option={trendOption} style={{ height: 300 }} />
      </Card>

      {/* 渠道状态和告警通知 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="渠道状态监控">
            <Table
              columns={channelColumns}
              dataSource={dashboardData?.channel_status || []}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="告警通知">
            <Table
              columns={alertColumns}
              dataSource={[]}
              rowKey="id"
              pagination={false}
              size="small"
              locale={{ emptyText: '暂无告警' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
