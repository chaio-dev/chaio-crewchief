import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useDebounce } from './solution';

describe('useDebounce', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('a', 500));
    expect(result.current).toBe('a');
  });

  it('does not update before the delay elapses', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 500), {
      initialProps: { v: 'a' },
    });
    rerender({ v: 'b' });
    act(() => { vi.advanceTimersByTime(499); });
    expect(result.current).toBe('a');
  });

  it('updates to the new value after the delay elapses', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 500), {
      initialProps: { v: 'a' },
    });
    rerender({ v: 'b' });
    act(() => { vi.advanceTimersByTime(500); });
    expect(result.current).toBe('b');
  });

  it('only commits the most recent value when changes are rapid', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 500), {
      initialProps: { v: 'a' },
    });
    rerender({ v: 'b' });
    act(() => { vi.advanceTimersByTime(300); });
    rerender({ v: 'c' });
    act(() => { vi.advanceTimersByTime(300); });
    expect(result.current).toBe('a'); // c only pending 300ms so far
    act(() => { vi.advanceTimersByTime(200); });
    expect(result.current).toBe('c');
  });

  it('works with number values and honors a changed delay', () => {
    const { result, rerender } = renderHook(({ v, d }) => useDebounce(v, d), {
      initialProps: { v: 1, d: 100 },
    });
    rerender({ v: 2, d: 1000 });
    act(() => { vi.advanceTimersByTime(100); });
    expect(result.current).toBe(1);
    act(() => { vi.advanceTimersByTime(900); });
    expect(result.current).toBe(2);
  });

  it('does not throw or warn when unmounted with a pending timer', () => {
    const { rerender, unmount } = renderHook(({ v }) => useDebounce(v, 500), {
      initialProps: { v: 'a' },
    });
    rerender({ v: 'b' });
    unmount();
    expect(() => { vi.advanceTimersByTime(500); }).not.toThrow();
  });
});
