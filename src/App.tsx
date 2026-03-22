import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { useThemeStore } from '@stores/theme';
import Login from '@pages/Login';
import Dashboard from '@pages/Dashboard';
import Channels from '@pages/Channels';
import Tokens from '@pages/Tokens';
import Users from '@pages/Users';
import Layout from '@layouts/Layout';
import RequireAuth from '@components/RequireAuth';
import NotFound from '@pages/NotFound';

function App() {
  const { isDark } = useThemeStore();

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#8b5cf6',
          borderRadius: 6,
        },
      }}
    >
      <Routes>
        {/* 公开路由 */}
        <Route path="/login" element={<Login />} />
        
        {/* 需要认证的路由 */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="channels" element={<Channels />} />
          <Route path="tokens" element={<Tokens />} />
          <Route path="users" element={<Users />} />
        </Route>

        {/* 404 页面 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ConfigProvider>
  );
}

export default App;
