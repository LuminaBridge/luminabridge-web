import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ChannelCard from '@components/ChannelCard';
import type { Channel } from '@types';

const mockChannel: Channel = {
  id: '1',
  name: 'Test Channel',
  status: 'active',
  type: 'openai',
  base_url: 'https://api.openai.com/v1',
  models: ['gpt-4', 'gpt-3.5-turbo'],
  weight: 1,
  request_count: 1000,
  error_rate: 0.02,
  created_at: Date.now(),
  updated_at: Date.now(),
};

describe('ChannelCard', () => {
  it('renders channel name correctly', () => {
    render(<ChannelCard channel={mockChannel} />);
    expect(screen.getByText('Test Channel')).toBeInTheDocument();
  });

  it('shows active status correctly', () => {
    render(<ChannelCard channel={mockChannel} />);
    expect(screen.getByText('正常')).toBeInTheDocument();
  });

  it('shows channel type correctly', () => {
    render(<ChannelCard channel={mockChannel} />);
    expect(screen.getByText(/类型:/)).toBeInTheDocument();
    expect(screen.getByText('openai')).toBeInTheDocument();
  });

  it('shows model count correctly', () => {
    render(<ChannelCard channel={mockChannel} />);
    expect(screen.getByText(/模型数:/)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows request count correctly', () => {
    render(<ChannelCard channel={mockChannel} />);
    expect(screen.getByText(/请求量:/)).toBeInTheDocument();
    expect(screen.getByText('1,000/天')).toBeInTheDocument();
  });

  it('shows error rate progress bar', () => {
    render(<ChannelCard channel={mockChannel} />);
    expect(screen.getByText(/错误率:/)).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<ChannelCard channel={mockChannel} onTest={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />);
    // Check that buttons are rendered (they're inside Tooltip components)
    const { container } = render(<ChannelCard channel={mockChannel} onTest={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />);
    const buttons = container.querySelectorAll('.ant-btn');
    expect(buttons.length).toBeGreaterThanOrEqual(3);
  });

  it('renders test button', () => {
    const { container } = render(<ChannelCard channel={mockChannel} onTest={vi.fn()} />);
    expect(container.querySelector('.anticon-thunderbolt')).toBeInTheDocument();
  });

  it('renders edit button', () => {
    const { container } = render(<ChannelCard channel={mockChannel} onEdit={vi.fn()} />);
    expect(container.querySelector('.anticon-edit')).toBeInTheDocument();
  });

  it('renders delete button', () => {
    const { container } = render(<ChannelCard channel={mockChannel} onDelete={vi.fn()} />);
    expect(container.querySelector('.anticon-delete')).toBeInTheDocument();
  });

  it('renders error status correctly', () => {
    const errorChannel: Channel = { ...mockChannel, status: 'error' };
    render(<ChannelCard channel={errorChannel} />);
    expect(screen.getByText('异常')).toBeInTheDocument();
  });

  it('renders inactive status correctly', () => {
    const inactiveChannel: Channel = { ...mockChannel, status: 'inactive' };
    render(<ChannelCard channel={inactiveChannel} />);
    expect(screen.getByText('禁用')).toBeInTheDocument();
  });

  it('does not show error rate when not provided', () => {
    const channelWithoutErrorRate: Channel = { ...mockChannel, error_rate: undefined };
    render(<ChannelCard channel={channelWithoutErrorRate} />);
    expect(screen.queryByText(/错误率:/)).not.toBeInTheDocument();
  });

  it('shows zero request count when not provided', () => {
    const channelWithoutRequestCount: Channel = { ...mockChannel, request_count: undefined };
    render(<ChannelCard channel={channelWithoutRequestCount} />);
    expect(screen.getByText('0/天')).toBeInTheDocument();
  });
});
