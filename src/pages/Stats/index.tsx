import { useState } from 'react';
import { Row, Col, Card, Table, DatePicker, Select, Button, Space } from 'antd';
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { getStatsReport } from '@services/stats';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const Stats: React.FC = () => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(7, 'day'),
    dayjs(),
  ]);
  const [groupBy, setGroupBy] = useState<string>('channel');

  // 获取统计报告
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['stats-report', dateRange, groupBy],
    queryFn: () => getStatsReport({
      start_time: dateRange[0].valueOf(),
      end_time: dateRange[1].valueOf(),
      group_by: groupBy,
    }),
  });

  // 请求量趋势图配置
  const requestTrendOption = {
    title: { text: '请求量趋势', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['请求量', '成功', '失败'], bottom: 0 },
    xAxis: {
      type: 'category',
      data: data?.trend?.map((item: any) => item.date) || [],
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '请求量',
        type: 'line',
        smooth: true,
        data: data?.trend?.map((item: any) => item.total) || [],
        itemStyle: { color: '#8b5cf6' },
      },
      {
        name: '成功',
        type: 'line',
        smooth: true,
        data: data?.trend?.map((item: any) => item.success) || [],
        itemStyle: { color: '#10b981' },
      },
      {
        name: '失败',
        type: 'line',
        smooth: true,
        data: data?.trend?.map((item: any) => item.failed) || [],
        itemStyle: { color: '#ef4444' },
      },
    ],
  };

  // Token 使用量趋势图配置
  const tokenTrendOption = {
    title: { text: 'Token 使用量趋势', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: data?.trend?.map((item: any) => item.date) || [],
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Token 使用量',
        type: 'bar',
        data: data?.trend?.map((item: any) => item.tokens) || [],
        itemStyle: { color: '#3b82f6' },
      },
    ],
  };

  // 按渠道统计表格
  const channelColumns = [
    {
      title: '渠道名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '请求量',
      dataIndex: 'requests',
      key: 'requests',
      sorter: (a: any, b: any) => a.requests - b.requests,
    },
    {
      title: '成功量',
      dataIndex: 'success',
      key: 'success',
    },
    {
      title: '失败量',
      dataIndex: 'failed',
      key: 'failed',
    },
    {
      title: '成功率',
      key: 'rate',
      render: (_: any, record: any) => {
        const rate = record.requests > 0 ? ((record.success / record.requests) * 100).toFixed(2) : '0.00';
        return `${rate}%`;
      },
    },
    {
      title: 'Token 使用量',
      dataIndex: 'tokens',
      key: 'tokens',
      render: (tokens: number) => tokens?.toLocaleString() || '0',
    },
  ];

  // 按模型统计表格
  const modelColumns = [
    {
      title: '模型名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '请求量',
      dataIndex: 'requests',
      key: 'requests',
      sorter: (a: any, b: any) => a.requests - b.requests,
    },
    {
      title: 'Token 使用量',
      dataIndex: 'tokens',
      key: 'tokens',
      render: (tokens: number) => tokens?.toLocaleString() || '0',
    },
    {
      title: '平均 Token/请求',
      key: 'avg',
      render: (_: any, record: any) => {
        const avg = record.requests > 0 ? Math.round(record.tokens / record.requests) : 0;
        return avg.toLocaleString();
      },
    },
  ];

  const handleExport = () => {
    // TODO: 实现导出功能
    console.log('Export stats');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">统计分析</h1>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
            刷新
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            导出
          </Button>
        </Space>
      </div>

      {/* 筛选栏 */}
      <Card>
        <Space size="large">
          <Space>
            <span>时间范围：</span>
            <RangePicker
              value={dateRange}
              onChange={(dates) => {
                if (dates) {
                  setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs]);
                }
              }}
            />
          </Space>
          <Space>
            <span>分组：</span>
            <Select
              value={groupBy}
              onChange={setGroupBy}
              style={{ width: 120 }}
              options={[
                { value: 'channel', label: '按渠道' },
                { value: 'model', label: '按模型' },
                { value: 'token', label: '按令牌' },
              ]}
            />
          </Space>
        </Space>
      </Card>

      {/* 趋势图表 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card>
            <ReactECharts option={requestTrendOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card>
            <ReactECharts option={tokenTrendOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      {/* 详细数据表格 */}
      <Card title={groupBy === 'channel' ? '按渠道统计' : groupBy === 'model' ? '按模型统计' : '按令牌统计'}>
        <Table
          columns={groupBy === 'channel' ? channelColumns : modelColumns}
          dataSource={data?.details || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  );
};

export default Stats;
