import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Header from '@layouts/Header';

// Mock the auth store
vi.mock('@stores/auth', () => ({
  useAuthStore: vi.fn(),
}));

// Mock the theme store
vi.mock('@stores/theme', () => ({
  useThemeStore: vi.fn(),
}));

// Mock the auth hook
vi.mock('@hooks/useAuth', () => ({
  useLogout: vi.fn(),
}));

const { useAuthStore } = await import('@stores/auth');
const { useThemeStore } = await import('@stores/theme');
const { useLogout } = await import('@hooks/useAuth');

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setup = () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
      token: 'token',
      login: vi.fn(),
      logout: vi.fn(),
    });

    vi.mocked(useThemeStore).mockReturnValue({
      isDark: false,
      toggleTheme: vi.fn(),
    });

    vi.mocked(useLogout).mockReturnValue({
      logout: vi.fn(),
    });
  };

  it('renders header correctly', () => {
    setup();

    render(
      <MemoryRouter>
        <Header collapsed={false} />
      </MemoryRouter>
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('shows user name when not collapsed', () => {
    setup();

    render(
      <MemoryRouter>
        <Header collapsed={false} />
      </MemoryRouter>
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('hides user name when collapsed', () => {
    setup();

    render(
      <MemoryRouter>
        <Header collapsed={true} />
      </MemoryRouter>
    );

    expect(screen.queryByText('Test User')).not.toBeInTheDocument();
  });

  it('shows default user name when user name is not provided', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', name: '' },
      token: 'token',
      login: vi.fn(),
      logout: vi.fn(),
    });

    vi.mocked(useThemeStore).mockReturnValue({
      isDark: false,
      toggleTheme: vi.fn(),
    });

    vi.mocked(useLogout).mockReturnValue({
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Header collapsed={false} />
      </MemoryRouter>
    );

    expect(screen.getByText('用户')).toBeInTheDocument();
  });

  it('renders theme switch', () => {
    setup();

    render(
      <MemoryRouter>
        <Header collapsed={false} />
      </MemoryRouter>
    );

    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('calls toggleTheme when theme switch is clicked', () => {
    const mockToggleTheme = vi.fn();
    vi.mocked(useThemeStore).mockReturnValue({
      isDark: false,
      toggleTheme: mockToggleTheme,
    });

    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
      token: 'token',
      login: vi.fn(),
      logout: vi.fn(),
    });

    vi.mocked(useLogout).mockReturnValue({
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Header collapsed={false} />
      </MemoryRouter>
    );

    const themeSwitch = screen.getByRole('switch');
    fireEvent.click(themeSwitch);
    expect(mockToggleTheme).toHaveBeenCalled();
  });

  it('shows theme switch in light mode', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
      token: 'token',
      login: vi.fn(),
      logout: vi.fn(),
    });

    vi.mocked(useThemeStore).mockReturnValue({
      isDark: false,
      toggleTheme: vi.fn(),
    });

    vi.mocked(useLogout).mockReturnValue({
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Header collapsed={false} />
      </MemoryRouter>
    );

    const themeSwitch = screen.getByRole('switch');
    expect(themeSwitch).toBeInTheDocument();
    expect(themeSwitch).not.toBeChecked();
  });

  it('shows theme switch in dark mode', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
      token: 'token',
      login: vi.fn(),
      logout: vi.fn(),
    });

    vi.mocked(useThemeStore).mockReturnValue({
      isDark: true,
      toggleTheme: vi.fn(),
    });

    vi.mocked(useLogout).mockReturnValue({
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Header collapsed={false} />
      </MemoryRouter>
    );

    const themeSwitch = screen.getByRole('switch');
    expect(themeSwitch).toBeInTheDocument();
    expect(themeSwitch).toBeChecked();
  });

  it('shows notification badge', () => {
    setup();

    const { container } = render(
      <MemoryRouter>
        <Header collapsed={false} />
      </MemoryRouter>
    );

    // Check for notification bell icon
    expect(container.querySelector('.anticon-bell')).toBeInTheDocument();
  });

  it('shows user avatar', () => {
    setup();

    const { container } = render(
      <MemoryRouter>
        <Header collapsed={false} />
      </MemoryRouter>
    );

    // Check that avatar element exists (ant-avatar class)
    expect(container.querySelector('.ant-avatar')).toBeInTheDocument();
  });

  it('has correct header structure', () => {
    setup();

    const { container } = render(
      <MemoryRouter>
        <Header collapsed={false} />
      </MemoryRouter>
    );

    expect(container.querySelector('.ant-layout-header')).toBeInTheDocument();
  });

  it('renders user dropdown trigger', () => {
    setup();

    render(
      <MemoryRouter>
        <Header collapsed={false} />
      </MemoryRouter>
    );

    // The user button should be clickable
    const userButton = screen.getByText('Test User').closest('div');
    expect(userButton).toBeInTheDocument();
  });

  it('calls logout on logout menu click', async () => {
    const mockLogout = vi.fn().mockResolvedValue({});
    vi.mocked(useLogout).mockReturnValue({
      logout: mockLogout,
    });

    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
      token: 'token',
      login: vi.fn(),
      logout: vi.fn(),
    });

    vi.mocked(useThemeStore).mockReturnValue({
      isDark: false,
      toggleTheme: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Header collapsed={false} />
      </MemoryRouter>
    );

    // Click on user name to open dropdown
    const userButton = screen.getByText('Test User').closest('div');
    fireEvent.click(userButton!);

    // Wait for dropdown and click logout
    const logoutButton = await screen.findByText('退出登录');
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });

  it('shows profile menu item in dropdown', async () => {
    setup();

    render(
      <MemoryRouter>
        <Header collapsed={false} />
      </MemoryRouter>
    );

    // Click on user name to open dropdown
    const userButton = screen.getByText('Test User').closest('div');
    fireEvent.click(userButton!);

    expect(await screen.findByText('个人中心')).toBeInTheDocument();
  });
});
