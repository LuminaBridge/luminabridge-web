import { useCallback } from 'react';
import { useAuthStore } from '@stores/auth';
import { login as loginApi, logout as logoutApi } from '@services/auth';
import type { LoginParams } from '@services/auth';

/**
 * 获取当前认证状态
 */
export const useAuth = () => {
  const { user, isAuthenticated, token } = useAuthStore();
  return {
    user,
    isAuthenticated,
    token,
  };
};

/**
 * 登录 Hook
 */
export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  const login = useCallback(
    async (params: LoginParams) => {
      const response = await loginApi(params);
      setAuth(response.user, response.token, response.refresh_token);
      return response;
    },
    [setAuth]
  );

  return { login };
};

/**
 * 登出 Hook
 */
export const useLogout = () => {
  const logoutStore = useAuthStore((state) => state.logout);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      logoutStore();
    }
  }, [logoutStore]);

  return { logout };
};
