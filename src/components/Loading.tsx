import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingProps {
  fullScreen?: boolean;
  size?: 'small' | 'default' | 'large';
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({
  fullScreen = false,
  size = 'large',
  text = '加载中...',
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-50">
        <Spin indicator={antIcon} size={size} tip={text} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <Spin indicator={antIcon} size={size} tip={text} />
    </div>
  );
};

export default Loading;
