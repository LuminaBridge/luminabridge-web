import { Layout, Dropdown, Avatar, Badge, Tooltip, Switch } from 'antd';
import {
  BellOutlined,
  LogoutOutlined,
  UserOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@stores/auth';
import { useThemeStore } from '@stores/theme';
import { useLogout } from '@hooks/useAuth';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { logout } = useLogout();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader
      className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 flex items-center justify-between"
      style={{ padding: '0 16px', height: 64 }}
    >
      <div className="flex items-center gap-4">
        <Tooltip title={isDark ? '切换到亮色模式' : '切换到暗色模式'}>
          <Switch
            checked={isDark}
            onChange={toggleTheme}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
          />
        </Tooltip>
      </div>

      <div className="flex items-center gap-4">
        <Tooltip title="通知">
          <Badge count={2} size="small">
            <BellOutlined className="text-lg cursor-pointer hover:text-primary-500" />
          </Badge>
        </Tooltip>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors">
            <Avatar
              size={32}
              icon={user?.avatar ? <img src={user.avatar} alt={user.name} /> : <UserOutlined />}
              className="bg-primary-500"
            />
            {!collapsed && (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {user?.name || '用户'}
              </span>
            )}
          </div>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;
