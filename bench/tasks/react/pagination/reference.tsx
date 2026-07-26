import { useState, useCallback } from 'react';

export function usePagination(options: { total: number; pageSize: number; initialPage?: number }) {
  const { total, pageSize } = options;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const clamp = (n: number) => Math.min(pageCount, Math.max(1, n));

  const [page, setPage] = useState(() => clamp(options.initialPage ?? 1));

  const current = clamp(page);

  const goTo = useCallback((n: number) => setPage(clamp(n)), [pageCount]);
  const next = useCallback(() => setPage((p) => clamp(p + 1)), [pageCount]);
  const prev = useCallback(() => setPage((p) => clamp(p - 1)), [pageCount]);

  const slice = useCallback(
    <T,>(items: T[]): T[] => items.slice((current - 1) * pageSize, current * pageSize),
    [current, pageSize],
  );

  return {
    page: current,
    pageSize,
    pageCount,
    canPrev: current > 1,
    canNext: current < pageCount,
    goTo,
    next,
    prev,
    slice,
  };
}
