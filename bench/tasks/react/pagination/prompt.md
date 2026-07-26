Write a single TypeScript React file exporting a hook `usePagination`.

Contract:
- `export function usePagination(options: { total: number; pageSize: number; initialPage?: number }): PaginationResult`
- `initialPage` defaults to `1` when omitted.

The returned object must have exactly these members:
- `page: number` — the current 1-based page. Always clamped into the valid range `[1, pageCount]`.
- `pageSize: number` — echoes the input `pageSize`.
- `pageCount: number` — total number of pages, computed as `Math.max(1, Math.ceil(total / pageSize))`. When `total` is `0`, `pageCount` is `1`.
- `canPrev: boolean` — `true` when `page > 1`.
- `canNext: boolean` — `true` when `page < pageCount`.
- `goTo(n: number): void` — set the current page to `n`, clamped into `[1, pageCount]` (values below 1 clamp to 1, values above `pageCount` clamp to `pageCount`).
- `next(): void` — advance one page; does nothing if already on the last page.
- `prev(): void` — go back one page; does nothing if already on the first page.
- `slice<T>(items: T[]): T[]` — return the slice of `items` for the current page: `items.slice((page - 1) * pageSize, page * pageSize)`.

Behavioral requirements:
- If `initialPage` is out of range it must be clamped on first render.
- State updates from `goTo`/`next`/`prev` must be reflected in the returned object after a re-render.

Implementation notes: use React hooks (`useState`, and `useMemo`/`useCallback` as needed). No external libraries.

Output ONLY one ```tsx code block containing the complete file.
