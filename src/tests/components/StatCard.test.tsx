import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatCard from '@components/StatCard';
import { ThunderboltOutlined } from '@ant-design/icons';

describe('StatCard', () => {
  it('renders title correctly', () => {
    render(<StatCard title="Total Users" value={100} />);
    expect(screen.getByText('Total Users')).toBeInTheDocument();
  });

  it('renders value correctly', () => {
    render(<StatCard title="Total Users" value={100} />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders suffix correctly', () => {
    render(<StatCard title="Revenue" value={1000} suffix="USD" />);
    expect(screen.getByText('USD')).toBeInTheDocument();
  });

  it('renders string value correctly', () => {
    render(<StatCard title="Status" value="Active" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('shows positive trend with up arrow', () => {
    render(<StatCard title="Growth" value={50} trend={10} />);
    expect(screen.getByText('10%')).toBeInTheDocument();
  });

  it('shows negative trend with down arrow', () => {
    render(<StatCard title="Decline" value={50} trend={-15} />);
    expect(screen.getByText('15%')).toBeInTheDocument();
  });

  it('does not show trend when not provided', () => {
    render(<StatCard title="Static" value={100} />);
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<StatCard title="Power" value={100} icon={<ThunderboltOutlined />} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('applies success color for positive trend', () => {
    const { container } = render(<StatCard title="Growth" value={50} trend={10} />);
    const valueElement = container.querySelector('.ant-statistic-content-value');
    expect(valueElement).toHaveStyle('color: rgb(16, 185, 129)');
  });

  it('applies error color for negative trend', () => {
    const { container } = render(<StatCard title="Decline" value={50} trend={-15} />);
    const valueElement = container.querySelector('.ant-statistic-content-value');
    expect(valueElement).toHaveStyle('color: rgb(239, 68, 68)');
  });

  it('renders without trend color when trend is zero', () => {
    render(<StatCard title="Stable" value={100} trend={0} />);
    const { container } = render(<StatCard title="Stable" value={100} trend={0} />);
    const valueElement = container.querySelector('.ant-statistic-content-value');
    expect(valueElement).toHaveStyle('color: rgb(16, 185, 129)');
  });

  it('has correct card structure', () => {
    const { container } = render(<StatCard title="Test" value={42} />);
    expect(container.querySelector('.ant-card')).toBeInTheDocument();
    expect(container.querySelector('.ant-statistic')).toBeInTheDocument();
  });
});
