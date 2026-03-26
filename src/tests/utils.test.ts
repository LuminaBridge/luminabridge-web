/**
 * Utility Functions Tests
 * 
 * Tests for utility/helper functions.
 * 工具/辅助函数测试。
 */

import { describe, it, expect, vi } from 'vitest';

describe('Utility Functions', () => {
  describe('formatNumber', () => {
    const formatNumber = (num: number): string => {
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
      }
      if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
      }
      return num.toString();
    };

    it('should format numbers less than 1000', () => {
      expect(formatNumber(100)).toBe('100');
      expect(formatNumber(999)).toBe('999');
    });

    it('should format thousands', () => {
      expect(formatNumber(1000)).toBe('1.0K');
      expect(formatNumber(1500)).toBe('1.5K');
      expect(formatNumber(9999)).toBe('10.0K');
    });

    it('should format millions', () => {
      expect(formatNumber(1000000)).toBe('1.0M');
      expect(formatNumber(1500000)).toBe('1.5M');
      expect(formatNumber(2500000)).toBe('2.5M');
    });
  });

  describe('formatCurrency', () => {
    const formatCurrency = (amount: number, currency: string = 'USD'): string => {
      const symbols: Record<string, string> = {
        USD: '$',
        CNY: '¥',
        EUR: '€',
      };
      const symbol = symbols[currency] || '$';
      return `${symbol}${amount.toFixed(2)}`;
    };

    it('should format USD currency', () => {
      expect(formatCurrency(10.5, 'USD')).toBe('$10.50');
      expect(formatCurrency(100, 'USD')).toBe('$100.00');
    });

    it('should format CNY currency', () => {
      expect(formatCurrency(100, 'CNY')).toBe('¥100.00');
    });

    it('should default to USD', () => {
      expect(formatCurrency(50)).toBe('$50.00');
    });
  });

  describe('formatDateTime', () => {
    const formatDateTime = (date: Date): string => {
      return date.toISOString().replace('T', ' ').substring(0, 19);
    };

    it('should format date correctly', () => {
      const date = new Date('2024-01-15T10:30:45Z');
      const formatted = formatDateTime(date);
      expect(formatted).toContain('2024-01-15');
      expect(formatted).toContain('10:30:45');
    });
  });

  describe('calculatePercentage', () => {
    const calculatePercentage = (part: number, total: number): number => {
      if (total === 0) return 0;
      return (part / total) * 100;
    };

    it('should calculate percentage correctly', () => {
      expect(calculatePercentage(50, 100)).toBe(50);
      expect(calculatePercentage(25, 100)).toBe(25);
      expect(calculatePercentage(75, 200)).toBe(37.5);
    });

    it('should handle zero total', () => {
      expect(calculatePercentage(50, 0)).toBe(0);
    });
  });

  describe('validateEmail', () => {
    const validateEmail = (email: string): boolean => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    it('should validate correct emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.org')).toBe(true);
      expect(validateEmail('user+tag@example.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user@domain')).toBe(false);
    });
  });

  describe('clamp', () => {
    const clamp = (value: number, min: number, max: number): number => {
      return Math.min(Math.max(value, min), max);
    };

    it('should clamp value within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(5, 0, 3)).toBe(3);
      expect(clamp(5, 7, 10)).toBe(7);
    });
  });

  describe('debounce', () => {
    it('should delay function execution', () => {
      vi.useFakeTimers();
      
      const mockFn = vi.fn();
      const debouncedFn = (() => {
        let timeout: any = null;
        return (ms: number = 300) => {
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(mockFn, ms);
        };
      })();
      
      debouncedFn(100);
      expect(mockFn).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalled();
      
      vi.useRealTimers();
    });
  });
});

describe('Type Guards', () => {
  describe('isDefined', () => {
    const isDefined = <T>(value: T | undefined | null): value is T => {
      return value !== undefined && value !== null;
    };

    it('should check for defined values', () => {
      expect(isDefined(5)).toBe(true);
      expect(isDefined('test')).toBe(true);
      expect(isDefined({})).toBe(true);
      expect(isDefined([])).toBe(true);
    });

    it('should return false for null/undefined', () => {
      expect(isDefined(null)).toBe(false);
      expect(isDefined(undefined)).toBe(false);
    });
  });

  describe('isEmpty', () => {
    const isEmpty = (value: any): boolean => {
      if (value == null) return true;
      if (Array.isArray(value) || typeof value === 'string') {
        return value.length === 0;
      }
      if (typeof value === 'object') {
        return Object.keys(value).length === 0;
      }
      return false;
    };

    it('should check for empty values', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it('should return false for non-empty values', () => {
      expect(isEmpty('test')).toBe(false);
      expect(isEmpty([1])).toBe(false);
      expect(isEmpty({ a: 1 })).toBe(false);
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(false)).toBe(false);
    });
  });
});
