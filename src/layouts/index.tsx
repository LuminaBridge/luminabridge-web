import { useState } from 'react';
import { Layout, ConfigProvider, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import { useThemeStore } from '@stores/theme';
import Header from './Header';
import Sidebar from './Sidebar';

const { Content } = Layout;

const LayoutComponent: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { isDark } = useThemeStore();

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout className="min-h-screen">
        <Sidebar collapsed={collapsed} />
        <Layout>
          <Header collapsed={collapsed} />
          <Content className="m-4 p-6 bg-white dark:bg-gray-900 rounded-lg min-h-[calc(100vh-112px)]">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default LayoutComponent;
