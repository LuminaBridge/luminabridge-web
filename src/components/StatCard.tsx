import { Card, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface StatCardProps {
  title: string;
  value: number | string;
  suffix?: string;
  trend?: number;
  icon?: React.ReactNode;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  suffix,
  trend,
  icon,
  color = 'primary',
}) => {
  const trendColor = trend !== undefined ? (trend >= 0 ? 'success' : 'error') : undefined;

  return (
    <Card className="hover:shadow-lg transition-shadow" bordered={false}>
      <Statistic
        title={<span className="text-gray-500 dark:text-gray-400">{title}</span>}
        value={value}
        suffix={suffix}
        valueStyle={{ color: trendColor === 'success' ? '#10b981' : trendColor === 'error' ? '#ef4444' : undefined }}
        prefix={
          <div className="flex items-center gap-2">
            {icon}
            {trend !== undefined && (
              <span className={`text-sm ${trend >= 0 ? 'text-success' : 'text-error'}`}>
                {trend >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                {Math.abs(trend)}%
              </span>
            )}
          </div>
        }
      />
    </Card>
  );
};

export default StatCard;
