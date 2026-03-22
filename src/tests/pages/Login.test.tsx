import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Login from '@pages/Login';

// Mock the auth hook
vi.mock('@hooks/useAuth', () => ({
  useLogin: vi.fn(),
  useLogout: vi.fn(),
}));

// Mock the auth service
vi.mock('@services/auth', () => ({
  oauthLogin: vi.fn(),
}));

// Mock antd message
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
      loading: vi.fn(),
    },
  };
});

const { useLogin } = await import('@hooks/useAuth');
const { oauthLogin } = await import('@services/auth');
const { message } = await import('antd');

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form correctly', () => {
    vi.mocked(useLogin).mockReturnValue({
      login: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText('LuminaBridge')).toBeInTheDocument();
    expect(screen.getByText('Illuminating AI Connections')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('邮箱 / Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('密码 / Password')).toBeInTheDocument();
    expect(screen.getByText('登 录')).toBeInTheDocument();
  });

  it('renders email input field', () => {
    vi.mocked(useLogin).mockReturnValue({
      login: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('邮箱 / Email');
    expect(emailInput).toBeInTheDocument();
  });

  it('renders password input field', () => {
    vi.mocked(useLogin).mockReturnValue({
      login: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText('密码 / Password');
    expect(passwordInput).toBeInTheDocument();
  });

  it('renders remember me checkbox', () => {
    vi.mocked(useLogin).mockReturnValue({
      login: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText('记住我')).toBeInTheDocument();
  });

  it('renders forgot password link', () => {
    vi.mocked(useLogin).mockReturnValue({
      login: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText('忘记密码？')).toBeInTheDocument();
  });

  it('renders register link', () => {
    vi.mocked(useLogin).mockReturnValue({
      login: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText('立即注册')).toBeInTheDocument();
  });

  it('renders GitHub OAuth button', () => {
    vi.mocked(useLogin).mockReturnValue({
      login: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  it('renders Discord OAuth button', () => {
    vi.mocked(useLogin).mockReturnValue({
      login: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText('Discord')).toBeInTheDocument();
  });

  it('calls login with correct credentials on form submit', async () => {
    const mockLogin = vi.fn().mockResolvedValue({});
    vi.mocked(useLogin).mockReturnValue({
      login: mockLogin,
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('邮箱 / Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('密码 / Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByText('登 录'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('shows success message on successful login', async () => {
    const mockLogin = vi.fn().mockResolvedValue({});
    vi.mocked(useLogin).mockReturnValue({
      login: mockLogin,
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('邮箱 / Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('密码 / Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByText('登 录'));

    await waitFor(() => {
      expect(message.success).toHaveBeenCalledWith('登录成功');
    });
  });

  it('shows error message on failed login', async () => {
    const mockLogin = vi.fn().mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
    });
    vi.mocked(useLogin).mockReturnValue({
      login: mockLogin,
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('邮箱 / Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('密码 / Password'), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByText('登 录'));

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  it('calls oauthLogin when GitHub button is clicked', () => {
    vi.mocked(oauthLogin).mockReturnValue('https://github.com/oauth');
    vi.mocked(useLogin).mockReturnValue({
      login: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('GitHub'));
    expect(oauthLogin).toHaveBeenCalledWith('github');
  });

  it('calls oauthLogin when Discord button is clicked', () => {
    vi.mocked(oauthLogin).mockReturnValue('https://discord.com/oauth');
    vi.mocked(useLogin).mockReturnValue({
      login: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Discord'));
    expect(oauthLogin).toHaveBeenCalledWith('discord');
  });

  it('has login button', () => {
    vi.mocked(useLogin).mockReturnValue({
      login: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const loginButton = screen.getByText('登 录');
    expect(loginButton).toBeInTheDocument();
  });

  it('has form with correct structure', () => {
    vi.mocked(useLogin).mockReturnValue({
      login: vi.fn(),
    });

    const { container } = render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Check for form element
    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('renders with card component', () => {
    vi.mocked(useLogin).mockReturnValue({
      login: vi.fn(),
    });

    const { container } = render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(container.querySelector('.ant-card')).toBeInTheDocument();
  });
});
