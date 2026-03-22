import { Card, Tag, Space, Button, Tooltip, Progress } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  EditOutlined,
  DeleteOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import type { Channel } from '@types';

interface ChannelCardProps {
  channel: Channel;
  onEdit?: (channel: Channel) => void;
  onDelete?: (id: string) => void;
  onTest?: (id: string) => void;
}

const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  onEdit,
  onDelete,
  onTest,
}) => {
  const getStatusIcon = (status: Channel['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircleOutlined className="text-success" />;
      case 'error':
        return <CloseCircleOutlined className="text-error" />;
      case 'inactive':
        return <WarningOutlined className="text-warning" />;
      default:
        return null;
    }
  };

  const getStatusTag = (status: Channel['status']) => {
    const statusMap = {
      active: { color: 'success', text: '正常' },
      error: { color: 'error', text: '异常' },
      inactive: { color: 'warning', text: '禁用' },
    };
    const { color, text } = statusMap[status] || { color: 'default', text: status };
    return <Tag color={color}>{text}</Tag>;
  };

  return (
    <Card
      hoverable
      className="transition-shadow hover:shadow-lg"
      actions={[
        <Tooltip key="test" title="测试">
          <Button type="link" icon={<ThunderboltOutlined />} onClick={() => onTest?.(channel.id)} />
        </Tooltip>,
        <Tooltip key="edit" title="编辑">
          <Button type="link" icon={<EditOutlined />} onClick={() => onEdit?.(channel)} />
        </Tooltip>,
        <Tooltip key="delete" title="删除">
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete?.(channel.id)}
          />
        </Tooltip>,
      ]}
    >
      <Card.Meta
        avatar={getStatusIcon(channel.status)}
        title={
          <div className="flex items-center justify-between">
            <span>{channel.name}</span>
            {getStatusTag(channel.status)}
          </div>
        }
        description={
          <div className="space-y-2">
            <div className="text-sm text-gray-500">
              <span className="font-medium">类型:</span> {channel.type}
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-medium">模型数:</span> {channel.models.length}
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-medium">请求量:</span>{' '}
              {channel.request_count?.toLocaleString() || 0}/天
            </div>
            {channel.error_rate !== undefined && (
              <div className="text-sm">
                <span className="font-medium">错误率:</span>
                <Progress
                  percent={(channel.error_rate * 100).toFixed(2)}
                  size="small"
                  strokeColor={
                    channel.error_rate > 0.05 ? '#ef4444' : channel.error_rate > 0.01 ? '#f59e0b' : '#10b981'
                  }
                  format={(percent) => `${percent}%`}
                />
              </div>
            )}
          </div>
        }
      />
    </Card>
  );
};

export default ChannelCard;
