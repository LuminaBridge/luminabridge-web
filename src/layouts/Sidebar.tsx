import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  LinkOutlined,
  KeyOutlined,
  TeamOutlined,
  BarChartOutlined,
  SettingOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const { Sider: AntSider } = Layout;

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: '仪表盘', path: '/dashboard' },
  { key: 'channels', icon: <LinkOutlined />, label: '渠道管理', path: '/channels' },
  { key: 'tokens', icon: <KeyOutlined />, label: '令牌管理', path: '/tokens' },
  { key: 'users', icon: <TeamOutlined />, label: '用户管理', path: '/users' },
  { key: 'stats', icon: <BarChartOutlined />, label: '统计分析', path: '/stats' },
  { key: 'logs', icon: <FileTextOutlined />, label: '操作日志', path: '/logs' },
  { key: 'settings', icon: <SettingOutlined />, label: '系统设置', path: '/settings' },
];

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentKey = location.pathname.split('/')[1] || 'dashboard';

  const handleMenuClick = ({ key }: { key: string }) => {
    const item = menuItems.find((i) => i.key === key);
    if (item) {
      navigate(item.path);
    }
  };

  return (
    <AntSider
      className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800"
      width={200}
      collapsedWidth={80}
      collapsed={collapsed}
      style={{ overflow: 'auto', height: '100vh', position: 'sticky', top: 0 }}
    >
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
        {collapsed ? (
          <span className="text-2xl">🌉</span>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌉</span>
            <span className="text-lg font-bold text-primary-600">LuminaBridge</span>
          </div>
        )}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[currentKey]}
        onClick={handleMenuClick}
        items={menuItems.map((item) => ({
          key: item.key,
          icon: item.icon,
          label: item.label,
        }))}
        className="border-r-0"
      />
    </AntSider>
  );
};

export default Sidebar;
