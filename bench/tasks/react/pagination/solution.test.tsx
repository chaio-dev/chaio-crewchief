import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePagination } from './solution';

describe('usePagination', () => {
  it('computes pageCount and defaults to page 1', () => {
    const { result } = renderHook(() => usePagination({ total: 95, pageSize: 10 }));
    expect(result.current.pageCount).toBe(10);
    expect(result.current.page).toBe(1);
    expect(result.current.canPrev).toBe(false);
    expect(result.current.canNext).toBe(true);
  });

  it('treats zero total as a single page', () => {
    const { result } = renderHook(() => usePagination({ total: 0, pageSize: 10 }));
    expect(result.current.pageCount).toBe(1);
    expect(result.current.canNext).toBe(false);
    expect(result.current.canPrev).toBe(false);
  });

  it('clamps an out-of-range initialPage', () => {
    const { result } = renderHook(() => usePagination({ total: 30, pageSize: 10, initialPage: 99 }));
    expect(result.current.page).toBe(3);
  });

  it('goTo clamps below 1 and above pageCount', () => {
    const { result } = renderHook(() => usePagination({ total: 30, pageSize: 10 }));
    act(() => result.current.goTo(-5));
    expect(result.current.page).toBe(1);
    act(() => result.current.goTo(999));
    expect(result.current.page).toBe(3);
  });

  it('next and prev respect boundaries', () => {
    const { result } = renderHook(() => usePagination({ total: 25, pageSize: 10 }));
    expect(result.current.pageCount).toBe(3);
    act(() => result.current.prev());
    expect(result.current.page).toBe(1); // no-op at start
    act(() => { result.current.next(); });
    act(() => { result.current.next(); });
    expect(result.current.page).toBe(3);
    act(() => result.current.next());
    expect(result.current.page).toBe(3); // no-op at end
    expect(result.current.canNext).toBe(false);
  });

  it('slice returns the items for the current page', () => {
    const items = Array.from({ length: 25 }, (_, i) => i);
    const { result } = renderHook(() => usePagination({ total: 25, pageSize: 10 }));
    expect(result.current.slice(items)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    act(() => result.current.goTo(3));
    expect(result.current.slice(items)).toEqual([20, 21, 22, 23, 24]);
  });
});
